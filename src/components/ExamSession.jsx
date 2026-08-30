import { useEffect, useMemo, useRef, useState } from "react";
import { pruefMix, istFrageKorrekt, istBeantwortet, PRUEF_ANZAHL, PRUEF_RECHNEN, PRUEF_MINUTEN } from "../lib/exam.js";
import { mischen } from "../lib/random.js";
import TabBar from "./TabBar.jsx";
import Icon from "./Icon.jsx";

export default function ExamSession({ progress, onAbbrechen, onErgebnis, onTabWechsel }) {
  const fragen = useMemo(() => {
    const alle = progress.kartenVon(0);
    const roh = pruefMix(
      alle.filter((k) => k.m),
      alle.filter((k) => k.r),
      PRUEF_ANZAHL,
      PRUEF_RECHNEN
    );
    return roh.map((f) =>
      f.typ === "mc"
        ? { ...f, optionen: mischen(f.k.m.map((text, idx) => ({ text, richtig: idx === 0 }))), gewaehlt: null }
        : { ...f, eingabe: "" }
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const [index, setIndex] = useState(0);
  const [antworten, setAntworten] = useState(fragen); // mutable Kopie inkl. Antwort
  const startZeitRef = useRef(Date.now());
  const dauerMs = PRUEF_MINUTEN * 60 * 1000;
  const [restMs, setRestMs] = useState(dauerMs);
  const ausgewertetRef = useRef(false);
  const antwortenRef = useRef(antworten);
  antwortenRef.current = antworten;
  const rechenInputRef = useRef(null);

  useEffect(() => {
    const iv = setInterval(() => {
      const rest = startZeitRef.current + dauerMs - Date.now();
      setRestMs(rest);
      if (rest <= 0) {
        clearInterval(iv);
        auswerten();
      }
    }, 500);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function auswerten() {
    if (ausgewertetRef.current) return;
    ausgewertetRef.current = true;
    // Über die Ref, weil der Timer-Callback sonst auf einem alten State säße.
    const stand = antwortenRef.current;
    let punkte = 0;
    stand.forEach((f) => {
      const korrekt = istFrageKorrekt(f);
      if (korrekt) punkte++;
      progress.antwortVerbuchen(f.k, korrekt);
    });
    progress.streakUpdaten();
    onErgebnis({
      typ: "pruefung",
      antworten: stand,
      punkte,
      zeitMs: Date.now() - startZeitRef.current,
    });
  }

  const f = ausgewertetRef.current ? null : antworten[index];
  const letzte = index === antworten.length - 1;

  function setzeAntwort(feld, wert) {
    setAntworten((prev) => {
      const copy = prev.slice();
      copy[index] = { ...copy[index], [feld]: wert };
      return copy;
    });
  }

  function waehle(idx) {
    if (!f || f.typ !== "mc" || idx >= f.optionen.length) return;
    setzeAntwort("gewaehlt", idx);
  }

  function weiter() {
    if (letzte) auswerten();
    else setIndex((i) => i + 1);
  }

  // Tastatur: 1-4 waehlt eine Antwort (nur Multiple Choice), Enter geht weiter.
  useEffect(() => {
    function onKeyDown(e) {
      if (ausgewertetRef.current || !f) return;
      if (f.typ === "mc" && /^[1-4]$/.test(e.key)) {
        e.preventDefault();
        waehle(Number(e.key) - 1);
      } else if (e.key === "Enter" && istBeantwortet(f)) {
        e.preventDefault();
        weiter();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, f]);

  useEffect(() => {
    if (f && f.typ === "rechnen") rechenInputRef.current?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  if (ausgewertetRef.current || !f) return null;

  const pz = Math.round((index / antworten.length) * 100);
  const min = Math.floor(Math.max(restMs, 0) / 60000);
  const sek = Math.floor((Math.max(restMs, 0) % 60000) / 1000);
  const warnung = restMs < 60000;
  const beantwortet = istBeantwortet(f);

  function abbrechen() {
    if (window.confirm("Prüfung abbrechen? Der Durchlauf wird verworfen.")) {
      onAbbrechen();
    }
  }

  return (
    <>
      <div className="topbar">
        <button className="back" onClick={abbrechen}>
          ← Abbrechen
        </button>
        <span className={"pruef-timer" + (warnung ? " warn" : "")} aria-live="polite">
          <small>RESTZEIT</small> {min}:{String(sek).padStart(2, "0")}
        </span>
      </div>
      <div className="progress">
        <i style={{ transform: `scaleX(${pz / 100})` }} />
      </div>
      <div className="pruef-note">
        Frage {index + 1} von {antworten.length} · Lösung kommt am Ende
      </div>
      <div style={{ textAlign: "center" }}>
        <span className="lf-badge">
          {f.typ === "rechnen" ? <><Icon name="calculator" size={14} /> Rechnen · </> : null}Lehrjahr {f.k.j} · {f.k.lf}
        </span>
      </div>

      {f.typ === "rechnen" ? (
        <div className="rechen-karte">
          <div className="rk-frage">{f.k.f}</div>
          <label className="rechen-eingabe">
            <input
              ref={rechenInputRef}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              value={f.eingabe}
              placeholder="?"
              aria-label={"Ergebnis in " + (f.k.r.einheit || "der passenden Einheit")}
              onChange={(e) => setzeAntwort("eingabe", e.target.value)}
            />
            <span className="re-einheit">{f.k.r.einheit}</span>
          </label>
          <div className="rechen-hinweis">Komma oder Punkt · Lösung erst am Ende</div>
        </div>
      ) : (
        <>
          <div className="quiz-q">{f.k.f}</div>
          {f.optionen.map((o, idx) => (
            <button key={idx} className={"opt" + (f.gewaehlt === idx ? " sel" : "")} onClick={() => waehle(idx)}>
              <span className="opt-key" aria-hidden="true">{idx + 1}</span><span>{o.text}</span>
            </button>
          ))}
        </>
      )}

      <div aria-live="polite">
        {beantwortet ? (
          <button className="next-btn" onClick={weiter}>
            {letzte ? "Prüfung abgeben ✓" : "Weiter →"}
          </button>
        ) : null}
      </div>
      <TabBar
        aktiv="lernen"
        onWechsel={(tab) => {
          if (window.confirm("Prüfung abbrechen? Der Durchlauf wird verworfen.")) onTabWechsel(tab);
        }}
      />
    </>
  );
}
