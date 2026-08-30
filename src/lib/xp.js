// XP & Level — dezente Gamification (kein Kindergarten, siehe PRODUCT.md
// Brand Personality: "Belohnung über Momentum, nicht über Effekt-Feuerwerk").
// Level-Schwellen wachsen dreieckig (50, 150, 300, 500 …), damit frühe Level
// schnell fallen (Erfolgserlebnis) und spätere Level etwas bedeuten.

export const XP_RICHTIG = 10; // Karte/Quizfrage richtig beantwortet
export const XP_VERSUCH = 2; // falsch, aber immerhin dran versucht

export function xpFuerAntwort(gewusst) {
  return gewusst ? XP_RICHTIG : XP_VERSUCH;
}

/** Kumulative XP-Schwelle, die für Level n (>=1) nötig ist. Level 1 startet bei 0 XP. */
export function schwelleFuerLevel(level) {
  if (level <= 1) return 0;
  const n = level - 1;
  return 50 * n * (n + 1); // Dreieckszahl * 50: 100, 300, 600, 1000, ...
}

/** Aktuelles Level aus Gesamt-XP ableiten. */
export function levelFuerXp(xp) {
  let level = 1;
  while (schwelleFuerLevel(level + 1) <= xp) level++;
  return level;
}

/** Fortschritt (0..1) innerhalb des aktuellen Levels, fürs Anzeigen einer Mini-Leiste. */
export function levelFortschritt(xp) {
  const level = levelFuerXp(xp);
  const von = schwelleFuerLevel(level);
  const bis = schwelleFuerLevel(level + 1);
  if (bis === von) return 1;
  return Math.min(1, Math.max(0, (xp - von) / (bis - von)));
}
