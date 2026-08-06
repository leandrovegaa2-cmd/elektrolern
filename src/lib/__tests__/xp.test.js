import { describe, it, expect } from 'vitest';
import { xpFuerAntwort, schwelleFuerLevel, levelFuerXp, levelFortschritt } from '../xp.js';

describe('xp & level', () => {
  it('vergibt mehr XP fuer richtige als fuer falsche Antworten', () => {
    expect(xpFuerAntwort(true)).toBeGreaterThan(xpFuerAntwort(false));
  });

  it('Level 1 startet bei 0 XP', () => {
    expect(schwelleFuerLevel(1)).toBe(0);
    expect(levelFuerXp(0)).toBe(1);
  });

  it('Level-Schwellen wachsen (schwerer werden pro Level)', () => {
    const s1 = schwelleFuerLevel(2), s2 = schwelleFuerLevel(3), s3 = schwelleFuerLevel(4);
    expect(s2 - s1).toBeGreaterThan(0);
    expect(s3 - s2).toBeGreaterThan(s2 - s1);
  });

  it('levelFuerXp ist monoton nicht-fallend mit steigendem XP', () => {
    let letztesLevel = 1;
    for (let xp = 0; xp <= 2000; xp += 37) {
      const level = levelFuerXp(xp);
      expect(level).toBeGreaterThanOrEqual(letztesLevel);
      letztesLevel = level;
    }
  });

  it('levelFortschritt liegt immer zwischen 0 und 1', () => {
    for (let xp = 0; xp <= 2000; xp += 53) {
      const p = levelFortschritt(xp);
      expect(p).toBeGreaterThanOrEqual(0);
      expect(p).toBeLessThanOrEqual(1);
    }
  });
});
