import { describe, it, expect } from 'vitest';
import {
  pruefAuswahl,
  pruefMix,
  istFrageKorrekt,
  istBeantwortet,
  bestanden,
  lfAnalyse,
  BESTEHENSGRENZE,
} from '../exam.js';

const pool = [
  ...Array.from({ length: 10 }, (_, i) => ({ i: i, lf: 'LF8', m: [1] })),
  ...Array.from({ length: 2 }, (_, i) => ({ i: 100 + i, lf: 'LF9', m: [1] })),
  ...Array.from({ length: 1 }, (_, i) => ({ i: 200 + i, lf: 'LF13', m: [1] })),
];

describe('pruefAuswahl', () => {
  it('verteilt ueber Lernfelder, statt ein grosses LF alles dominieren zu lassen', () => {
    const seq = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7]; // deterministischer "rng"
    let k = 0;
    const rng = () => seq[k++ % seq.length];
    const auswahl = pruefAuswahl(pool, 10, rng);
    const lfs = new Set(auswahl.map((k) => k.lf));
    // kleine LFs (nur 1-2 Karten) muessen trotz nur 10 von 13 Karten vertreten sein
    expect(lfs.has('LF9')).toBe(true);
    expect(lfs.has('LF13')).toBe(true);
  });

  it('liefert nie mehr Karten als angefragt oder vorhanden', () => {
    const auswahl = pruefAuswahl(pool, 100);
    expect(auswahl.length).toBe(pool.length);
    const auswahl2 = pruefAuswahl(pool, 5);
    expect(auswahl2.length).toBe(5);
  });
});

describe('pruefMix', () => {
  const mcPool = Array.from({ length: 30 }, (_, i) => ({ i, lf: 'LF' + ((i % 5) + 1), m: ['a', 'b'] }));
  const rechenPool = Array.from({ length: 10 }, (_, i) => ({
    i: 500 + i,
    lf: 'LF' + ((i % 3) + 1),
    r: { loesung: 10, einheit: 'A' },
  }));

  it('mischt den gewuenschten Anteil Rechenaufgaben unter die Multiple-Choice-Fragen', () => {
    const fragen = pruefMix(mcPool, rechenPool, 20, 5);
    expect(fragen.length).toBe(20);
    expect(fragen.filter((f) => f.typ === 'rechnen').length).toBe(5);
    expect(fragen.filter((f) => f.typ === 'mc').length).toBe(15);
  });

  it('fuellt mit Multiple Choice auf, wenn zu wenige Rechenkarten da sind', () => {
    const fragen = pruefMix(mcPool, rechenPool.slice(0, 2), 20, 5);
    expect(fragen.length).toBe(20);
    expect(fragen.filter((f) => f.typ === 'rechnen').length).toBe(2);
  });

  it('nimmt keine Karte doppelt', () => {
    const doppel = { i: 999, lf: 'LF1', m: ['a', 'b'], r: { loesung: 1, einheit: 'A' } };
    const fragen = pruefMix([...mcPool, doppel], [doppel], 20, 5);
    const ids = fragen.map((f) => f.k.i);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('kommt mit leeren Pools klar', () => {
    expect(pruefMix([], [], 20, 5)).toEqual([]);
    expect(pruefMix([], rechenPool, 20, 5).length).toBe(5);
  });
});

describe('istFrageKorrekt / istBeantwortet', () => {
  const mcFrage = (gewaehlt) => ({
    typ: 'mc',
    k: { i: 1 },
    optionen: [
      { text: 'falsch', richtig: false },
      { text: 'richtig', richtig: true },
    ],
    gewaehlt,
  });
  const rechenFrage = (eingabe) => ({ typ: 'rechnen', k: { i: 2, r: { loesung: 6.857, einheit: 'V' } }, eingabe });

  it('wertet Multiple Choice ueber die gewaehlte Option', () => {
    expect(istFrageKorrekt(mcFrage(1))).toBe(true);
    expect(istFrageKorrekt(mcFrage(0))).toBe(false);
    expect(istFrageKorrekt(mcFrage(null))).toBe(false);
  });

  it('wertet Rechenaufgaben mit Toleranz', () => {
    expect(istFrageKorrekt(rechenFrage('6,86'))).toBe(true);
    expect(istFrageKorrekt(rechenFrage('6.86'))).toBe(true);
    expect(istFrageKorrekt(rechenFrage('7,5'))).toBe(false);
    expect(istFrageKorrekt(rechenFrage(''))).toBe(false);
  });

  it('erkennt unbeantwortete Fragen beider Typen', () => {
    expect(istBeantwortet(mcFrage(null))).toBe(false);
    expect(istBeantwortet(mcFrage(0))).toBe(true);
    expect(istBeantwortet(rechenFrage('  '))).toBe(false);
    expect(istBeantwortet(rechenFrage('0'))).toBe(true);
  });
});

describe('bestanden', () => {
  it(`Bestehensgrenze liegt bei ${BESTEHENSGRENZE}%`, () => {
    expect(bestanden(10, 20)).toBe(true); // genau 50%
    expect(bestanden(9, 20)).toBe(false); // 45%
    expect(bestanden(0, 0)).toBe(false); // keine Fragen = nicht bestanden
  });
});

describe('lfAnalyse', () => {
  it('sortiert nach Trefferquote, schwaechste zuerst', () => {
    const ergebnis = lfAnalyse([
      { lf: 'LF1', korrekt: true },
      { lf: 'LF1', korrekt: true },
      { lf: 'LF2', korrekt: false },
      { lf: 'LF2', korrekt: true },
    ]);
    expect(ergebnis[0].lf).toBe('LF2'); // 50% < 100%
    expect(ergebnis[0].quote).toBeCloseTo(0.5);
    expect(ergebnis[1].lf).toBe('LF1');
    expect(ergebnis[1].quote).toBe(1);
  });
});
