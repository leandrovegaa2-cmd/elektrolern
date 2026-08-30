// Visuelle Lernkarten: Schaltzeichen erkennen (MC) und Fehlerbilder
// „Was ist hier falsch?" (gemischt: MC + Aufdeck-Karte). Das Bild ist Teil der
// FRAGE — `dia` verweist auf data/diagrams.js (Schaltzeichen bzw. fb_*).
//
// MC-Karten: m[0] ist die richtige Antwort (QuizSession mischt danach).
// Aufdeck-Karten: kein `m` — erscheinen nur im Karteikarten-Modus, Antwort in `a`.

export const VISUELL_KARTEN = [
  // ---- Schaltzeichen erkennen (Multiple Choice) ----
  {
    i: "v1", j: 1, lf: "LF3", dia: "sz_schliesser",
    f: "Welches Schaltzeichen ist das?",
    m: ["Schließer (NO)", "Öffner (NC)", "Wechsler", "Taster"],
    a: "Ein **Schließer** (NO, normally open): in Ruhe offen, bei Betätigung geschlossen. Grundkontakt für Ein-Befehle.",
  },
  {
    i: "v2", j: 1, lf: "LF3", dia: "sz_oeffner",
    f: "Welches Schaltzeichen ist das?",
    m: ["Öffner (NC)", "Schließer (NO)", "Wechsler", "Sicherung"],
    a: "Ein **Öffner** (NC, normally closed): in Ruhe geschlossen, bei Betätigung offen. Für Aus-/Stopp-Befehle.",
  },
  {
    i: "v3", j: 1, lf: "LF3", dia: "sz_wechsler",
    f: "Welches Schaltzeichen ist das?",
    m: ["Wechsler (Umschalter)", "Schließer", "Öffner", "Taster"],
    a: "Ein **Wechsler**: ein gemeinsamer Anschluss schaltet zwischen zwei Kontakten um — Basis der Wechselschaltung.",
  },
  {
    i: "v4", j: 1, lf: "LF3", dia: "sz_taster",
    f: "Welches Schaltzeichen ist das?",
    m: ["Taster (Schließer)", "Schalter (rastend)", "Schützspule", "Sicherung"],
    a: "Ein **Taster**: schaltet nur, solange gedrückt wird. Hier als Schließer gezeichnet (mit Betätigungssymbol).",
  },
  {
    i: "v5", j: 1, lf: "LF3", dia: "sz_schuetzspule",
    f: "Welches Bauteil zeigt dieses Schaltzeichen?",
    m: ["Schützspule (A1/A2)", "Widerstand", "Sicherung", "Motorwicklung"],
    a: "Die **Schützspule** (Anschlüsse A1/A2). Unter Spannung zieht das Schütz an und schließt seine Hauptkontakte.",
  },
  {
    i: "v6", j: 1, lf: "LF2", dia: "sz_sicherung",
    f: "Welches Bauteil zeigt dieses Schaltzeichen?",
    m: ["Schmelzsicherung", "LS-Schalter", "Widerstand", "Kondensator"],
    a: "Eine **Schmelzsicherung**: trennt bei Überstrom durch Durchschmelzen des Schmelzleiters.",
  },
  {
    i: "v7", j: 1, lf: "LF5", dia: "sz_fi",
    f: "Welches Schutzgerät zeigt dieses Schaltzeichen?",
    m: ["FI/RCD (Fehlerstromschutz)", "LS-Schalter", "Motorschutzschalter", "Überspannungsableiter"],
    a: "Ein **FI/RCD**: vergleicht die Ströme (Summenstromwandler). Ist die Summe ≠ 0, liegt ein Fehlerstrom vor und er trennt.",
  },
  {
    i: "v8", j: 2, lf: "LF8", dia: "sz_motor3",
    f: "Welches Betriebsmittel ist das?",
    m: ["Drehstrom-Asynchronmotor (M 3~)", "Transformator", "Generator", "Gleichstrommotor"],
    a: "Ein **Drehstrommotor** (M 3~) — das Zeichen 3~ steht für Drehstrom-Speisung.",
  },
  {
    i: "v9", j: 1, lf: "LF2", dia: "sz_steckdose",
    f: "Welches Schaltzeichen ist das?",
    m: ["Schutzkontakt-Steckdose", "Leuchte", "Schalter", "Klemmdose"],
    a: "Eine **Steckdose** (Halbkreis mit Kontaktlinie), hier mit Schutzkontakt.",
  },
  {
    i: "v10", j: 1, lf: "LF2", dia: "sz_erde",
    f: "Wofür steht dieses Symbol?",
    m: ["Erde / Schutzleiter (PE)", "Masse-Signal", "Antenne", "Neutralleiter"],
    a: "Das **Erdungs-/Schutzleitersymbol (PE)** — Anschluss an den Schutzleiter bzw. die Erdung.",
  },

  // ---- Fehlerbilder: Multiple Choice ----
  {
    i: "v11", j: 1, lf: "LF5", dia: "fb_pe_n_vertauscht",
    f: "Was ist an dieser Klemmung falsch?",
    m: [
      "PE und N sind vertauscht",
      "Alles korrekt angeschlossen",
      "L fehlt komplett",
      "Zu großer Querschnitt",
    ],
    a: "**PE und N sind vertauscht:** An der N-Klemme hängt die grün-gelbe (PE-)Ader, an PE die blaue (N-)Ader. Der Schutzleiter führt dann Betriebsstrom — lebensgefährlich. Grün-gelb gehört IMMER an PE.",
  },
  {
    i: "v12", j: 1, lf: "LF5", dia: "fb_l_blau",
    f: "Warum ist diese Ader falsch verwendet?",
    m: [
      "Blau darf nur Neutralleiter sein, nicht Außenleiter",
      "Blau ist als Außenleiter vorgeschrieben",
      "Blau ist der Schutzleiter",
      "Die Farbe spielt keine Rolle",
    ],
    a: "**Blau ist dem Neutralleiter (N) vorbehalten.** Als Außenleiter (L) ist Blau unzulässig — Verwechslungsgefahr. Außenleiter: braun, schwarz, grau.",
  },
  {
    i: "v13", j: 2, lf: "LF5", dia: "fb_pe_geschaltet",
    f: "Was ist an dieser Schaltung falsch?",
    m: [
      "Der Schutzleiter (PE) darf nicht geschaltet werden",
      "Der PE muss immer geschaltet sein",
      "Der Schalter gehört in den N",
      "Nichts, das ist korrekt",
    ],
    a: "**Der Schutzleiter darf niemals geschaltet oder unterbrochen werden.** Ein offener Schalter im PE hebt den Schutz auf. PE wird immer durchverbunden.",
  },
  {
    i: "v14", j: 2, lf: "LF2", dia: "fb_querschnitt",
    f: "Warum ist diese Absicherung unzulässig?",
    m: [
      "1,5 mm² darf höchstens mit 16 A abgesichert werden",
      "1,5 mm² verträgt problemlos 25 A",
      "B25 ist zu klein für die Leitung",
      "Der Querschnitt ist zu groß",
    ],
    a: "**Überlastgefahr:** 1,5 mm² Kupfer ist nur bis ~16 A belastbar. Ein B25-Automat schützt die Leitung nicht — sie kann überhitzen, bevor er auslöst. Zu 25 A gehört mind. 4 mm².",
  },

  // ---- Fehlerbilder: Aufdeck-Karten (Bild → Antwort) ----
  {
    i: "v15", j: 1, lf: "LF5", dia: "fb_pe_fehlt",
    f: "Was ist hier falsch?",
    a: "**Der Schutzleiter (PE) ist nicht angeschlossen** (Klemme unbelegt). Ohne PE fehlt bei einem Körperschluss der Fehlerschutz — die Abschaltung funktioniert nicht. PE muss immer aufgelegt sein.",
  },
  {
    i: "v16", j: 2, lf: "LF5", dia: "fb_sicherung_n",
    f: "Was ist hier falsch?",
    a: "**Eine Sicherung/Trennstelle im Neutralleiter ist unzulässig.** Löst nur der N aus, bleibt der Verbraucher über L unter Spannung. Überstromschutz gehört in den Außenleiter, nicht in den N.",
  },
  {
    i: "v17", j: 2, lf: "LF5", dia: "fb_fi_gebrueckt",
    f: "Was ist hier falsch?",
    a: "**Der FI/RCD ist mit einer Drahtbrücke überbrückt** — er ist damit wirkungslos. Der Fehlerstromschutz für Personen fehlt. Brücke entfernen, FI korrekt anklemmen.",
  },
  {
    i: "v18", j: 1, lf: "LF2", dia: "fb_klemme",
    f: "Was ist hier falsch?",
    a: "**Zwei Leiter unter einer Klemme:** je Klemmstelle gehört nur ein Leiter (sofern nicht ausdrücklich freigegeben). Sonst sitzt einer locker → Übergangswiderstand, Erwärmung, Wackelkontakt.",
  },
];
