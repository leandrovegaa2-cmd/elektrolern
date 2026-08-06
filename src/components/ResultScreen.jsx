import { useEffect } from "react";
import Ring from "./Ring.jsx";
import { konfetti } from "../lib/konfetti.js";

/** Ergebnis-Screen für abgeschlossene Karteikarten-, Quiz- oder Rechen-Sessions. */
export default function ResultScreen({ ergebnis, streakCount, onNochmal, onFalscheWiederholen, onHeim }) {
  const falsche = ergebnis.falscheKarten || [];
  let quote, emoji, titel, text;
  if (ergebnis.typ === "flash") {
    const { richtig, falsch } = ergebnis;
    quote = richtig + falsch > 0 ? Math.round((richtig / (richtig + falsch)) * 100) : 0;
    emoji = quote >= 80 ? "🏆" : quote >= 50 ? "💪" : "🔧";
    titel = "Session geschafft!";
    text = (
      <>
        <span className="score-num">{richtig}</span> gewusst · {falsch} nochmal fällig
        <br />
        Nicht gewusste Karten kommen früher wieder — genau so soll es sein.
      </>
    );
  } else {
    const { punkte, fragen } = ergebnis;
    quote = Math.round((punkte / fragen.length) * 100);
    emoji = quote >= 80 ? "🏆" : quote >= 50 ? "💪" : "🔧";
    titel = `${punkte} von ${fragen.length} richtig`;
    text =
      quote >= 80
        ? "Stark. Das sitzt."
        : quote >= 50
        ? "Solide Basis — die Lücken holen wir mit den Karteikarten."
        : "Kein Stress: Genau dafür ist die App da. Karteikarten-Modus hilft.";
  }

  useEffect(() => {
    // Bei Top-Ergebnis mehr Konfetti — kleine Extra-Belohnung.
    if (quote >= 50) konfetti(quote >= 80 ? 96 : 46);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="result">
      <div className="big">{emoji}</div>
      <Ring prozent={quote} />
      <h1>{titel}</h1>
      <p>{text}</p>
      <p>
        <span className="flame" aria-hidden="true">🔥</span> Streak: {streakCount} Tag
        {streakCount === 1 ? "" : "e"}
      </p>
      {falsche.length ? (
        <button className="next-btn" onClick={() => onFalscheWiederholen(falsche)}>
          🔁 Die {falsche.length} falschen nochmal
        </button>
      ) : null}
      <button className={"next-btn" + (falsche.length ? " secondary" : "")} onClick={onNochmal}>
        Nochmal lernen
      </button>
      <button className="next-btn secondary" onClick={onHeim}>
        Zur Übersicht
      </button>
    </div>
  );
}
