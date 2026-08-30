import { LJ_NAMEN, LF_NAMEN } from "../data/namen.js";
import { lfMeta, LJ_META } from "../data/lernfelder.js";
import Lernkachel from "./Lernkachel.jsx";
import TabBar from "./TabBar.jsx";

export default function FieldPicker({ progress, gewaehltesLJ, onZurueck, onWaehleLF, onTabWechsel }) {
  const alleKarten = progress.kartenVon(gewaehltesLJ);
  const lfs = [...new Set(alleKarten.map((k) => k.lf))].sort((a, b) => Number(a.slice(2)) - Number(b.slice(2)));

  return (
    <>
      <div className="topbar">
        <button className="back" onClick={onZurueck}>
          ← Lehrjahr
        </button>
      </div>
      <section className="screen-intro field-intro">
        <span className="screen-code">LJ.0{gewaehltesLJ} / AUSWAHL</span>
        <h1>{LJ_NAMEN[gewaehltesLJ]}</h1>
        <p>Lernfeld wählen</p>
        <div className="intro-metrics">
          <span><b>{alleKarten.length}</b> Karten</span>
          <span><b>{progress.faelligVon(gewaehltesLJ).length}</b> Wiederholungen</span>
          <span><b>{progress.fortschrittProzent(gewaehltesLJ)}%</b> gelernt</span>
        </div>
      </section>

      <Lernkachel
        farbe={LJ_META[gewaehltesLJ].farbe}
        badge={LJ_META[gewaehltesLJ].badge}
        kicker="Alles zusammen"
        titel="Ganzes Lehrjahr"
        anzahl={alleKarten.length}
        faellig={progress.faelligVon(gewaehltesLJ).length}
        neu={progress.neuVon(gewaehltesLJ).length}
        prozent={progress.fortschrittProzent(gewaehltesLJ)}
        onClick={() => onWaehleLF(null)}
      />

      <div className="lk-trenner"><span>Einzelne Lernfelder</span><i>{lfs.length} Module</i></div>

      {lfs.map((lf) => {
        const meta = lfMeta(lf);
        return (
          <Lernkachel
            key={lf}
            farbe={meta.farbe}
            badge={meta.icon}
            kicker={lf}
            titel={LF_NAMEN[lf] || ""}
            anzahl={progress.kartenVon(gewaehltesLJ, lf).length}
            faellig={progress.faelligVon(gewaehltesLJ, lf).length}
            neu={progress.neuVon(gewaehltesLJ, lf).length}
            prozent={progress.fortschrittProzent(gewaehltesLJ, lf)}
            onClick={() => onWaehleLF(lf)}
          />
        );
      })}
      <TabBar aktiv="lernen" onWechsel={onTabWechsel} />
    </>
  );
}
