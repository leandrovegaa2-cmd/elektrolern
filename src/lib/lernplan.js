// Prüfungs-Countdown & Rückwärts-Lernplan — reine Funktionen.
//
// Idee: Statt „lern halt regelmäßig" rechnet die App vom Prüfungstermin zurück.
// Offen ist, was noch nicht in Box 4–5 („sicher") steht. Verteilt auf die
// verbleibenden Tage ergibt das ein konkretes Tagespensum — die Zahl, die man
// morgens wirklich braucht.

import { istSicher } from "./leitner.js";
import { todayISO } from "./date.js";
import { MIN_TAGESZIEL, MAX_TAGESZIEL } from "./tagesziel.js";

/** Ist das ein plausibles Prüfungsdatum im Format YYYY-MM-DD? */
export function pruefDatumGueltig(datum) {
  if (typeof datum !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(datum)) return false;
  const d = new Date(datum + "T00:00:00");
  return !Number.isNaN(d.getTime());
}

/**
 * Ganze Tage vom Referenztag bis zum Zieldatum. Heute = 0, morgen = 1,
 * gestern = -1. Rechnet auf Tagesebene, damit Sommerzeit nichts verschiebt.
 */
export function tageBis(datum, ref = new Date()) {
  if (!pruefDatumGueltig(datum)) return null;
  const ziel = new Date(datum + "T00:00:00");
  const heute = new Date(todayISO(ref) + "T00:00:00");
  return Math.round((ziel - heute) / 86400000);
}

/**
 * Baut den Lernplan.
 * @param {Array} karten alle Karten
 * @param {Object} prog Leitner-Fortschritt (state.prog)
 * @param {string|null} pruefDatum YYYY-MM-DD oder null
 * @param {Date} ref Referenzdatum (Tests)
 */
export function lernplan(karten, prog, pruefDatum, ref = new Date()) {
  const gesamt = karten.length;
  const sicher = karten.filter((k) => istSicher(prog[k.i])).length;
  const offen = gesamt - sicher;

  if (!pruefDatumGueltig(pruefDatum)) {
    return { aktiv: false, datum: null, tage: null, gesamt, sicher, offen, proTag: 0, machbar: true, vorbei: false };
  }

  const tage = tageBis(pruefDatum, ref);
  const vorbei = tage < 0;
  // Der Prüfungstag selbst zählt nicht als Lerntag — bis dahin muss es sitzen.
  const lerntage = Math.max(tage, 0);
  const proTag = offen === 0 ? 0 : lerntage <= 0 ? offen : Math.ceil(offen / lerntage);

  return {
    aktiv: true,
    datum: pruefDatum,
    tage,
    gesamt,
    sicher,
    offen,
    proTag,
    machbar: proTag <= MAX_TAGESZIEL,
    vorbei,
  };
}

/** Tagesziel-Vorschlag aus dem Plan — auf den erlaubten Bereich begrenzt. */
export function empfohlenesTagesziel(plan) {
  if (!plan || !plan.aktiv || plan.proTag <= 0) return null;
  return Math.min(MAX_TAGESZIEL, Math.max(MIN_TAGESZIEL, plan.proTag));
}

/** Kurzer Klartext-Status fürs Widget. */
export function planText(plan) {
  if (!plan.aktiv) return "Trag deinen Prüfungstermin ein — dann rechne ich dir das Tagespensum aus.";
  if (plan.vorbei) return "Der Termin liegt in der Vergangenheit. Neues Datum eintragen?";
  if (plan.offen === 0) return "Alle Karten sitzen sicher. Jetzt nur noch halten.";
  if (plan.tage === 0) return "Heute ist Prüfungstag. Kurz die Problemkarten durchgehen — mehr nicht.";
  if (!plan.machbar) return `${plan.proTag} Karten/Tag wären nötig — das ist sportlich. Früher anfangen oder Umfang kürzen.`;
  return `${plan.proTag} Karten pro Tag reichen, um bis dahin alles sicher zu haben.`;
}
