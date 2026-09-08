import { useEffect, useMemo, useRef, useState } from "react";
import { FACHGESPRAECH_PHASES, FACHGESPRAECH_SZENARIEN } from "../data/fachgespraech.js";
import { FACHQUELLEN } from "../data/fachquellen.js";
import { adaptiveFolgefrage, bewerteFachantwort, erstelleFachgespraech, fachgespraechProtokoll } from "../lib/fachgespraech.js";
import Icon from "./Icon.jsx";

function formatiereZeit(sekunden) {
  const minuten = Math.floor(sekunden / 60);
  return `${String(minuten).padStart(2, "0")}:${String(sekunden % 60).padStart(2, "0")}`;
}

function ProtokollText({ szenario, protokoll, antworten, dauer }) {
  const zeilen = [
    "ElektroLern – Fachgespräch-Trainingsprotokoll",
    `Auftrag: ${szenario.titel}`,
    `Trainingswert: ${protokoll.punkte}/100 – Note ${protokoll.bewertung.note} (${protokoll.bewertung.text})`,
    `Dauer: ${formatiereZeit(dauer)}`,
    "",
    ...protokoll.phasen.map((phase) => `${phase.label}: ${phase.prozent}%`),
    "",
    ...antworten.flatMap((eintrag, index) => [
      `${index + 1}. ${eintrag.frage.frage}`,
      `Antwort: ${eintrag.antwort}`,
      `Abdeckung: ${eintrag.bewertung.prozent}%`,
      `Fehlend: ${eintrag.bewertung.fehlend.map((punkt) => punkt.titel).join(", ") || "keine Kernpunkte"}`,
      `Musterantwort: ${eintrag.frage.muster}`,
      "",
    ]),
    "Hinweis: Automatische Trainingsbewertung, keine offizielle IHK-Prüfungsnote.",
  ];
  return zeilen.join("\n");
}

function Setup({ onStart, onAbbrechen }) {
  const [szenarioId, setSzenarioId] = useState(FACHGESPRAECH_SZENARIEN[0].id);
  const [niveau, setNiveau] = useState("basis");
  const [anzahl, setAnzahl] = useState(5);
  const [kontext, setKontext] = useState("");
  const methodenQuellen = FACHQUELLEN.filter((quelle) => ["bibb-elektro-fachgespraech", "ihk-fachgespraech-bewertung"].includes(quelle.id));

  return (
    <div className="talk-setup">
      <div className="talk-topbar"><button className="back" onClick={onAbbrechen} aria-label="Fachgespräch verlassen">←</button><span>Fachgespräch konfigurieren</span><b>OFFLINE</b></div>
      <section className="talk-intro">
        <span className="talk-kicker"><Icon name="conversation" size={16} /> Prüfungstraining · freie Antwort</span>
        <h1>Dein Auftrag.<br /><em>Dein Fachgespräch.</em></h1>
        <p>Wähle eine reale Ausgangslage. Der Prüfer fragt entlang der Auftragsphasen nach und reagiert einmal gezielt auf die Qualität deiner Antwort.</p>
      </section>

      <section className="talk-config-card" aria-labelledby="talk-scenario-title">
        <div className="talk-config-head"><span>01</span><div><h2 id="talk-scenario-title">Ausgangslage wählen</h2><p>Jeder Auftrag verwendet einen eigenen geprüften Fragenpool.</p></div></div>
        <div className="talk-scenarios">
          {FACHGESPRAECH_SZENARIEN.map((szenario) => (
            <button key={szenario.id} className={szenarioId === szenario.id ? "active" : ""} onClick={() => setSzenarioId(szenario.id)} aria-pressed={szenarioId === szenario.id}>
              <span>{szenario.code}</span><b>{szenario.titel}</b><small>{szenario.kurz}</small><i><Icon name={szenario.id === "stoerung" ? "problem" : szenario.id === "buero" ? "light" : "factory"} size={20} /></i>
            </button>
          ))}
        </div>
      </section>

      <section className="talk-config-card">
        <div className="talk-config-head"><span>02</span><div><h2>Gespräch einstellen</h2><p>Die Bewertung bleibt in beiden Stufen transparent.</p></div></div>
        <div className="talk-options">
          <fieldset><legend>Niveau</legend><div><button className={niveau === "basis" ? "active" : ""} onClick={() => setNiveau("basis")}>Basis</button><button className={niveau === "fortgeschritten" ? "active" : ""} onClick={() => setNiveau("fortgeschritten")}>Fortgeschritten</button></div></fieldset>
          <fieldset><legend>Umfang</legend><div><button className={anzahl === 5 ? "active" : ""} onClick={() => setAnzahl(5)}>5 Fragen</button><button className={anzahl === 7 ? "active" : ""} onClick={() => setAnzahl(7)}>7 Fragen</button></div></fieldset>
        </div>
        <label className="talk-context"><span>Eigener Auftragskontext <small>optional</small></span><textarea maxLength="600" value={kontext} onChange={(event) => setKontext(event.target.value)} placeholder="Zum Beispiel: Raumgröße, vorhandene Leuchten, Kundenwunsch oder konkretes Fehlerbild …" /><small>{kontext.length}/600</small></label>
      </section>

      <div className="talk-method"><Icon name="safety" size={18} /><div><p><b>So wird bewertet:</b> Fachliche Kernpunkte werden in deiner Antwort erkannt. Formulierungen dürfen frei sein. Sprache, Auftreten und technisch gleichwertige Begriffe kann die lokale Auswertung nur eingeschränkt beurteilen — das Ergebnis ist ein Trainingswert, keine offizielle Prüfungsnote.</p><span>{methodenQuellen.map((quelle) => <a key={quelle.id} href={quelle.url} target="_blank" rel="noreferrer">{quelle.herausgeber}: Grundlage öffnen</a>)}</span></div></div>
      <button className="talk-start" onClick={() => onStart({ szenarioId, niveau, anzahl, kontext })}><Icon name="conversation" size={20} /> Fachgespräch erstellen und starten <Icon name="arrow" size={19} /></button>
    </div>
  );
}

function Ergebnis({ szenario, antworten, dauer, onNochmal, onHeim, onLichttechnik }) {
  const protokoll = useMemo(() => fachgespraechProtokoll(antworten), [antworten]);
  const [kopiert, setKopiert] = useState(false);

  async function kopieren() {
    const text = ProtokollText({ szenario, protokoll, antworten, dauer });
    try {
      await navigator.clipboard.writeText(text);
      setKopiert(true);
    } catch {
      setKopiert(false);
    }
  }

  return (
    <div className="talk-result">
      <span className="talk-kicker"><Icon name="clipboard" size={16} /> Trainingsprotokoll</span>
      <div className="talk-score">
        <div><span>Gesamtwert</span><b>{protokoll.punkte}</b><small>/ 100</small></div>
        <div><span>IHK-Schlüssel</span><b>Note {protokoll.bewertung.note}</b><small>{protokoll.bewertung.text} · Trainingswert</small></div>
        <div><span>Gesprächsdauer</span><b>{formatiereZeit(dauer)}</b><small>{antworten.length} Antworten</small></div>
      </div>
      <h1>{szenario.titel}</h1>
      <p className="talk-result-lead">Die Phasen werden nach dem IHK-Muster für „Errichten, Ändern, Programmieren oder Integrieren“ gewichtet. Das Ergebnis dient nur zum Üben.</p>

      <div className="talk-phase-results">
        {protokoll.phasen.map((phase) => <article key={phase.id}><span><Icon name={phase.icon} size={16} /> {phase.label}<small>{phase.gewicht}% Gewicht</small></span><b>{phase.prozent}%</b><i><em style={{ transform: `scaleX(${phase.prozent / 100})` }} /></i></article>)}
      </div>

      <section className="talk-review" aria-labelledby="talk-review-title">
        <h2 id="talk-review-title">Antworten im Detail</h2>
        {antworten.map((eintrag, index) => (
          <details key={`${eintrag.frage.id}-${index}`} open={eintrag.bewertung.prozent < 60}>
            <summary><span>{index + 1}</span><div><b>{eintrag.frage.frage}</b><small>{FACHGESPRAECH_PHASES.find((phase) => phase.id === eintrag.frage.phase)?.label}{eintrag.frage.adaptiv ? " · adaptive Nachfrage" : ""}</small></div><strong>{eintrag.bewertung.prozent}%</strong></summary>
            <div className="talk-review-body"><h3>Deine Antwort</h3><p>{eintrag.antwort}</p>{eintrag.bewertung.fehlend.length ? <><h3>Noch ergänzen</h3><ul>{eintrag.bewertung.fehlend.map((punkt) => <li key={punkt.titel}><b>{punkt.titel}:</b> {punkt.erklaerung}</li>)}</ul></> : null}<h3>Musterantwort</h3><p>{eintrag.frage.muster}</p></div>
          </details>
        ))}
      </section>

      <div className="talk-result-actions"><button className="next-btn" onClick={kopieren}><Icon name="clipboard" size={17} /> {kopiert ? "Protokoll kopiert" : "Protokoll kopieren"}</button><button className="next-btn secondary" onClick={onNochmal}>Neues Gespräch</button><button className="next-btn secondary" onClick={onLichttechnik}>Lichtechnik nachschlagen</button><button className="next-btn secondary" onClick={onHeim}>Zur Übersicht</button></div>
      <p className="talk-disclaimer">Automatische Schlüsselwort- und Kernpunktbewertung. Keine Prüfungsaussage und keine offizielle IHK-Note.</p>
    </div>
  );
}

export default function FachgespraechSimulator({ progress, onAbbrechen, onLichttechnik }) {
  const [status, setStatus] = useState("setup");
  const [szenario, setSzenario] = useState(null);
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
    const auswahl = FACHGESPRAECH_SZENARIEN.find((item) => item.id === config.szenarioId) || FACHGESPRAECH_SZENARIEN[0];
    setSzenario(auswahl);
    setKontext(config.kontext.trim());
    setFragen(erstelleFachgespraech(auswahl, config.anzahl, config.niveau));
    setZielAnzahl(Number(config.anzahl) || 5);
    setIndex(0);
    setAntwort("");
    setFeedback(null);
    setAntworten([]);
    setDauer(0);
    setAdaptivGenutzt(false);
    startRef.current = Date.now();
    setStatus("session");
  }

  function bewerten() {
    const frage = fragen[index];
    if (!frage || antwort.trim().length < 12 || feedback) return;
    const bewertung = bewerteFachantwort(antwort, frage.kernpunkte);
    const eintrag = { frage, antwort: antwort.trim(), bewertung };
    setAntworten((bisher) => [...bisher, eintrag]);
    setFeedback(bewertung);
    const karte = progress.karten.find((item) => item.i === frage.karteId);
    if (karte) progress.antwortVerbuchen(karte, bewertung.anteil >= 0.6);
    else progress.uebungVerbuchen(bewertung.anteil >= 0.6);

    if (!adaptivGenutzt) {
      const folge = adaptiveFolgefrage(frage, bewertung);
      if (folge) {
        setFragen((bisher) => [...bisher.slice(0, index + 1), folge, ...bisher.slice(index + 1)]);
        setAdaptivGenutzt(true);
      }
    }
  }

  function weiter() {
    if (index + 1 >= fragen.length) {
      setDauer(Math.floor((Date.now() - startRef.current) / 1000));
      setStatus("result");
      return;
    }
    setIndex((wert) => wert + 1);
    setAntwort("");
    setFeedback(null);
  }

  if (status === "setup") return <Setup onStart={starten} onAbbrechen={onAbbrechen} />;
  if (status === "result") return <Ergebnis szenario={szenario} antworten={antworten} dauer={dauer} onNochmal={() => setStatus("setup")} onHeim={onAbbrechen} onLichttechnik={onLichttechnik} />;

  const frage = fragen[index];
  const phase = FACHGESPRAECH_PHASES.find((item) => item.id === frage.phase);
  const angezeigteAnzahl = Math.max(zielAnzahl, fragen.length);
  return (
    <div className="talk-session">
      <div className="talk-topbar"><button className="back" onClick={onAbbrechen} aria-label="Fachgespräch abbrechen">←</button><span>Frage {index + 1} von {angezeigteAnzahl}</span><b className="talk-timer">{formatiereZeit(dauer)}</b></div>
      <div className="session-progress"><i style={{ transform: `scaleX(${(index + 1) / Math.max(1, angezeigteAnzahl)})` }} /></div>
      <div className="talk-session-grid">
        <aside className="talk-brief">
          <span>{szenario.code}</span><h2>{szenario.titel}</h2><p>{szenario.auftrag}</p>
          <ul>{szenario.daten.map((datum) => <li key={datum}>{datum}</li>)}</ul>
          {kontext ? <div><b>Dein Zusatz</b><p>{kontext}</p></div> : null}
          <small>Die Simulation bleibt thematisch bei diesem Auftrag — wie ein echtes Fachgespräch.</small>
        </aside>

        <main className="talk-question-card">
          <div className="talk-phase"><span><Icon name={phase.icon} size={17} /> {phase.label}</span><b>{phase.gewicht}% IHK-Gewichtung</b></div>
          {frage.adaptiv ? <span className="talk-adaptive"><Icon name="trend" size={14} /> Nachfrage passend zur vorherigen Antwort</span> : null}
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
          ) : <p className="talk-eval-note"><Icon name="safety" size={15} /> Bewertet wird die Abdeckung der angezeigten Fachlogik — nicht eine exakt vorgegebene Formulierung.</p>}

          <div className="talk-question-actions">
            {!feedback ? <button className="next-btn" disabled={antwort.trim().length < 12} onClick={bewerten}>Antwort auswerten</button> : <button className="next-btn" onClick={weiter}>{index + 1 >= fragen.length ? "Prüfprotokoll anzeigen" : "Nächste Prüferfrage"} <Icon name="arrow" size={17} /></button>}
          </div>
        </main>
      </div>
    </div>
  );
}
