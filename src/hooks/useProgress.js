import { useCallback, useMemo, useRef, useState } from "react";
import { ladeState, speichereState } from "../lib/progressStore.js";
import { naechsteBox, istFaellig, istGelernt, istSicher, boxVon } from "../lib/leitner.js";
import { streakAktualisieren } from "../lib/streak.js";
import { xpFuerAntwort, levelFuerXp, levelFortschritt, schwelleFuerLevel } from "../lib/xp.js";
import { heuteZaehlen, heutigerStand, STANDARD_TAGESZIEL, tageszielGueltig } from "../lib/tagesziel.js";
import { verlaufAktualisieren } from "../lib/verlauf.js";
import { neueErfolge } from "../lib/erfolge.js";
import { problemkarten, fehlerVon } from "../lib/problemkarten.js";
import { lfMeisterschaft } from "../lib/schwaechen.js";
import { lernplan, pruefDatumGueltig } from "../lib/lernplan.js";
import { todayISO } from "../lib/date.js";
import { useKarten } from "./useKarten.js";

function leererStand() {
  return {
    prog: {},
    streak: { last: null, count: 0 },
    xp: 0,
    tagesziel: STANDARD_TAGESZIEL,
    heute: { datum: null, anzahl: 0 },
    verlauf: [],
    erfolge: {},
    pruefDatum: null,
  };
}

/** Baut den Kontext für die Erfolge-Prüfung aus dem aktuellen State. */
function erfolgKontext(karten, state, extra) {
  const meisterschaft = lfMeisterschaft(karten, state.prog);
  const lfSicherErreicht = meisterschaft.some((m) => m.anzahl > 0 && m.sicher === m.anzahl);
  const alleLfGelernt = meisterschaft.length > 0 && meisterschaft.every((m) => m.gelernt === m.anzahl);
  return {
    streak: state.streak.count,
    level: levelFuerXp(state.xp || 0),
    lfSicherErreicht,
    alleLfGelernt,
    pruefungBestanden: false,
    pruefungProzent: 0,
    ...extra,
  };
}

/** Prüft neue Erfolge und schreibt sie (mit Freischalt-Datum) in den State. */
function mitNeuenErfolgen(karten, state, extra) {
  const ctx = erfolgKontext(karten, state, extra);
  const neu = neueErfolge(state.erfolge, ctx);
  if (!neu.length) return state;
  const erfolge = { ...(state.erfolge || {}) };
  const heute = todayISO();
  neu.forEach((id) => (erfolge[id] = heute));
  return { ...state, erfolge };
}

/**
 * Zentraler Hook für Lernfortschritt: Leitner-Boxen, Streak, XP/Level,
 * Tagesziel, Problemkarten, Fortschritts-Verlauf, Erfolge und Prüfungs-Lernplan.
 * Kapselt localStorage-Persistenz — Komponenten sehen nur einfache Aufrufe.
 *
 * Die Kartenliste kommt aus dem Karten-Store (Original + Korrekturen + eigene
 * Karten). Weil sie sich zur Laufzeit ändern kann (Editor), greifen die
 * setState-Callbacks über eine Ref darauf zu statt über eine Closure-Kopie.
 */
export function useProgress() {
  const [state, setState] = useState(() => ladeState());
  const karten = useKarten();
  const kartenRef = useRef(karten);
  kartenRef.current = karten;

  const persist = useCallback((next) => {
    setState(next);
    speichereState(next);
  }, []);

  const kartenVon = useCallback(
    (lj, lf) => karten.filter((k) => (lj === 0 || k.j === lj) && (!lf || k.lf === lf)),
    [karten]
  );

  const faelligVon = useCallback(
    (lj, lf) => kartenVon(lj, lf).filter((k) => istFaellig(state.prog[k.i])),
    [kartenVon, state.prog]
  );

  const fortschrittProzent = useCallback(
    (lj, lf) => {
      const liste = kartenVon(lj, lf);
      if (!liste.length) return 0;
      const gelernt = liste.filter((k) => istGelernt(state.prog[k.i])).length;
      return Math.round((gelernt / liste.length) * 100);
    },
    [kartenVon, state.prog]
  );

  /** Gesamt-Lernstand für den Verlauf (Prozent gelernter Karten). */
  function gesamtProzent(alle, prog) {
    if (!alle.length) return 0;
    const gelernt = alle.filter((k) => istGelernt(prog[k.i])).length;
    return Math.round((gelernt / alle.length) * 100);
  }

  /** Verbucht eine Antwort: Leitner-Box weiterschalten, XP gutschreiben,
   *  Tagesziel-Zähler und Fortschritts-Verlauf aktualisieren, Erfolge prüfen. */
  const antwortVerbuchen = useCallback((karte, gewusst) => {
    setState((prev) => {
      const alle = kartenRef.current;
      const bisher = prev.prog[karte.i];
      let next = { ...prev, prog: { ...prev.prog } };
      next.prog[karte.i] = {
        ...naechsteBox(bisher, gewusst),
        fehler: fehlerVon(bisher) + (gewusst ? 0 : 1),
      };
      next.xp = (prev.xp || 0) + xpFuerAntwort(gewusst);
      next.heute = heuteZaehlen(prev.heute);
      next.verlauf = verlaufAktualisieren(prev.verlauf, { prozent: gesamtProzent(alle, next.prog), xp: next.xp });
      next = mitNeuenErfolgen(alle, next);
      speichereState(next);
      return next;
    });
  }, []);

  /**
   * Verbucht eine Übung OHNE feste Karte — z. B. eine generierte Rechenaufgabe.
   * Zahlt auf XP, Tagesziel und Verlauf ein, rührt die Leitner-Boxen aber nicht
   * an (es gibt keine Karten-ID, die man wiederholen könnte).
   */
  const uebungVerbuchen = useCallback((gewusst) => {
    setState((prev) => {
      const alle = kartenRef.current;
      let next = { ...prev };
      next.xp = (prev.xp || 0) + xpFuerAntwort(gewusst);
      next.heute = heuteZaehlen(prev.heute);
      next.verlauf = verlaufAktualisieren(prev.verlauf, { prozent: gesamtProzent(alle, next.prog), xp: next.xp });
      next = mitNeuenErfolgen(alle, next);
      speichereState(next);
      return next;
    });
  }, []);

  const streakUpdaten = useCallback(() => {
    setState((prev) => {
      let next = { ...prev, streak: streakAktualisieren(prev.streak) };
      next = mitNeuenErfolgen(kartenRef.current, next);
      speichereState(next);
      return next;
    });
  }, []);

  /** Nach einer abgeschlossenen Prüfungssimulation: Prüfungs-Erfolge freischalten. */
  const pruefungAbschliessen = useCallback((punkte, gesamt) => {
    setState((prev) => {
      const prozent = gesamt > 0 ? Math.round((punkte / gesamt) * 100) : 0;
      const next = mitNeuenErfolgen(kartenRef.current, prev, {
        pruefungBestanden: prozent >= 50,
        pruefungProzent: prozent,
      });
      if (next === prev) return prev;
      speichereState(next);
      return next;
    });
  }, []);

  const setTagesziel = useCallback((n) => {
    if (!tageszielGueltig(n)) return;
    setState((prev) => {
      const next = { ...prev, tagesziel: n };
      speichereState(next);
      return next;
    });
  }, []);

  /** Prüfungstermin setzen (YYYY-MM-DD) oder mit null wieder entfernen. */
  const setPruefDatum = useCallback((datum) => {
    const wert = pruefDatumGueltig(datum) ? datum : null;
    setState((prev) => {
      const next = { ...prev, pruefDatum: wert };
      speichereState(next);
      return next;
    });
  }, []);

  const resetAll = useCallback(() => {
    persist(leererStand());
  }, [persist]);

  const importState = useCallback(
    (importiert) => {
      persist({
        prog: importiert.prog || {},
        streak: importiert.streak || { last: null, count: 0 },
        xp: typeof importiert.xp === "number" ? importiert.xp : 0,
        tagesziel: tageszielGueltig(importiert.tagesziel) ? importiert.tagesziel : STANDARD_TAGESZIEL,
        heute: importiert.heute && typeof importiert.heute === "object" ? importiert.heute : { datum: null, anzahl: 0 },
        verlauf: Array.isArray(importiert.verlauf) ? importiert.verlauf : [],
        erfolge: importiert.erfolge && typeof importiert.erfolge === "object" ? importiert.erfolge : {},
        pruefDatum: pruefDatumGueltig(importiert.pruefDatum) ? importiert.pruefDatum : null,
      });
    },
    [persist]
  );

  const level = useMemo(() => levelFuerXp(state.xp || 0), [state.xp]);
  const levelProgress = useMemo(() => levelFortschritt(state.xp || 0), [state.xp]);
  const xpBisNaechstesLevel = useMemo(() => schwelleFuerLevel(level + 1) - (state.xp || 0), [level, state.xp]);
  const heuteAnzahl = useMemo(() => heutigerStand(state.heute), [state.heute]);
  const problemkartenListe = useMemo(() => problemkarten(karten, state.prog), [karten, state.prog]);
  const plan = useMemo(() => lernplan(karten, state.prog, state.pruefDatum), [karten, state.prog, state.pruefDatum]);

  return {
    state,
    karten,
    kartenVon,
    faelligVon,
    fortschrittProzent,
    boxVon: (kartenId) => boxVon(state.prog[kartenId]),
    istGelernt: (kartenId) => istGelernt(state.prog[kartenId]),
    istSicher: (kartenId) => istSicher(state.prog[kartenId]),
    antwortVerbuchen,
    uebungVerbuchen,
    streakUpdaten,
    pruefungAbschliessen,
    setTagesziel,
    setPruefDatum,
    resetAll,
    importState,
    level,
    levelProgress,
    xpBisNaechstesLevel,
    heuteAnzahl,
    problemkartenListe,
    plan,
  };
}
