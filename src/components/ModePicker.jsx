import { LJ_NAMEN } from "../data/namen.js";
import TabBar from "./TabBar.jsx";
import Icon from "./Icon.jsx";

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
  const neu = progress.neuVon(gewaehltesLJ, gewaehltesLF).length;
  const rechenKarten = karten.filter((k) => k.r).length;
  const auswahl = LJ_NAMEN[gewaehltesLJ] + (gewaehltesLF ? " · " + gewaehltesLF : "");

  return (
    <>
      <div className="topbar">
        <button className="back" onClick={onZurueck}>
          ← Zurück
        </button>
      </div>
      <section className="screen-intro mode-intro">
        <span className="screen-code">TRAINING / MODUS</span>
        <h1>{auswahl}</h1>
        <p>{anz} Karten · {fael} Wiederholungen · {neu} neu</p>
      </section>
      <div className="mode-row mode-command">
        <button className="mode-btn" onClick={onFlash}>
          <span className="mode-index">01</span>
          <span className="mode-emoji" aria-hidden="true"><Icon name="layers" /></span>
          <span className="mode-name">Karteikarten</span>
          <small>Einprägen und mit dem Leitner-System wiederholen</small>
          <i aria-hidden="true">→</i>
        </button>
        <button className="mode-btn secondary" onClick={onQuiz}>
          <span className="mode-index">02</span>
          <span className="mode-emoji" aria-hidden="true"><Icon name="target" /></span>
          <span className="mode-name">Quiz</span>
          <small>Wissen abrufen und Antworten direkt prüfen</small>
          <i aria-hidden="true">→</i>
        </button>
      </div>
      {rechenKarten > 0 ? (
        <button className="next-btn secondary calculate-btn" onClick={onRechnen}>
          <span><Icon name="calculator" size={18} /> Rechnen ({rechenKarten} Aufgaben)</span><i aria-hidden="true">→</i>
        </button>
      ) : null}
      <TabBar aktiv="lernen" onWechsel={onTabWechsel} />
    </>
  );
}
