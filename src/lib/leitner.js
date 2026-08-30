// Leitner-Spaced-Repetition — reine, testbare Funktionen.
// 7 Boxen (Index 0-6). Box 0 = neu/nie beantwortet. Intervalle in Tagen je Box.
//
// Box 6 (35 Tage) kam am 24.07.2026 dazu: vorher war bei 14 Tagen Schluss, und
// längst sitzende Karten kamen bis in alle Ewigkeit alle zwei Wochen wieder und
// haben das Tagespensum blockiert. 35 Tage sind lang genug, um Platz für die
// wackeligen Karten zu schaffen, und kurz genug, dass eine Karte vor einer
// Prüfung in ein paar Monaten trotzdem nochmal auftaucht.
import { addDaysISO, todayISO } from "./date.js";

export const INTERVALLE = [0, 0, 1, 3, 7, 14, 35]; // Tage bis zur nächsten Fälligkeit je Box
export const BOX_MAX = INTERVALLE.length - 1;
export const GELERNT_AB_BOX = 2; // "gelernt" zählt ab Box 2
export const SICHER_AB_BOX = 4; // "sicher" zählt ab Box 4

/**
 * Berechnet den neuen Fortschritt einer Karte nach einer Antwort.
 * @param {{box:number, due:string}|undefined} bisher aktueller Stand (oder undefined = neu)
 * @param {boolean} gewusst richtig beantwortet?
 * @param {Date} ref Referenzdatum (für Tests) — Default: jetzt
 */
export function naechsteBox(bisher, gewusst, ref = new Date()) {
  const box = gewusst ? Math.min((bisher?.box ?? 0) + 1, BOX_MAX) : 1;
  return { box, due: addDaysISO(INTERVALLE[box], ref) };
}

/** Ist eine Karte heute fällig? (nie gelernt = immer fällig) */
export function istFaellig(progress, ref = new Date()) {
  if (!progress) return true;
  return progress.due <= todayISO(ref);
}

export function boxVon(progress) {
  return progress?.box ?? 0;
}

export function istGelernt(progress) {
  return boxVon(progress) >= GELERNT_AB_BOX;
}

export function istSicher(progress) {
  return boxVon(progress) >= SICHER_AB_BOX;
}
