import { describe, it, expect } from 'vitest';
import { streakAktualisieren } from '../streak.js';

describe('streak', () => {
  it('startet einen neuen Streak bei 1, wenn "last" leer ist', () => {
    const r = streakAktualisieren({ last: null, count: 0 }, new Date('2026-07-19'));
    expect(r).toEqual({ last: '2026-07-19', count: 1 });
  });

  it('zaehlt hoch, wenn gestern zuletzt gelernt wurde', () => {
    const r = streakAktualisieren({ last: '2026-07-18', count: 4 }, new Date('2026-07-19'));
    expect(r).toEqual({ last: '2026-07-19', count: 5 });
  });

  it('setzt auf 1 zurueck, wenn eine Luecke entstanden ist', () => {
    const r = streakAktualisieren({ last: '2026-07-10', count: 7 }, new Date('2026-07-19'));
    expect(r).toEqual({ last: '2026-07-19', count: 1 });
  });

  it('bleibt gleich, wenn heute schon gezaehlt wurde (kein Doppelzaehlen)', () => {
    const r = streakAktualisieren({ last: '2026-07-19', count: 3 }, new Date('2026-07-19'));
    expect(r).toEqual({ last: '2026-07-19', count: 3 });
  });
});
