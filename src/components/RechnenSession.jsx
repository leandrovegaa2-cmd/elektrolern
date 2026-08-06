import { useEffect, useMemo, useRef, useState } from "react";
import { mischen } from "../lib/random.js";
import { istRichtig, abweichungProzent, formatZahl, STANDARD_TOLERANZ } from "../lib/rechnen.js";
import { aufgabenSerie } from "../data/rechenVorlagen.js";

export const RECHEN_ANZAHL = 10;

/**
 * Rechen-Modus mit Zahleneingabe. Zwei Quellen:
 *
 *  quelle="karten"     feste Rechenkarten aus der Auswahl (haben ein `r`-Feld).
 *                      Zahlen auf die Leitner-Boxen — es sind echte Karten.
 *  quelle="generator"  frisch gewürfelte Aufgaben aus den Formel-Vorlagen.
 *                      Zahlen nur auf XP/Tagesziel, weil es keine feste Karte gibt.
 */
export default function RechnenSession({
  progress,
  gewaehltesLJ,
  gewaehltesLF,
  quelle = "karten",
  onAbbrechen,
  onErgebnis,
}) {
  const aufgaben = useMemo(() => {
    if (quelle === "generator") {
      return aufgabenSerie(RECHEN_ANZAHL).map((a) => ({
        frage: a.frage,
        loesung: a.loesung,
        einheit: a.einheit,
        weg: a.weg,
        toleranz: a.toleranz || STANDARD_TOLERANZ,
        lf: a.lf,
        titel: a.titel,
        karte: null,
      }));
    }
    return mischen(progress.kartenVon(gewaehltesLJ, gewaehltesLF).filter((k) => k.r))
      .slice(0, RECHEN_ANZAHL)
      .map((k) => ({
        frage: k.f,
        loesung: Number(k.r.loesung),
        einheit: k.r.einheit || "",
        weg: k.a,
        toleranz: Number.isFinite(k.r.tol) ? k.r.tol : STANDARD_TOLERANZ,
        lf: k.lf,
        titel: null,
        karte: k,
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [index, setIndex] = useState(0);
  const [eingabe, setEingabe] = useState("");
  const [geprueft, setGeprueft] = useState(false);
  const [punkte, setPunkte] = useState(0);
  const inputRef = useRef(null);
  // Nur echte Karten lassen sich wiederholen — generierte Aufgaben haben keine ID.
  const falscheRef = useRef([]);

  const fertig = index >= aufgaben.length;
  const a = fertig ? null : aufgaben[index];
  const korrekt = geprueft && a ? istRichtig(eingabe, a.loesung, a.toleranz) : false;

  useEffect(() => {
    if (aufgaben.length === 0) onAbbrechen();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fertig) {
      progress.streakUpdaten();
      onErgebnis({ typ: "rechnen", quelle, punkte, fragen: aufgaben, falscheKarten: falscheRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fertig]);

  useEffect(() => {
    if (!fertig && !geprueft) inputRef.current?.focus();
  }, [index, fertig, geprueft]);

  if (fertig || !a) return null;

  function pruefen() {
    if (geprueft || !eingabe.trim()) return;
    const richtig = istRichtig(eingabe, a.loesung, a.toleranz);
    setGeprueft(true);
    if (richtig) setPunkte((p) => p + 1);
    else merkeFalsch();
    if (a.karte) progress.antwortVerbuchen(a.karte, richtig);
    else progress.uebungVerbuchen(richtig);
  }

  function merkeFalsch() {
    if (a.karte && !falscheRef.current.some((k) => k.i === a.karte.i)) falscheRef.current.push(a.karte);
  }

  function weiter() {
    setGeprueft(false);
    setEingabe("");
    setIndex((i) => i + 1);
  }

  function aufgeben() {
    if (geprueft) return;
    setGeprueft(true);
    merkeFalsch();
    if (a.karte) progress.antwortVerbuchen(a.karte, false);
    else progress.uebungVerbuchen(false);
  }

  function onKeyDown(e) {
    if (e.key !== "Enter") return;
    e.preventDefault();
    if (geprueft) weiter();
    else pruefen();
  }

  const pz = Math.round((index / aufgaben.length) * 100);
  const abw = geprueft && !korrekt ? abweichungProzent(eingabe, a.loesung) : null;
  const knappDaneben = abw !== null && abw <= 10;

  return (
    <>
      <div className="topbar">
        <button className="back" onClick={onAbbrechen}>
          ← Abbrechen
        </button>
        <span className="counter">
          {index + 1} / {aufgaben.length} · {punkte} ✓
        </span>
      </div>
      <div className="progress">
        <i style={{ transform: `scaleX(${pz / 100})` }} />
      </div>
      <div style={{ textAlign: "center" }}>
        <span className="lf-badge">{quelle === "generator" ? "🔢 Rechentrainer" : "🔢 Rechnen"} · {a.lf}</span>
      </div>

      <div className={"rechen-karte" + (geprueft ? (korrekt ? " ok" : " bad") : "")}>
        <div className="rk-frage">{a.frage}</div>

        <label className={"rechen-eingabe" + (geprueft ? (korrekt ? " ok" : " bad") : "")}>
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            autoComplete="off"
            value={eingabe}
            disabled={geprueft}
            placeholder="?"
            aria-label={"Ergebnis in " + (a.einheit || "der passenden Einheit")}
            onChange={(e) => setEingabe(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <span className="re-einheit">{a.einheit}</span>
        </label>
        <div className="rechen-hinweis">Komma oder Punkt · Toleranz ±{Math.round(a.toleranz * 100)} %</div>
      </div>

      <div aria-live="polite">
        {geprueft ? (
          <>
            <div className={"rechen-feedback " + (korrekt ? "ok" : "bad")}>
              <span className="rf-ico" aria-hidden="true">
                {korrekt ? "✓" : "✗"}
              </span>
              {korrekt ? (
                <span>
                  <b>Richtig.</b> {formatZahl(a.loesung, 3)} {a.einheit}
                </span>
              ) : (
                <span>
                  <b>Nicht ganz.</b> Richtig wäre{" "}
                  <b className="rf-loesung">
                    {formatZahl(a.loesung, 3)} {a.einheit}
                  </b>
                  {knappDaneben ? " — knapp daneben, vermutlich nur gerundet." : ""}
                </span>
              )}
            </div>
            <div className="rechen-weg">
              <div className="rw-label">Rechenweg</div>
              {String(a.weg)
                .split("\n")
                .filter((z) => z.trim())
                .map((z, i) => (
                  <div key={i} className={/=/.test(z) ? "a-formel" : "a-p"}>
                    {z}
                  </div>
                ))}
            </div>
            <button className="next-btn" onClick={weiter}>
              Weiter →
            </button>
          </>
        ) : (
          <div className="rechen-aktionen">
            <button className="next-btn" onClick={pruefen} disabled={!eingabe.trim()}>
              Prüfen
            </button>
            <button className="loesung-link" onClick={aufgeben}>
              Ich komme nicht weiter — Lösung zeigen
            </button>
          </div>
        )}
      </div>
    </>
  );
}
