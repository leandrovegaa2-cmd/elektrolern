import Header from "./Header.jsx";
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
  onInteraktiv,
  onFehlerheft,
  onReset,
  onWerkstatt,
  voltChips,
  onTabWechsel,
}) {
  const faelligGesamt = progress.faelligVon(0).length;
  const neuGesamt = progress.neuVon(0).length;
  const paketAnzahl = Math.min(15, progress.state.tagesziel, faelligGesamt + neuGesamt);
  const gesamtPz = progress.fortschrittProzent(0);
  const anzahlProblemkarten = progress.problemkartenListe.length;
  const offeneFehler = progress.fehlerheftListe.filter((k) => !k.fehlerheft.geklaert).length;
  const heuteProzent = Math.min(100, Math.round((progress.heuteAnzahl / Math.max(1, progress.state.tagesziel)) * 100));

  return (
    <>
      <Header streak={progress.state.streak.count} level={progress.level} />
      <section className="academy-hero" aria-labelledby="dashboard-title">
        <img
          className="academy-hero-art"
          src={`${import.meta.env.BASE_URL}visuals/academy-meter-v1.jpg`}
          alt="Futuristisches Multimeter in einem leuchtenden Energie-Labor"
        />
        <div className="academy-hero-shade" aria-hidden="true" />
        <div className="academy-traces" aria-hidden="true"><i /><i /><i /></div>
        <div className="academy-copy">
          <div className="academy-kicker"><span /> System bereit · Tagesmission</div>
          <h1 id="dashboard-title">Lerne, bis es<br /><em>unter Spannung sitzt.</em></h1>
          <p className="academy-lead">Kurze Einsätze. Klare Rückmeldung. Sichtbarer Fortschritt bis zur Prüfung.</p>

          <div className="mission-readout">
            <div className="mission-number num"><CountUp ziel={faelligGesamt > 0 ? faelligGesamt : paketAnzahl} /></div>
            <div>
              <b>{faelligGesamt > 0 ? "Wiederholungen bereit" : neuGesamt > 0 ? "Karten im heutigen Paket" : "Tagesziel erreicht"}</b>
              <span>{faelligGesamt > 0 ? `${neuGesamt} neue Karten warten danach.` : neuGesamt > 0 ? `${neuGesamt} Karten sind noch ungelernt.` : "Freiwilliges Training bleibt verfügbar."}</span>
            </div>
          </div>

          <button className={"mission-launch" + (faelligGesamt + neuGesamt > 0 ? "" : " secondary")} onClick={onSchnellstart}>
            <span className="mission-launch-icon"><Icon name="bolt" size={20} /></span>
            <span>
              <b>{faelligGesamt + neuGesamt > 0 ? `Tagespaket starten · ${paketAnzahl}` : "Trotzdem üben"}</b>
              <small>ca. {Math.max(4, Math.ceil(paketAnzahl * 0.55))} Minuten</small>
            </span>
            <Icon name="arrow" size={20} />
          </button>
        </div>
        <div className="academy-hud" aria-label={`${gesamtPz} Prozent gelernt`}>
          <span>Gesamtstatus</span>
          <b className="num">{gesamtPz}<small>%</small></b>
          <i><em style={{ transform: `scaleX(${gesamtPz / 100})` }} /></i>
        </div>
      </section>

      <section className="daily-console" aria-labelledby="daily-console-title">
        <div className="console-heading">
          <span className="section-index">01</span>
          <div><h2 id="daily-console-title">Dein Einsatz heute</h2><p>Trainieren, wiederholen oder gezielt Schwächen schließen.</p></div>
          <span className="daily-gauge num">{heuteProzent}%</span>
        </div>

        <HeuteKarte
          heuteAnzahl={progress.heuteAnzahl}
          tagesziel={progress.state.tagesziel}
          plan={progress.plan}
          pruefDatum={progress.state.pruefDatum}
          onSetTagesziel={progress.setTagesziel}
          onSetPruefDatum={progress.setPruefDatum}
        />
      </section>

      <section className="training-section" aria-labelledby="training-title">
        <div className="section-heading">
          <span className="section-index">02</span>
          <div><h2 id="training-title">Trainingsmodule</h2><p>Wähle die Art, wie du heute besser werden willst.</p></div>
        </div>

        <div className="training-grid">
        <button className="training-card training-card-main" onClick={onPruefung}>
          <span className="training-code">SIM / 20</span>
          <span className="training-icon" aria-hidden="true"><Icon name="exam" size={25} /></span>
          <span className="q-titel">Prüfung</span>
          <span className="q-sub">20 Fragen unter Zeitdruck. Danach siehst du jede Lücke.</span>
          <span className="training-link">Simulation öffnen <Icon name="arrow" size={15} /></span>
        </button>
        <button className="training-card" onClick={onRechentrainer}>
          <span className="training-code">CALC</span>
          <span className="training-icon" aria-hidden="true"><Icon name="calculator" /></span>
          <span className="q-titel">Rechnen</span>
          <span className="q-sub">Aufgaben mit Zahlen</span>
        </button>
        <button className="training-card" onClick={onInteraktiv}>
          <span className="training-code">LAB</span>
          <span className="training-icon" aria-hidden="true"><Icon name="circuit" /></span>
          <span className="q-titel">Interaktiv</span>
          <span className="q-sub">Sortieren &amp; zuordnen</span>
        </button>
        <button className={"training-card" + (offeneFehler ? " warn" : "")} onClick={onFehlerheft}>
          <span className="training-code">FIX / {offeneFehler}</span>
          <span className="training-icon" aria-hidden="true"><Icon name="clipboard" /></span>
          <span className="q-titel">Fehlerheft</span>
          <span className="q-sub">{offeneFehler} offene Einträge</span>
        </button>
        {anzahlProblemkarten > 0 ? (
          <button className="training-card warn" onClick={onProblemkarten}>
            <span className="training-code">FOCUS</span>
            <span className="training-icon" aria-hidden="true"><Icon name="problem" /></span>
            <span className="q-titel">Problemkarten</span>
            <span className="q-sub">{anzahlProblemkarten} sitzen noch nicht</span>
          </button>
        ) : null}
        </div>
      </section>

      <section className="level-section" aria-labelledby="level-title">
        <div className="section-heading">
          <span className="section-index">03</span>
          <div><h2 id="level-title">Ausbildungsroute</h2><p><span className="route-label">Gezielt lernen</span> · Vom Fundament bis zur Prüfung.</p></div>
          <span className="route-total num">{gesamtPz}%</span>
        </div>
        <div className="route-line" aria-hidden="true"><i style={{ transform: `scaleX(${gesamtPz / 100})` }} /></div>
        <div className="learning-route">
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
        </div>
      </section>

      <button className="reward-preview" aria-label="Elektro-Werkstatt öffnen" onClick={onWerkstatt}>
        <div className="reward-sigil" aria-hidden="true"><Icon name="crystal" size={28} /></div>
        <div className="reward-copy">
          <span>Belohnungspfad · Stufe {progress.level}</span>
          <h2>Werkzeug-Arsenal freischalten</h2>
          <p>Kisten öffnen · Skins sammeln · Werkzeuge ausrüsten</p>
        </div>
        <div className="reward-xp num">{voltChips}<small> CHIPS</small></div>
        <div className="reward-bar" aria-hidden="true"><i style={{ transform: `scaleX(${progress.levelProgress})` }} /></div>
      </button>

      <div className="footer-note">
        {progress.karten.length} Karten · LF 1–13 · Fortschritt bleibt in diesem Browser gespeichert.
        <br />
        <button className="danger-link" onClick={onReset}>Fortschritt zurücksetzen</button>
      </div>
      <TabBar aktiv="lernen" onWechsel={onTabWechsel} />
    </>
  );
}
