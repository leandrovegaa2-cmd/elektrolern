import { useEffect, useMemo, useRef, useState } from "react";
import { mischen } from "../lib/random.js";
import FormattedAnswer from "./FormattedAnswer.jsx";
import Diagram from "./Diagram.jsx";
import Icon from "./Icon.jsx";

const MAX_ZUSATZ = 8; // wie oft falsche Karten max. wieder angehängt werden

export default function FlashcardSession({
  progress,
  gewaehltesLJ,
  gewaehltesLF,
  erzwingeUeben,
  kartenOverride,
  onAbbrechen,
  onErgebnis,
}) {
  const startQueue = useMemo(() => {
    if (kartenOverride && kartenOverride.length) {
      return mischen(kartenOverride).slice(0, 15);
    }
    let karten = progress.faelligVon(gewaehltesLJ, gewaehltesLF);
    if (!karten.length && !erzwingeUeben) {
      karten = progress.neuVon(gewaehltesLJ, gewaehltesLF);
    }
    if (!karten.length || erzwingeUeben) {
      karten = progress.kartenVon(gewaehltesLJ, gewaehltesLF);
    }
    return mischen(karten).slice(0, 15);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [queue, setQueue] = useState(startQueue);
  const [index, setIndex] = useState(0);
  const [aufgedeckt, setAufgedeckt] = useState(false);
  const [richtig, setRichtig] = useState(0);
  const [falsch, setFalsch] = useState(0);
  // Karten, die in dieser Session mindestens einmal danebengingen — Grundlage für
  // "Die falschen nochmal" auf dem Ergebnis-Screen.
  const falscheRef = useRef([]);
  const gesamtRef = useRef(startQueue.length);
  const swipeStartX = useRef(null);
  const cardRef = useRef(null);

  const fertig = index >= queue.length;

  useEffect(() => {
    if (fertig) {
      progress.streakUpdaten();
      onErgebnis({ typ: "flash", richtig, falsch, falscheKarten: falscheRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fertig]);

  // Karte automatisch fokussieren, sobald eine neue erscheint oder aufgedeckt
  // wird — sonst wären Leertaste/Pfeiltasten erst nach einem Mausklick aktiv.
  useEffect(() => {
    if (!fertig) cardRef.current?.focus();
  }, [aufgedeckt, index, fertig]);

  if (fertig) return null;

  const karte = queue[index];
  const pz = Math.round((index / queue.length) * 100);

  function beantwortet(gewusst) {
    progress.antwortVerbuchen(karte, gewusst);
    if (gewusst) {
      setRichtig((r) => r + 1);
    } else {
      setFalsch((f) => f + 1);
      if (!falscheRef.current.some((k) => k.i === karte.i)) falscheRef.current.push(karte);
      setQueue((q) => (q.length < gesamtRef.current + MAX_ZUSATZ ? [...q, karte] : q));
    }
    setIndex((i) => i + 1);
    setAufgedeckt(false);
  }

  function aufdecken() {
    setAufgedeckt(true);
  }

  function onKeyDown(e) {
    if (!aufgedeckt) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        aufdecken();
      }
      return;
    }
    if (e.key === "ArrowRight") beantwortet(true);
    else if (e.key === "ArrowLeft") beantwortet(false);
  }

  function onTouchStart(e) {
    swipeStartX.current = e.changedTouches[0].clientX;
  }
  function onTouchEnd(e) {
    if (swipeStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - swipeStartX.current;
    swipeStartX.current = null;
    if (Math.abs(dx) > 60) beantwortet(dx > 0);
  }

  return (
    <>
      <div className="topbar">
        <button className="back" onClick={onAbbrechen}>
          ← Abbrechen
        </button>
        <span className="counter session-counter">
          <small>SESSION</small> {String(index + 1).padStart(2, "0")} / {String(queue.length).padStart(2, "0")}
        </span>
      </div>
      <div className="progress">
        <i style={{ transform: `scaleX(${pz / 100})` }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <span className="lf-badge">
          Lehrjahr {karte.j} · {karte.lf}
        </span>
      </div>

      {!aufgedeckt ? (
        <div
          className="flashcard"
          ref={cardRef}
          tabIndex={0}
          role="button"
          aria-label="Karte antippen oder Leertaste drücken, um die Antwort aufzudecken"
          onClick={aufdecken}
          onKeyDown={onKeyDown}
        >
          <div>
            <div className="q">{karte.f}</div>
            {karte.dia ? <Diagram name={karte.dia} /> : null}
            <div className="tap-hint"><Icon name="target" size={14} /> Tippen oder Leertaste zum Aufdecken</div>
          </div>
        </div>
      ) : (
        <>
          <div
            className="flashcard flip"
            ref={cardRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            aria-live="polite"
          >
            <div>
              <div className="q-small">{karte.f}</div>
              <div className="divider" />
              <div className="a">
                <FormattedAnswer karte={karte} />
              </div>
            </div>
          </div>
          <div className="swipe-hint">← wischen/Pfeiltaste: nicht gewusst · gewusst: wischen/Pfeiltaste →</div>
        </>
      )}

      <div className="action-bar">
        {!aufgedeckt ? (
          <button className="next-btn" onClick={aufdecken}>
            <span>Antwort zeigen</span><i aria-hidden="true">→</i>
          </button>
        ) : (
          <div className="answer-row">
            <button className="btn-bad" onClick={() => beantwortet(false)}>
              <Icon name="close" size={17} /> Nicht gewusst
            </button>
            <button className="btn-ok" onClick={() => beantwortet(true)}>
              <Icon name="check" size={17} /> Gewusst
            </button>
          </div>
        )}
      </div>
    </>
  );
}
