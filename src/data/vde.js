// Norm-Daten für die Rechner & Merktabellen (DIN VDE / TAB, Deutschland).
//
// Quelle: interner Deep-Research-Report + DIN VDE 0298-4. Nur Kupferleiter
// (κ = 56 m/(Ω·mm²)), PVC-isoliert, Bezugstemperatur 30 °C. Alle Werte sind
// Lern-/Richtwerte — im Einzelfall gilt die konkrete Norm-Tabelle.

// Leitwert Kupfer, für Spannungsfall/Widerstand.
export const KAPPA_CU = 56;

// Verlegearten nach DIN VDE 0298-4 mit Kurz-Klartext.
export const VERLEGEARTEN = [
  { id: "A1", text: "Einzeladern in Rohr in wärmegedämmter Wand" },
  { id: "A2", text: "Mehraderleitung in Rohr in wärmegedämmter Wand" },
  { id: "B1", text: "Einzeladern in Rohr auf/in der Wand" },
  { id: "B2", text: "Mehraderleitung in Rohr auf/in der Wand" },
  { id: "C", text: "Leitung direkt auf der Wand" },
  { id: "E", text: "Mehraderleitung frei in Luft / auf Kabelrinne" },
];

// Strombelastbarkeit Iz in A — DIN VDE 0298-4, Kupfer, PVC, 3 belastete Adern,
// 30 °C Umgebung. Spalten je Referenz-Verlegeart.
export const STROMBELASTBARKEIT = [
  { A: 1.5, iz: { A1: 13, A2: 13, B1: 15.5, B2: 15, C: 17.5, E: 19.5 } },
  { A: 2.5, iz: { A1: 17.5, A2: 17, B1: 21, B2: 20, C: 24, E: 27 } },
  { A: 4, iz: { A1: 23, A2: 22, B1: 28, B2: 27, C: 32, E: 36 } },
  { A: 6, iz: { A1: 29, A2: 28, B1: 36, B2: 34, C: 41, E: 46 } },
  { A: 10, iz: { A1: 39, A2: 38, B1: 50, B2: 46, C: 57, E: 63 } },
  { A: 16, iz: { A1: 52, A2: 50, B1: 66, B2: 61, C: 76, E: 85 } },
  { A: 25, iz: { A1: 68, A2: 64, B1: 84, B2: 80, C: 96, E: 112 } },
  { A: 35, iz: { A1: 83, A2: 77, B1: 104, B2: 99, C: 119, E: 138 } },
];

// Umrechnungsfaktoren Umgebungstemperatur (PVC, Luft) — DIN VDE 0298-4.
export const TEMP_FAKTOR = [
  { t: 10, f: 1.22 },
  { t: 15, f: 1.17 },
  { t: 20, f: 1.12 },
  { t: 25, f: 1.06 },
  { t: 30, f: 1.0 },
  { t: 35, f: 0.94 },
  { t: 40, f: 0.87 },
  { t: 45, f: 0.79 },
  { t: 50, f: 0.71 },
  { t: 55, f: 0.61 },
  { t: 60, f: 0.5 },
];

// Häufungsfaktoren — mehrere belastete Stromkreise gehäuft (DIN VDE 0298-4).
export const HAEUFUNG_FAKTOR = [
  { n: 1, f: 1.0 },
  { n: 2, f: 0.8 },
  { n: 3, f: 0.7 },
  { n: 4, f: 0.65 },
  { n: 5, f: 0.6 },
  { n: 6, f: 0.57 },
  { n: 7, f: 0.54 },
  { n: 8, f: 0.52 },
  { n: 9, f: 0.5 },
];

// Zulässige Spannungsfall-Grenzen (Δu).
export const SPANNUNGSFALL_GRENZEN = [
  { label: "3 %", text: "DIN 18015-1 — Zähler bis letzter Verbraucher (Wohnbau)" },
  { label: "4 %", text: "VDE 0100-520 — Beleuchtungsstromkreise" },
  { label: "5 %", text: "VDE 0100-520 — sonstige Verbraucher (Last)" },
  { label: "0,5 %", text: "TAB — Hauptleitung bis 100 kVA" },
];

// Auslösecharakteristiken von Leitungsschutzschaltern (LS/MCB).
export const LS_CHARAKTERISTIK = [
  { typ: "B", ausloesung: "3–5 × In", einsatz: "Steckdosen, Licht, normale Lasten" },
  { typ: "C", ausloesung: "5–10 × In", einsatz: "Motoren, Vorschaltgeräte, höhere Einschaltströme" },
  { typ: "D", ausloesung: "10–20 × In", einsatz: "Transformatoren, große Einschaltstromstöße" },
  { typ: "K", ausloesung: "8–14 × In", einsatz: "Motoren, Schweißtrafos (Geräteschutz)" },
  { typ: "Z", ausloesung: "2–3 × In", einsatz: "empfindliche Elektronik / Halbleiter" },
];

// Normreihe der LS-Nennströme (A).
export const SICHERUNG_REIHE = [6, 10, 13, 16, 20, 25, 32, 40, 50, 63];

// FI/RCD-Typen nach erfassbaren Fehlerströmen.
export const FI_TYPEN = [
  { typ: "AC", erfasst: "nur sinusförmige AC-Fehlerströme", einsatz: "in DE nicht mehr zulässig" },
  { typ: "A", erfasst: "AC + pulsierende DC-Fehlerströme", einsatz: "Standard in Wohnanlagen" },
  { typ: "F", erfasst: "wie A + Mischfrequenzen bis 1 kHz", einsatz: "Frequenzumrichter, Waschmaschinen" },
  { typ: "B", erfasst: "allstromsensitiv, auch glatter DC", einsatz: "PV, Ladestationen (EV), Wechselrichter" },
];

// FI-Bemessungsfehlerströme.
export const FI_BEMESSUNG = [
  { wert: "10 mA", text: "erhöhter Personenschutz (z. B. medizinische Bereiche)" },
  { wert: "30 mA", text: "Personenschutz — Standard in Endstromkreisen" },
  { wert: "300 mA", text: "Brandschutz — vorgelagert im Verteiler" },
];

// Einsatzorte, an denen VDE 0100-530 einen RCD fordert.
export const FI_PFLICHT = [
  "Steckdosen bis 32 A für Laien",
  "Bäder & Feuchträume",
  "Außenbereiche / Baustellen",
  "Räume mit Badewanne oder Dusche",
];

// IP-Code — 1. Ziffer: Fremdkörper- & Berührungsschutz (EN 60529 / VDE 0470-1).
export const IP_ZIFFER1 = [
  { z: "0", text: "kein Schutz" },
  { z: "1", text: "Fremdkörper ≥ 50 mm / Handrücken" },
  { z: "2", text: "Fremdkörper ≥ 12,5 mm / Finger" },
  { z: "3", text: "Fremdkörper ≥ 2,5 mm / Werkzeug" },
  { z: "4", text: "Fremdkörper ≥ 1,0 mm / Draht" },
  { z: "5", text: "staubgeschützt" },
  { z: "6", text: "staubdicht" },
];

// IP-Code — 2. Ziffer: Wasserschutz.
export const IP_ZIFFER2 = [
  { z: "0", text: "kein Schutz" },
  { z: "1", text: "senkrecht fallendes Tropfwasser" },
  { z: "2", text: "Tropfwasser schräg (bis 15°)" },
  { z: "3", text: "Sprühwasser (bis 60°)" },
  { z: "4", text: "allseitiges Spritzwasser" },
  { z: "5", text: "Strahlwasser (Düse)" },
  { z: "6", text: "starkes Strahlwasser" },
  { z: "7", text: "zeitweiliges Untertauchen" },
  { z: "8", text: "dauerndes Untertauchen" },
  { z: "9", text: "Hochdruck-/Dampfstrahlreinigung (9K)" },
];

// Gängige IP-Beispiele mit Einsatzort.
export const IP_BEISPIELE = [
  { code: "IP20", text: "berührungsgeschützt, kein Wasserschutz — Unterverteilung innen" },
  { code: "IP44", text: "Spritzwasser — Außensteckdosen, Feuchtraum" },
  { code: "IP54", text: "staubgeschützt & spritzwassergeschützt — Industrie" },
  { code: "IP65", text: "staubdicht & strahlwassergeschützt — außen/Waschplatz" },
  { code: "IP67", text: "staubdicht & zeitweise tauchfähig" },
];

// Leiterfarben nach DIN VDE 0100-510 / VDE 0293 (Standard ab 2003).
export const LEITERFARBEN_VOLL = [
  { label: "L1", farbe: "#92400e", text: "braun — Außenleiter 1" },
  { label: "L2", farbe: "#18181b", text: "schwarz — Außenleiter 2" },
  { label: "L3", farbe: "#9ca3af", text: "grau — Außenleiter 3" },
  { label: "N", farbe: "#2563eb", text: "blau — Neutralleiter" },
  { label: "PE", farbe: "pe", text: "grün-gelb — Schutzleiter, NIE anders nutzen!" },
];

// Kernpunkte der Technischen Anschlussbedingungen (TAB) des Netzbetreibers.
export const TAB_PUNKTE = [
  "Anschluss & Zählerplatz nur nach TAB des örtlichen Netzbetreibers",
  "Hauptschalter / Hauptleitungsabzweigklemme vorschriftsgemäß",
  "Hauptleitung: Spannungsfall < 0,5 % (bis 100 kVA)",
  "Schutzpotentialausgleich am Hausanschluss (Haupterdungsschiene)",
  "Selektiver Hauptleitungsschutz (SH-Schalter) vor dem Zähler",
  "Anmeldung & Inbetriebnahme durch eingetragenen Elektroinstallateur",
];

// DIN-VDE-Merkzettel — die wichtigsten Normen mit Ein-Satz-Merker.
export const DIN_VDE_MERK = [
  { norm: "VDE 0100-410", text: "Schutz gegen elektrischen Schlag (Abschaltzeiten, Fehlerschutz)" },
  { norm: "VDE 0100-520", text: "Kabel/Leitungen — Spannungsfall-Grenzen (4 %/5 %)" },
  { norm: "VDE 0100-530", text: "Schalt- & Schutzgeräte — RCD-Pflicht & Auswahl" },
  { norm: "VDE 0100-600", text: "Erstprüfung: Durchgängigkeit, Isolation, Schleife, RCD-Zeit" },
  { norm: "VDE 0298-4", text: "Strombelastbarkeit & Umrechnungsfaktoren von Leitungen" },
  { norm: "EN 60529 (VDE 0470-1)", text: "IP-Schutzarten (Fremdkörper- & Wasserschutz)" },
  { norm: "DIN 18015-1", text: "Wohnbau: Spannungsfall ≤ 3 % bis zum letzten Verbraucher" },
];
