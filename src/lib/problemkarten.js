// Problemkarten: Karten, die wiederholt "nicht gewusst" beantwortet wurden.
// Eigener Fehler-Zähler je Karte (unabhängig von der Leitner-Box, die bei
// einem einzigen Erfolg schon wieder hochspringt) — damit "diese Karte sitzt
// noch nicht" sichtbar bleibt, statt nach einem Lucky Guess zu verschwinden.
export const MIN_FEHLER = 2;

export function fehlerVon(progress) {
  return progress?.fehler || 0;
}

/** Karten mit mind. MIN_FEHLER Fehlversuchen, häufigste zuerst. */
export function problemkarten(karten, prog, limit = 15) {
  return karten
    .filter((k) => fehlerVon(prog[k.i]) >= MIN_FEHLER)
    .sort((a, b) => fehlerVon(prog[b.i]) - fehlerVon(prog[a.i]))
    .slice(0, limit);
}
