import { FACHGESPRAECH_PHASES } from "../data/fachgespraech.js";

function normalisiere(wert) {
  return String(wert || "")
    .toLocaleLowerCase("de")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function begriffGefunden(text, begriff) {
  const gesucht = normalisiere(begriff);
  if (!gesucht) return false;
  return (` ${text} `).includes(` ${gesucht} `) || (gesucht.length > 5 && text.includes(gesucht));
}

export function bewerteFachantwort(antwort, kernpunkte = []) {
  const text = normalisiere(antwort);
  const details = kernpunkte.map((punkt) => ({
    ...punkt,
    getroffen: (punkt.begriffe || []).some((begriff) => begriffGefunden(text, begriff)),
  }));
  const treffer = details.filter((punkt) => punkt.getroffen);
  const fehlend = details.filter((punkt) => !punkt.getroffen);
  const anteil = details.length ? treffer.length / details.length : 0;
  return {
    anteil,
    prozent: Math.round(anteil * 100),
    punkte: Math.round(anteil * 10),
    treffer,
    fehlend,
    niveau: anteil >= 0.8 ? "sicher" : anteil >= 0.5 ? "solide" : "lueckenhaft",
  };
}

function mischen(liste, zufall = Math.random) {
  const kopie = [...liste];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

export function zufaelligesSzenario(szenarien = [], kategorie = "alle", zufall = Math.random) {
  const pool = kategorie === "alle" ? szenarien : szenarien.filter((szenario) => szenario.kategorie === kategorie);
  if (!pool.length) return null;
  return pool[Math.floor(zufall() * pool.length)];
}

const EIGENE_SCHWERPUNKTE = {
  installation: { label: "Installation und Schutz", icon: "distribution", begriffe: ["schutzmassnahme", "leitung", "absicherung", "rcd"], hinweis: "Schutzmaßnahmen, Leitungsanlage und Auswahl der Schutzorgane" },
  steuerung: { label: "Steuerung und SPS", icon: "plc", begriffe: ["sensor", "aktor", "signal", "programm"], hinweis: "Signalweg, Steuerungslogik und sicheres Anlagenverhalten" },
  antrieb: { label: "Motor und Antrieb", icon: "motor", begriffe: ["motor", "last", "motorschutz", "parameter"], hinweis: "Motordaten, Lastverhalten, Schutz und Parametrierung" },
  licht: { label: "Lichttechnik", icon: "light", begriffe: ["sehaufgabe", "beleuchtungsstarke", "blendung", "lichtmessung"], hinweis: "Sehaufgabe, Lichtqualität, Steuerung und messtechnische Kontrolle" },
  energie: { label: "Energie und Gebäude", icon: "solar", begriffe: ["leistung", "lastmanagement", "energie", "netzanschluss"], hinweis: "Leistungsbilanz, Anschlussgrenzen, Regelung und Betrieb" },
};

const eigenerPunkt = (titel, begriffe, erklaerung) => ({ titel, begriffe, erklaerung });

export function erstelleEigenesSzenario({ titel, auftrag, rahmen = "", schwerpunkt = "installation" } = {}) {
  const fokus = EIGENE_SCHWERPUNKTE[schwerpunkt] || EIGENE_SCHWERPUNKTE.installation;
  const saubererTitel = String(titel || "Eigener Elektro-Auftrag").trim().slice(0, 90) || "Eigener Elektro-Auftrag";
  const saubererAuftrag = String(auftrag || "Beschreiben Sie den geplanten Elektro-Auftrag fachgerecht.").trim().slice(0, 1200);
  const daten = String(rahmen || "").split(/\n|;/).map((wert) => wert.trim()).filter(Boolean).slice(0, 5);
  if (!daten.length) daten.push("Eigene Auftragsdaten während des Gesprächs begründen");
  const fachpunkt = eigenerPunkt("Fachlicher Schwerpunkt", fokus.begriffe, `Auf ${fokus.hinweis} eingehen.`);
  return {
    id: `eigen-${schwerpunkt}`,
    eigenerAuftrag: true,
    kategorie: schwerpunkt === "antrieb" ? "steuerung" : schwerpunkt,
    icon: fokus.icon,
    titel: saubererTitel,
    code: `EIGENER AUFTRAG / ${fokus.label.toLocaleUpperCase("de")}`,
    kurz: "Lokal erzeugte Gesprächsstruktur für deinen eigenen betrieblichen Auftrag.",
    auftrag: saubererAuftrag,
    daten,
    fragen: [
      {
        id: `eigen-${schwerpunkt}-info`, phase: "information", niveau: "basis",
        frage: "Welche Informationen, Anforderungen und offenen Punkte klären Sie vor Beginn dieses Auftrags?",
        kernpunkte: [
          eigenerPunkt("Auftragsziel", ["auftragsziel", "kundenwunsch", "anforderung", "sollzustand"], "Ziel und erwarteten Sollzustand eindeutig klären."),
          eigenerPunkt("Bestand", ["bestand", "istzustand", "unterlagen", "vor ort"], "Istzustand und vorhandene Unterlagen aufnehmen."),
          eigenerPunkt("Randbedingungen", ["randbedingung", "umgebung", "termin", "betrieb"], "Betriebliche, räumliche und zeitliche Bedingungen erfassen."),
          fachpunkt,
        ],
        muster: `Ich kläre Auftragsziel und Sollzustand, erfasse Bestand und Unterlagen und stimme betriebliche, räumliche sowie zeitliche Randbedingungen ab. Beim Schwerpunkt ${fokus.label} untersuche ich besonders ${fokus.hinweis}.`,
        folge: {
          schwach: { id: `eigen-${schwerpunkt}-info-schwach`, phase: "information", frage: "Welche drei Angaben würden Sie vor Ort auf keinen Fall nur annehmen, sondern prüfen?", kernpunkte: [eigenerPunkt("Istzustand", ["istzustand", "bestand", "messen"], "Den tatsächlichen Bestand prüfen."), eigenerPunkt("Anforderungen", ["anforderung", "hersteller", "kunde", "vorgabe"], "Anforderungen und Vorgaben belegen."), eigenerPunkt("Sicherheit", ["netzform", "schutzmassnahme", "gefahr", "sicherheit"], "Sicherheitsrelevante Bedingungen feststellen.")], muster: "Ich prüfe den realen Istzustand, belege Kunden-, Hersteller- und Anschlussanforderungen und stelle sicherheitsrelevante Bedingungen wie Gefahren, Netzform und vorhandene Schutzmaßnahmen fest." },
          stark: { id: `eigen-${schwerpunkt}-info-stark`, phase: "information", frage: "Wo sehen Sie bei diesem Auftrag technische Zielkonflikte, und wie würden Sie diese klären?", kernpunkte: [eigenerPunkt("Zielkonflikt", ["zielkonflikt", "kosten", "termin", "qualitat"], "Mindestens einen technischen oder betrieblichen Zielkonflikt benennen."), eigenerPunkt("Varianten", ["alternative", "variante", "vergleich"], "Lösungsvarianten fachlich vergleichen."), eigenerPunkt("Abstimmung", ["abstimmen", "kunde", "betreiber", "dokumentieren"], "Entscheidung mit Verantwortlichen abstimmen und dokumentieren.")], muster: "Ich benenne Konflikte zwischen Sicherheit, Funktion, Verfügbarkeit, Kosten und Termin, vergleiche geeignete Varianten und lasse die Entscheidung mit ihren Folgen vom Betreiber abstimmen und dokumentieren." },
        },
      },
      { id: `eigen-${schwerpunkt}-plan-loesung`, phase: "planung", niveau: "basis", frage: "Welche Lösung planen Sie, und warum ist sie für den Auftrag geeignet?", kernpunkte: [eigenerPunkt("Lösung", ["losung", "konzept", "auswahl"], "Ein klares technisches Konzept darstellen."), fachpunkt, eigenerPunkt("Alternative", ["alternative", "variante", "vergleich"], "Mindestens eine Alternative abwägen."), eigenerPunkt("Begründung", ["begrunden", "vorteil", "nachteil", "geeignet"], "Auswahl anhand nachvollziehbarer Kriterien begründen.")], muster: `Ich beschreibe mein technisches Konzept mit Schwerpunkt auf ${fokus.hinweis}, vergleiche mindestens eine geeignete Alternative und begründe die Auswahl anhand von Sicherheit, Funktion, Aufwand und Betrieb. ` },
      { id: `eigen-${schwerpunkt}-plan-ablauf`, phase: "planung", niveau: "fortgeschritten", frage: "Wie planen Sie Material, Arbeitsablauf, Risiken und Abstimmungen?", kernpunkte: [eigenerPunkt("Material", ["material", "stuckliste", "werkzeug", "prufmittel"], "Material, Werkzeuge und Prüfmittel vorbereiten."), eigenerPunkt("Ablauf", ["reihenfolge", "arbeitsablauf", "zeitplan"], "Arbeitsschritte sinnvoll ordnen."), eigenerPunkt("Risiken", ["gefahrdung", "risiko", "schutzmassnahme"], "Gefährdungen beurteilen und Maßnahmen festlegen."), eigenerPunkt("Abstimmung", ["abschaltung", "freigabe", "betreiber", "gewerk"], "Abschaltungen und Schnittstellen koordinieren.")], muster: "Ich erstelle Material- und Prüfmittelliste, ordne die Arbeitsschritte, beurteile Gefährdungen und lege Schutzmaßnahmen fest. Abschaltungen, Freigaben und Schnittstellen stimme ich mit den Beteiligten ab." },
      { id: `eigen-${schwerpunkt}-do`, phase: "durchfuehrung", niveau: "basis", frage: "Wie führen Sie den Auftrag sicher und qualitätsgesichert aus?", kernpunkte: [eigenerPunkt("Sicher starten", ["freischalten", "spannungsfreiheit", "arbeitsbereich", "sicher"], "Arbeitsbereich sichern und elektrische Gefahren beherrschen."), eigenerPunkt("Herstellerregeln", ["hersteller", "montageanleitung", "drehmoment", "vorgabe"], "Hersteller- und Montagevorgaben beachten."), fachpunkt, eigenerPunkt("Zwischenkontrolle", ["zwischenprufung", "kontrollieren", "kennzeichnen", "dokumentieren"], "Arbeitsschritte kontrollieren und Änderungen dokumentieren.")], muster: `Ich sichere den Arbeitsbereich und wende die nötigen Sicherheitsmaßnahmen an. Die Ausführung folgt Hersteller- und Planungsunterlagen; ${fokus.hinweis} kontrolliere ich besonders. Änderungen und Zwischenprüfungen dokumentiere ich. ` },
      { id: `eigen-${schwerpunkt}-do-abweichung`, phase: "durchfuehrung", niveau: "fortgeschritten", frage: "Während der Arbeit weicht der Bestand von der Dokumentation ab. Wie entscheiden Sie weiter?", kernpunkte: [eigenerPunkt("Stoppen", ["stoppen", "unterbrechen", "nicht einfach"], "Bei sicherheits- oder planungsrelevanter Abweichung nicht ungeprüft fortfahren."), eigenerPunkt("Bewerten", ["prufen", "messen", "ursache", "bewerten"], "Abweichung untersuchen und technische Folgen bewerten."), eigenerPunkt("Abstimmen", ["abstimmen", "freigabe", "betreiber", "auftraggeber"], "Änderung durch Verantwortliche freigeben lassen."), eigenerPunkt("Nachführen", ["plan andern", "dokumentieren", "nachtrag"], "Planung und Dokumentation nachführen.")], muster: "Ich unterbreche den betroffenen Schritt, prüfe die Abweichung und bewerte ihre Folgen für Sicherheit, Funktion, Kosten und Termin. Die angepasste Lösung wird freigegeben und in Planung sowie Dokumentation übernommen." },
      { id: `eigen-${schwerpunkt}-check`, phase: "kontrolle", niveau: "basis", frage: "Wie prüfen, dokumentieren und übergeben Sie das Arbeitsergebnis?", kernpunkte: [eigenerPunkt("Prüfung", ["besichtigen", "erproben", "messen", "funktionstest"], "Erforderliche Sicht-, Funktions- und Messprüfungen durchführen."), eigenerPunkt("Soll-Ist", ["soll ist", "anforderung", "abnahme", "ergebnis"], "Ergebnis mit den vereinbarten Anforderungen vergleichen."), eigenerPunkt("Dokumentation", ["messwert", "prufprotokoll", "plan", "dokumentation"], "Messwerte, Änderungen und Unterlagen vollständig dokumentieren."), eigenerPunkt("Übergabe", ["einweisung", "ubergabe", "betreiber", "wartung"], "Betreiber einweisen und Betriebs- beziehungsweise Wartungshinweise geben.")], muster: "Ich führe die erforderlichen Sicht-, Funktions- und Messprüfungen durch, vergleiche das Ergebnis mit dem Soll und dokumentiere Messwerte sowie Änderungen. Bei der Übergabe weise ich den Betreiber ein und erläutere Betrieb und Wartung." },
    ],
  };
}

export function erstelleFachgespraech(szenario, anzahl = 5, niveau = "basis", zufall = Math.random) {
  if (!szenario) return [];
  const maximum = Math.max(5, Math.min(7, Number(anzahl) || 5));
  const bevorzugt = szenario.fragen.filter((frage) => niveau === "fortgeschritten" || frage.niveau === "basis");
  // Bei einem langen Basis-Gespräch dienen die fortgeschrittenen Fragen als
  // Vertiefung. So enthält die gewählte 7er-Variante auch wirklich 7 Fragen.
  const ergaenzung = niveau === "basis" ? szenario.fragen.filter((frage) => frage.niveau !== "basis") : [];
  const pool = [...bevorzugt, ...ergaenzung];
  const kernAnzahl = maximum - 1;
  const pflicht = FACHGESPRAECH_PHASES
    .map((phase) => pool.find((frage) => frage.phase === phase.id))
    .filter(Boolean);
  const pflichtIds = new Set(pflicht.map((frage) => frage.id));
  const rest = mischen(pool.filter((frage) => !pflichtIds.has(frage.id)), zufall);
  const gewaehlt = [...pflicht, ...rest].slice(0, kernAnzahl);
  const reihenfolge = new Map(FACHGESPRAECH_PHASES.map((phase, index) => [phase.id, index]));
  return gewaehlt.sort((a, b) => reihenfolge.get(a.phase) - reihenfolge.get(b.phase));
}

export function adaptiveFolgefrage(frage, bewertung) {
  if (!frage?.folge) return null;
  const variante = bewertung.anteil >= 0.75 ? frage.folge.stark : frage.folge.schwach;
  return variante ? { ...variante, adaptiv: true, elternId: frage.id } : null;
}

export function ihkNote(punkte) {
  if (punkte >= 92) return { note: 1, text: "sehr gut" };
  if (punkte >= 81) return { note: 2, text: "gut" };
  if (punkte >= 67) return { note: 3, text: "befriedigend" };
  if (punkte >= 50) return { note: 4, text: "ausreichend" };
  if (punkte >= 30) return { note: 5, text: "mangelhaft" };
  return { note: 6, text: "ungenügend" };
}

export function fachgespraechProtokoll(antworten = []) {
  const phasen = FACHGESPRAECH_PHASES.map((phase) => {
    const passend = antworten.filter((antwort) => antwort.frage.phase === phase.id);
    const prozent = passend.length
      ? Math.round(passend.reduce((summe, antwort) => summe + antwort.bewertung.prozent, 0) / passend.length)
      : 0;
    return { ...phase, prozent, beantwortet: passend.length };
  });
  const gewichtSumme = phasen.filter((phase) => phase.beantwortet).reduce((summe, phase) => summe + phase.gewicht, 0);
  const punkte = gewichtSumme
    ? Math.round(phasen.reduce((summe, phase) => summe + (phase.beantwortet ? phase.prozent * phase.gewicht : 0), 0) / gewichtSumme)
    : 0;
  const staerken = phasen.filter((phase) => phase.beantwortet && phase.prozent >= 75);
  const lernfelder = phasen.filter((phase) => phase.beantwortet && phase.prozent < 60);
  const fehlendeMap = new Map();
  antworten.forEach((antwort) => {
    (antwort.bewertung.fehlend || []).forEach((punkt) => {
      const vorhanden = fehlendeMap.get(punkt.titel) || { ...punkt, anzahl: 0 };
      vorhanden.anzahl += 1;
      fehlendeMap.set(punkt.titel, vorhanden);
    });
  });
  const lernempfehlungen = [...fehlendeMap.values()].sort((a, b) => b.anzahl - a.anzahl).slice(0, 3);
  return { punkte, bewertung: ihkNote(punkte), phasen, staerken, lernfelder, lernempfehlungen };
}
