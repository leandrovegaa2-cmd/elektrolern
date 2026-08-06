// Optische Identität je Lernfeld bzw. Lehrjahr.
//
// Symbol, Farbe und Nummer gehören zusammen: das Badge trägt das Symbol auf der
// Lernfeld-Farbe, die Nummer steht als farbige Zeile darüber, und dieselbe Farbe
// taucht in Fortschrittsring und Balken wieder auf. Ein Erkennungsmerkmal in drei
// Ausprägungen statt drei konkurrierender Marker auf einer Karte.
//
// Die Farben sind bewusst über den ganzen Farbkreis verteilt (nicht 13 Blautöne),
// damit benachbarte Lernfelder in der Liste unterscheidbar bleiben, und alle hell
// genug für den dunklen Hintergrund. Entscheidend ist die Nachbarschaft INNERHALB
// eines Lehrjahrs — nur die sieht man gleichzeitig:
//   LJ1 = LF1–4 · LJ2 = LF5–8 · LJ3 = LF9–11 · LJ4 = LF12–13

export const LF_META = {
  LF1: { icon: "⚡", farbe: "#3b82f6" }, // Systeme analysieren & prüfen
  LF2: { icon: "🔌", farbe: "#22d3ee" }, // Installation planen & ausführen
  LF3: { icon: "🎛️", farbe: "#a78bfa" }, // Steuerungen analysieren
  LF4: { icon: "💻", farbe: "#38bdf8" }, // Informationstechnik
  LF5: { icon: "🏭", farbe: "#f59e0b" }, // Energieversorgung & Sicherheit
  LF6: { icon: "🔍", farbe: "#34d399" }, // Anlagen prüfen
  LF7: { icon: "🤖", farbe: "#6366f1" }, // SPS programmieren
  LF8: { icon: "⚙️", farbe: "#fb923c" }, // Antriebe & Motoren
  LF9: { icon: "🏠", farbe: "#2dd4bf" }, // Kommunikation / KNX
  // Rot ist hier bewusst NICHT vergeben: es liest sich in dieser App als Fehler
  // bzw. Warnung (falsche Antwort, Problemkarten) und wäre als Lernfeld-Farbe
  // ein falsches Signal.
  LF10: { icon: "🚿", farbe: "#c084fc" }, // Haustechnik & Installation
  LF11: { icon: "☀️", farbe: "#fbbf24" }, // Energietechnik (PV, Blitz)
  LF12: { icon: "📐", farbe: "#60a5fa" }, // Anlagen planen
  LF13: { icon: "🔧", farbe: "#f472b6" }, // Instandhaltung & Fehlersuche
};

const LF_FALLBACK = { icon: "📘", farbe: "#8f98ac" };

/** Symbol + Farbe eines Lernfelds. Unbekannte Lernfelder bekommen ein neutrales Paar. */
export function lfMeta(lf) {
  return LF_META[lf] || LF_FALLBACK;
}

/**
 * Lehrjahre bekommen bewusst die NUMMER statt eines Symbols ins Badge — so
 * unterscheidet sich die Auswahl-Ebene „Lehrjahr" auf einen Blick von der
 * Ebene „Lernfeld" darunter, obwohl beide dieselbe Kartenform benutzen.
 */
export const LJ_META = {
  0: { badge: "★", farbe: "#22d3ee" },
  1: { badge: "1", farbe: "#3b82f6" },
  2: { badge: "2", farbe: "#a78bfa" },
  3: { badge: "3", farbe: "#34d399" },
  4: { badge: "4", farbe: "#f59e0b" },
};

/** Trennt "Lehrjahr 2 — Energie & Steuerung" in Kicker und Titel. */
export function nameTeilen(name) {
  const teile = String(name).split(" — ");
  if (teile.length < 2) return { kicker: null, titel: name };
  return { kicker: teile[0], titel: teile.slice(1).join(" — ") };
}
