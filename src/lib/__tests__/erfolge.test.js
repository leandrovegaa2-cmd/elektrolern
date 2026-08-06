import { describe, it, expect } from 'vitest';
import { neueErfolge, ERFOLGE } from '../erfolge.js';

describe('erfolge', () => {
  it('schaltet nichts frei, wenn kein Kriterium erfuellt ist', () => {
    const ctx = { streak: 0, level: 1, lfSicherErreicht: false, alleLfGelernt: false, pruefungBestanden: false, pruefungProzent: 0 };
    expect(neueErfolge({}, ctx)).toEqual([]);
  });

  it('schaltet Streak-Erfolge anhand des Schwellwerts frei', () => {
    const ctx = { streak: 7, level: 1, lfSicherErreicht: false, alleLfGelernt: false, pruefungBestanden: false, pruefungProzent: 0 };
    const neu = neueErfolge({}, ctx);
    expect(neu).toContain('streak_3');
    expect(neu).toContain('streak_7');
    expect(neu).not.toContain('streak_14');
  });

  it('gibt bereits freigeschaltete Erfolge nicht erneut zurueck', () => {
    const ctx = { streak: 7, level: 1, lfSicherErreicht: false, alleLfGelernt: false, pruefungBestanden: false, pruefungProzent: 0 };
    const neu = neueErfolge({ streak_3: '2026-07-01', streak_7: '2026-07-10' }, ctx);
    expect(neu).toEqual([]);
  });

  it('jede Erfolgs-ID im Katalog ist eindeutig', () => {
    const ids = ERFOLGE.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('Pruefungs- und Level-Kriterien loesen unabhaengig voneinander aus', () => {
    const ctx = { streak: 0, level: 10, lfSicherErreicht: false, alleLfGelernt: false, pruefungBestanden: true, pruefungProzent: 95 };
    const neu = neueErfolge({}, ctx);
    expect(neu).toEqual(expect.arrayContaining(['level_5', 'level_10', 'pruefung_bestanden', 'pruefung_glanz']));
  });
});
