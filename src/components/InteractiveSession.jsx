import { useMemo, useState } from "react";
import { INTERAKTIVE_AUFGABEN } from "../data/interaktiveAufgaben.js";
import { FACHQUELLEN } from "../data/fachquellen.js";
import Icon from "./Icon.jsx";

function verschoben(liste) {
  if (liste.length < 2) return [...liste];
  return [...liste.slice(1), liste[0]];
}

function Task({ aufgabe, nummer, gesamt, onBewertet, onAbbrechen }) {
  const [reihenfolge, setReihenfolge] = useState(() => verschoben(aufgabe.elemente || []));
  const [zuordnung, setZuordnung] = useState({});
  const [geprueft, setGeprueft] = useState(false);
  const [richtig, setRichtig] = useState(false);
  const quelle = FACHQUELLEN.find((q) => q.id === aufgabe.quelle);
  const optionen = useMemo(() => verschoben((aufgabe.paare || []).map((paar) => paar[1])), [aufgabe]);

  function bewegen(index, richtung) {
    if (geprueft) return;
    const ziel = index + richtung;
    if (ziel < 0 || ziel >= reihenfolge.length) return;
    const next = [...reihenfolge];
    [next[index], next[ziel]] = [next[ziel], next[index]];
    setReihenfolge(next);
  }

  function pruefen() {
    const korrekt = aufgabe.typ === "reihenfolge"
      ? reihenfolge.every((item, i) => item === aufgabe.elemente[i])
      : aufgabe.paare.every(([links, rechts]) => zuordnung[links] === rechts);
    setRichtig(korrekt);
    setGeprueft(true);
    onBewertet(korrekt, false);
  }

  const vollstaendig = aufgabe.typ === "reihenfolge" || aufgabe.paare.every(([links]) => zuordnung[links]);

  return (
    <div className="interactive-shell">
      <div className="session-top">
        <button className="back" onClick={onAbbrechen} aria-label="Interaktive Übung abbrechen">←</button>
        <span>Aufgabe {nummer} von {gesamt}</span>
        <span className="task-type"><Icon name={aufgabe.typ === "reihenfolge" ? "layers" : "circuit"} size={16} /> {aufgabe.typ === "reihenfolge" ? "Reihenfolge" : "Zuordnung"}</span>
      </div>
      <div className="session-progress"><i style={{ transform: `scaleX(${nummer / gesamt})` }} /></div>
      <section className="interactive-card">
        <span className="screen-code">INTERAKTIV / {aufgabe.typ === "reihenfolge" ? "SORTIEREN" : "VERKNÜPFEN"}</span>
        <h1>{aufgabe.titel}</h1>
        <p>{aufgabe.frage}</p>

        {aufgabe.typ === "reihenfolge" ? (
          <ol className="sort-list">
            {reihenfolge.map((item, index) => (
              <li key={item} className={geprueft ? (item === aufgabe.elemente[index] ? "correct" : "wrong") : ""}>
                <b>{index + 1}</b><span>{item}</span>
                <div>
                  <button onClick={() => bewegen(index, -1)} disabled={index === 0 || geprueft} aria-label={`${item} nach oben`}>↑</button>
                  <button onClick={() => bewegen(index, 1)} disabled={index === reihenfolge.length - 1 || geprueft} aria-label={`${item} nach unten`}>↓</button>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <div className="match-list">
            {aufgabe.paare.map(([links, rechts]) => (
              <label key={links} className={geprueft ? (zuordnung[links] === rechts ? "correct" : "wrong") : ""}>
                <span>{links}</span>
                <select value={zuordnung[links] || ""} disabled={geprueft} onChange={(e) => setZuordnung((z) => ({ ...z, [links]: e.target.value }))}>
                  <option value="">Zuordnung wählen</option>
                  {optionen.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
                {geprueft && zuordnung[links] !== rechts ? <small>Richtig: {rechts}</small> : null}
              </label>
            ))}
          </div>
        )}

        {geprueft ? (
          <div className={"interactive-feedback " + (richtig ? "good" : "bad")} role="status">
            <Icon name={richtig ? "check" : "close"} size={18} />
            <span><b>{richtig ? "Richtig gelöst." : "Noch nicht ganz."}</b> {richtig ? "Die Verknüpfungen sitzen." : "Die richtige Lösung ist markiert."}</span>
          </div>
        ) : null}

        <div className="task-source">Grundlage: {quelle?.titel}</div>
        {!geprueft ? (
          <button className="next-btn" disabled={!vollstaendig} onClick={pruefen}>Lösung prüfen</button>
        ) : (
          <button className="next-btn" onClick={() => onBewertet(richtig, true)}>{nummer === gesamt ? "Auswertung anzeigen" : "Nächste Aufgabe"}</button>
        )}
      </section>
    </div>
  );
}

export default function InteractiveSession({ progress, onAbbrechen, onErgebnis }) {
  const [index, setIndex] = useState(0);
  const [punkte, setPunkte] = useState(0);
  const [antworten, setAntworten] = useState([]);

  function onBewertet(richtig, weiter) {
    if (!weiter) {
      setPunkte((p) => p + (richtig ? 1 : 0));
      setAntworten((a) => [...a, richtig]);
      progress.uebungVerbuchen(richtig);
      return;
    }
    if (index + 1 >= INTERAKTIVE_AUFGABEN.length) {
      onErgebnis({ typ: "interaktiv", punkte, fragen: INTERAKTIVE_AUFGABEN, antworten });
    } else {
      setIndex((i) => i + 1);
    }
  }

  return <Task key={INTERAKTIVE_AUFGABEN[index].id} aufgabe={INTERAKTIVE_AUFGABEN[index]} nummer={index + 1} gesamt={INTERAKTIVE_AUFGABEN.length} onBewertet={onBewertet} onAbbrechen={onAbbrechen} />;
}

