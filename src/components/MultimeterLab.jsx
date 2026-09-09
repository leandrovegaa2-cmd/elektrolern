import { useMemo, useState } from "react";
import { FACHQUELLEN } from "../data/fachquellen.js";
import { MULTIMETER_JACKS, MULTIMETER_MODES, MULTIMETER_SZENARIEN } from "../data/multimeter.js";
import { evaluateMeasurement, simulateMeasurement } from "../lib/multimeter.js";
import Icon from "./Icon.jsx";

const LEERER_AUFBAU = { mode: "off", redJack: null, blackJack: null, redPoint: null, blackPoint: null };

function playContinuityTone() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  const audio = new AudioContext();
  const oscillator = audio.createOscillator();
  const gain = audio.createGain();
  oscillator.frequency.value = 1850;
  gain.gain.setValueAtTime(0.055, audio.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.16);
  oscillator.connect(gain).connect(audio.destination);
  oscillator.start();
  oscillator.stop(audio.currentTime + 0.16);
  oscillator.addEventListener("ended", () => audio.close());
}

function InstallationBoard({ scenario, setup, activeLead, onPoint }) {
  const pointById = Object.fromEntries(scenario.points.map((point) => [point.id, point]));
  return (
    <section className={`meter-board meter-board-${scenario.visual}`} aria-labelledby="meter-installation-title">
      <header>
        <span>ANLAGE / {scenario.code}</span>
        <b id="meter-installation-title">Messpunkte</b>
        <small className={scenario.energized ? "live" : "safe"}>{scenario.supply}</small>
      </header>
      <div className="meter-board-stage">
        <div className="meter-board-grid" aria-hidden="true" />
        <svg className="meter-schematic" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {scenario.wires.map(([from, to], index) => {
            const a = pointById[from]; const b = pointById[to];
            return <line key={`${from}-${to}-${index}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} />;
          })}
        </svg>
        <div className="meter-board-device" aria-hidden="true"><Icon name={scenario.visual === "socket" ? "distribution" : scenario.visual === "lighting" ? "light" : scenario.visual === "heater" ? "resistor" : scenario.visual === "current" ? "circuit" : "control"} size={42} /><span>{scenario.visual === "socket" ? "SCHUKO" : scenario.visual === "lighting" ? "S1 / E1" : scenario.visual === "heater" ? "1 kW" : scenario.visual === "current" ? "MESSLÜCKE" : "SELV"}</span></div>
        {scenario.points.map((point) => {
          const red = setup.redPoint === point.id;
          const black = setup.blackPoint === point.id;
          return (
            <button
              key={point.id}
              className={`meter-point ${point.tone}${red ? " connected-red" : ""}${black ? " connected-black" : ""}`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              onClick={() => onPoint(point.id)}
              aria-label={`${point.label}, ${point.detail}; ${activeLead === "red" ? "rote" : "schwarze"} Messspitze hier setzen`}
            >
              <i aria-hidden="true" />
              <b>{point.label}</b>
              <small>{point.detail}</small>
            </button>
          );
        })}
        <div className={`meter-probe-status ${activeLead}`}>
          <span>AKTIVE SPITZE</span><b>{activeLead === "red" ? "ROT" : "SCHWARZ"}</b><small>Messpunkt antippen</small>
        </div>
      </div>
    </section>
  );
}

function DigitalMeter({ setup, result, activeLead, onLead, onJack, onMode }) {
  const modeIndex = Math.max(0, MULTIMETER_MODES.findIndex((mode) => mode.id === setup.mode));
  return (
    <section className={`digital-meter meter-state-${result.status}`} aria-label="Virtuelles Digitalmultimeter">
      <div className="meter-brand"><span>ELEKTRO</span><b>DMM / R1</b><small>CAT III · SIMULATION</small></div>
      <div className="meter-display" aria-live="polite">
        <div><span>{result.status === "danger" ? "WARNUNG" : result.beep ? "DURCHGANG" : "AUTO RANGE"}</span><small>{setup.mode === "vac" || setup.mode === "aac" ? "AC" : setup.mode !== "off" ? "DC / FUNC" : "STANDBY"}</small></div>
        <strong>{result.display}</strong><b>{result.unit}</b>
        <i><em /><em /><em /></i>
      </div>
      <div className="meter-function-label"><span>MESSFUNKTION</span><b>{MULTIMETER_MODES[modeIndex].label}</b></div>
      <div className="meter-dial" style={{ "--dial-angle": `${-120 + modeIndex * 40}deg` }}>
        <div className="meter-dial-track" aria-hidden="true" />
        {MULTIMETER_MODES.map((mode, index) => {
          const angle = -120 + index * 40;
          return <button key={mode.id} className={setup.mode === mode.id ? "active" : ""} style={{ "--angle": `${angle}deg` }} onClick={() => onMode(mode.id)} aria-pressed={setup.mode === mode.id} title={mode.label}><span>{mode.short}</span></button>;
        })}
        <div className="meter-knob" aria-hidden="true"><i /></div>
      </div>
      <div className="meter-lead-select" aria-label="Messleitung auswählen">
        <button className={`black${activeLead === "black" ? " active" : ""}`} onClick={() => onLead("black")} aria-pressed={activeLead === "black"}><i /> Schwarze Leitung</button>
        <button className={`red${activeLead === "red" ? " active" : ""}`} onClick={() => onLead("red")} aria-pressed={activeLead === "red"}><i /> Rote Leitung</button>
      </div>
      <div className="meter-jacks" aria-label="Anschlussbuchsen">
        {MULTIMETER_JACKS.map((jack) => {
          const red = setup.redJack === jack.id;
          const black = setup.blackJack === jack.id;
          return <button key={jack.id} className={`${jack.color}${red ? " has-red" : ""}${black ? " has-black" : ""}`} onClick={() => onJack(jack.id)} aria-label={`${jack.label}; ${activeLead === "red" ? "rote" : "schwarze"} Leitung hier einstecken`}><i /><b>{jack.label}</b><small>{red ? "ROT" : black ? "SCHWARZ" : "FREI"}</small></button>;
        })}
      </div>
    </section>
  );
}

function Result({ solved, attempts, onRestart, onBack }) {
  const totalAttempts = Object.values(attempts).reduce((sum, value) => sum + value, 0);
  const direct = MULTIMETER_SZENARIEN.filter((scenario) => attempts[scenario.id] === 1).length;
  return (
    <div className="meter-result-screen">
      <span className="meter-kicker"><Icon name="multimeter" size={17} /> Laborprotokoll abgeschlossen</span>
      <div className="meter-result-hero"><div><small>REALISTISCHER MODUS</small><h1>Messaufbau<br /><em>bestanden.</em></h1><p>Alle fünf Gebäudetechnik-Szenarien wurden sicher gelöst.</p></div><strong>{solved.length}<span>/ 5</span></strong></div>
      <div className="meter-result-stats"><article><span>Versuche</span><b>{totalAttempts}</b><small>einschließlich Korrekturen</small></article><article><span>Direkt richtig</span><b>{direct}</b><small>ohne Fehlversuch</small></article><article><span>Lernfortschritt</span><b>aktiv</b><small>XP und Fehlerheft aktualisiert</small></article></div>
      <section className="meter-result-list"><h2>Dein Messprotokoll</h2>{MULTIMETER_SZENARIEN.map((scenario, index) => <article key={scenario.id}><span>0{index + 1}</span><div><b>{scenario.titel}</b><p>{scenario.erfolg}</p></div><strong>{attempts[scenario.id]} {attempts[scenario.id] === 1 ? "Versuch" : "Versuche"}</strong></article>)}</section>
      <div className="meter-result-actions"><button className="next-btn" onClick={onRestart}>Labor wiederholen</button><button className="next-btn secondary" onClick={onBack}>Zur Übersicht</button></div>
    </div>
  );
}

export default function MultimeterLab({ progress, onAbbrechen }) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [setup, setSetup] = useState(LEERER_AUFBAU);
  const [activeLead, setActiveLead] = useState("red");
  const [feedback, setFeedback] = useState(null);
  const [solved, setSolved] = useState([]);
  const [attempts, setAttempts] = useState({});
  const [status, setStatus] = useState("lab");
  const scenario = MULTIMETER_SZENARIEN[scenarioIndex];
  const result = useMemo(() => simulateMeasurement(scenario, setup), [scenario, setup]);
  const sources = scenario.quellenIds.map((id) => FACHQUELLEN.find((source) => source.id === id)).filter(Boolean);

  function updateSetup(change) {
    setSetup((current) => ({ ...current, ...change }));
    setFeedback(null);
  }

  function connectJack(jackId) {
    setSetup((current) => {
      const next = { ...current };
      if (activeLead === "red") {
        next.redJack = jackId;
        if (next.blackJack === jackId) next.blackJack = null;
      } else {
        next.blackJack = jackId;
        if (next.redJack === jackId) next.redJack = null;
      }
      return next;
    });
    setFeedback(null);
  }

  function connectPoint(pointId) {
    updateSetup(activeLead === "red" ? { redPoint: pointId } : { blackPoint: pointId });
  }

  function check() {
    const evaluation = evaluateMeasurement(scenario, setup, result);
    const nextAttempts = (attempts[scenario.id] || 0) + 1;
    setAttempts((current) => ({ ...current, [scenario.id]: nextAttempts }));
    const card = progress.karten.find((item) => item.i === scenario.cardId);
    if (card) progress.antwortVerbuchen(card, evaluation.correct);
    else progress.uebungVerbuchen(evaluation.correct);
    if (evaluation.correct && result.beep) playContinuityTone();
    if (evaluation.correct) setSolved((current) => current.includes(scenario.id) ? current : [...current, scenario.id]);
    setFeedback(evaluation);
  }

  function nextScenario() {
    if (scenarioIndex + 1 >= MULTIMETER_SZENARIEN.length) setStatus("result");
    else {
      setScenarioIndex((index) => index + 1);
      setSetup(LEERER_AUFBAU);
      setFeedback(null);
      setActiveLead("red");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function restart() {
    setScenarioIndex(0); setSetup(LEERER_AUFBAU); setFeedback(null); setSolved([]); setAttempts({}); setActiveLead("red"); setStatus("lab");
  }

  if (status === "result") return <Result solved={solved} attempts={attempts} onRestart={restart} onBack={onAbbrechen} />;

  return (
    <div className={`meter-lab meter-lab-${result.status}`}>
      <div className="meter-topbar"><button className="back" onClick={onAbbrechen} aria-label="Multimeter-Labor verlassen">←</button><span>Virtuelles Multimeter · Realistischer Modus</span><b>AUFGABE {scenarioIndex + 1} / {MULTIMETER_SZENARIEN.length}</b></div>
      <div className="session-progress"><i style={{ transform: `scaleX(${(scenarioIndex + 1) / MULTIMETER_SZENARIEN.length})` }} /></div>
      <section className="meter-brief">
        <div className="meter-brief-number">0{scenarioIndex + 1}</div>
        <div><span>{scenario.code} · ENERGIE- UND GEBÄUDETECHNIK</span><h1>{scenario.titel}</h1><p>{scenario.auftrag}</p></div>
        <aside><small>AUSGANGSLAGE</small><b>{scenario.kontext}</b></aside>
      </section>

      <div className="meter-workbench">
        <InstallationBoard scenario={scenario} setup={setup} activeLead={activeLead} onPoint={connectPoint} />
        <DigitalMeter setup={setup} result={result} activeLead={activeLead} onLead={setActiveLead} onJack={connectJack} onMode={(mode) => updateSetup({ mode })} />
      </div>

      <section className={`meter-live-feedback ${result.status}`} aria-live="polite">
        <span><Icon name={result.status === "danger" ? "warning" : result.status === "reading" ? "trend" : "multimeter"} size={19} /></span>
        <div><small>{result.status === "danger" ? "SICHERHEITSSTOPP" : "LIVE-DIAGNOSE"}</small><h2>{result.title}</h2><p>{result.explanation}</p></div>
        <div className="meter-connection-readout"><span>ROT</span><b>{setup.redJack ? MULTIMETER_JACKS.find((jack) => jack.id === setup.redJack)?.label : "—"} / {scenario.points.find((point) => point.id === setup.redPoint)?.label || "—"}</b><span>SCHWARZ</span><b>{setup.blackJack ? MULTIMETER_JACKS.find((jack) => jack.id === setup.blackJack)?.label : "—"} / {scenario.points.find((point) => point.id === setup.blackPoint)?.label || "—"}</b></div>
      </section>

      {feedback ? (
        <section className={`meter-check-result ${feedback.correct ? "correct" : "wrong"}`} aria-live="polite">
          <span><Icon name={feedback.correct ? "check" : "close"} size={22} /></span>
          <div><h2>{feedback.correct ? "Messaufbau korrekt." : "Messaufbau noch nicht freigegeben."}</h2>{feedback.correct ? <><p>{scenario.erfolg}</p><small>+10 XP · Szenario im Laborprotokoll gespeichert</small></> : <ul>{feedback.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul>}</div>
          {feedback.correct ? <button className="next-btn" onClick={nextScenario}>{scenarioIndex + 1 >= MULTIMETER_SZENARIEN.length ? "Protokoll anzeigen" : "Nächste Messung"} <Icon name="arrow" size={17} /></button> : null}
        </section>
      ) : (
        <div className="meter-check-row"><p><Icon name="safety" size={16} /> Simulation für ausgebildete Elektrofachkräfte und Ausbildung. Kein Ersatz für Freigabe, Gefährdungsbeurteilung oder geeignetes Prüfgerät.</p><button className="next-btn" onClick={check}>Messaufbau bewerten</button></div>
      )}

      <section className="meter-practice-note"><Icon name="book" size={18} /><div><b>Praxisgrenze</b><p>{scenario.praxis}</p><span>{sources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.herausgeber} · Quelle öffnen</a>)}</span></div></section>
    </div>
  );
}
