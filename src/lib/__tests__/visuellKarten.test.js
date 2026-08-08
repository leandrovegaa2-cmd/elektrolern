import { describe, it, expect } from 'vitest';
import { VISUELL_KARTEN } from '../../data/visuellKarten.js';
import { SCHALTZEICHEN } from '../../data/schaltzeichen.js';
import { DIA } from '../../data/diagrams.js';
import { BASIS_KARTEN, karteFehler } from '../kartenStore.js';

describe('visuellKarten', () => {
  it('jede Karte verweist auf ein existierendes Diagramm', () => {
    for (const k of VISUELL_KARTEN) {
      expect(k.dia, 'Karte ' + k.i + ' hat kein dia-Feld').toBeTruthy();
      expect(DIA[k.dia], 'Diagramm "' + k.dia + '" fehlt in DIA').toBeTruthy();
    }
  });

  it('jede Karte ist gültig (Pflichtfelder ok)', () => {
    for (const k of VISUELL_KARTEN) {
      expect(karteFehler(k), 'Karte ' + k.i + ': ' + karteFehler(k).join(', ')).toEqual([]);
    }
  });

  it('MC-Karten haben m[0] als Antwort und ≥3 Optionen; Aufdeck-Karten kein m', () => {
    for (const k of VISUELL_KARTEN) {
      if (k.m) {
        expect(k.m.length, 'Karte ' + k.i).toBeGreaterThanOrEqual(3);
        expect(String(k.m[0]).trim().length, 'Karte ' + k.i).toBeGreaterThan(0);
      } else {
        expect(String(k.a).trim().length, 'Aufdeck-Karte ' + k.i).toBeGreaterThan(0);
      }
    }
  });

  it('gibt sowohl MC- als auch Aufdeck-Fehlerbilder', () => {
    const mc = VISUELL_KARTEN.filter((k) => k.dia.startsWith('fb_') && k.m);
    const auf = VISUELL_KARTEN.filter((k) => k.dia.startsWith('fb_') && !k.m);
    expect(mc.length).toBeGreaterThan(0);
    expect(auf.length).toBeGreaterThan(0);
  });

  it('alle Schaltzeichen sind als DIA-Bildfrage abrufbar', () => {
    for (const s of SCHALTZEICHEN) {
      expect(DIA[s.name], 'Schaltzeichen "' + s.name + '" nicht in DIA').toBeTruthy();
    }
  });

  it('Karten-IDs sind global eindeutig (keine Kollision mit anderen Karten)', () => {
    const ids = BASIS_KARTEN.map((k) => k.i);
    expect(new Set(ids).size, 'doppelte Karten-ID im Basisdeck').toBe(ids.length);
  });
});
