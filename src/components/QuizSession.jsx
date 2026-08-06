import { useEffect, useMemo, useRef, useState } from "react";
import { mischen } from "../lib/random.js";
import FormattedAnswer from "./FormattedAnswer.jsx";
import Diagram from "./Diagram.jsx";

export default function QuizSession({ progress, gewaehltesLJ, gewaehltesLF, onAbbrechen, onErgebnis }) {
  const fragen = useMemo(() => {
    const pool = progress.kartenVon(gewaehltesLJ, gewaehltesLF).filter((k) => k.m);
    return mischen(pool).slice(0, 10);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [index, setIndex] = useState(0);
  const [punkte, setPunkte] = useState(0);
  const [optionen, setOptionen] = useState(null);
  const [beantwortet, setBeantwortet] = useState(false);
  const [gewaehlt, setGewaehlt] = useState(null);
  const falscheRef = useRef([]);

  const fertig = index >= fragen.length;

  useEffect(() => {
    if (fragen.length === 0) {
      onAbbrechen();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!fertig) {
      const k = fragen[index];
      setOptionen(mischen(k.m.map((text, idx) => ({ text, richtig: idx === 0 }))));
      setBeantwortet(false);
      setGewaehlt(null);
    } else {
      progress.streakUpdaten();
      onErgebnis({ typ: "quiz", punkte, fragen, falscheKarten: falscheRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, fertig]);

  const k = fertig ? null : fragen[index];

  function waehle(idx) {
    if (beantwortet || !optionen || idx >= optionen.length) return;
    setBeantwortet(true);
    setGewaehlt(idx);
    const richtig = optionen[idx].richtig;
    if (richtig) setPunkte((p) => p + 1);
    else if (!falscheRef.current.some((f) => f.i === k.i)) falscheRef.current.push(k);
    progress.antwortVerbuchen(k, richtig);
  }

  // Tastatur: 1-4 waehlt eine Antwort, Enter/Leertaste geht weiter.
  useEffect(() => {
    function onKeyDown(e) {
      if (fertig || !optionen) return;
      if (!beantwortet && /^[1-4]$/.test(e.key)) {
        e.preventDefault();
        waehle(Number(e.key) - 1);
      } else if (beantwortet && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        setIndex((i) => i + 1);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beantwortet, optionen, fertig]);

  if (fertig || !optionen) return null;

  const pz = Math.round((index / fragen.length) * 100);

  return (
    <>
      <div className="topbar">
        <button className="back" onClick={onAbbrechen}>
          ← Abbrechen
        </button>
        <span className="counter">
          {index + 1} / {fragen.length} · {punkte} ✓
        </span>
      </div>
      <div className="progress">
        <i style={{ transform: `scaleX(${pz / 100})` }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <span className="lf-badge">
          Lehrjahr {k.j} · {k.lf}
        </span>
      </div>
      <div className="quiz-q">{k.f}</div>
      {k.dia ? <Diagram name={k.dia} /> : null}
      {optionen.map((o, idx) => {
        let cls = "opt";
        if (beantwortet) {
          if (o.richtig) cls += " correct";
          else if (idx === gewaehlt) cls += " wrong";
          else cls += " faded";
        }
        return (
          <button key={idx} className={cls} disabled={beantwortet} onClick={() => waehle(idx)}>
            {o.text}
          </button>
        );
      })}
      <div aria-live="polite">
        {beantwortet ? (
          <>
            <div className="quiz-erkl">
              <FormattedAnswer karte={k} />
            </div>
            <button className="next-btn" onClick={() => setIndex((i) => i + 1)}>
              {optionen[gewaehlt]?.richtig ? "Richtig! Weiter →" : "Weiter →"}
            </button>
          </>
        ) : null}
      </div>
    </>
  );
}
