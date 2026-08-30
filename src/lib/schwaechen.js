// Persistente Schwächen-Analyse: Meisterschaft je Lernfeld, unabhängig von der
// Prüfungssimulation. Neu ggü. dem Original — dort gab's die LF-Analyse nur
// als Ergebnis einer abgeschlossenen Prüfung.
import { boxVon, GELERNT_AB_BOX, SICHER_AB_BOX } from "./leitner.js";

/**
 * @param {Array} karten alle Karten (oder eine Teilmenge)
 * @param {Object} prog state.prog — {kartenId: {box, due}}
 * @returns {Array<{lf:string, anzahl:number, gelernt:number, quote:number}>} schwächste zuerst
 */
export function schwaechenAnalyse(karten, prog) {
  const proLf = {};
  karten.forEach((k) => {
    const eintrag = (proLf[k.lf] = proLf[k.lf] || { anzahl: 0, gelernt: 0 });
    eintrag.anzahl++;
    if (boxVon(prog[k.i]) >= GELERNT_AB_BOX) eintrag.gelernt++;
  });
  return Object.keys(proLf)
    .map((lf) => ({ lf, ...proLf[lf], quote: proLf[lf].gelernt / proLf[lf].anzahl }))
    .sort((a, b) => a.quote - b.quote);
}

/**
 * Meisterschaft je Lernfeld inkl. "sicher" (Box 4+) — Grundlage für die
 * "Lernfeld sitzt"-/"Alles gelernt"-Erfolge.
 * @returns {Array<{lf:string, anzahl:number, gelernt:number, sicher:number}>}
 */
export function lfMeisterschaft(karten, prog) {
  const proLf = {};
  karten.forEach((k) => {
    const eintrag = (proLf[k.lf] = proLf[k.lf] || { anzahl: 0, gelernt: 0, sicher: 0 });
    eintrag.anzahl++;
    const box = boxVon(prog[k.i]);
    if (box >= GELERNT_AB_BOX) eintrag.gelernt++;
    if (box >= SICHER_AB_BOX) eintrag.sicher++;
  });
  return Object.keys(proLf).map((lf) => ({ lf, ...proLf[lf] }));
}
