// Prüfungssimulation: Fragenauswahl & Auswertung als reine Funktionen.
import { mischen } from "./random.js";
import { istRichtig, STANDARD_TOLERANZ } from "./rechnen.js";

export const PRUEF_ANZAHL = 20;
export const PRUEF_RECHNEN = 5; // davon Rechenaufgaben mit Zahleneingabe
export const PRUEF_MINUTEN = 20;
export const BESTEHENSGRENZE = 50; // Prozent

/**
 * Zieht Fragen reihum aus jedem Lernfeld, damit große Lernfelder (LF8, LF5)
 * kleine (LF9, LF12, LF13) nicht verdrängen. `rng` ist injizierbar für Tests.
 */
export function pruefAuswahl(pool, anzahl, rng = Math.random) {
  const nachLF = {};
  pool.forEach((k) => {
    (nachLF[k.lf] = nachLF[k.lf] || []).push(k);
  });
  Object.keys(nachLF).forEach((lf) => {
    nachLF[lf] = mischen(nachLF[lf], rng);
  });
  const lfListe = mischen(Object.keys(nachLF), rng);
  const ausgewaehlt = [];
  let runde = 0;
  while (ausgewaehlt.length < anzahl && runde < 50) {
    let bewegt = false;
    for (const lf of lfListe) {
      if (ausgewaehlt.length >= anzahl) break;
      const karte = nachLF[lf][runde];
      if (karte) {
        ausgewaehlt.push(karte);
        bewegt = true;
      }
    }
    if (!bewegt) break;
    runde++;
  }
  return ausgewaehlt;
}

/**
 * Stellt eine gemischte Prüfung zusammen: überwiegend Multiple Choice, dazu ein
 * fester Anteil Rechenaufgaben mit Zahleneingabe — so läuft die echte Prüfung auch.
 * Reicht der Rechen-Vorrat nicht, wird mit Multiple Choice aufgefüllt (und umgekehrt),
 * damit die Prüfung nie kürzer wird als gewollt.
 */
export function pruefMix(mcPool, rechenPool, anzahl = PRUEF_ANZAHL, rechenAnzahl = PRUEF_RECHNEN, rng = Math.random) {
  const rechen = pruefAuswahl(rechenPool, Math.min(rechenAnzahl, rechenPool.length, anzahl), rng);
  const genommen = new Set(rechen.map((k) => k.i));
  const mc = pruefAuswahl(
    mcPool.filter((k) => !genommen.has(k.i)),
    Math.max(0, anzahl - rechen.length),
    rng
  );
  const fragen = [
    ...mc.map((k) => ({ k, typ: "mc" })),
    ...rechen.map((k) => ({ k, typ: "rechnen" })),
  ];
  return mischen(fragen, rng);
}

/** Toleranz einer Rechenkarte (eigener Wert oder Standard). */
export function toleranzVon(karte) {
  return Number.isFinite(karte?.r?.tol) ? karte.r.tol : STANDARD_TOLERANZ;
}

/**
 * Ist eine Prüfungsfrage richtig beantwortet? Deckt beide Fragetypen ab, damit
 * Session, Auswertung und Ergebnis-Screen garantiert dieselbe Regel benutzen.
 */
export function istFrageKorrekt(f) {
  if (!f) return false;
  if (f.typ === "rechnen") {
    return istRichtig(f.eingabe, Number(f.k.r.loesung), toleranzVon(f.k));
  }
  return f.gewaehlt !== null && f.gewaehlt !== undefined && !!f.optionen?.[f.gewaehlt]?.richtig;
}

/** Hat der Nutzer die Frage überhaupt angefasst? */
export function istBeantwortet(f) {
  if (!f) return false;
  return f.typ === "rechnen" ? String(f.eingabe || "").trim() !== "" : f.gewaehlt !== null;
}

export function bestanden(punkte, gesamt) {
  return gesamt > 0 && Math.round((punkte / gesamt) * 100) >= BESTEHENSGRENZE;
}

/** Lernfeld-Analyse: Trefferquote je LF, schwächste zuerst. */
export function lfAnalyse(fragenMitErgebnis) {
  const proLf = {};
  fragenMitErgebnis.forEach(({ lf, korrekt }) => {
    (proLf[lf] = proLf[lf] || { richtig: 0, gesamt: 0 }).gesamt++;
    if (korrekt) proLf[lf].richtig++;
  });
  return Object.keys(proLf)
    .map((lf) => ({ lf, ...proLf[lf], quote: proLf[lf].richtig / proLf[lf].gesamt }))
    .sort((a, b) => a.quote - b.quote);
}
