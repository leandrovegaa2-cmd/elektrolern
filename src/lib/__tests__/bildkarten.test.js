import { describe, it, expect } from 'vitest';
import { BILD_KARTEN } from '../../data/bildkarten.js';
import { DIA } from '../../data/diagrams.js';
import { karteFehler } from '../kartenStore.js';

describe('bildkarten', () => {
  it('jede Bild-Frage verweist auf ein existierendes Diagramm', () => {
    for (const k of BILD_KARTEN) {
      expect(k.dia, 'Karte ' + k.i + ' hat kein dia-Feld').toBeTruthy();
      expect(DIA[k.dia], 'Diagramm "' + k.dia + '" fehlt in diagrams.js').toBeTruthy();
    }
  });

  it('jede Bild-Frage ist eine gültige Quiz-Karte (Pflichtfelder ok)', () => {
    for (const k of BILD_KARTEN) {
      expect(karteFehler(k), 'Karte ' + k.i + ': ' + karteFehler(k).join(', ')).toEqual([]);
    }
  });

  it('jede Bild-Frage hat mindestens 3 Antwortmöglichkeiten', () => {
    for (const k of BILD_KARTEN) {
      expect(k.m.length, 'Karte ' + k.i).toBeGreaterThanOrEqual(3);
    }
  });

  it('Karten-IDs sind eindeutig', () => {
    const ids = BILD_KARTEN.map((k) => k.i);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
