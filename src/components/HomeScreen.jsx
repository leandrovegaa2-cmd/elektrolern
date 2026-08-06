import Header from "./Header.jsx";
import Ring from "./Ring.jsx";
import CountUp from "./CountUp.jsx";
import TabBar from "./TabBar.jsx";
import HeuteKarte from "./HeuteKarte.jsx";
import Lernkachel from "./Lernkachel.jsx";
import { LJ_NAMEN } from "../data/namen.js";
import { LJ_META, nameTeilen } from "../data/lernfelder.js";

const LEHRJAHRE = [0, 1, 2, 3, 4];

export default function HomeScreen({
  progress,
  onWaehleLJ,
  onSchnellstart,
  onPruefung,
  onProblemkarten,
  onRechentrainer,
  onReset,
  onTabWechsel,
}) {
  const faelligGesamt = progress.faelligVon(0).length;
  const gesamtPz = progress.fortschrittProzent(0);
  const anzahlProblemkarten = progress.problemkartenListe.length;

  return (
    <>
      <Header streak={progress.state.streak.count} level={progress.level} />
      <div className="hero">
        <div className="hero-left">
          <div className="hz num">
            <CountUp ziel={faelligGesamt} />
          </div>
          <div className="hl">
            {faelligGesamt > 0 ? "Karten heute fällig — kurze Session reicht." : "Alles aufgeholt. Stark! 💪"}
          </div>
        </div>
        <Ring prozent={gesamtPz} caption="gelernt" />
      </div>

      <HeuteKarte
        heuteAnzahl={progress.heuteAnzahl}
        tagesziel={progress.state.tagesziel}
        plan={progress.plan}
        pruefDatum={progress.state.pruefDatum}
        onSetTagesziel={progress.setTagesziel}
        onSetPruefDatum={progress.setPruefDatum}
      />

      {/* Eine einzige große Aktion — alles andere sind bewusst kleinere Kacheln,
          damit „womit fange ich an?" nicht jedes Mal neu beantwortet werden muss. */}
      <button className={"next-btn" + (faelligGesamt > 0 ? "" : " secondary")} onClick={onSchnellstart}>
        {faelligGesamt > 0 ? "⚡ Jetzt lernen" : "Trotzdem üben"}
      </button>

      <div className="quick-grid">
        <button className="quick" onClick={onPruefung}>
          <span className="q-ico" aria-hidden="true">
            📝
          </span>
          <span className="q-titel">Prüfung</span>
          <span className="q-sub">20 Fragen · 20 min</span>
        </button>
        <button className="quick" onClick={onRechentrainer}>
          <span className="q-ico" aria-hidden="true">
            🔢
          </span>
          <span className="q-titel">Rechnen</span>
          <span className="q-sub">Aufgaben mit Zahlen</span>
        </button>
        {anzahlProblemkarten > 0 ? (
          <button className="quick warn" onClick={onProblemkarten}>
            <span className="q-ico" aria-hidden="true">
              🧩
            </span>
            <span className="q-titel">Problemkarten</span>
            <span className="q-sub">{anzahlProblemkarten} sitzen noch nicht</span>
          </button>
        ) : null}
      </div>

      <div className="screen-titel">Gezielt lernen</div>
      <div className="sel-line">Lehrjahr wählen, dann Lernfeld</div>

      {LEHRJAHRE.map((lj) => {
        const { kicker, titel } = nameTeilen(LJ_NAMEN[lj]);
        return (
          <Lernkachel
            key={lj}
            farbe={LJ_META[lj].farbe}
            badge={LJ_META[lj].badge}
            kicker={kicker}
            titel={titel}
            anzahl={progress.kartenVon(lj).length}
            faellig={progress.faelligVon(lj).length}
            prozent={progress.fortschrittProzent(lj)}
            onClick={() => onWaehleLJ(lj)}
          />
        );
      })}

      <div className="footer-note">
        {progress.karten.length} Karten · LF 1–13 · Fortschritt bleibt in diesem Browser gespeichert.
        <br />
        <button className="danger-link" onClick={onReset}>
          Fortschritt zurücksetzen
        </button>
      </div>
      <TabBar aktiv="lernen" onWechsel={onTabWechsel} />
    </>
  );
}
