import { describe, it, expect } from 'vitest';
import { verlaufAktualisieren, VERLAUF_MAX } from '../verlauf.js';

const TAG1 = new Date('2026-07-19T10:00:00');
const TAG2 = new Date('2026-07-20T09:00:00');

describe('verlauf', () => {
  it('fuegt einen neuen Tagespunkt hinzu', () => {
    const v = verlaufAktualisieren([], { prozent: 10, xp: 100 }, TAG1);
    expect(v).toEqual([{ datum: '2026-07-19', prozent: 10, xp: 100 }]);
  });

  it('ueberschreibt den heutigen Punkt statt einen zweiten anzuhaengen', () => {
    let v = verlaufAktualisieren([], { prozent: 10, xp: 100 }, TAG1);
    v = verlaufAktualisieren(v, { prozent: 15, xp: 130 }, TAG1);
    expect(v).toHaveLength(1);
    expect(v[0]).toEqual({ datum: '2026-07-19', prozent: 15, xp: 130 });
  });

  it('haengt an einem neuen Tag einen weiteren Punkt an', () => {
    let v = verlaufAktualisieren([], { prozent: 10, xp: 100 }, TAG1);
    v = verlaufAktualisieren(v, { prozent: 20, xp: 200 }, TAG2);
    expect(v).toHaveLength(2);
    expect(v[1].datum).toBe('2026-07-20');
  });

  it('kappt die Liste auf VERLAUF_MAX Eintraege', () => {
    let v = [];
    for (let i = 0; i < VERLAUF_MAX + 10; i++) {
      const tag = new Date(2026, 0, 1 + i);
      v = verlaufAktualisieren(v, { prozent: i, xp: i * 10 }, tag);
    }
    expect(v).toHaveLength(VERLAUF_MAX);
    expect(v[v.length - 1].prozent).toBe(VERLAUF_MAX + 9);
  });
});
