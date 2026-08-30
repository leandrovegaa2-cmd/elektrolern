import { useState } from "react";
import { parseZahl, formatZahl } from "../../../lib/rechnen.js";
import { leistung } from "../../../lib/elektro.js";
import { NumFeld, WahlFeld, Ergebnis } from "./felder.jsx";

// Leistungsrechner: P aus U, I, cosφ — oder I aus P, U, cosφ. Ein-/dreiphasig.
export default function LeistungRechner() {
  const [phasen, setPhasen] = useState("1");
  const [modus, setModus] = useState("p"); // "p" = P suchen, "i" = I suchen
  const [u, setU] = useState("230");
  const [i, setI] = useState("10");
  const [p, setP] = useState("2300");
  const [cos, setCos] = useState("1");

  const ph = Number(phasen);
  const U = parseZahl(u);
  const I = parseZahl(i);
  const P = parseZahl(p);
  const cosv = parseZahl(cos) ?? 1;

  const res =
    modus === "p"
      ? U !== null && I !== null
        ? leistung({ U, I, cos: cosv, phasen: ph })
        : null
      : P !== null && U !== null
        ? leistung({ P, U, cos: cosv, phasen: ph })
        : null;

  return (
    <div className="rechner">
      <WahlFeld
        label="Netz"
        value={phasen}
        onChange={setPhasen}
        optionen={[
          { value: "1", label: "Einphasig (230 V)" },
          { value: "3", label: "Drehstrom (400 V)" },
        ]}
      />
      <WahlFeld
        label="Gesucht"
        value={modus}
        onChange={setModus}
        optionen={[
          { value: "p", label: "Leistung P" },
          { value: "i", label: "Strom I" },
        ]}
      />
      <NumFeld label="Spannung U" value={u} onChange={setU} einheit="V" />
      {modus === "p" ? (
        <NumFeld label="Strom I" value={i} onChange={setI} einheit="A" />
      ) : (
        <NumFeld label="Leistung P" value={p} onChange={setP} einheit="W" />
      )}
      <NumFeld label="cos φ" value={cos} onChange={setCos} step="0.05" min="0" />
      {res ? (
        <Ergebnis>
          <div className="kv">
            {modus === "p" ? (
              <>
                <b>P</b>
                <span>{formatZahl(res.P, 1)} W ({formatZahl(res.P / 1000, 2)} kW)</span>
              </>
            ) : (
              <>
                <b>I</b>
                <span>{formatZahl(res.I, 2)} A</span>
              </>
            )}
          </div>
          <div className="rf-formel">
            {ph === 3 ? "P = √3 · U · I · cos φ" : "P = U · I · cos φ"}
          </div>
        </Ergebnis>
      ) : (
        <Ergebnis ok={false}>Werte eingeben.</Ergebnis>
      )}
    </div>
  );
}
