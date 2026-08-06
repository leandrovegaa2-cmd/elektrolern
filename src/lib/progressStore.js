// Persistenz: localStorage, gleicher Schlüssel wie die Vanilla-Version
// ("elektrolern_v1"), damit bestehender Lernfortschritt der Klasse beim
// Umstieg auf die React-App NICHT verloren geht (gleiche Origin = gleicher
// localStorage, unabhängig vom internen Code).
import { boxVon } from "./leitner.js";
import { STANDARD_TAGESZIEL } from "./tagesziel.js";
import { pruefDatumGueltig } from "./lernplan.js";

export const LS_KEY = "elektrolern_v1";

function leererState() {
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

/** Lädt den gespeicherten Stand. Backfillt fehlende Felder (z.B. xp bei
 *  Ständen aus der alten Vanilla-Version, oder neue Felder aus älteren
 *  React-Ständen) statt sie auf 0 zu setzen. */
export function ladeState() {
  let s;
  try {
    const raw = JSON.parse(localStorage.getItem(LS_KEY));
    s = raw && typeof raw === "object" ? raw : leererState();
  } catch {
    s = leererState();
  }
  s.prog = s.prog || {};
  s.streak = s.streak || { last: null, count: 0 };
  if (typeof s.xp !== "number") {
    // Alter Stand ohne XP-Feld: grob aus vorhandenem Boxfortschritt schätzen,
    // damit Umsteiger nicht bei Level 1 / 0 XP neu anfangen.
    s.xp = Object.values(s.prog).reduce((sum, p) => sum + boxVon(p) * 10, 0);
  }
  if (typeof s.tagesziel !== "number") s.tagesziel = STANDARD_TAGESZIEL;
  s.heute = s.heute && typeof s.heute === "object" ? s.heute : { datum: null, anzahl: 0 };
  s.verlauf = Array.isArray(s.verlauf) ? s.verlauf : [];
  s.erfolge = s.erfolge && typeof s.erfolge === "object" ? s.erfolge : {};
  s.pruefDatum = pruefDatumGueltig(s.pruefDatum) ? s.pruefDatum : null;
  return s;
}

export function speichereState(state) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state));
  } catch {
    // z.B. privater Modus ohne Storage-Zugriff — Lernen funktioniert trotzdem,
    // nur ohne Persistenz über die Session hinaus.
  }
}
