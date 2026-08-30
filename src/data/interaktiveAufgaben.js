export const INTERAKTIVE_AUFGABEN = [
  {
    id: "ordnung-sicherheitsregeln",
    typ: "reihenfolge",
    titel: "Freischalten in richtiger Reihenfolge",
    frage: "Bringe die fünf Sicherheitsregeln in die vorgeschriebene Reihenfolge.",
    elemente: [
      "Freischalten",
      "Gegen Wiedereinschalten sichern",
      "Spannungsfreiheit feststellen",
      "Erden und kurzschließen",
      "Benachbarte, unter Spannung stehende Teile abdecken oder abschranken",
    ],
    quelle: "dguv-203-001",
  },
  {
    id: "ordnung-erstpruefung",
    typ: "reihenfolge",
    titel: "Erstprüfung strukturieren",
    frage: "Ordne die drei Grundschritte einer Erstprüfung.",
    elemente: ["Besichtigen", "Erproben", "Messen"],
    quelle: "vde-0100-600",
  },
  {
    id: "zuordnung-leiter",
    typ: "zuordnung",
    titel: "Leiter sicher zuordnen",
    frage: "Ordne jedem Leiter seine Kennzeichnung zu.",
    paare: [
      ["Schutzleiter (PE)", "Grün-Gelb"],
      ["Neutralleiter (N)", "Blau"],
      ["Außenleiter", "L1, L2 oder L3"],
    ],
    quelle: "vde-0197",
  },
  {
    id: "zuordnung-pruefung",
    typ: "zuordnung",
    titel: "Prüfschritte erkennen",
    frage: "Ordne den Prüfarten passende Beispiele zu.",
    paare: [
      ["Besichtigen", "Auswahl und Kennzeichnung kontrollieren"],
      ["Erproben", "Funktion einer Schutzeinrichtung prüfen"],
      ["Messen", "Isolationswiderstand bestimmen"],
    ],
    quelle: "vde-0100-600",
  },
];

