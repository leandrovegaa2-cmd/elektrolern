// Reine Elektro-Rechenlogik für die Rechner im Nachschlagewerk.
// Kein React, keine UI — damit unit-testbar. Formeln nach DIN VDE / Report,
// nur Kupferleiter. Tabellenwerte aus data/vde.js.

import {
  KAPPA_CU,
  STROMBELASTBARKEIT,
  TEMP_FAKTOR,
  HAEUFUNG_FAKTOR,
  SICHERUNG_REIHE,
} from "../data/vde.js";

const WURZEL3 = Math.sqrt(3);

/**
 * Ohmsches Gesetz. Genau zwei von U, R, I angeben — die dritte Größe wird
 * berechnet. Rückgabe: { U, R, I } oder null, wenn die Eingabe unvollständig
 * bzw. widersprüchlich ist.
 */
export function ohm({ U, R, I }) {
  const hatU = Number.isFinite(U);
  const hatR = Number.isFinite(R);
  const hatI = Number.isFinite(I);
  if (hatU && hatR && !hatI) return { U, R, I: U / R };
  if (hatU && hatI && !hatR) return { U, R: U / I, I };
  if (hatR && hatI && !hatU) return { U: R * I, R, I };
  return null;
}

/**
 * Leistung im Wechsel-/Drehstromnetz. phasen: 1 (einphasig) oder 3 (Drehstrom).
 * Gibt aus U, I, cosφ die Wirkleistung P — oder aus P, U, cosφ den Strom I.
 * Rückgabe: { P, I } (die übergebene Größe wird gespiegelt) oder null.
 */
export function leistung({ U, I, P, cos = 1, phasen = 1 }) {
  const k = phasen === 3 ? WURZEL3 : 1;
  if (Number.isFinite(U) && Number.isFinite(I)) {
    return { P: k * U * I * cos, I, U };
  }
  if (Number.isFinite(P) && Number.isFinite(U) && U !== 0) {
    return { P, I: P / (k * U * cos), U };
  }
  return null;
}

/**
 * Spannungsfall auf einer Kupferleitung.
 * phasen: 1 → ΔU = 2·l·I·cosφ/(κ·A); 3 → ΔU = √3·l·I·cosφ/(κ·A).
 * u0: Bezugsspannung für den Prozentwert (230 einphasig, 400 dreiphasig).
 * Rückgabe: { deltaU (V), prozent (%) }.
 */
export function spannungsfall({ l, I, A, cos = 1, phasen = 1, u0 }) {
  const faktor = phasen === 3 ? WURZEL3 : 2;
  const bezug = Number.isFinite(u0) ? u0 : phasen === 3 ? 400 : 230;
  const deltaU = (faktor * l * I * cos) / (KAPPA_CU * A);
  return { deltaU, prozent: (deltaU / bezug) * 100 };
}

/** Iz-Wert einer Verlegeart für einen Querschnitt (roh, ohne Korrektur). */
function izRoh(A, verlegeart) {
  const zeile = STROMBELASTBARKEIT.find((z) => z.A === A);
  return zeile ? zeile.iz[verlegeart] : null;
}

/** Temperaturfaktor per exakter Stützstelle (sonst 1). */
export function tempFaktor(temp) {
  const t = TEMP_FAKTOR.find((e) => e.t === temp);
  return t ? t.f : 1;
}

/** Häufungsfaktor für n belastete Stromkreise (deckelt am größten Tabellenwert). */
export function haeufungFaktor(n) {
  const treffer = HAEUFUNG_FAKTOR.find((e) => e.n === n);
  if (treffer) return treffer.f;
  const letzter = HAEUFUNG_FAKTOR[HAEUFUNG_FAKTOR.length - 1];
  return n > letzter.n ? letzter.f : 1;
}

/** Korrigierte Strombelastbarkeit: Iz · fTemp · fHäufung. */
export function izKorrigiert(A, verlegeart, temp = 30, haeufung = 1) {
  const roh = izRoh(A, verlegeart);
  if (roh === null) return null;
  return roh * tempFaktor(temp) * haeufungFaktor(haeufung);
}

/**
 * Empfiehlt den kleinsten Querschnitt, der zwei Bedingungen erfüllt:
 *  (a) korrigierte Strombelastbarkeit ≥ Betriebsstrom I
 *  (b) Spannungsfall ≤ grenzeProzent
 * Rückgabe: {
 *   querschnitt, izKorr, deltaU, prozent, grund: "strom"|"spannungsfall"|null,
 *   ausreichend: bool
 * }  — grund nennt die schärfere Bedingung; null, wenn nichts passt.
 */
export function querschnittEmpfehlung({
  I,
  l,
  cos = 1,
  phasen = 1,
  verlegeart = "B2",
  temp = 30,
  haeufung = 1,
  grenzeProzent = 3,
  u0,
}) {
  for (const zeile of STROMBELASTBARKEIT) {
    const A = zeile.A;
    const izKorr = izKorrigiert(A, verlegeart, temp, haeufung);
    const stromOk = izKorr !== null && izKorr >= I;
    const { deltaU, prozent } = spannungsfall({ l, I, A, cos, phasen, u0 });
    const spannungOk = prozent <= grenzeProzent;
    if (stromOk && spannungOk) {
      // Welche Bedingung war am nächsten an der Grenze (= treibend)?
      const stromReserve = izKorr / I;
      const spannungReserve = grenzeProzent / prozent;
      const grund = spannungReserve <= stromReserve ? "spannungsfall" : "strom";
      return { querschnitt: A, izKorr, deltaU, prozent, grund, ausreichend: true };
    }
  }
  // Nichts reicht — größten Querschnitt zurückgeben, damit die UI etwas zeigt.
  const groesste = STROMBELASTBARKEIT[STROMBELASTBARKEIT.length - 1];
  const izKorr = izKorrigiert(groesste.A, verlegeart, temp, haeufung);
  const { deltaU, prozent } = spannungsfall({ l, I, A: groesste.A, cos, phasen, u0 });
  return { querschnitt: groesste.A, izKorr, deltaU, prozent, grund: null, ausreichend: false };
}

/**
 * Wählt den passenden LS-Nennstrom In für einen Querschnitt A und Betriebsstrom I:
 *   Bedingung DIN VDE:  I_B ≤ I_n ≤ I_z
 * Nimmt den größten Normwert, der ≤ korrigiertem Iz ist und ≥ Betriebsstrom.
 * Rückgabe: { nennstrom, izKorr, passt: bool } — passt=false, wenn keine
 * Normgröße beide Bedingungen erfüllt (z. B. Querschnitt zu klein).
 */
export function sicherungWaehlen({ I, A, verlegeart = "B2", temp = 30, haeufung = 1 }) {
  const izKorr = izKorrigiert(A, verlegeart, temp, haeufung);
  if (izKorr === null) return { nennstrom: null, izKorr: null, passt: false };
  let gewaehlt = null;
  for (const In of SICHERUNG_REIHE) {
    if (In <= izKorr && In >= I) gewaehlt = In; // größter gültiger Wert
    if (In > izKorr) break;
  }
  return { nennstrom: gewaehlt, izKorr, passt: gewaehlt !== null };
}

/**
 * FI/RCD-Empfehlung. bereich: "wohnen" | "gewerbe". glatterDC: true bei
 * PV/EV/Wechselrichtern (→ Typ B). Rückgabe: { typ, bemessung, hinweis }.
 */
export function fiEmpfehlung({ bereich = "wohnen", glatterDC = false } = {}) {
  if (glatterDC) {
    return {
      typ: "B",
      bemessung: "30 mA",
      hinweis: "Allstromsensitiv — Ladestation/PV/Wechselrichter mit glattem DC-Fehlerstrom.",
    };
  }
  const bemessung = bereich === "gewerbe" ? "30 mA (+ 300 mA Brandschutz vorgelagert)" : "30 mA";
  return {
    typ: "A",
    bemessung,
    hinweis: "Standard-Personenschutz für Endstromkreise (Steckdosen ≤ 32 A, Feuchträume).",
  };
}
