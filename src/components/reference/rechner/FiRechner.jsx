import { useState } from "react";
import { fiEmpfehlung } from "../../../lib/elektro.js";
import { FI_TYPEN, FI_PFLICHT } from "../../../data/vde.js";
import { WahlFeld, Ergebnis } from "./felder.jsx";

// FI/RCD-Auswahl: Typ + Bemessungsfehlerstrom aus Bereich & Fehlerstromart.
export default function FiRechner() {
  const [bereich, setBereich] = useState("wohnen");
  const [dc, setDc] = useState("nein");

  const res = fiEmpfehlung({ bereich, glatterDC: dc === "ja" });
  const typInfo = FI_TYPEN.find((t) => t.typ === res.typ);

  return (
    <div className="rechner">
      <WahlFeld
        label="Bereich"
        value={bereich}
        onChange={setBereich}
        optionen={[
          { value: "wohnen", label: "Wohnung / Endstromkreis" },
          { value: "gewerbe", label: "Gewerbe (zusätzl. Brandschutz)" },
        ]}
      />
      <WahlFeld
        label="Glatter DC-Fehlerstrom?"
        value={dc}
        onChange={setDc}
        optionen={[
          { value: "nein", label: "Nein — Standardlasten" },
          { value: "ja", label: "Ja — PV / Ladestation / Wechselrichter" },
        ]}
      />
      <Ergebnis>
        <div className="rf-gross">
          RCD Typ {res.typ} · {res.bemessung}
        </div>
        <div className="kv">
          <b>erfasst</b>
          <span>{typInfo.erfasst}</span>
          <b>Einsatz</b>
          <span>{typInfo.einsatz}</span>
        </div>
        <div className="rf-hint">{res.hinweis}</div>
        <div className="rf-hint">RCD-Pflicht (VDE 0100-530): {FI_PFLICHT.join(" · ")}.</div>
      </Ergebnis>
    </div>
  );
}
