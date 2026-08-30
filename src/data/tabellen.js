// Praxis-Tabellen fürs Nachschlagen. Ursprünglich als HTML-Strings in
// website/index.html (tabellenHTML()) — hier als strukturierte Daten,
// damit die UI sie als echte React-Komponenten rendert statt als
// zusammengeklebten HTML-String.

export const LEITERFARBEN = [
  { label: "PE", farbe: "pe", text: "grün-gelb — Schutzleiter, NIE anders nutzen!" },
  { label: "N", farbe: "#2563eb", text: "blau — Neutralleiter" },
  { label: "L1", farbe: "#92400e", text: "braun" },
  { label: "L2", farbe: "#18181b", text: "schwarz" },
  { label: "L3", farbe: "#9ca3af", text: "grau" },
];

export const SICHERHEITSREGELN = [
  "Freischalten",
  "Gegen Wiedereinschalten sichern",
  "Spannungsfreiheit feststellen — zweipoliger Prüfer!",
  "Erden und kurzschließen",
  "Benachbarte, unter Spannung stehende Teile abdecken oder abschranken",
];

export const FAUSTWERTE = {
  querschnitte: [
    { label: "1,5 mm²", text: "Licht (16 A)" },
    { label: "2,5 mm²", text: "Steckdosen (16 A)" },
    { label: "6–10 mm²", text: "Herd" },
  ],
  grenzwerte: [
    { label: "50 V AC / 120 V DC", text: "ab hier gefährliche Spannung" },
    { label: "ca. 50 mA", text: "Herzkammerflimmern droht" },
    { label: "30 mA", text: "RCD in Endstromkreisen" },
    { label: "0,4 s", text: "max. Abschaltzeit TN (bis 32 A)" },
    { label: "230/400 V", text: "Netz, 50 Hz (T = 20 ms)" },
  ],
};

export const SCHUTZKLASSEN = [
  { label: "Klasse I", text: "mit Schutzleiter (PE)" },
  { label: "Klasse II", text: "doppelt isoliert (Doppelquadrat-Symbol)" },
  { label: "Klasse III", text: "Schutzkleinspannung (SELV)" },
];

// IP-Code-Beispiel IP44: erste Ziffer = Fremdkörper/Berührung, zweite = Wasser
export const IP_BEISPIEL = {
  code: "IP44",
  erste: { wert: "4", label: "1. Ziffer: Fremdkörper & Berührung (0–6)" },
  zweite: { wert: "4", label: "2. Ziffer: Wasser (0–9)" },
};
