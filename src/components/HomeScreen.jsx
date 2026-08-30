import Header from "./Header.jsx";
import Ring from "./Ring.jsx";
import CountUp from "./CountUp.jsx";
import TabBar from "./TabBar.jsx";
import HeuteKarte from "./HeuteKarte.jsx";
import Lernkachel from "./Lernkachel.jsx";
import { LJ_NAMEN } from "../data/namen.js";
import { LJ_META, nameTeilen } from "../data/lernfelder.js";
import Icon from "./Icon.jsx";

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
  const neuGesamt = progress.neuVon(0).length;
  const paketAnzahl = Math.min(15, progress.state.tagesziel, faelligGesamt + neuGesamt);
  const gesamtPz = progress.fortschrittProzent(0);
  const anzahlProblemkarten = progress.problemkartenListe.length;

  return (
    <>
      <Header streak={progress.state.streak.count} level={progress.level} />
      <section className="hero" aria-labelledby="dashboard-title">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-orbit" aria-hidden="true"><i /><i /><i /></div>
        <div className="hero-left">
          <div className="hero-kicker"><span /> Lernleitstand · heute</div>
          <h1 id="dashboard-title">Bereit, Spannung<br /><em>aufzubauen?</em></h1>
          <div className="hero-status">
            <div className="hz num">
              <CountUp ziel={faelligGesamt > 0 ? faelligGesamt : paketAnzahl} />
            </div>
            <div className="hl">
              {faelligGesamt > 0 ? "Wiederholungen sind fällig" : neuGesamt > 0 ? "Karten im heutigen Paket" : "Alles für heute erledigt"}
              <small>{faelligGesamt > 0 ? `${neuGesamt} weitere Karten sind noch neu.` : neuGesamt > 0 ? `${neuGesamt} Karten warten insgesamt auf dich.` : "Du kannst freiwillig weiterüben."}</small>
            </div>
          </div>
        </div>
        <Ring prozent={gesamtPz} caption="gelernt" />
      </section>

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
      <button className={"next-btn" + (faelligGesamt + neuGesamt > 0 ? "" : " secondary")} onClick={onSchnellstart}>
        <span><Icon name="bolt" size={18} /> {faelligGesamt + neuGesamt > 0 ? `Tagespaket starten · ${paketAnzahl}` : "Trotzdem üben"}</span>
        <i aria-hidden="true">→</i>
      </button>

      <div className="quick-grid">
        <button className="quick" onClick={onPruefung}>
          <span className="q-ico" aria-hidden="true"><Icon name="exam" /></span>
          <span className="q-titel">Prüfung</span>
          <span className="q-sub">20 Fragen · 20 min</span>
        </button>
        <button className="quick" onClick={onRechentrainer}>
          <span className="q-ico" aria-hidden="true"><Icon name="calculator" /></span>
          <span className="q-titel">Rechnen</span>
          <span className="q-sub">Aufgaben mit Zahlen</span>
        </button>
        {anzahlProblemkarten > 0 ? (
          <button className="quick warn" onClick={onProblemkarten}>
            <span className="q-ico" aria-hidden="true"><Icon name="problem" /></span>
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
            neu={progress.neuVon(lj).length}
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
