/**
 * Geprüftes Grundlagenwissen zur Lichtechnik.
 * Fachstand und Quellenabgleich: 08.09.2026. Die Quellen-IDs verweisen auf
 * data/fachquellen.js. Konkrete Arbeitsplatzwerte stammen aus ASR A3.4.
 */

export const LICHT_GROESSEN = [
  { symbol: "Φ", name: "Lichtstrom", einheit: "Lumen (lm)", bedeutung: "gesamte sichtbare Lichtleistung einer Lichtquelle" },
  { symbol: "I", name: "Lichtstärke", einheit: "Candela (cd)", bedeutung: "Lichtstrom in eine bestimmte Richtung" },
  { symbol: "E", name: "Beleuchtungsstärke", einheit: "Lux (lx)", bedeutung: "Lichtstrom, der auf einer Fläche ankommt" },
  { symbol: "L", name: "Leuchtdichte", einheit: "cd/m²", bedeutung: "Helligkeitseindruck einer Fläche in Blickrichtung" },
  { symbol: "η", name: "Lichtausbeute", einheit: "lm/W", bedeutung: "Lichtstrom je aufgenommener elektrischer Leistung" },
];

export const LICHT_PRAXISWERTE = [
  { bereich: "Flure ohne Fahrzeugverkehr", lux: 50, hinweis: "Mindestwert auf der Bezugsfläche" },
  { bereich: "Treppen, Fahrtreppen, Aufzüge", lux: 100, hinweis: "Absätze und Stufen sicher erkennbar" },
  { bereich: "Wasch-, Dusch- und Umkleideräume", lux: 200, hinweis: "Mindestwert der mittleren Beleuchtungsstärke" },
  { bereich: "Lagerräume mit Leseaufgaben", lux: 200, hinweis: "zum Beispiel Beschriftungen erkennen" },
  { bereich: "Unterrichtsräume", lux: 300, hinweis: "Wandtafel/Demonstrationstisch: 500 lx vertikal" },
  { bereich: "Büro: Schreiben, Lesen, Datenverarbeitung", lux: 500, hinweis: "Mindestwert am Arbeitsplatz" },
  { bereich: "Baustelle: feine Tätigkeiten im Freien", lux: 200, hinweis: "zum Beispiel anspruchsvolle Montage" },
];

export const LICHT_WISSEN = [
  {
    id: "groessen",
    titel: "Die fünf Lichtgrößen",
    quelle: "cie-ilv-2020",
    kurz: "Lumen verlässt die Quelle, Lux erreicht die Fläche.",
    punkte: [
      "Lichtstrom Φ in Lumen beschreibt die gesamte sichtbare Lichtabgabe einer Quelle.",
      "Lichtstärke I in Candela beschreibt die Abgabe in eine bestimmte Richtung.",
      "Beleuchtungsstärke E in Lux ist der auftreffende Lichtstrom je Fläche: 1 lx = 1 lm/m².",
      "Leuchtdichte L in cd/m² beschreibt den Helligkeitseindruck einer Fläche in einer Blickrichtung.",
      "Lichtausbeute η in lm/W vergleicht Lichtstrom mit elektrischer Leistungsaufnahme. Bei Vergleichen muss klar sein, ob das Betriebsgerät mitgerechnet ist.",
    ],
  },
  {
    id: "berechnen",
    titel: "Beleuchtungsstärke berechnen",
    quelle: "cie-ilv-2020",
    kurz: "Fläche, Abstand, Winkel und Lichtverteilung entscheiden.",
    punkte: [
      "Bei ideal gleichmäßig verteiltem Licht gilt E = Φ/A. Die Formel eignet sich zum Verstehen, nicht allein zur Leuchtenplanung.",
      "Für eine punktförmige Quelle senkrecht über der Fläche gilt näherungsweise E = I/r². Doppelter Abstand bedeutet nur noch ein Viertel der Beleuchtungsstärke.",
      "Bei schrägem Lichteinfall gilt das photometrische Entfernungsgesetz E = I · cos(θ) / r².",
      "In realen Räumen verändern Abstrahlkurve, Reflexionen, Raumgeometrie, Verschattung und Alterung das Ergebnis.",
    ],
  },
  {
    id: "planung",
    titel: "Planung und Wartungswert",
    quelle: "din-en-12464-1",
    kurz: "Nicht nur die Neuanlage, sondern der Betrieb bis zur Wartung zählt.",
    punkte: [
      "Anforderungen beziehen sich auf Sehaufgabe, unmittelbare Umgebung und Hintergrund — nicht pauschal nur auf den ganzen Raum.",
      "Der Wartungswert darf im Betrieb nicht unterschritten werden. Alterung und Verschmutzung werden über einen begründeten Wartungsfaktor berücksichtigt.",
      "Der vereinfachte Wirkungsgradansatz lautet: benötigter Lichtstrom = Wartungs-Beleuchtungsstärke × Fläche / (Nutzungsfaktor × Wartungsfaktor).",
      "Eine vollständige Planung prüft zusätzlich Gleichmäßigkeit, Blendung, Farbwiedergabe, Flimmern, Tageslicht, Steuerung und Energiebedarf.",
    ],
  },
  {
    id: "lichtqualitaet",
    titel: "Lichtqualität statt nur Lux",
    quelle: "asr-a3-4-2023",
    kurz: "Mehr Licht ist nicht automatisch besseres Licht.",
    punkte: [
      "Direktblendung entsteht durch zu helle oder schlecht abgeschirmte Quellen; Reflexblendung durch Spiegelungen auf Bildschirmen oder glänzenden Werkstücken.",
      "Geeignete Leuchtenanordnung, Abschirmung, helle Raumflächen und matte Oberflächen begrenzen Blendung.",
      "Die korrelierte Farbtemperatur CCT wird in Kelvin angegeben: niedrigere Werte wirken typischerweise wärmer, höhere kühler. Sie sagt nichts über Helligkeit oder Farbwiedergabe aus.",
      "Der allgemeine Farbwiedergabeindex Ra beschreibt Farbtreue gegenüber einer Referenz. Die CIE weist darauf hin, dass Ra allein die Farbqualität moderner LED nicht vollständig beschreibt.",
    ],
  },
  {
    id: "led",
    titel: "LED und Betriebsgerät",
    quelle: "eu-licht-ecodesign",
    kurz: "Die LED ist nur ein Teil des elektrischen Systems.",
    punkte: [
      "Das Betriebsgerät bereitet die Versorgung für die Lichtquelle auf. Es kann Strom begrenzen, starten, den Leistungsfaktor verbessern und Störungen reduzieren.",
      "Beim Austausch müssen Ausgangsstrom beziehungsweise -spannung, Leistung, Dimmverfahren, Umgebungstemperatur und Herstellerfreigabe zusammenpassen.",
      "L70B50 bezeichnet bei LED die Zeit, nach der bei 50 % einer Population der Lichtstrom unter 70 % des Anfangswertes gefallen ist — nicht den plötzlichen Ausfall jeder einzelnen Leuchte.",
      "Flimmern und stroboskopische Effekte können auch auftreten, wenn das Auge sie nicht bewusst wahrnimmt. Für netzbetriebene LED/OLED nennt die EU-Ökodesign-Verordnung Prüfgrenzen bei Volllast.",
    ],
  },
  {
    id: "steuerung",
    titel: "Dimmen und Lichtsteuerung",
    quelle: "iec-62386-dali",
    kurz: "Dimmer, Treiber und Protokoll müssen dieselbe Sprache sprechen.",
    punkte: [
      "Phasenan- oder Phasenabschnitt funktioniert nur, wenn LED-Lampe, Treiber und Dimmer ausdrücklich kompatibel sind.",
      "DALI ist eine digitale, adressierbare Lichtsteuerung nach IEC 62386. Geräte lassen sich einzeln oder in Gruppen konfigurieren.",
      "DALI ermöglicht bidirektionale Kommunikation: geeignete Geräte können Status- und Fehlerinformationen zurückmelden.",
      "Präsenz- und Lichtsensoren ermöglichen bedarfsabhängiges Schalten oder Regeln; Schaltzeiten und Mindesthelligkeit müssen zur Nutzung passen.",
    ],
  },
  {
    id: "schutz",
    titel: "Schutzart und Leuchtensicherheit",
    quelle: "din-en-60529",
    kurz: "Die Umgebung bestimmt Gehäuse, Montage und Anschluss.",
    punkte: [
      "Beim IP-Code beschreibt die erste Kennziffer den Schutz gegen Berührung und feste Fremdkörper, die zweite den Schutz gegen Wasser.",
      "IP65 bedeutet staubdicht und gegen Strahlwasser geschützt. Die Schutzart muss zum tatsächlichen Montageort passen; eine hohe Zahl ersetzt keine Planung.",
      "Bei Leuchten sind Herstellerangaben zu Montageart, Umgebungstemperatur, Wärmedämmung, Zugentlastung, Schutzleiter und austauschbaren Komponenten einzuhalten.",
      "Vor Arbeiten gelten Gefährdungsbeurteilung und die fünf Sicherheitsregeln. Nach Errichtung oder Änderung sind die erforderlichen Prüfungen und die Dokumentation durchzuführen.",
    ],
  },
  {
    id: "messen",
    titel: "Messen, prüfen, dokumentieren",
    quelle: "asr-a3-4-2023",
    kurz: "Ein einzelner Luxwert beweist noch keine gute Anlage.",
    punkte: [
      "Beleuchtungsstärke wird mit einem geeigneten Luxmeter auf der für die Sehaufgabe festgelegten Bezugsfläche gemessen.",
      "Für eine Bewertung werden mehrere Messpunkte benötigt. Messbedingungen wie Tageslicht, Schaltzustand, Position und Alter der Anlage gehören ins Protokoll.",
      "Bei der Abnahme werden außerdem Gleichmäßigkeit, Blendung, Farbwiedergabe, Funktion der Steuerung und erkennbare Flimmer- oder Stroboskopeffekte beurteilt.",
      "Messung und Berechnung müssen sich auf dieselbe Bezugsfläche und denselben Betriebszustand beziehen.",
    ],
  },
];

export const LICHT_KARTEN = [
  { i: 300, j: 3, lf: "LF10", f: "Was ist der Lichtstrom Φ und in welcher Einheit wird er angegeben?", a: "Der Lichtstrom Φ beschreibt die gesamte sichtbare Lichtabgabe einer Lichtquelle. Einheit: Lumen (lm).", m: ["Gesamte sichtbare Lichtabgabe in Lumen (lm)", "Licht auf einer Fläche in Lux", "Helligkeit einer Fläche in cd/m²", "Elektrische Leistung in Watt"], quelle: "cie-ilv-2020" },
  { i: 301, j: 3, lf: "LF10", f: "Was ist die Beleuchtungsstärke E?", a: "Sie beschreibt den auf eine Fläche auftreffenden Lichtstrom je Fläche. Einheit: Lux; 1 lx = 1 lm/m².", m: ["Auftreffender Lichtstrom je Fläche, in Lux", "Lichtstrom in eine Richtung, in Candela", "Elektrische Leistung einer Leuchte", "Farbtemperatur einer Lichtquelle"], quelle: "cie-ilv-2020" },
  { i: 302, j: 3, lf: "LF10", f: "Worin unterscheiden sich Lichtstärke I und Leuchtdichte L?", a: "Lichtstärke I in Candela beschreibt die Lichtabgabe einer Quelle in eine Richtung. Leuchtdichte L in cd/m² beschreibt den Helligkeitseindruck einer Fläche in einer Blickrichtung.", m: ["I: Richtungsabgabe der Quelle; L: Helligkeit einer Fläche in Blickrichtung", "I und L sind zwei Namen für Lux", "I ist Farbtemperatur; L ist Lichtstrom", "I misst Leistung; L misst Energie"], quelle: "cie-ilv-2020" },
  { i: 303, j: 3, lf: "LF10", f: "Wie lautet die Grundbeziehung zwischen gleichmäßigem Lichtstrom, Fläche und Beleuchtungsstärke?", a: "Idealisiert gilt E = Φ/A. In realen Räumen müssen unter anderem Lichtverteilung, Nutzungs- und Wartungsfaktor berücksichtigt werden.", m: ["E = Φ/A", "E = Φ · A", "E = P/A", "E = I · r²"], quelle: "cie-ilv-2020" },
  { i: 304, j: 3, lf: "LF10", f: "Was passiert nach dem photometrischen Entfernungsgesetz bei doppeltem Abstand?", a: "Bei senkrechtem Einfall und einer punktförmigen Quelle gilt E = I/r². Doppelter Abstand ergibt deshalb nur ein Viertel der Beleuchtungsstärke.", m: ["Die Beleuchtungsstärke sinkt auf ein Viertel", "Sie halbiert sich", "Sie verdoppelt sich", "Sie bleibt gleich"], quelle: "cie-ilv-2020" },
  { i: 305, j: 3, lf: "LF10", f: "Was beschreibt die Lichtausbeute η in lm/W?", a: "Sie ist der Quotient aus abgegebenem Lichtstrom und aufgenommener Leistung. Es muss angegeben sein, ob Hilfs- oder Betriebsgeräte in der Leistung enthalten sind.", m: ["Lichtstrom je aufgenommener Leistung", "Beleuchtungsstärke je Quadratmeter", "Farbtreue je Kelvin", "Lebensdauer je Schaltung"], quelle: "cie-ilv-2020" },
  { i: 306, j: 3, lf: "LF10", f: "Warum wird eine Beleuchtungsanlage auf einen Wartungswert geplant?", a: "Lichtstrom und Beleuchtungsstärke nehmen durch Alterung und Verschmutzung ab. Der Wartungswert muss bis zur vorgesehenen Wartung eingehalten werden; der Wartungsfaktor bildet diese Abnahme ab.", m: ["Damit Alterung und Verschmutzung bis zur Wartung berücksichtigt sind", "Damit neue Leuchten möglichst dunkel starten", "Nur um den Kaufpreis zu berechnen", "Damit Lux und Lumen denselben Zahlenwert haben"], quelle: "cie-wartungsfaktor" },
  { i: 307, j: 3, lf: "LF10", f: "Wie lautet der vereinfachte Wirkungsgradansatz für die Anzahl gleicher Leuchten?", a: "N = (Em · A) / (ΦLeuchte · UF · MF), anschließend auf ganze Leuchten aufrunden. UF ist der Nutzungsfaktor, MF der Wartungsfaktor. Die Methode ersetzt keinen vollständigen Lichtplanungsnachweis.", m: ["N = Em·A / (ΦLeuchte·UF·MF), dann aufrunden", "N = ΦLeuchte / (Em·A)", "N = P·A / Em", "N = Em·UF·MF / A"], quelle: "cie-wartungsfaktor" },
  { i: 308, j: 3, lf: "LF10", f: "Was ist der Unterschied zwischen Farbtemperatur und Farbwiedergabe?", a: "Die Farbtemperatur in Kelvin beschreibt die Lichtfarbe von warm bis kühl. Die Farbwiedergabe beschreibt, wie farbtreu beleuchtete Gegenstände im Vergleich zu einer Referenz erscheinen.", m: ["Kelvin beschreibt Lichtfarbe; Farbwiedergabe beschreibt Farbtreue", "Beide beschreiben nur die Helligkeit", "Kelvin ist die Effizienz; Ra die Leistung", "Es gibt keinen Unterschied"], quelle: "cie-farbtemperatur" },
  { i: 309, j: 3, lf: "LF10", f: "Warum reicht der allgemeine Farbwiedergabeindex Ra allein bei LED nicht immer aus?", a: "Ra ist ein verbreiteter Mittelwert für Farbtreue, bildet aber nicht jede Eigenschaft der Farbqualität und nicht jedes schmalbandige LED-Spektrum vollständig ab. Die CIE empfiehlt für die fachliche Bewertung ergänzende neuere Kennwerte.", m: ["Ra bildet nicht jede Farbqualität und jedes LED-Spektrum vollständig ab", "Ra misst nur die elektrische Leistung", "LED besitzen grundsätzlich keinen Ra-Wert", "Ra ist identisch mit der Farbtemperatur"], quelle: "cie-farbqualitaet-2025" },
  { i: 310, j: 3, lf: "LF10", f: "Wie entstehen Direkt- und Reflexblendung?", a: "Direktblendung kommt von zu hellen oder schlecht abgeschirmten Quellen im Gesichtsfeld. Reflexblendung entsteht durch Spiegelungen auf glänzenden Flächen, Werkstücken oder Bildschirmen.", m: ["Direkt durch helle Quellen; Reflex durch Spiegelungen", "Beide nur durch zu geringe Beleuchtungsstärke", "Direkt durch Wärme; Reflex durch Schall", "Nur durch falsche Farbtemperatur"], quelle: "asr-a3-4-2023" },
  { i: 311, j: 3, lf: "LF10", f: "Welche Aufgabe hat ein LED-Betriebsgerät?", a: "Es bereitet die Netzversorgung für die LED auf und stellt die benötigten elektrischen Betriebsbedingungen bereit. Je nach Gerät übernimmt es zusätzlich Dimmen, Leistungsfaktorkorrektur, Schutz- und Kommunikationsfunktionen.", m: ["Versorgung für die LED aufbereiten und Betriebsbedingungen bereitstellen", "Nur das Licht mechanisch verteilen", "Die Farbtemperatur des Raums messen", "Den Schutzleiter ersetzen"], quelle: "eu-licht-ecodesign" },
  { i: 312, j: 3, lf: "LF10", f: "Was bedeutet L70B50 bei einer LED-Lichtquelle?", a: "Nach der angegebenen Zeit ist bei 50 % einer Population der Lichtstrom unter 70 % des Anfangswertes gefallen. Das ist eine statistische Lichtstrom-Lebensdauer, kein garantierter Ausfallzeitpunkt jeder Leuchte.", m: ["Bei 50 % der Population fällt der Lichtstrom unter 70 % des Anfangswertes", "70 % fallen nach 50 Stunden vollständig aus", "Die Leuchte hat 70 W bei 50 V", "50 % der Energie werden zu 70 % Licht"], quelle: "eu-licht-label" },
  { i: 313, j: 3, lf: "LF10", f: "Was ist DALI?", a: "DALI ist eine digitale, adressierbare Schnittstelle zur Lichtsteuerung nach IEC 62386. Geräte können einzeln oder in Gruppen gesteuert und — sofern unterstützt — abgefragt werden.", m: ["Digitale adressierbare Lichtsteuerung nach IEC 62386", "Ein analoger Zweidraht-Dimmer ohne Adressen", "Eine Schutzart für Außenleuchten", "Eine Einheit für Farbwiedergabe"], quelle: "iec-62386-dali" },
  { i: 314, j: 3, lf: "LF10", f: "Was bedeuten die beiden Kennziffern einer IP-Schutzart?", a: "Die erste Kennziffer beschreibt den Schutz gegen Berührung und feste Fremdkörper, die zweite den Schutz gegen Wasser. Ein X bedeutet, dass für diese Stelle keine Kennziffer angegeben ist.", m: ["Erste: Berührung/Fremdkörper; zweite: Wasser", "Erste: Wasser; zweite: Spannung", "Erste: Leistung; zweite: Lebensdauer", "Beide geben die Schutzklasse an"], quelle: "din-en-60529" },
  { i: 315, j: 3, lf: "LF10", f: "Was bedeutet IP65 bei einer Leuchte?", a: "6: staubdicht und vollständiger Berührungsschutz. 5: geschützt gegen Strahlwasser. Ob IP65 genügt, hängt trotzdem vom konkreten Montageort und der Gefährdung ab.", m: ["Staubdicht und gegen Strahlwasser geschützt", "Nur gegen Berührung mit Fingern geschützt", "Für dauerhaftes Untertauchen geeignet", "Schutzklasse II mit 65 V"], quelle: "din-en-60529" },
  { i: 316, j: 3, lf: "LF10", f: "Welche Angaben zeigt das EU-Energielabel für Lichtquellen?", a: "Es verwendet die Effizienzskala A bis G und zeigt unter anderem Energieverbrauch in kWh je 1.000 Stunden sowie einen QR-Code zu Produktinformationen.", m: ["Klasse A–G, kWh/1.000 h und QR-Code", "Nur Lumen und Kaufpreis", "Schutzart und Schutzklasse", "Montagehöhe und Abstrahlwinkel"], quelle: "eu-licht-label" },
  { i: 317, j: 3, lf: "LF10", f: "Wie wird die Beleuchtungsstärke an einem Arbeitsplatz sinnvoll geprüft?", a: "Mit geeignetem Luxmeter an mehreren Punkten der festgelegten Bezugsfläche. Tageslicht, Schaltzustand, Messposition und Anlagenzustand werden dokumentiert; ein einzelner Messwert reicht für die Bewertung nicht.", m: ["An mehreren dokumentierten Punkten auf der Bezugsfläche", "Nur direkt unter der hellsten Leuchte", "Mit einem Multimeter am Treiber", "Durch Ablesen der Wattzahl"], quelle: "asr-a3-4-2023" },
  { i: 318, j: 3, lf: "LF10", f: "Welcher ASR-Mindestwert gilt typischerweise für Büroarbeit mit Schreiben, Lesen und Datenverarbeitung?", a: "500 lx als Mindestwert der mittleren Beleuchtungsstärke am Arbeitsplatz. Die konkrete Planung muss zusätzlich weitere Qualitätsmerkmale und die Gefährdungsbeurteilung berücksichtigen.", m: ["500 lx", "50 lx", "100 lx", "5.000 lx"], quelle: "asr-a3-4-2023" },
  { i: 319, j: 3, lf: "LF10", f: "Welche Punkte gehören außer Lux zu einer vollständigen Lichtplanung?", a: "Mindestens Sehaufgabe und Bezugsfläche, Gleichmäßigkeit, Blendung, Farbwiedergabe und Lichtfarbe, Flimmern, Wartung, Tageslicht, Steuerung, Energiebedarf, Schutzart, Montagebedingungen und Dokumentation.", m: ["Sehaufgabe, Gleichmäßigkeit, Blendung, Farbe, Flimmern, Wartung und Umgebung", "Nur Wattzahl und Kaufpreis", "Nur Raumfläche und Anzahl der Leuchten", "Nur Farbtemperatur und Gehäusefarbe"], quelle: "din-en-12464-1" },
];

