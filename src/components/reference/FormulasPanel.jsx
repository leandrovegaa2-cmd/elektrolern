import { FORMELN } from "../../data/formeln.js";
import { LEITERFARBEN, SICHERHEITSREGELN, FAUSTWERTE, SCHUTZKLASSEN, IP_BEISPIEL } from "../../data/tabellen.js";
import { SCHALTZEICHEN } from "../../data/schaltzeichen.js";
import Diagram from "../Diagram.jsx";
import Icon from "../Icon.jsx";

function SummaryIcon({ name }) {
  return <span className="ref-icon" aria-hidden="true"><Icon name={name} size={18} /></span>;
}

function FarbChip({ farbe }) {
  if (farbe === "pe") {
    return (
      <span
        className="farb-chip"
        style={{ background: "repeating-linear-gradient(45deg,#16a34a 0 4px,#facc15 4px 8px)" }}
      />
    );
  }
  return <span className="farb-chip" style={{ background: farbe }} />;
}

export default function FormulasPanel({ initialOpen = null }) {
  return (
    <>
      <details className="ref" open={initialOpen === "formeln" || undefined}>
        <summary>
          <SummaryIcon name="formula" /> Formelsammlung<span className="ref-sub">{FORMELN.length} Grundformeln</span>
        </summary>
        <div className="formel-grid">
          {FORMELN.map(([formel, erklaerung]) => (
            <div style={{ display: "contents" }} key={formel}>
              <b>{formel}</b>
              <span>{erklaerung}</span>
            </div>
          ))}
        </div>
      </details>

      <details className="ref" open={initialOpen === "leiterfarben" || undefined}>
        <summary>
          <SummaryIcon name="palette" /> Leiterfarben<span className="ref-sub">PE, N, L1–L3</span>
        </summary>
        <div className="ref-body w">
          <div className="kv">
            {LEITERFARBEN.map((f) => (
              <div style={{ display: "contents" }} key={f.label}>
                <b>
                  <FarbChip farbe={f.farbe} />
                  {f.label}
                </b>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </details>

      <details className="ref" open={initialOpen === "sicherheit" || undefined}>
        <summary>
          <SummaryIcon name="safety" /> 5 Sicherheitsregeln<span className="ref-sub">Reihenfolge auswendig</span>
        </summary>
        <div className="ref-body w">
          <ol className="steps">
            {SICHERHEITSREGELN.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ol>
        </div>
      </details>

      <details className="ref" open={initialOpen === "grenzwerte" || undefined}>
        <summary>
          <SummaryIcon name="limits" /> Faustwerte &amp; Grenzen<span className="ref-sub">Querschnitte, Gefahrenwerte</span>
        </summary>
        <div className="ref-body w">
          <div className="w-sec">Leitungsquerschnitte</div>
          <div className="kv">
            {FAUSTWERTE.querschnitte.map((q) => (
              <div style={{ display: "contents" }} key={q.label}>
                <b>{q.label}</b>
                <span>{q.text}</span>
              </div>
            ))}
          </div>
          <div className="w-sec">Gefahren- &amp; Grenzwerte</div>
          <div className="kv">
            {FAUSTWERTE.grenzwerte.map((g) => (
              <div style={{ display: "contents" }} key={g.label}>
                <b>{g.label}</b>
                <span>{g.text}</span>
              </div>
            ))}
          </div>
        </div>
      </details>

      <details className="ref" open={initialOpen === "schutzklassen" || undefined}>
        <summary>
          <SummaryIcon name="safety" /> Schutzklassen &amp; IP-Code<span className="ref-sub">Geräte &amp; Gehäuse</span>
        </summary>
        <div className="ref-body w">
          <div className="w-sec">Schutzklassen</div>
          <div className="kv">
            {SCHUTZKLASSEN.map((s) => (
              <div style={{ display: "contents" }} key={s.label}>
                <b>{s.label}</b>
                <span>{s.text}</span>
              </div>
            ))}
          </div>
          <div className="w-sec">IP-Code lesen (Beispiel {IP_BEISPIEL.code})</div>
          <div className="ip-demo">
            <span className="ip-p">IP</span>
            <span className="ip-d">
              <b>{IP_BEISPIEL.erste.wert}</b>
              <small>{IP_BEISPIEL.erste.label}</small>
            </span>
            <span className="ip-d">
              <b>{IP_BEISPIEL.zweite.wert}</b>
              <small>{IP_BEISPIEL.zweite.label}</small>
            </span>
          </div>
        </div>
      </details>

      <details className="ref">
        <summary>
          <SummaryIcon name="circuit" /> Schaltzeichen<span className="ref-sub">{SCHALTZEICHEN.length} Symbole erkennen</span>
        </summary>
        <div className="ref-body w">
          <div className="sz-grid">
            {SCHALTZEICHEN.map((s) => (
              <div className="sz-cell" key={s.name}>
                <div className="sz-sym" dangerouslySetInnerHTML={{ __html: s.svg }} />
                <b>{s.label}</b>
                <span>{s.bedeutung}</span>
              </div>
            ))}
          </div>
        </div>
      </details>

      <details className="ref">
        <summary>
          <SummaryIcon name="distribution" /> Verteileraufbau<span className="ref-sub">Hauptschalter · FI · LS</span>
        </summary>
        <div className="ref-body w">
          <Diagram name="verteiler" />
        </div>
      </details>

      <details className="ref">
        <summary>
          <SummaryIcon name="cable" /> Leitungsquerschnitt<span className="ref-sub">NYM-J 5-adrig</span>
        </summary>
        <div className="ref-body w">
          <Diagram name="nym5" />
        </div>
      </details>
    </>
  );
}
