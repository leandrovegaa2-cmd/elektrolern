export const SLOT_EINSAETZE = [10, 25, 50, 100];

export const SLOT_SYMBOLE = [
  { id: "strom", label: "Strom", icon: "bolt", gewicht: 33, auszahlung: { 3: 5, 4: 12, 5: 32 } },
  { id: "schaltung", label: "Schaltung", icon: "circuit", gewicht: 25, auszahlung: { 3: 7, 4: 18, 5: 52 } },
  { id: "werk", label: "Werk", icon: "tools", gewicht: 18, auszahlung: { 3: 10, 4: 32, 5: 105 } },
  { id: "antrieb", label: "Antrieb", icon: "motor", gewicht: 12, auszahlung: { 3: 18, 4: 52, 5: 210 } },
  { id: "kern", label: "Energiekern", icon: "crystal", gewicht: 7, auszahlung: { 3: 32, 4: 105, 5: 525 } },
  { id: "krone", label: "Hochspannung", icon: "trophy", gewicht: 3, auszahlung: { 3: 90, 4: 350, 5: 1750 } },
  { id: "wild", label: "Wild", icon: "slotWild", gewicht: 2, auszahlung: { 3: 175, 4: 875, 5: 2500 }, wild: true },
];

export const SLOT_SYMBOL_MAP = Object.fromEntries(SLOT_SYMBOLE.map((symbol) => [symbol.id, symbol]));

// Zehn feste Linien, gelesen von der linken zur rechten Walze.
export const SLOT_LINIEN = [
  [0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1],
  [2, 2, 2, 2, 2],
  [0, 1, 2, 1, 0],
  [2, 1, 0, 1, 2],
  [0, 0, 1, 0, 0],
  [2, 2, 1, 2, 2],
  [1, 0, 0, 0, 1],
  [1, 2, 2, 2, 1],
  [0, 1, 1, 1, 0],
];
