import { useEffect, useState } from "react";
import Ring from "./Ring.jsx";
import { bestanden as istBestanden, lfAnalyse, istFrageKorrekt } from "../lib/exam.js";
import { konfetti } from "../lib/konfetti.js";
import { formatZahl } from "../lib/rechnen.js";
import { LF_NAMEN } from "../data/namen.js";

/** Was hat der Nutzer geantwortet — je nach Fragetyp Option oder Zahl. */
function deineAntwort(f) {
  if (f.typ === "rechnen") {
    const roh = String(f.eingabe || "").trim();
    return roh ? roh + " " + (f.k.r.einheit || "") : "— nicht beantwortet —";
  }
  return f.gewaehlt !== null ? f.optionen[f.gewaehlt].text : "— nicht beantwortet —";
}

/** Was wäre richtig gewesen. */
function richtigeAntwort(f) {
  if (f.typ === "rechnen") {
    return formatZahl(Number(f.k.r.loesung), 3) + " " + (f.k.r.einheit || "");
  }
  return f.optionen.find((o) => o.richtig).text;
}

export default function ExamResult({ ergebnis, onNeuePruefung, onHeim }) {
  const { antworten, punkte, zeitMs } = ergebnis;
  const gesamt = antworten.length;
  const quote = Math.round((punkte / gesamt) * 100);
  const bestanden = istBestanden(punkte, gesamt);
  const min = Math.floor(zeitMs / 60000);
  const sek = Math.floor((zeitMs % 60000) / 1000);
  const emoji = quote >= 80 ? "🏆" : bestanden ? "💪" : "📚";
  const [zeigeFalsch, setZeigeFalsch] = useState(false);

  const analyse = lfAnalyse(antworten.map((f) => ({ lf: f.k.lf, korrekt: istFrageKorrekt(f) })));
  const falsche = antworten.filter((f) => !istFrageKorrekt(f));
  const rechenFragen = antworten.filter((f) => f.typ === "rechnen");
  const rechenPunkte = rechenFragen.filter(istFrageKorrekt).length;

  useEffect(() => {
    if (bestanden) konfetti();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="result result-shell exam-result-shell">
      <span className="result-code">PRÜFUNG / AUSWERTUNG</span>
      <div className="big">{emoji}</div>
      <Ring prozent={quote} />
      <div className={"verdikt " + (bestanden ? "ok" : "no")}>{bestanden ? "Bestanden ✓" : "Noch nicht bestanden"}</div>
      <h1>
        {punkte} von {gesamt} richtig
      </h1>
      <p>
        Zeit: {min}:{String(sek).padStart(2, "0")} min · Bestehensgrenze 50 %
        {rechenFragen.length ? (
          <>
            <br />
            Davon Rechenaufgaben: {rechenPunkte} von {rechenFragen.length} richtig
          </>
        ) : null}
      </p>
      <div className="lf-analyse">
        <div className="ref-h" style={{ marginTop: 6 }}>
          Nach Lernfeld — Schwächen zuerst
        </div>
        {analyse.map((a) => (
          <div className="stat-zeile" key={a.lf}>
            <span className="sn">
              {a.lf} — {LF_NAMEN[a.lf] || ""}
            </span>
            <span className="stat-bar">
              <i style={{ width: Math.round(a.quote * 100) + "%" }} />
            </span>
            <span className="sp">
              {a.richtig}/{a.gesamt}
            </span>
          </div>
        ))}
      </div>
      {falsche.length ? (
        <button className="next-btn secondary" onClick={() => setZeigeFalsch((v) => !v)}>
          {zeigeFalsch ? "Ausblenden" : "Falsche Fragen ansehen"}
        </button>
      ) : null}
      {zeigeFalsch ? (
        <div className="falsch-liste">
          {falsche.map((f, i) => (
            <div className="falsch-frage" key={i}>
              <div className="ff-q">
                {f.typ === "rechnen" ? <span className="ff-typ">🔢 Rechnen</span> : null}
                {f.k.f}
              </div>
              <div className="ff-du">✗ Deine Antwort: {deineAntwort(f)}</div>
              <div className="ff-r">✓ Richtig: {richtigeAntwort(f)}</div>
            </div>
          ))}
        </div>
      ) : null}
      <button className="next-btn" onClick={onNeuePruefung}>
        Neue Prüfung
      </button>
      <button className="next-btn secondary" onClick={onHeim}>
        Zur Übersicht
      </button>
    </div>
  );
}
