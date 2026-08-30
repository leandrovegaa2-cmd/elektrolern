// Erfolge/Achievements — bewusst zurückhaltend (siehe PRODUCT.md: "Belohnung
// über Momentum, nicht über Effekt-Feuerwerk"). Kein Konfetti, keine Popups —
// freigeschaltete Abzeichen erscheinen nur als kleine Galerie im
// Fortschritt-Tab. Jede Definition ist eine reine Prüf-Funktion über einen
// Kontext, damit sie ohne React/State testbar ist.
export const ERFOLGE = [
  { id: "streak_3", titel: "Drei Tage dran", beschreibung: "3 Tage in Folge gelernt.", icon: "streak", check: (ctx) => ctx.streak >= 3 },
  { id: "streak_7", titel: "Eine Woche durch", beschreibung: "7 Tage in Folge gelernt.", icon: "streak", check: (ctx) => ctx.streak >= 7 },
  { id: "streak_14", titel: "Zwei Wochen Routine", beschreibung: "14 Tage in Folge gelernt.", icon: "streak", check: (ctx) => ctx.streak >= 14 },
  { id: "streak_30", titel: "Ein Monat durch", beschreibung: "30 Tage in Folge gelernt.", icon: "streak", check: (ctx) => ctx.streak >= 30 },
  { id: "level_5", titel: "Level 5", beschreibung: "Level 5 erreicht.", icon: "trend", check: (ctx) => ctx.level >= 5 },
  { id: "level_10", titel: "Level 10", beschreibung: "Level 10 erreicht.", icon: "trend", check: (ctx) => ctx.level >= 10 },
  { id: "lf_sicher", titel: "Lernfeld sitzt", beschreibung: "Ein Lernfeld komplett sicher (Box 4+).", icon: "target", check: (ctx) => ctx.lfSicherErreicht },
  { id: "alle_gelernt", titel: "Alles einmal gelernt", beschreibung: "Alle 13 Lernfelder mindestens einmal gelernt.", icon: "book", check: (ctx) => ctx.alleLfGelernt },
  { id: "pruefung_bestanden", titel: "Prüfung bestanden", beschreibung: "Erste Prüfungssimulation bestanden.", icon: "exam", check: (ctx) => ctx.pruefungBestanden },
  { id: "pruefung_glanz", titel: "Mit Glanz bestanden", beschreibung: "Prüfungssimulation mit 90 % oder mehr.", icon: "trophy", check: (ctx) => ctx.pruefungProzent >= 90 },
];

/** Gibt die IDs neu erfüllter (noch nicht freigeschalteter) Erfolge zurück. */
export function neueErfolge(erfolgeBisher, ctx) {
  const bisher = erfolgeBisher || {};
  return ERFOLGE.filter((e) => !bisher[e.id] && e.check(ctx)).map((e) => e.id);
}
