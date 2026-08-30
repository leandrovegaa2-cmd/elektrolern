import { describe, it, expect } from 'vitest';
import { heuteZaehlen, heutigerStand, tageszielGueltig, STANDARD_TAGESZIEL, MIN_TAGESZIEL, MAX_TAGESZIEL } from '../tagesziel.js';

const TAG1 = new Date('2026-07-19T10:00:00');
const TAG2 = new Date('2026-07-20T09:00:00');

describe('tagesziel', () => {
  it('startet bei 1, wenn heute noch nichts gezaehlt wurde', () => {
    const h = heuteZaehlen(null, TAG1);
    expect(h).toEqual({ datum: '2026-07-19', anzahl: 1 });
  });

  it('zaehlt am selben Tag hoch', () => {
    let h = heuteZaehlen(null, TAG1);
    h = heuteZaehlen(h, TAG1);
    h = heuteZaehlen(h, TAG1);
    expect(h.anzahl).toBe(3);
  });

  it('setzt an einem neuen Tag zurueck auf 1', () => {
    let h = heuteZaehlen(null, TAG1);
    h = heuteZaehlen(h, TAG1);
    h = heuteZaehlen(h, TAG2);
    expect(h).toEqual({ datum: '2026-07-20', anzahl: 1 });
  });

  it('heutigerStand ist 0, wenn der gespeicherte Stand von gestern ist', () => {
    const gestern = { datum: '2026-07-19', anzahl: 8 };
    expect(heutigerStand(gestern, TAG2)).toBe(0);
    expect(heutigerStand(gestern, TAG1)).toBe(8);
  });

  it('STANDARD_TAGESZIEL liegt innerhalb der gueltigen Grenzen', () => {
    expect(tageszielGueltig(STANDARD_TAGESZIEL)).toBe(true);
  });

  it('tageszielGueltig lehnt Werte ausserhalb des Bereichs ab', () => {
    expect(tageszielGueltig(MIN_TAGESZIEL - 1)).toBe(false);
    expect(tageszielGueltig(MAX_TAGESZIEL + 1)).toBe(false);
    expect(tageszielGueltig(NaN)).toBe(false);
  });
});
