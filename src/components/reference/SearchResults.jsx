import { useMemo } from "react";
import { useKarten } from "../../hooks/useKarten.js";
import { FORMELN } from "../../data/formeln.js";
import { LF_HTML, LF_INFO } from "../../data/lfWissen.js";
import { LF_NAMEN } from "../../data/namen.js";
import CardDetail from "../CardDetail.jsx";
import Icon from "../Icon.jsx";

export default function SearchResults({ query }) {
  const karten = useKarten();
  const q = query.trim().toLowerCase();

  const { treffer, lfTreffer, formelTreffer } = useMemo(() => {
    const treffer = karten.filter((k) => (k.f + " " + k.a).toLowerCase().includes(q)).slice(0, 60);
    const lfTreffer = Object.keys(LF_INFO).filter(
      (lf) => LF_INFO[lf].toLowerCase().includes(q) || (LF_NAMEN[lf] || "").toLowerCase().includes(q)
    );
    const formelTreffer = FORMELN.filter(([f, e]) => (f + " " + e).toLowerCase().includes(q));
    return { treffer, lfTreffer, formelTreffer };
  }, [q, karten]);

  return (
    <>
      {formelTreffer.length ? (
        <>
          <div className="ref-h">Formeln</div>
          <details className="ref" open>
            <summary>
              <span className="ref-icon"><Icon name="formula" size={18} /></span> Formeln<span className="ref-sub">{formelTreffer.length} Treffer</span>
            </summary>
            <div className="formel-grid">
              {formelTreffer.map(([f, e]) => (
                <div style={{ display: "contents" }} key={f}>
                  <b>{f}</b>
                  <span>{e}</span>
                </div>
              ))}
            </div>
          </details>
        </>
      ) : null}

      <div className="ref-h">
        {treffer.length} Karten-Treffer{treffer.length === 60 ? " (max.)" : ""}
      </div>
      {treffer.length ? (
        treffer.map((k) => <CardDetail karte={k} key={k.i} />)
      ) : (
        <div className="empty">Nichts gefunden. Anders formulieren?</div>
      )}

      {lfTreffer.length ? (
        <>
          <div className="ref-h">Lernfeld-Wissen</div>
          {lfTreffer.map((lf) => (
            <details className="ref" key={lf}>
              <summary>
                {lf} — {LF_NAMEN[lf] || ""}
                <span className="ref-sub">Lernfeld-Wissen</span>
              </summary>
              <div className="ref-body w" dangerouslySetInnerHTML={{ __html: LF_HTML[lf] }} />
            </details>
          ))}
        </>
      ) : null}
    </>
  );
}
