import { useMemo, useState } from "react";
import { FACHQUELLEN } from "../data/fachquellen.js";
import { MULTIMETER_JACKS, MULTIMETER_MODES, MULTIMETER_SZENARIEN } from "../data/multimeter.js";
import { evaluateMeasurement, rangesForMode, selectedRange, simulateMeasurement } from "../lib/multimeter.js";
import Icon from "./Icon.jsx";

const LEERER_AUFBAU = { mode: "off", range: "auto", redJack: null, blackJack: null, redPoint: null, blackPoint: null, fuseOk: true };

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

function boardIcon(scenario) {
  if (scenario.visual === "socket" || scenario.visual === "distribution") return "distribution";
  if (scenario.visual === "lighting") return "light";
  if (scenario.visual === "heater") return "resistor";
  if (scenario.visual === "current") return "circuit";
  return "control";
}

function boardLabel(scenario) {
  if (scenario.visual === "socket") return "SCHUKO";
  if (scenario.visual === "distribution") return "UV / 3~";
  if (scenario.visual === "lighting") return "S1 / E1";
  if (scenario.visual === "heater") return "1 kW";
  if (scenario.visual === "current") return "MESSLÜCKE";
  return scenario.id === "knx-busspannung" ? "KNX TP" : "SELV";
}

function InstallationBoard({ scenario, setup, activeLead, onPoint, locked }) {
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
        <div className="meter-board-device" aria-hidden="true"><Icon name={boardIcon(scenario)} size={42} /><span>{boardLabel(scenario)}</span></div>
        {scenario.points.map((point) => {
          const red = setup.redPoint === point.id;
          const black = setup.blackPoint === point.id;
          return (
            <button
              key={point.id}
              className={`meter-point ${point.tone}${red ? " connected-red" : ""}${black ? " connected-black" : ""}`}
              style={{ left: `${point.x}%`, top: `${point.y}%` }}
              onClick={() => onPoint(point.id)}
              disabled={locked}
              aria-label={`${point.label}, ${point.detail}; ${activeLead === "red" ? "rote" : "schwarze"} Messspitze hier setzen`}
            >
              <i aria-hidden="true" />
              <b>{point.label}</b>
              <small>{point.detail}</small>
            </button>
          );
        })}
        <div className={`meter-probe-status ${activeLead}`}>
          <span>{locked ? "MESSUNG FIXIERT" : "AKTIVE SPITZE"}</span><b>{activeLead === "red" ? "ROT" : "SCHWARZ"}</b><small>{locked ? "Aufbau bewertet" : "Messpunkt antippen"}</small>
        </div>
      </div>
    </section>
  );
}

function DigitalMeter({ setup, result, activeLead, onLead, onJack, onMode, onRange, onFuseReset, locked }) {
  const modeIndex = Math.max(0, MULTIMETER_MODES.findIndex((mode) => mode.id === setup.mode));
  const ranges = rangesForMode(setup.mode);
  const range = selectedRange(setup.mode, setup.range);
  const rangeState = range.id === "auto" ? "AUTO RANGE" : `MANUAL · ${range.label}`;
  return (
    <section className={`digital-meter meter-state-${result.status}`} aria-label="Virtuelles Digitalmultimeter">
      <div className="meter-brand"><span>ELEKTRO</span><b>DMM / R2</b><small>CAT III · SIMULATION</small></div>
      <div className="meter-display" aria-live="polite">
        <div><span>{result.status === "danger" ? "WARNUNG" : result.status === "fuse" ? "SICHERUNG" : result.beep ? "DURCHGANG" : rangeState}</span><small>{setup.mode === "vac" || setup.mode === "aac" ? "AC" : setup.mode !== "off" ? "DC / FUNC" : "STANDBY"}</small></div>
        <strong>{result.display}</strong><b>{result.unit}</b>
        <i><em /><em /><em /></i>
      </div>
      <div className="meter-range-control" aria-label="Messbereich wählen">
        <span>MESSBEREICH</span>
        <div>{ranges.map((item) => <button key={item.id} className={range.id === item.id ? "active" : ""} onClick={() => onRange(item.id)} disabled={locked || ranges.length === 1} aria-pressed={range.id === item.id}>{item.label}</button>)}</div>
      </div>
      <div className="meter-function-label"><span>MESSFUNKTION</span><b>{MULTIMETER_MODES[modeIndex].label}</b></div>
      <div className="meter-dial" style={{ "--dial-angle": `${-120 + modeIndex * 40}deg` }}>
        <div className="meter-dial-track" aria-hidden="true" />
        {MULTIMETER_MODES.map((mode, index) => {
          const angle = -120 + index * 40;
          return <button key={mode.id} className={setup.mode === mode.id ? "active" : ""} style={{ "--angle": `${angle}deg` }} onClick={() => onMode(mode.id)} disabled={locked} aria-pressed={setup.mode === mode.id} title={mode.label}><span>{mode.short}</span></button>;
        })}
        <div className="meter-knob" aria-hidden="true"><i /></div>
      </div>
      <div className="meter-lead-select" aria-label="Messleitung auswählen">
        <button className={`black${activeLead === "black" ? " active" : ""}`} onClick={() => onLead("black")} disabled={locked} aria-pressed={activeLead === "black"}><i /> Schwarze Leitung</button>
        <button className={`red${activeLead === "red" ? " active" : ""}`} onClick={() => onLead("red")} disabled={locked} aria-pressed={activeLead === "red"}><i /> Rote Leitung</button>
      </div>
      <div className="meter-jacks" aria-label="Anschlussbuchsen">
        {MULTIMETER_JACKS.map((jack) => {
          const red = setup.redJack === jack.id;
          const black = setup.blackJack === jack.id;
          return <button key={jack.id} className={`${jack.color}${red ? " has-red" : ""}${black ? " has-black" : ""}`} onClick={() => onJack(jack.id)} disabled={locked} aria-label={`${jack.label}; ${activeLead === "red" ? "rote" : "schwarze"} Leitung hier einstecken`}><i /><b>{jack.label}</b><small>{red ? "ROT" : black ? "SCHWARZ" : "FREI"}</small></button>;
        })}
      </div>
      <div className={`meter-fuse-panel ${setup.fuseOk ? "ok" : "blown"}`}>
        <Icon name="fuse" size={17} />
        <div><span>GERÄTESICHERUNG</span><b>{setup.fuseOk ? "Betriebsbereit" : "Ausgelöst"}</b></div>
        {!setup.fuseOk ? <button onClick={onFuseReset}>Leitungen trennen & Sicherung ersetzen</button> : null}
      </div>
    </section>
  );
}

function Diagnosis({ scenario, choice, onChoose }) {
  return (
    <section className="meter-diagnosis" aria-labelledby="meter-diagnosis-title">
      <header><span><Icon name="trend" size={20} /></span><div><small>SCHRITT 2 / 2 · MESSWERTDIAGNOSE</small><h2 id="meter-diagnosis-title">{scenario.diagnosis.question}</h2></div></header>
      <div className="meter-diagnosis-options">
        {scenario.diagnosis.options.map((option, index) => {
          const selected = choice?.id === option.id;
          return <button key={option.id} className={selected ? (option.correct ? "correct" : "wrong") : ""} onClick={() => onChoose(option)} disabled={choice?.correct}><span>{String.fromCharCode(65 + index)}</span><b>{option.text}</b>{selected ? <Icon name={option.correct ? "check" : "close"} size={18} /> : null}</button>;
        })}
      </div>
      {choice ? <div className={`meter-diagnosis-feedback ${choice.correct ? "correct" : "wrong"}`} aria-live="polite"><b>{choice.correct ? "Fachlich sauber eingeordnet." : "Noch nicht präzise genug."}</b><p>{choice.explanation}</p></div> : <p className="meter-diagnosis-hint">Bewerte nur, was der konkrete Messwert im beschriebenen Zustand tatsächlich belegt.</p>}
    </section>
  );
}

function Result({ solved, attempts, logs, onRestart, onBack }) {
  const totalAttempts = Object.values(attempts).reduce((sum, value) => sum + (value.setup || 0) + (value.diagnosis || 0), 0);
  const direct = MULTIMETER_SZENARIEN.filter((scenario) => attempts[scenario.id]?.setup === 1 && attempts[scenario.id]?.diagnosis === 1).length;
  return (
    <div className="meter-result-screen">
      <span className="meter-kicker"><Icon name="multimeter" size={17} /> Laborprotokoll abgeschlossen</span>
      <div className="meter-result-hero"><div><small>REALISTISCHER MODUS</small><h1>Messung und<br /><em>Diagnose bestanden.</em></h1><p>Alle {MULTIMETER_SZENARIEN.length} Szenarien aus Energie- und Gebäudetechnik wurden sicher gelöst.</p></div><strong>{solved.length}<span>/ {MULTIMETER_SZENARIEN.length}</span></strong></div>
      <div className="meter-result-stats"><article><span>Prüfschritte</span><b>{totalAttempts}</b><small>Aufbau und Diagnose</small></article><article><span>Direkt richtig</span><b>{direct}</b><small>beide Schritte im ersten Versuch</small></article><article><span>Lernfortschritt</span><b>aktiv</b><small>XP und Fehlerheft aktualisiert</small></article></div>
      <section className="meter-result-list"><h2>Dein Messprotokoll</h2>{MULTIMETER_SZENARIEN.map((scenario, index) => {
        const entry = logs[scenario.id];
        const count = (attempts[scenario.id]?.setup || 0) + (attempts[scenario.id]?.diagnosis || 0);
        return <article key={scenario.id}><span>{String(index + 1).padStart(2, "0")}</span><div><b>{scenario.titel}</b><p>{entry ? `${entry.display} ${entry.unit} · ${entry.range}` : scenario.erfolg}</p></div><strong>{count} Prüfschritte</strong></article>;
      })}</section>
      <div className="meter-result-actions"><button className="next-btn" onClick={onRestart}>Labor wiederholen</button><button className="next-btn secondary" onClick={onBack}>Zur Übersicht</button></div>
    </div>
  );
}

export default function MultimeterLab({ progress, onAbbrechen }) {
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [setup, setSetup] = useState(LEERER_AUFBAU);
  const [activeLead, setActiveLead] = useState("red");
  const [feedback, setFeedback] = useState(null);
  const [diagnosisChoice, setDiagnosisChoice] = useState(null);
  const [step, setStep] = useState("setup");
  const [solved, setSolved] = useState([]);
  const [attempts, setAttempts] = useState({});
  const [logs, setLogs] = useState({});
  const [status, setStatus] = useState("lab");
  const scenario = MULTIMETER_SZENARIEN[scenarioIndex];
  const result = useMemo(() => simulateMeasurement(scenario, setup), [scenario, setup]);
  const sources = scenario.quellenIds.map((id) => FACHQUELLEN.find((source) => source.id === id)).filter(Boolean);
  const locked = step !== "setup";

  function recordProgress(correct) {
    const card = progress.karten.find((item) => item.i === scenario.cardId);
    if (card) progress.antwortVerbuchen(card, correct);
    else progress.uebungVerbuchen(correct);
  }

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
    setAttempts((current) => ({ ...current, [scenario.id]: { ...current[scenario.id], setup: (current[scenario.id]?.setup || 0) + 1 } }));
    if (result.status === "danger" && (setup.mode === "aac" || setup.mode === "adc") && (setup.redJack === "ma" || setup.redJack === "10a")) {
      setSetup((current) => ({ ...current, fuseOk: false }));
    }
    if (!evaluation.correct) {
      recordProgress(false);
      setFeedback(evaluation);
      return;
    }
    if (result.beep) playContinuityTone();
    const range = selectedRange(setup.mode, setup.range);
    setLogs((current) => ({ ...current, [scenario.id]: { display: result.display, unit: result.unit, range: range.label, mode: setup.mode } }));
    setFeedback(null);
    setStep("diagnosis");
  }

  function chooseDiagnosis(option) {
    if (diagnosisChoice?.correct) return;
    setAttempts((current) => ({ ...current, [scenario.id]: { ...current[scenario.id], diagnosis: (current[scenario.id]?.diagnosis || 0) + 1 } }));
    setDiagnosisChoice(option);
    recordProgress(option.correct);
    if (option.correct) {
      setSolved((current) => current.includes(scenario.id) ? current : [...current, scenario.id]);
      setStep("complete");
    }
  }

  function replaceFuse() {
    setSetup((current) => ({ ...current, redJack: null, blackJack: null, redPoint: null, blackPoint: null, fuseOk: true }));
    setActiveLead("red");
    setFeedback(null);
  }

  function nextScenario() {
    if (scenarioIndex + 1 >= MULTIMETER_SZENARIEN.length) setStatus("result");
    else {
      setScenarioIndex((index) => index + 1);
      setSetup(LEERER_AUFBAU);
      setFeedback(null);
      setDiagnosisChoice(null);
      setStep("setup");
      setActiveLead("red");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  function restart() {
    setScenarioIndex(0); setSetup(LEERER_AUFBAU); setFeedback(null); setDiagnosisChoice(null); setStep("setup"); setSolved([]); setAttempts({}); setLogs({}); setActiveLead("red"); setStatus("lab");
  }

  if (status === "result") return <Result solved={solved} attempts={attempts} logs={logs} onRestart={restart} onBack={onAbbrechen} />;

  const logEntries = MULTIMETER_SZENARIEN.filter((item) => logs[item.id]).map((item) => ({ ...logs[item.id], titel: item.titel }));

  return (
    <div className={`meter-lab meter-lab-${result.status}`}>
      <div className="meter-topbar"><button className="back" onClick={onAbbrechen} aria-label="Multimeter-Labor verlassen">←</button><span>Virtuelles Multimeter · Realistischer Modus</span><b>AUFGABE {scenarioIndex + 1} / {MULTIMETER_SZENARIEN.length}</b></div>
      <div className="session-progress"><i style={{ transform: `scaleX(${(scenarioIndex + 1) / MULTIMETER_SZENARIEN.length})` }} /></div>
      <section className="meter-brief">
        <div className="meter-brief-number">{String(scenarioIndex + 1).padStart(2, "0")}</div>
        <div><span>{scenario.code} · ENERGIE- UND GEBÄUDETECHNIK</span><h1>{scenario.titel}</h1><p>{scenario.auftrag}</p></div>
        <aside><small>AUSGANGSLAGE</small><b>{scenario.kontext}</b><div className="meter-stepper"><span className={step === "setup" ? "active" : "done"}>01 Aufbau</span><span className={step === "diagnosis" ? "active" : step === "complete" ? "done" : ""}>02 Diagnose</span></div></aside>
      </section>

      <div className="meter-workbench">
        <InstallationBoard scenario={scenario} setup={setup} activeLead={activeLead} onPoint={connectPoint} locked={locked} />
        <DigitalMeter setup={setup} result={result} activeLead={activeLead} onLead={setActiveLead} onJack={connectJack} onMode={(mode) => updateSetup({ mode, range: "auto" })} onRange={(range) => updateSetup({ range })} onFuseReset={replaceFuse} locked={locked} />
      </div>

      <section className={`meter-live-feedback ${result.status}`} aria-live="polite">
        <span><Icon name={result.status === "danger" || result.status === "fuse" ? "warning" : result.status === "reading" ? "trend" : "multimeter"} size={19} /></span>
        <div><small>{result.status === "danger" ? "SICHERHEITSSTOPP" : result.status === "fuse" ? "GERÄTESCHUTZ" : result.status === "overload" ? "MESSBEREICH" : "LIVE-DIAGNOSE"}</small><h2>{result.title}</h2><p>{result.explanation}</p></div>
        <div className="meter-connection-readout"><span>ROT</span><b>{setup.redJack ? MULTIMETER_JACKS.find((jack) => jack.id === setup.redJack)?.label : "—"} / {scenario.points.find((point) => point.id === setup.redPoint)?.label || "—"}</b><span>SCHWARZ</span><b>{setup.blackJack ? MULTIMETER_JACKS.find((jack) => jack.id === setup.blackJack)?.label : "—"} / {scenario.points.find((point) => point.id === setup.blackPoint)?.label || "—"}</b></div>
      </section>

      {step === "diagnosis" ? <Diagnosis scenario={scenario} choice={diagnosisChoice} onChoose={chooseDiagnosis} /> : step === "complete" ? (
        <section className="meter-check-result correct" aria-live="polite">
          <span><Icon name="check" size={22} /></span>
          <div><h2>Messung vollständig bestanden.</h2><p>{scenario.erfolg}</p><small>+10 XP · Messwert und Diagnose im Laborprotokoll gespeichert</small></div>
          <button className="next-btn" onClick={nextScenario}>{scenarioIndex + 1 >= MULTIMETER_SZENARIEN.length ? "Protokoll anzeigen" : "Nächste Messung"} <Icon name="arrow" size={17} /></button>
        </section>
      ) : feedback ? (
        <section className="meter-check-result wrong" aria-live="polite">
          <span><Icon name="close" size={22} /></span>
          <div><h2>Messaufbau noch nicht freigegeben.</h2><ul>{feedback.issues.map((issue) => <li key={issue}>{issue}</li>)}</ul></div>
        </section>
      ) : (
        <div className="meter-check-row"><p><Icon name="safety" size={16} /> Simulation für Elektrofachkräfte und Ausbildung. Kein Ersatz für Freigabe, Gefährdungsbeurteilung oder geeignetes Prüfgerät.</p><button className="next-btn" onClick={check}>Schritt 1 · Aufbau bewerten</button></div>
      )}

      {logEntries.length ? <section className="meter-log-strip"><span><Icon name="clipboard" size={17} /> MESSPROTOKOLL · {logEntries.length}/{MULTIMETER_SZENARIEN.length}</span><div>{logEntries.slice(-4).map((entry) => <article key={entry.titel}><b>{entry.titel}</b><strong>{entry.display} {entry.unit}</strong><small>{entry.range}</small></article>)}</div></section> : null}

      <section className="meter-practice-note"><Icon name="book" size={18} /><div><b>Praxisgrenze</b><p>{scenario.praxis}</p><span>{sources.map((source) => <a key={source.id} href={source.url} target="_blank" rel="noreferrer">{source.herausgeber} · Quelle öffnen</a>)}</span></div></section>
    </div>
  );
}
