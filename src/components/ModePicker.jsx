import { LJ_NAMEN } from "../data/namen.js";
import TabBar from "./TabBar.jsx";

export default function ModePicker({
  progress,
  gewaehltesLJ,
  gewaehltesLF,
  onZurueck,
  onFlash,
  onQuiz,
  onRechnen,
  onTabWechsel,
}) {
  const karten = progress.kartenVon(gewaehltesLJ, gewaehltesLF);
  const anz = karten.length;
  const fael = progress.faelligVon(gewaehltesLJ, gewaehltesLF).length;
  const rechenKarten = karten.filter((k) => k.r).length;
  const auswahl = LJ_NAMEN[gewaehltesLJ] + (gewaehltesLF ? " · " + gewaehltesLF : "");

  return (
    <>
      <div className="topbar">
        <button className="back" onClick={onZurueck}>
          ← Zurück
        </button>
      </div>
      <div className="screen-titel">{auswahl}</div>
      <div className="sel-line">
        {anz} Karten · {fael} heute fällig
      </div>
      <div className="mode-row">
        <button className="mode-btn" onClick={onFlash}>
          <span className="mode-emoji" aria-hidden="true">
            🃏
          </span>
          Karteikarten
        </button>
        <button className="mode-btn secondary" onClick={onQuiz}>
          <span className="mode-emoji" aria-hidden="true">
            ❓
          </span>
          Quiz
        </button>
      </div>
      {rechenKarten > 0 ? (
        <button className="next-btn secondary" onClick={onRechnen}>
          🔢 Rechnen ({rechenKarten} Aufgaben)
        </button>
      ) : null}
      <TabBar aktiv="lernen" onWechsel={onTabWechsel} />
    </>
  );
}
