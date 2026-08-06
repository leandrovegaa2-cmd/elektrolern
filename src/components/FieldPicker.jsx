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
      <div className="screen-titel">{LJ_NAMEN[gewaehltesLJ]}</div>
      <div className="sel-line">Lernfeld wählen</div>

      <Lernkachel
        farbe={LJ_META[gewaehltesLJ].farbe}
        badge={LJ_META[gewaehltesLJ].badge}
        kicker="Alles zusammen"
        titel="Ganzes Lehrjahr"
        anzahl={alleKarten.length}
        faellig={progress.faelligVon(gewaehltesLJ).length}
        prozent={progress.fortschrittProzent(gewaehltesLJ)}
        onClick={() => onWaehleLF(null)}
      />

      <div className="lk-trenner">Einzelne Lernfelder</div>

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
            prozent={progress.fortschrittProzent(gewaehltesLJ, lf)}
            onClick={() => onWaehleLF(lf)}
          />
        );
      })}
      <TabBar aktiv="lernen" onWechsel={onTabWechsel} />
    </>
  );
}
