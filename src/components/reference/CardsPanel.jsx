import { useState } from "react";
import { useKarten } from "../../hooks/useKarten.js";
import { LF_NAMEN } from "../../data/namen.js";
import CardDetail from "../CardDetail.jsx";

export default function CardsPanel() {
  const karten = useKarten();
  const [refLJ, setRefLJ] = useState(0);
  const [refLF, setRefLF] = useState(null);

  const pool = karten.filter((k) => refLJ === 0 || k.j === refLJ);
  const lfsVerfuegbar = [...new Set(pool.map((k) => k.lf))].sort((a, b) => Number(a.slice(2)) - Number(b.slice(2)));
  const ks = karten.filter((k) => (refLJ === 0 || k.j === refLJ) && (refLF === null || k.lf === refLF));

  return (
    <>
      <div className="chip-row">
        {[0, 1, 2, 3, 4].map((lj) => (
          <button
            key={lj}
            className={"chip" + (refLJ === lj ? " active" : "")}
            onClick={() => {
              setRefLJ(lj);
              setRefLF(null);
            }}
          >
            {lj === 0 ? "Alle Jahre" : "LJ " + lj}
          </button>
        ))}
      </div>
      <div className="chip-row">
        <button className={"chip" + (refLF === null ? " active" : "")} onClick={() => setRefLF(null)}>
          Alle LF
        </button>
        {lfsVerfuegbar.map((lf) => (
          <button key={lf} className={"chip" + (refLF === lf ? " active" : "")} onClick={() => setRefLF(lf)}>
            {lf}
          </button>
        ))}
      </div>

      <div className="ref-h">{ks.length} Karten</div>
      {!ks.length ? (
        <div className="empty">Keine Karten in dieser Auswahl.</div>
      ) : refLF !== null ? (
        ks.map((k) => <CardDetail karte={k} key={k.i} />)
      ) : (
        [...new Set(ks.map((k) => k.lf))]
          .sort((a, b) => Number(a.slice(2)) - Number(b.slice(2)))
          .map((lf) => {
            const gruppe = ks.filter((k) => k.lf === lf);
            return (
              <details className="ref" key={lf}>
                <summary>
                  {lf} — {LF_NAMEN[lf] || ""}
                  <span className="ref-sub">{gruppe.length} Karten</span>
                </summary>
                <div style={{ padding: "0 10px 10px" }}>
                  {gruppe.map((k) => (
                    <CardDetail karte={k} key={k.i} />
                  ))}
                </div>
              </details>
            );
          })
      )}
    </>
  );
}
