import { LF_HTML } from "../../data/lfWissen.js";
import { LF_NAMEN } from "../../data/namen.js";

/**
 * Die 13 Lernfeld-Wissensblöcke sind handverfasste, statische HTML-Strings
 * (Abschnittsüberschriften, Begriff/Wert-Raster, Merksatz-Boxen, eingebettete
 * Schaubilder). Kein Nutzer-Input fließt hier ein — dangerouslySetInnerHTML
 * ist daher unproblematisch. Eine 1:1-JSX-Nachbildung aller 13 Blöcke hätte
 * hier keinen Mehrwert gebracht, nur enormen Portierungsaufwand ohne
 * sichtbaren Unterschied für die Nutzer:innen.
 */
export default function WissenPanel() {
  return (
    <>
      {Object.keys(LF_HTML).map((lf) => (
        <details className="ref" key={lf}>
          <summary>
            {lf} — {LF_NAMEN[lf] || ""}
            <span className="ref-sub">Kompakt-Wissen</span>
          </summary>
          <div className="ref-body w" dangerouslySetInnerHTML={{ __html: LF_HTML[lf] }} />
        </details>
      ))}
    </>
  );
}
