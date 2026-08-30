import { describe, it, expect } from 'vitest';
import { naechsteBox, istFaellig, istGelernt, istSicher, INTERVALLE } from '../leitner.js';

describe('leitner', () => {
  const ref = new Date('2026-07-19T10:00:00');

  it('startet eine neue Karte bei "gewusst" in Box 1 mit due=heute (Intervall 0)', () => {
    const r = naechsteBox(undefined, true, ref);
    expect(r.box).toBe(1);
    expect(r.due).toBe('2026-07-19');
  });

  it('wandert bei "gewusst" eine Box hoch und setzt due passend zum Intervall', () => {
    const r = naechsteBox({ box: 2, due: '2026-07-10' }, true, ref);
    expect(r.box).toBe(3);
    expect(r.due).toBe('2026-07-22'); // +3 Tage
  });

  it('faellt bei "nicht gewusst" immer zurück auf Box 1, egal von wo', () => {
    const r = naechsteBox({ box: 5, due: '2026-07-10' }, false, ref);
    expect(r.box).toBe(1);
    expect(r.due).toBe('2026-07-19'); // Intervall Box1 = 0 Tage
  });

  it('steigt von Box 5 in die neue Box 6 mit langer Pause', () => {
    const r = naechsteBox({ box: 5, due: '2026-07-10' }, true, ref);
    expect(r.box).toBe(6);
    expect(r.due).toBe('2026-08-23'); // +35 Tage
  });

  it('geht nicht über die höchste Box hinaus', () => {
    const r = naechsteBox({ box: 6, due: '2026-07-10' }, true, ref);
    expect(r.box).toBe(6); // BOX_MAX
    expect(r.due).toBe('2026-08-23'); // +35 Tage
  });

  it('eine nie gelernte Karte ist immer fällig', () => {
    expect(istFaellig(undefined, ref)).toBe(true);
  });

  it('eine Karte mit due in der Zukunft ist nicht fällig', () => {
    expect(istFaellig({ box: 3, due: '2026-08-01' }, ref)).toBe(false);
  });

  it('eine Karte mit due heute oder in der Vergangenheit ist fällig', () => {
    expect(istFaellig({ box: 3, due: '2026-07-19' }, ref)).toBe(true);
    expect(istFaellig({ box: 3, due: '2026-07-01' }, ref)).toBe(true);
  });

  it('"gelernt" zählt ab Box 2, "sicher" ab Box 4', () => {
    expect(istGelernt({ box: 1 })).toBe(false);
    expect(istGelernt({ box: 2 })).toBe(true);
    expect(istSicher({ box: 3 })).toBe(false);
    expect(istSicher({ box: 4 })).toBe(true);
  });

  it('Intervalle: Original [0,0,1,3,7,14] plus die neue Box 6 mit 35 Tagen', () => {
    expect(INTERVALLE).toEqual([0, 0, 1, 3, 7, 14, 35]);
  });
});
