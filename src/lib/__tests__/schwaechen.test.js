import { describe, it, expect } from 'vitest';
import { schwaechenAnalyse, lfMeisterschaft } from '../schwaechen.js';

describe('schwaechenAnalyse', () => {
  const karten = [
    { i: 1, lf: 'LF1' }, { i: 2, lf: 'LF1' },
    { i: 3, lf: 'LF2' }, { i: 4, lf: 'LF2' },
  ];

  it('sortiert Lernfelder nach Meisterschaft, schwaechstes zuerst', () => {
    const prog = {
      1: { box: 3 }, 2: { box: 3 }, // LF1: beide gelernt (Box>=2)
      3: { box: 0 }, 4: { box: 1 }, // LF2: keine gelernt
    };
    const r = schwaechenAnalyse(karten, prog);
    expect(r[0].lf).toBe('LF2');
    expect(r[0].quote).toBe(0);
    expect(r[1].lf).toBe('LF1');
    expect(r[1].quote).toBe(1);
  });

  it('behandelt komplett neue Karten (kein Progress-Eintrag) als nicht gelernt', () => {
    const r = schwaechenAnalyse(karten, {});
    expect(r.every((x) => x.quote === 0)).toBe(true);
  });
});

describe('lfMeisterschaft', () => {
  const karten = [
    { i: 1, lf: 'LF1' }, { i: 2, lf: 'LF1' },
    { i: 3, lf: 'LF2' }, { i: 4, lf: 'LF2' },
  ];

  it('zaehlt gelernt (Box>=2) und sicher (Box>=4) getrennt', () => {
    const prog = { 1: { box: 4 }, 2: { box: 2 }, 3: { box: 0 }, 4: { box: 5 } };
    const r = lfMeisterschaft(karten, prog);
    const lf1 = r.find((x) => x.lf === 'LF1');
    const lf2 = r.find((x) => x.lf === 'LF2');
    expect(lf1).toEqual({ lf: 'LF1', anzahl: 2, gelernt: 2, sicher: 1 });
    expect(lf2).toEqual({ lf: 'LF2', anzahl: 2, gelernt: 1, sicher: 1 });
  });

  it('meldet 0 sicher/gelernt fuer komplett neue Karten', () => {
    const r = lfMeisterschaft(karten, {});
    expect(r.every((x) => x.gelernt === 0 && x.sicher === 0)).toBe(true);
  });
});
