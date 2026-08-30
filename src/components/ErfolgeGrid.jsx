import { ERFOLGE } from "../lib/erfolge.js";

/** Zurückhaltende Erfolge-Galerie: freigeschaltete Abzeichen farbig, offene
 *  ausgegraut mit Beschreibung — keine Popups, kein Konfetti (PRODUCT.md). */
export default function ErfolgeGrid({ erfolge }) {
  return (
    <div className="erfolg-grid">
      {ERFOLGE.map((e) => {
        const frei = !!(erfolge && erfolge[e.id]);
        return (
          <div className={"erfolg-badge" + (frei ? "" : " locked")} key={e.id}>
            <span className="eb-icon" aria-hidden="true">
              {e.icon}
            </span>
            <span className="eb-titel">{e.titel}</span>
            <span className="eb-desc">{e.beschreibung}</span>
          </div>
        );
      })}
    </div>
  );
}
