// Tagesziel: einfacher Tageszähler beantworteter Karten (Flashcard + Quiz +
// Prüfung), passend zur ADHS-Kurzsessions-Regel aus PRODUCT.md — kleine,
// sichtbare Tagesportionen statt endloser Prozentzahlen.
import { todayISO } from "./date.js";

export const STANDARD_TAGESZIEL = 15;
export const MIN_TAGESZIEL = 5;
export const MAX_TAGESZIEL = 100;

/** Zählt eine beantwortete Karte für heute. Setzt an neuem Tag auf 1 zurück. */
export function heuteZaehlen(heute, ref = new Date()) {
  const t = todayISO(ref);
  if (!heute || heute.datum !== t) return { datum: t, anzahl: 1 };
  return { datum: t, anzahl: heute.anzahl + 1 };
}

/** Wie viele Karten wurden heute schon beantwortet (0, wenn neuer Tag)? */
export function heutigerStand(heute, ref = new Date()) {
  const t = todayISO(ref);
  return heute && heute.datum === t ? heute.anzahl : 0;
}

export function tageszielGueltig(n) {
  return Number.isFinite(n) && n >= MIN_TAGESZIEL && n <= MAX_TAGESZIEL;
}
