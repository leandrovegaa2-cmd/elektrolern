import { useEffect, useMemo, useRef, useState } from "react";
import { FACHGESPRAECH_PHASES, FACHGESPRAECH_SZENARIEN } from "../data/fachgespraech.js";
import { WEITERE_FACHGESPRAECH_SZENARIEN } from "../data/fachgespraechErweitert.js";
import { FACHQUELLEN } from "../data/fachquellen.js";
import { adaptiveFolgefrage, bewerteFachantwort, erstelleEigenesSzenario, erstelleFachgespraech, fachgespraechProtokoll, zufaelligesSzenario } from "../lib/fachgespraech.js";
import Icon from "./Icon.jsx";

const ALLE_SZENARIEN = [...FACHGESPRAECH_SZENARIEN, ...WEITERE_FACHGESPRAECH_SZENARIEN];
const KATEGORIEN = [
  { id: "alle", label: "Alle Aufträge" },
  { id: "licht", label: "Lichttechnik" },
  { id: "installation", label: "Installation" },
  { id: "steuerung", label: "SPS & Antrieb" },
  { id: "energie", label: "Energie" },
  { id: "fehlersuche", label: "Fehlersuche" },
];
const SCHWERPUNKTE = [
  { id: "installation", label: "Installation & Schutz" },
  { id: "steuerung", label: "Steuerung & SPS" },
  { id: "antrieb", label: "Motor & Antrieb" },
  { id: "licht", label: "Lichttechnik" },
  { id: "energie", label: "Energie & Gebäude" },
];

function formatiereZeit(sekunden) {
  const minuten = Math.floor(sekunden / 60);
  return `${String(minuten).padStart(2, "0")}:${String(sekunden % 60).padStart(2, "0")}`;
}

function ProtokollText({ szenario, protokoll, antworten, dauer, modus }) {
  return [
    "ElektroLern – Fachgespräch-Trainingsprotokoll",
    `Auftrag: ${szenario.titel}`,
    `Modus: ${modus === "pruefung" ? "Prüfungssimulation" : "Training mit Direktfeedback"}`,
    `Trainingswert: ${protokoll.punkte}/100 – Note ${protokoll.bewertung.note} (${protokoll.bewertung.text})`,
    `Dauer: ${formatiereZeit(dauer)}`, "",
    ...protokoll.phasen.map((phase) => `${phase.label}: ${phase.prozent}%`),
    `Stärken: ${protokoll.staerken.map((phase) => phase.label).join(", ") || "noch keine Phase über 75 %"}`,
    `Lernfokus: ${protokoll.lernfelder.map((phase) => phase.label).join(", ") || "keine Phase unter 60 %"}`, "",
    ...antworten.flatMap((eintrag, index) => [
      `${index + 1}. ${eintrag.frage.frage}`,
      `Antwort: ${eintrag.antwort}`,
      `Abdeckung: ${eintrag.bewertung.prozent}%`,
      `Fehlend: ${eintrag.bewertung.fehlend.map((punkt) => punkt.titel).join(", ") || "keine Kernpunkte"}`,
      `Musterantwort: ${eintrag.frage.muster}`, "",
    ]),
    "Hinweis: Automatische Trainingsbewertung, keine offizielle IHK-Prüfungsnote.",
  ].join("\n");
}

function Setup({ onStart, onAbbrechen }) {
  const [szenarioId, setSzenarioId] = useState(ALLE_SZENARIEN[0].id);
  const [kategorie, setKategorie] = useState("alle");
  const [niveau, setNiveau] = useState("basis");
  const [anzahl, setAnzahl] = useState(5);
  const [modus, setModus] = useState("training");
  const [kontext, setKontext] = useState("");
  const [eigenerTitel, setEigenerTitel] = useState("");
  const [eigenerAuftrag, setEigenerAuftrag] = useState("");
  const [eigenerRahmen, setEigenerRahmen] = useState("");
  const [schwerpunkt, setSchwerpunkt] = useState("installation");
  const methodenQuellen = FACHQUELLEN.filter((quelle) => ["bibb-elektro-fachgespraech", "ihk-fachgespraech-bewertung"].includes(quelle.id));
  const sichtbareSzenarien = kategorie === "alle" ? ALLE_SZENARIEN : ALLE_SZENARIEN.filter((item) => item.kategorie === kategorie);
  const eigenerAktiv = szenarioId === "eigen";
  const startBereit = !eigenerAktiv || eigenerAuftrag.trim().length >= 30;

  function filterWaehlen(neu) {
    setKategorie(neu);
    const pool = neu === "alle" ? ALLE_SZENARIEN : ALLE_SZENARIEN.filter((item) => item.kategorie === neu);
    if (!eigenerAktiv && !pool.some((item) => item.id === szenarioId)) setSzenarioId(pool[0]?.id || ALLE_SZENARIEN[0].id);
  }

  function start() {
    if (!startBereit) return;
    onStart({
      szenarioId, niveau, anzahl, modus, kontext,
      eigenerAuftrag: eigenerAktiv ? { titel: eigenerTitel, auftrag: eigenerAuftrag, rahmen: eigenerRahmen, schwerpunkt } : null,
    });
  }

  return (
    <div className="talk-setup">
      <div className="talk-topbar"><button className="back" onClick={onAbbrechen} aria-label="Fachgespräch verlassen">←</button><span>Fachgespräch konfigurieren</span><b>LOKAL & OFFLINE</b></div>
      <section className="talk-intro">
        <span className="talk-kicker"><Icon name="conversation" size={16} /> Prüfungstraining · freie Antwort</span>
        <h1>Dein Auftrag.<br /><em>Dein Fachgespräch.</em></h1>
        <p>Trainiere verschiedene Elektro-Aufträge mit direkten Hinweisen oder starte eine Prüfungssimulation ohne Zwischenfeedback.</p>
        <div className="talk-intro-stats"><span><b>{ALLE_SZENARIEN.length}</b> fertige Aufträge</span><span><b>2</b> Gesprächsmodi</span><span><b>1</b> eigener Auftrag</span></div>
      </section>

      <section className="talk-config-card" aria-labelledby="talk-scenario-title">
        <div className="talk-config-head"><span>01</span><div><h2 id="talk-scenario-title">Ausgangslage wählen</h2><p>Filtere nach Fachgebiet oder lass dir einen Auftrag zuteilen.</p></div></div>
        <div className="talk-category-row" aria-label="Aufträge filtern">
          {KATEGORIEN.map((item) => <button key={item.id} className={kategorie === item.id ? "active" : ""} onClick={() => filterWaehlen(item.id)}>{item.label}</button>)}
          <button className="talk-random" onClick={() => { const item = zufaelligesSzenario(ALLE_SZENARIEN, kategorie); if (item) setSzenarioId(item.id); }}><Icon name="repeat" size={15} /> Zufallsauftrag</button>
        </div>
        <div className="talk-scenarios">
          {sichtbareSzenarien.map((item) => (
            <button key={item.id} className={szenarioId === item.id ? "active" : ""} onClick={() => setSzenarioId(item.id)} aria-pressed={szenarioId === item.id}>
              <span>{item.code}</span><b>{item.titel}</b><small>{item.kurz}</small><i><Icon name={item.icon || "conversation"} size={20} /></i>
            </button>
          ))}
          <button className={`talk-own-card ${eigenerAktiv ? "active" : ""}`} onClick={() => setSzenarioId("eigen")} aria-pressed={eigenerAktiv}>
            <span>EIGENE AUSGANGSLAGE</span><b>Eigenen Auftrag verwenden</b><small>Du gibst das Projekt vor, die App baut lokal einen strukturierten Fragenlauf.</small><i><Icon name="edit" size={20} /></i>
          </button>
        </div>
        {eigenerAktiv ? (
          <div className="talk-own-editor">
            <div className="talk-own-note"><Icon name="safety" size={17} /><p><b>Lokale Vorlage:</b> Die App erzeugt phasengerechte Prüferfragen und bewertet Fachlogik. Spezielle Details deines freien Auftrags werden nicht automatisch als technisch geprüft ausgegeben.</p></div>
            <div className="talk-own-fields">
              <label><span>Titel</span><input maxLength="90" value={eigenerTitel} onChange={(event) => setEigenerTitel(event.target.value)} placeholder="Unterverteilung einer Werkstatt erneuern" /></label>
              <label><span>Schwerpunkt</span><select value={schwerpunkt} onChange={(event) => setSchwerpunkt(event.target.value)}>{SCHWERPUNKTE.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
              <label className="wide"><span>Auftragsbeschreibung <small>mindestens 30 Zeichen</small></span><textarea maxLength="1200" value={eigenerAuftrag} onChange={(event) => setEigenerAuftrag(event.target.value)} placeholder="Was soll errichtet, geändert, geprüft oder repariert werden? Welche Kundenanforderung gibt es?" /></label>
              <label className="wide"><span>Rahmendaten <small>optional, je Zeile ein Punkt</small></span><textarea maxLength="600" value={eigenerRahmen} onChange={(event) => setEigenerRahmen(event.target.value)} placeholder={"Netzform: TN-S\nLeitungsweg: 28 m\nBetrieb muss um 15 Uhr wieder laufen"} /></label>
            </div>
          </div>
        ) : null}
      </section>

      <section className="talk-config-card">
        <div className="talk-config-head"><span>02</span><div><h2>Gespräch einstellen</h2><p>Wähle Lernhilfe, Tiefe und Gesprächslänge passend zu deinem Ziel.</p></div></div>
        <div className="talk-mode-cards">
          <button className={modus === "training" ? "active" : ""} onClick={() => setModus("training")}><Icon name="book" size={20} /><span><b>Trainingsmodus</b><small>Direktes Feedback, Lernlücken und adaptive Nachfrage.</small></span></button>
          <button className={modus === "pruefung" ? "active" : ""} onClick={() => setModus("pruefung")}><Icon name="exam" size={20} /><span><b>Prüfungssimulation</b><small>Keine Zwischenhilfe, vollständige Auswertung am Ende.</small></span></button>
        </div>
        <div className="talk-options">
          <fieldset><legend>Niveau</legend><div><button className={niveau === "basis" ? "active" : ""} onClick={() => setNiveau("basis")}>Basis</button><button className={niveau === "fortgeschritten" ? "active" : ""} onClick={() => setNiveau("fortgeschritten")}>Fortgeschritten</button></div></fieldset>
          <fieldset><legend>Umfang</legend><div><button className={anzahl === 5 ? "active" : ""} onClick={() => setAnzahl(5)}>Kompakt · 5</button><button className={anzahl === 7 ? "active" : ""} onClick={() => setAnzahl(7)}>Standard · 7</button></div></fieldset>
        </div>
        {!eigenerAktiv ? <label className="talk-context"><span>Zusätzlicher Auftragskontext <small>optional</small></span><textarea maxLength="600" value={kontext} onChange={(event) => setKontext(event.target.value)} placeholder="Raumgröße, Kundenwunsch, konkretes Fehlerbild oder weitere Betriebsdaten …" /><small>{kontext.length}/600</small></label> : null}
      </section>

      <div className="talk-method"><Icon name="safety" size={18} /><div><p><b>So wird bewertet:</b> Fachliche Kernpunkte werden in deiner freien Antwort erkannt. Gleichwertige Formulierungen funktionieren häufig, Sprache und Auftreten kann die lokale Auswertung jedoch nur eingeschränkt beurteilen. Das Ergebnis ist ein Trainingswert.</p><span>{methodenQuellen.map((quelle) => <a key={quelle.id} href={quelle.url} target="_blank" rel="noreferrer">{quelle.herausgeber}: Grundlage öffnen</a>)}</span></div></div>
      <button className="talk-start" disabled={!startBereit} onClick={start}><Icon name={modus === "pruefung" ? "exam" : "conversation"} size={20} /> {modus === "pruefung" ? "Prüfungssimulation starten" : "Fachgespräch erstellen und starten"} <Icon name="arrow" size={19} /></button>
      {!startBereit ? <p className="talk-start-hint">Beschreibe deinen eigenen Auftrag mit mindestens 30 Zeichen.</p> : null}
    </div>
  );
}

function Ergebnis({ szenario, antworten, dauer, modus, onNochmal, onHeim, onLichttechnik }) {
  const protokoll = useMemo(() => fachgespraechProtokoll(antworten), [antworten]);
  const [kopiert, setKopiert] = useState(false);

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(ProtokollText({ szenario, protokoll, antworten, dauer, modus }));
      setKopiert(true);
    } catch {
      setKopiert(false);
    }
  }

  return (
    <div className="talk-result">
      <span className="talk-kicker"><Icon name="clipboard" size={16} /> {modus === "pruefung" ? "Prüfungssimulation abgeschlossen" : "Trainingsprotokoll"}</span>
      <div className="talk-score">
        <div><span>Gesamtwert</span><b>{protokoll.punkte}</b><small>/ 100</small></div>
        <div><span>IHK-Schlüssel</span><b>Note {protokoll.bewertung.note}</b><small>{protokoll.bewertung.text} · Trainingswert</small></div>
        <div><span>Gesprächsdauer</span><b>{formatiereZeit(dauer)}</b><small>{antworten.length} Antworten</small></div>
      </div>
      <h1>{szenario.titel}</h1>
      <p className="talk-result-lead">Die Auftragsphasen werden gewichtet ausgewertet. Du siehst, wo deine Begründungen tragen und was du gezielt nacharbeiten solltest.</p>
      <div className="talk-phase-results">
        {protokoll.phasen.map((phase) => <article key={phase.id}><span><Icon name={phase.icon} size={16} /> {phase.label}<small>{phase.gewicht}% Gewicht</small></span><b>{phase.prozent}%</b><i><em style={{ transform: `scaleX(${phase.prozent / 100})` }} /></i></article>)}
      </div>
      <section className="talk-insights" aria-label="Persönliche Auswertung">
        <article className="strong"><span><Icon name="trophy" size={18} /> Stärken</span><p>{protokoll.staerken.length ? protokoll.staerken.map((phase) => phase.label).join(" · ") : "Noch keine Phase liegt über 75 %. Nutze die Musterantworten für den nächsten Durchlauf."}</p></article>
        <article className="focus"><span><Icon name="target" size={18} /> Nächster Lernfokus</span><p>{protokoll.lernfelder.length ? protokoll.lernfelder.map((phase) => phase.label).join(" · ") : "Keine Auftragsphase liegt unter 60 %. Vertiefe jetzt die fehlenden Einzelpunkte."}</p></article>
      </section>
      {protokoll.lernempfehlungen.length ? <section className="talk-recommendations"><h2>Diese Punkte zuerst nacharbeiten</h2><div>{protokoll.lernempfehlungen.map((punkt, index) => <article key={punkt.titel}><span>0{index + 1}</span><div><b>{punkt.titel}</b><p>{punkt.erklaerung}</p></div></article>)}</div></section> : null}
      <section className="talk-review" aria-labelledby="talk-review-title">
        <h2 id="talk-review-title">Antworten im Detail</h2>
        {antworten.map((eintrag, index) => (
          <details key={`${eintrag.frage.id}-${index}`} open={eintrag.bewertung.prozent < 60}>
            <summary><span>{index + 1}</span><div><b>{eintrag.frage.frage}</b><small>{FACHGESPRAECH_PHASES.find((phase) => phase.id === eintrag.frage.phase)?.label}{eintrag.frage.adaptiv ? " · adaptive Nachfrage" : ""}</small></div><strong>{eintrag.bewertung.prozent}%</strong></summary>
            <div className="talk-review-body"><h3>Deine Antwort</h3><p>{eintrag.antwort}</p>{eintrag.bewertung.fehlend.length ? <><h3>Noch ergänzen</h3><ul>{eintrag.bewertung.fehlend.map((punkt) => <li key={punkt.titel}><b>{punkt.titel}:</b> {punkt.erklaerung}</li>)}</ul></> : null}<h3>Musterantwort</h3><p>{eintrag.frage.muster}</p></div>
          </details>
        ))}
      </section>
      <div className="talk-result-actions"><button className="next-btn" onClick={kopieren}><Icon name="clipboard" size={17} /> {kopiert ? "Protokoll kopiert" : "Protokoll kopieren"}</button><button className="next-btn secondary" onClick={onNochmal}>Neues Gespräch</button>{szenario.kategorie === "licht" ? <button className="next-btn secondary" onClick={onLichttechnik}>Lichtechnik nachschlagen</button> : null}<button className="next-btn secondary" onClick={onHeim}>Zur Übersicht</button></div>
      <p className="talk-disclaimer">Automatische Schlüsselwort- und Kernpunktbewertung. Keine Prüfungsaussage und keine offizielle IHK-Note.</p>
    </div>
  );
}

export default function FachgespraechSimulator({ progress, onAbbrechen, onLichttechnik }) {
  const [status, setStatus] = useState("setup");
  const [szenario, setSzenario] = useState(null);
  const [modus, setModus] = useState("training");
  const [kontext, setKontext] = useState("");
  const [fragen, setFragen] = useState([]);
  const [zielAnzahl, setZielAnzahl] = useState(5);
  const [index, setIndex] = useState(0);
  const [antwort, setAntwort] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [antworten, setAntworten] = useState([]);
  const [dauer, setDauer] = useState(0);
  const [adaptivGenutzt, setAdaptivGenutzt] = useState(false);
  const startRef = useRef(0);

  useEffect(() => {
    if (status !== "session") return undefined;
    const timer = window.setInterval(() => setDauer(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => window.clearInterval(timer);
  }, [status]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [status]);

  function starten(config) {
    const auswahl = config.eigenerAuftrag ? erstelleEigenesSzenario(config.eigenerAuftrag) : ALLE_SZENARIEN.find((item) => item.id === config.szenarioId) || ALLE_SZENARIEN[0];
    setSzenario(auswahl);
    setModus(config.modus);
    setKontext(config.kontext.trim());
    setFragen(erstelleFachgespraech(auswahl, config.anzahl, config.niveau));
    setZielAnzahl(Number(config.anzahl) || 5);
    setIndex(0); setAntwort(""); setFeedback(null); setAntworten([]); setDauer(0); setAdaptivGenutzt(false);
    startRef.current = Date.now();
    setStatus("session");
  }

  function verbuchen(frage, bewertung) {
    const karte = progress.karten.find((item) => item.i === frage.karteId);
    if (karte) progress.antwortVerbuchen(karte, bewertung.anteil >= 0.6);
    else progress.uebungVerbuchen(bewertung.anteil >= 0.6);
  }

  function beenden() {
    setDauer(Math.floor((Date.now() - startRef.current) / 1000));
    setStatus("result");
  }

  function bewerten() {
    const frage = fragen[index];
    if (!frage || antwort.trim().length < 12 || feedback) return;
    const bewertung = bewerteFachantwort(antwort, frage.kernpunkte);
    setAntworten((bisher) => [...bisher, { frage, antwort: antwort.trim(), bewertung }]);
    verbuchen(frage, bewertung);
    let naechsteFragen = fragen;
    if (!adaptivGenutzt) {
      const folge = adaptiveFolgefrage(frage, bewertung);
      if (folge) {
        naechsteFragen = [...fragen.slice(0, index + 1), folge, ...fragen.slice(index + 1)];
        setFragen(naechsteFragen);
        setAdaptivGenutzt(true);
      }
    }
    if (modus === "training") setFeedback(bewertung);
    else if (index + 1 >= naechsteFragen.length) beenden();
    else { setIndex((wert) => wert + 1); setAntwort(""); }
  }

  function weiter() {
    if (index + 1 >= fragen.length) beenden();
    else { setIndex((wert) => wert + 1); setAntwort(""); setFeedback(null); }
  }

  if (status === "setup") return <Setup onStart={starten} onAbbrechen={onAbbrechen} />;
  if (status === "result") return <Ergebnis szenario={szenario} antworten={antworten} dauer={dauer} modus={modus} onNochmal={() => setStatus("setup")} onHeim={onAbbrechen} onLichttechnik={onLichttechnik} />;

  const frage = fragen[index];
  const phase = FACHGESPRAECH_PHASES.find((item) => item.id === frage.phase);
  const angezeigteAnzahl = Math.max(zielAnzahl, fragen.length);
  return (
    <div className="talk-session">
      <div className="talk-topbar"><button className="back" onClick={onAbbrechen} aria-label="Fachgespräch abbrechen">←</button><span>{modus === "pruefung" ? "Prüfungssimulation" : "Training"} · Frage {index + 1} von {angezeigteAnzahl}</span><b className="talk-timer">{formatiereZeit(dauer)}</b></div>
      <div className="session-progress"><i style={{ transform: `scaleX(${(index + 1) / Math.max(1, angezeigteAnzahl)})` }} /></div>
      <div className="talk-session-grid">
        <aside className="talk-brief">
          <span>{szenario.code}</span><h2>{szenario.titel}</h2><p>{szenario.auftrag}</p>
          <ul>{szenario.daten.map((datum) => <li key={datum}>{datum}</li>)}</ul>
          {kontext ? <div><b>Dein Zusatz</b><p>{kontext}</p></div> : null}
          {szenario.quellenIds?.length ? <div className="talk-brief-sources"><b>Fachquellen</b>{szenario.quellenIds.map((id) => { const quelle = FACHQUELLEN.find((item) => item.id === id); return quelle ? <a key={id} href={quelle.url} target="_blank" rel="noreferrer">{quelle.herausgeber} · {quelle.titel}</a> : null; })}</div> : null}
          <small>{szenario.eigenerAuftrag ? "Eigener Auftrag: Die Bewertung prüft Gesprächsstruktur und ausgewählte Fachbegriffe." : "Die Simulation bleibt thematisch bei diesem Auftrag — wie ein echtes Fachgespräch."}</small>
        </aside>
        <main className="talk-question-card">
          <div className="talk-phase"><span><Icon name={phase.icon} size={17} /> {phase.label}</span><b>{phase.gewicht}% IHK-Gewichtung</b></div>
          {frage.adaptiv ? <span className="talk-adaptive"><Icon name="trend" size={14} /> Nachfrage passend zur vorherigen Antwort</span> : null}
          {modus === "pruefung" ? <span className="talk-exam-badge"><Icon name="lock" size={14} /> Auswertung bis zum Ende gesperrt</span> : null}
          <div className="talk-examiner"><span aria-hidden="true"><Icon name="conversation" size={24} /></span><div><small>Prüfungsausschuss</small><h1>{frage.frage}</h1></div></div>
          <label className="talk-answer"><span>Deine fachliche Antwort</span><textarea autoFocus value={antwort} disabled={!!feedback} onChange={(event) => setAntwort(event.target.value)} placeholder="Antworte in vollständigen Stichpunkten oder Sätzen. Begründe dein Vorgehen …" /></label>
          {feedback ? (
            <section className={`talk-feedback ${feedback.niveau}`} aria-live="polite">
              <div className="talk-feedback-score"><span>Kernpunkte abgedeckt</span><b>{feedback.prozent}%</b><small>{feedback.treffer.length} von {feedback.treffer.length + feedback.fehlend.length}</small></div>
              <div><h2>{feedback.niveau === "sicher" ? "Fachlich sicher." : feedback.niveau === "solide" ? "Solide Grundlage." : "Hier fehlen wichtige Punkte."}</h2>
                {feedback.treffer.length ? <div className="talk-hits">{feedback.treffer.map((punkt) => <span key={punkt.titel}><Icon name="check" size={13} /> {punkt.titel}</span>)}</div> : null}
                {feedback.fehlend.length ? <div className="talk-missing"><b>Noch nennen oder begründen:</b>{feedback.fehlend.map((punkt) => <p key={punkt.titel}><strong>{punkt.titel}</strong>{punkt.erklaerung}</p>)}</div> : null}
              </div>
            </section>
          ) : <p className="talk-eval-note"><Icon name={modus === "pruefung" ? "lock" : "safety"} size={15} /> {modus === "pruefung" ? "Deine Antwort wird gespeichert. Hinweise und Musterantworten siehst du erst im Abschlussprotokoll." : "Bewertet wird die Abdeckung der Fachlogik — nicht eine exakt vorgegebene Formulierung."}</p>}
          <div className="talk-question-actions">
            {!feedback ? <button className="next-btn" disabled={antwort.trim().length < 12} onClick={bewerten}>{modus === "pruefung" ? "Antwort speichern & weiter" : "Antwort auswerten"}</button> : <button className="next-btn" onClick={weiter}>{index + 1 >= fragen.length ? "Prüfprotokoll anzeigen" : "Nächste Prüferfrage"} <Icon name="arrow" size={17} /></button>}
          </div>
        </main>
      </div>
    </div>
  );
}
