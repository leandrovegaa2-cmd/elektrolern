// Bild-Fragen: Karten, bei denen ein Schaubild TEIL DER FRAGE ist (Feld `dia`
// verweist auf einen Eintrag in data/diagrams.js). QuizSession/FlashcardSession
// rendern das Diagramm schon in der Frage, nicht erst in der Antwort.
//
// Zwei Sorten:
//  - "Identify": neu gezeichnete, absichtlich label-freie Schaltzeichen
//    (schuetz, klemmbrettStern) — die Frage ist "Was ist das?".
//  - "Eigenschaft": vorhandene, beschriftete Diagramme als Kontext — gefragt
//    wird ein Wert/Detail, den die Beschriftung NICHT verrät (kein Spoiler).
//
// m[0] ist immer die richtige Antwort (QuizSession mischt danach).
export const BILD_KARTEN = [
  {
    i: "bf1", j: 1, lf: "LF3", dia: "schuetz",
    f: "Welches Bauteil zeigt dieses Schaltzeichen?",
    m: ["Schütz", "Trennrelais für Kleinspannung", "Spartransformator", "Motorschutzschalter"],
    a: "Ein **Schütz**: Die Spule A1/A2 zieht bei Strom an und schließt gleichzeitig alle drei Hauptkontakte (1-2, 3-4, 5-6). Fällt die Spule ab, öffnen sie wieder (Schließer).",
  },
  {
    i: "bf2", j: 2, lf: "LF8", dia: "klemmbrettStern",
    f: "Wie sind die Motorwicklungen im abgebildeten Klemmkasten verschaltet?",
    m: ["Stern — die drei Enden sind zum Sternpunkt gebrückt", "Dreieck", "Wicklungen offen (kein Betrieb)", "Zwei Wicklungen in Reihe"],
    a: "**Stern (Y):** Die unteren Wicklungsenden (W2/U2/V2) sind mit einer Brücke zum Sternpunkt verbunden, die oberen (U1/V1/W1) liegen an L1/L2/L3. An jeder Wicklung liegt so nur 1/√3 der Netzspannung.",
  },
  {
    i: "bf3", j: 2, lf: "LF8", dia: "sternDreieck",
    f: "Wie groß ist die Spannung an EINER Wicklung, wenn der Motor in Stern läuft?",
    m: ["1/√3 der Netzspannung (≈ 58 %)", "Gleich der Netzspannung (400 V)", "Das √3-fache der Netzspannung", "Die halbe Netzspannung"],
    a: "In Stern liegt an jeder Wicklung nur **U_Netz / √3** (bei 400 V also ≈ 230 V). Deshalb läuft der Motor in Stern mit weniger Moment an — das ist der Sinn der Stern-Dreieck-Anlaufschaltung.",
  },
  {
    i: "bf4", j: 1, lf: "LF1", dia: "drehstrom",
    f: "Um welchen Winkel sind die drei Außenleiter im Bild zeitlich versetzt?",
    m: ["120°", "90°", "60°", "180°"],
    a: "Die drei Außenleiter L1, L2, L3 sind um je **120°** phasenverschoben. Zusammen ergeben sie das Drehfeld, das Drehstrommotoren antreibt.",
  },
  {
    i: "bf5", j: 2, lf: "LF5", dia: "fi",
    f: "Worauf reagiert die abgebildete Schutzeinrichtung?",
    m: ["Auf einen Fehlerstrom (Summe der Ströme ≠ 0)", "Auf Überlast durch zu hohen Betriebsstrom", "Auf Kurzschluss zwischen zwei Außenleitern", "Auf Überspannung im Netz"],
    a: "Der **FI/RCD** vergleicht hin- und rückfließenden Strom. Fließt Strom über einen Fehler ab (z. B. über den Menschen), ist die Summe ≠ 0 und der Schalter trennt — Schutz gegen gefährliche Körperströme.",
  },
  {
    i: "bf6", j: 1, lf: "LF3", dia: "selbsthaltung",
    f: "Welche Aufgabe hat der parallel zum Ein-Taster liegende Kontakt (Selbsthaltung)?",
    m: ["Er hält den Schütz nach Loslassen des Tasters angezogen", "Er begrenzt den Anlaufstrom des Motors", "Er schaltet den Motor nach kurzer Zeit selbst ab", "Er kehrt die Drehrichtung um"],
    a: "**Selbsthaltung:** Ein eigener Schließer des Schützes überbrückt den Ein-Taster. Nach dem Loslassen bleibt der Stromkreis über diesen Kontakt geschlossen — der Schütz bleibt an, bis der Aus-Taster den Kreis öffnet.",
  },
  {
    i: "bf7", j: 2, lf: "LF7", dia: "spsZyklus",
    f: "In welcher Reihenfolge arbeitet eine SPS je Programmzyklus?",
    m: ["Eingänge lesen → Programm bearbeiten → Ausgänge schreiben", "Ausgänge schreiben → Eingänge lesen → Programm", "Programm → Eingänge lesen → Ausgänge", "Eingänge und Ausgänge gleichzeitig, ohne Programm"],
    a: "Der **Zyklus** einer SPS: erst das Prozessabbild der **Eingänge** einlesen, dann das **Programm** abarbeiten, dann die Ergebnisse auf die **Ausgänge** schreiben — danach von vorn.",
  },
  {
    i: "bf8", j: 1, lf: "LF2", dia: "kreuz",
    f: "Wozu dient die im Bild eingesetzte Kreuzschaltung?",
    m: ["Eine Lampe von drei oder mehr Stellen schalten", "Zwei Lampen unabhängig schalten", "Eine Lampe dimmen", "Einen Motor umpolen"],
    a: "Die **Kreuzschaltung** sitzt zwischen zwei Wechselschaltern und überkreuzt die beiden geschalteten Adern. So lässt sich dieselbe Lampe von **drei (oder mehr)** Stellen schalten — je zusätzlicher Stelle ein weiterer Kreuzschalter.",
  },
];
