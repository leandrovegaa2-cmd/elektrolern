import { useEffect } from "react";
import Ring from "./Ring.jsx";
import { konfetti } from "../lib/konfetti.js";
import Icon from "./Icon.jsx";

/** Ergebnis-Screen für abgeschlossene Karteikarten-, Quiz- oder Rechen-Sessions. */
export default function ResultScreen({ ergebnis, streakCount, onNochmal, onFalscheWiederholen, onHeim }) {
  const falsche = ergebnis.falscheKarten || [];
  let quote, symbol, titel, text;
  if (ergebnis.typ === "flash") {
    const { richtig, falsch } = ergebnis;
    quote = richtig + falsch > 0 ? Math.round((richtig / (richtig + falsch)) * 100) : 0;
    symbol = quote >= 80 ? "trophy" : quote >= 50 ? "effort" : "tools";
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
    symbol = quote >= 80 ? "trophy" : quote >= 50 ? "effort" : "tools";
    titel = `${punkte} von ${fragen.length} richtig`;
    text = ergebnis.typ === "interaktiv"
      ? quote >= 80
        ? "Stark. Reihenfolgen und Zuordnungen sitzen."
        : quote >= 50
        ? "Gute Basis. Eine weitere Runde festigt die Abläufe."
        : "Die Lösungen sind jetzt sichtbar gewesen — in der nächsten Runde wird es leichter."
      : quote >= 80
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
    <div className="result result-shell">
      <span className="result-code">SESSION / AUSWERTUNG</span>
      <div className="big result-symbol"><Icon name={symbol} size={42} /></div>
      <Ring prozent={quote} />
      <h1>{titel}</h1>
      <p>{text}</p>
      <p>
        <span className="flame" aria-hidden="true"><Icon name="streak" size={18} /></span> Streak: {streakCount} Tag
        {streakCount === 1 ? "" : "e"}
      </p>
      {falsche.length ? (
        <button className="next-btn" onClick={() => onFalscheWiederholen(falsche)}>
          <Icon name="repeat" size={18} /> Die {falsche.length} falschen nochmal
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
