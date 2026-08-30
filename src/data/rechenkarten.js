// Feste Rechenkarten (i220–i247) — Ergänzung zu KARTEN.
//
// Gleiche Grundform wie eine normale Karte (i, j, lf, f, a), zusätzlich `r`:
//   r = { loesung: Zahl, einheit: "A", tol?: relative Toleranz (Default 1 %) }
//
// Dadurch laufen sie ganz normal im Karteikarten-Modus und in den Leitner-Boxen
// mit, können aber zusätzlich im Rechen-Modus mit Zahleneingabe geprüft werden.
// Bewusst OHNE `m` (Multiple-Choice-Optionen): in der Prüfungssimulation soll
// weiter angekreuzt, nicht getippt werden.

export const RECHENKARTEN = [
  // ---------- LF1 · Grundlagen ----------
  {
    i: 220, j: 1, lf: "LF1",
    f: "An einem Widerstand von 25 Ω liegen 400 V an. Wie groß ist der Strom?",
    a: "I = U / R = 400 V / 25 Ω = 16 A",
    r: { loesung: 16, einheit: "A" },
  },
  {
    i: 221, j: 1, lf: "LF1",
    f: "Ein Verbraucher zieht an 230 V einen Strom von 13 A. Welche Leistung nimmt er auf?",
    a: "P = U · I = 230 V · 13 A = 2990 W ≈ 3 kW\n\nMerke: 13 A ist typisch für den maximal abgesicherten Haushalts-Stromkreis mit 16-A-Automat.",
    r: { loesung: 2990, einheit: "W" },
  },
  {
    i: 222, j: 1, lf: "LF1",
    f: "Reihenschaltung aus 47 Ω, 68 Ω und 100 Ω — wie groß ist der Gesamtwiderstand?",
    a: "Rges = R1 + R2 + R3 = 47 Ω + 68 Ω + 100 Ω = 215 Ω\n\nIn Reihe addieren sich die Widerstände.",
    r: { loesung: 215, einheit: "Ω" },
  },
  {
    i: 223, j: 1, lf: "LF1",
    f: "Parallelschaltung aus 100 Ω und 150 Ω — wie groß ist der Gesamtwiderstand?",
    a: "Rges = (R1 · R2) / (R1 + R2) = (100 · 150) / 250 = 60 Ω\n\nMerke: Parallel ist der Gesamtwiderstand immer kleiner als der kleinste Einzelwiderstand.",
    r: { loesung: 60, einheit: "Ω" },
  },
  {
    i: 224, j: 1, lf: "LF1",
    f: "Ein Gerät mit 2000 W läuft 3,5 Stunden. Wie viel elektrische Arbeit in kWh?",
    a: "W = P · t = 2 kW · 3,5 h = 7 kWh",
    r: { loesung: 7, einheit: "kWh" },
  },
  {
    i: 225, j: 1, lf: "LF1",
    f: "Was kosten 7 kWh bei einem Strompreis von 35 ct/kWh (in Euro)?",
    a: "Kosten = 7 kWh · 0,35 €/kWh = 2,45 €",
    r: { loesung: 2.45, einheit: "€" },
  },
  {
    i: 226, j: 1, lf: "LF1",
    f: "Ein Heizlüfter mit 2000 W hängt an 230 V. Wie groß ist sein Widerstand?",
    a: "P = U² / R → R = U² / P = 230² V / 2000 W = 52 900 / 2000 = 26,45 Ω\n\nAlternativ: erst I = P/U = 8,7 A, dann R = U/I.",
    r: { loesung: 26.45, einheit: "Ω" },
  },
  {
    i: 227, j: 1, lf: "LF1",
    f: "Spannungsteiler: R1 = 100 Ω und R2 = 200 Ω in Reihe an 12 V. Wie groß ist die Spannung an R2?",
    a: "I = U / Rges = 12 V / 300 Ω = 0,04 A\nU2 = I · R2 = 0,04 A · 200 Ω = 8 V\n\nMerke: Die Spannung teilt sich im Verhältnis der Widerstände.",
    r: { loesung: 8, einheit: "V" },
  },

  // ---------- LF2 · Installation & Leitungen ----------
  {
    i: 228, j: 1, lf: "LF2",
    f: "Kupferleitung, 50 m lang, 2,5 mm² Querschnitt (ρ = 0,0178 Ω·mm²/m). Wie groß ist der Leiterwiderstand?",
    a: "R = ρ · l / A = 0,0178 · 50 / 2,5 = 0,356 Ω",
    r: { loesung: 0.356, einheit: "Ω", tol: 0.02 },
  },
  {
    i: 229, j: 1, lf: "LF2",
    f: "Wechselstromkreis: 30 m Leitung, 16 A, 2,5 mm², κ = 56 m/(Ω·mm²). Wie groß ist der Spannungsfall ΔU?",
    a: "ΔU = (2 · l · I) / (κ · A) = (2 · 30 · 16) / (56 · 2,5) = 960 / 140 = 6,86 V\n\nMerke: Bei Wechselstrom zählt Hin- UND Rückleiter, deshalb der Faktor 2.",
    r: { loesung: 6.857, einheit: "V", tol: 0.02 },
  },
  {
    i: 230, j: 1, lf: "LF2",
    f: "Wie viel Volt Spannungsfall sind bei 230 V und 3 % zulässigem Spannungsfall maximal erlaubt?",
    a: "ΔUmax = 230 V · 0,03 = 6,9 V\n\nMerke: 3 % gilt für Beleuchtungsstromkreise, 5 % für sonstige Verbraucher (Endstromkreis).",
    r: { loesung: 6.9, einheit: "V" },
  },
  {
    i: 231, j: 1, lf: "LF2",
    f: "Drehstromkreis (cos φ = 1): 60 m, 25 A, 6 mm², κ = 56 m/(Ω·mm²). Wie groß ist ΔU?",
    a: "ΔU = (√3 · l · I) / (κ · A) = (1,732 · 60 · 25) / (56 · 6) = 2598 / 336 = 7,73 V\n\nMerke: Bei Drehstrom √3 statt 2 — der Rückstrom verteilt sich auf die anderen Außenleiter.",
    r: { loesung: 7.732, einheit: "V", tol: 0.02 },
  },
  {
    i: 232, j: 1, lf: "LF2",
    f: "Welcher Querschnitt ist rechnerisch nötig? Wechselstrom, 25 m, 20 A, ΔU max. 5 V, κ = 56.",
    a: "A = (2 · l · I) / (κ · ΔU) = (2 · 25 · 20) / (56 · 5) = 1000 / 280 = 3,57 mm²\n\nGewählt wird der nächste Normquerschnitt: 4 mm².",
    r: { loesung: 3.571, einheit: "mm²", tol: 0.02 },
  },
  {
    i: 233, j: 1, lf: "LF2",
    f: "TN-System: U0 = 230 V, Schleifenimpedanz Zs = 0,8 Ω. Wie groß ist der Fehlerstrom Ik im Kurzschlussfall?",
    a: "Ik = U0 / Zs = 230 V / 0,8 Ω = 287,5 A\n\nAchtung Begriffe: Ik ist der Strom, der im Fehlerfall FLIESST. Ia ist der Strom, den die Schutzeinrichtung zum Auslösen BRAUCHT.\nAbschaltbedingung nach DIN VDE 0100-410: Zs · Ia ≤ U0 — der fließende Strom Ik muss also mindestens so groß sein wie Ia, damit im Endstromkreis (≤ 32 A) in 0,4 s abgeschaltet wird.",
    r: { loesung: 287.5, einheit: "A" },
  },

  // ---------- LF5 · Wechsel- & Drehstrom ----------
  {
    i: 234, j: 2, lf: "LF5",
    f: "Eine Sinusspannung hat den Scheitelwert û = 325 V. Wie groß ist der Effektivwert U?",
    a: "U = û / √2 = 325 V / 1,414 = 229,8 V ≈ 230 V",
    r: { loesung: 229.81, einheit: "V", tol: 0.02 },
  },
  {
    i: 235, j: 2, lf: "LF5",
    f: "Wie groß ist der Scheitelwert û bei einem Effektivwert von 230 V?",
    a: "û = U · √2 = 230 V · 1,414 = 325,3 V\n\nDeshalb müssen Bauteile im 230-V-Netz mindestens 325 V Spitzenspannung aushalten.",
    r: { loesung: 325.27, einheit: "V", tol: 0.02 },
  },
  {
    i: 236, j: 2, lf: "LF5",
    f: "Wie groß ist die Strangspannung bei 400 V Außenleiterspannung (Sternschaltung)?",
    a: "UStrang = UAußen / √3 = 400 V / 1,732 = 230,9 V ≈ 230 V\n\nMerke: Verkettungsfaktor √3 = 1,73.",
    r: { loesung: 230.94, einheit: "V", tol: 0.02 },
  },
  {
    i: 237, j: 2, lf: "LF5",
    f: "Drehstromverbraucher: 400 V, 16 A, cos φ = 0,85. Wie groß ist die Wirkleistung P?",
    a: "P = √3 · U · I · cos φ = 1,732 · 400 V · 16 A · 0,85 = 9422 W ≈ 9,4 kW",
    r: { loesung: 9422, einheit: "W", tol: 0.02 },
  },
  {
    i: 238, j: 2, lf: "LF5",
    f: "Scheinleistung S = 10 kVA, cos φ = 0,8. Wie groß ist die Blindleistung Q in kvar?",
    a: "P = S · cos φ = 10 kVA · 0,8 = 8 kW\nQ = √(S² − P²) = √(100 − 64) = √36 = 6 kvar\n\nMerke: Leistungsdreieck — S ist die Hypotenuse aus P und Q.",
    r: { loesung: 6, einheit: "kvar" },
  },
  {
    i: 239, j: 2, lf: "LF5",
    f: "Ein Generator hat 2 Polpaare und dreht mit 1500 1/min. Welche Frequenz erzeugt er?",
    a: "n = 1500 1/min = 25 1/s\nf = p · n = 2 · 25 1/s = 50 Hz\n\nAchtung: n muss in Umdrehungen pro SEKUNDE eingesetzt werden.",
    r: { loesung: 50, einheit: "Hz" },
  },
  {
    i: 240, j: 2, lf: "LF5",
    f: "Wie groß ist die Periodendauer T bei 50 Hz (in Millisekunden)?",
    a: "T = 1 / f = 1 / 50 Hz = 0,02 s = 20 ms",
    r: { loesung: 20, einheit: "ms" },
  },

  // ---------- LF8 · Antriebe & Motoren ----------
  {
    i: 241, j: 2, lf: "LF8",
    f: "Drehstrommotor mit 2 Polpaaren am 50-Hz-Netz. Wie groß ist die Synchrondrehzahl n₀?",
    a: "n₀ = f · 60 / p = 50 · 60 / 2 = 1500 1/min",
    r: { loesung: 1500, einheit: "1/min" },
  },
  {
    i: 242, j: 2, lf: "LF8",
    f: "Ein Asynchronmotor hat n₀ = 1500 1/min und läuft mit 1440 1/min. Wie groß ist der Schlupf in %?",
    a: "s = (n₀ − n) / n₀ · 100 % = (1500 − 1440) / 1500 · 100 % = 60 / 1500 · 100 % = 4 %\n\nMerke: Ohne Schlupf keine Induktion im Läufer — deshalb heißt er Asynchronmotor.",
    r: { loesung: 4, einheit: "%" },
  },
  {
    i: 243, j: 2, lf: "LF8",
    f: "Ein Motor nimmt 4600 W auf und gibt 4000 W ab. Wie groß ist der Wirkungsgrad in %?",
    a: "η = Pab / Pzu · 100 % = 4000 / 4600 · 100 % = 86,96 % ≈ 87 %",
    r: { loesung: 86.96, einheit: "%", tol: 0.02 },
  },
  {
    i: 244, j: 2, lf: "LF8",
    f: "Motor-Leistungsschild: 5,5 kW, 400 V, cos φ = 0,86, η = 0,88. Wie groß ist der Nennstrom?",
    a: "I = P / (√3 · U · cos φ · η) = 5500 / (1,732 · 400 · 0,86 · 0,88) = 5500 / 524,3 = 10,5 A\n\nAchtung: Auf dem Leistungsschild steht die ABGEGEBENE Leistung — der Wirkungsgrad muss mit rein.",
    r: { loesung: 10.49, einheit: "A", tol: 0.03 },
  },
  {
    i: 245, j: 2, lf: "LF8",
    f: "Ein Motor gibt 5,5 kW bei 1450 1/min ab. Wie groß ist das Drehmoment in Nm?",
    a: "M = 9550 · P(kW) / n(1/min) = 9550 · 5,5 / 1450 = 36,2 Nm\n\nMerke: Die Zahl 9550 steckt die Umrechnung von 1/min in rad/s schon mit drin.",
    r: { loesung: 36.22, einheit: "Nm", tol: 0.02 },
  },

  // ---------- LF11 · Photovoltaik ----------
  {
    i: 246, j: 3, lf: "LF11",
    f: "Eine PV-Anlage hat 20 Module à 400 Wp. Wie groß ist die Anlagenleistung in kWp?",
    a: "P = 20 · 400 Wp = 8000 Wp = 8 kWp",
    r: { loesung: 8, einheit: "kWp" },
  },
  {
    i: 247, j: 3, lf: "LF11",
    f: "Wie viel Jahresertrag liefert eine 8-kWp-Anlage bei 950 kWh je kWp?",
    a: "W = 8 kWp · 950 kWh/kWp = 7600 kWh im Jahr\n\nFaustwert Deutschland: 900–1000 kWh je kWp und Jahr.",
    r: { loesung: 7600, einheit: "kWh" },
  },
];
