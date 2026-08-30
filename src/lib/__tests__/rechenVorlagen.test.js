import { describe, it, expect } from 'vitest';
import { RECHEN_VORLAGEN, zufallsAufgabe, aufgabenSerie } from '../../data/rechenVorlagen.js';
import { RECHENKARTEN } from '../../data/rechenkarten.js';
import { KARTEN } from '../../data/karten.js';
import { istRichtig, STANDARD_TOLERANZ } from '../rechnen.js';

/** Deterministischer Pseudo-Zufall, damit Fehlschlaege reproduzierbar sind. */
function seedRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) % 2147483648;
    return s / 2147483648;
  };
}

describe('Rechen-Vorlagen', () => {
  it('hat eindeutige IDs', () => {
    const ids = RECHEN_VORLAGEN.map((v) => v.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('liefert bei jeder Vorlage eine endliche Loesung mit Einheit und Rechenweg', () => {
    const rng = seedRng(7);
    RECHEN_VORLAGEN.forEach((v) => {
      for (let n = 0; n < 25; n++) {
        const a = v.bau(rng);
        expect(Number.isFinite(a.loesung), v.id + ' liefert keine Zahl').toBe(true);
        expect(a.loesung, v.id + ' liefert 0/negativ').toBeGreaterThan(0);
        expect(String(a.frage).length).toBeGreaterThan(10);
        expect(String(a.einheit).length).toBeGreaterThan(0);
        expect(String(a.weg)).toContain('=');
      }
    });
  });

  it('haelt den im Rechenweg genannten Wert innerhalb der Toleranz', () => {
    const rng = seedRng(3);
    RECHEN_VORLAGEN.forEach((v) => {
      for (let n = 0; n < 10; n++) {
        const a = v.bau(rng);
        // Der Rechenweg endet auf "= <Wert> <Einheit>" — dieser Wert muss als
        // Antwort durchgehen, sonst rechnet die App etwas anderes vor als sie prueft.
        const letzte = String(a.weg).split('\n').pop();
        const zahlen = letzte.match(/=\s*([-\d.,]+)/g);
        const letzterWert = zahlen[zahlen.length - 1].replace(/^=\s*/, '');
        expect(
          istRichtig(letzterWert, a.loesung, a.toleranz || STANDARD_TOLERANZ),
          `${v.id}: Rechenweg zeigt ${letzterWert}, Loesung ist ${a.loesung}`
        ).toBe(true);
      }
    });
  });

  it('zufallsAufgabe liefert eine Vorlagen-ID mit', () => {
    const a = zufallsAufgabe(seedRng(11));
    expect(RECHEN_VORLAGEN.some((v) => v.id === a.vorlageId)).toBe(true);
  });

  it('aufgabenSerie liefert die gewuenschte Anzahl', () => {
    const serie = aufgabenSerie(10, seedRng(5));
    expect(serie.length).toBe(10);
    serie.forEach((a) => expect(Number.isFinite(a.loesung)).toBe(true));
  });
});

describe('Feste Rechenkarten', () => {
  it('kollidieren nicht mit den IDs der Stammkarten', () => {
    const stamm = new Set(KARTEN.map((k) => k.i));
    RECHENKARTEN.forEach((k) => expect(stamm.has(k.i), 'ID ' + k.i + ' doppelt').toBe(false));
    const eigene = RECHENKARTEN.map((k) => k.i);
    expect(new Set(eigene).size).toBe(eigene.length);
  });

  it('haben alle eine Zahl, eine Einheit und einen Rechenweg', () => {
    RECHENKARTEN.forEach((k) => {
      expect(Number.isFinite(k.r.loesung), 'Karte ' + k.i).toBe(true);
      expect(String(k.r.einheit).length, 'Karte ' + k.i).toBeGreaterThan(0);
      expect(String(k.a)).toContain('=');
      expect([1, 2, 3, 4]).toContain(k.j);
      expect(k.lf).toMatch(/^LF\d{1,2}$/);
    });
  });
});
