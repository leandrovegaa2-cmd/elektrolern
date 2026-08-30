import { describe, it, expect } from 'vitest';
import { problemkarten, fehlerVon, MIN_FEHLER } from '../problemkarten.js';

const KARTEN = [
  { i: 'i1', f: 'Frage 1' },
  { i: 'i2', f: 'Frage 2' },
  { i: 'i3', f: 'Frage 3' },
];

describe('problemkarten', () => {
  it('fehlerVon liefert 0 fuer unbekannte/neue Karten', () => {
    expect(fehlerVon(undefined)).toBe(0);
    expect(fehlerVon({ box: 2 })).toBe(0);
  });

  it('nimmt nur Karten mit mindestens MIN_FEHLER Fehlversuchen auf', () => {
    const prog = { i1: { fehler: MIN_FEHLER }, i2: { fehler: MIN_FEHLER - 1 }, i3: { fehler: 0 } };
    const liste = problemkarten(KARTEN, prog);
    expect(liste.map((k) => k.i)).toEqual(['i1']);
  });

  it('sortiert absteigend nach Fehlerzahl', () => {
    const prog = { i1: { fehler: 2 }, i2: { fehler: 5 }, i3: { fehler: 3 } };
    const liste = problemkarten(KARTEN, prog);
    expect(liste.map((k) => k.i)).toEqual(['i2', 'i3', 'i1']);
  });

  it('begrenzt auf das angegebene Limit', () => {
    const prog = { i1: { fehler: 4 }, i2: { fehler: 5 }, i3: { fehler: 6 } };
    const liste = problemkarten(KARTEN, prog, 2);
    expect(liste).toHaveLength(2);
  });
});
