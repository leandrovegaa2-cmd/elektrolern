import { useState } from "react";
import { parseZahl, formatZahl } from "../../../lib/rechnen.js";
import { spannungsfall } from "../../../lib/elektro.js";
import { NumFeld, WahlFeld, Ergebnis } from "./felder.jsx";

const QUERSCHNITTE = [1.5, 2.5, 4, 6, 10, 16, 25, 35];

// Spannungsfall ΔU + Δu% für Wechsel-/Drehstrom auf Kupferleitung.
export default function SpannungsfallRechner() {
  const [phasen, setPhasen] = useState("1");
  const [l, setL] = useState("20");
  const [i, setI] = useState("16");
  const [a, setA] = useState("1.5");
  const [cos, setCos] = useState("1");

  const ph = Number(phasen);
  const L = parseZahl(l);
  const I = parseZahl(i);
  const A = Number(a);
  const cosv = parseZahl(cos) ?? 1;

  const res = L !== null && I !== null ? spannungsfall({ l: L, I, A, cos: cosv, phasen: ph }) : null;
  const grenze = 3; // Richtwert DIN 18015-1
  const ok = res ? res.prozent <= grenze : true;

  return (
    <div className="rechner">
      <WahlFeld
        label="Netz"
        value={phasen}
        onChange={setPhasen}
        optionen={[
          { value: "1", label: "Wechselstrom (230 V)" },
          { value: "3", label: "Drehstrom (400 V)" },
        ]}
      />
      <NumFeld label="Leitungslänge l" value={l} onChange={setL} einheit="m" />
      <NumFeld label="Strom I" value={i} onChange={setI} einheit="A" />
      <WahlFeld
        label="Querschnitt A"
        value={a}
        onChange={setA}
        optionen={QUERSCHNITTE.map((q) => ({ value: String(q), label: `${String(q).replace(".", ",")} mm²` }))}
      />
      <NumFeld label="cos φ" value={cos} onChange={setCos} step="0.05" min="0" />
      {res ? (
        <Ergebnis ok={ok}>
          <div className="kv">
            <b>ΔU</b>
            <span>{formatZahl(res.deltaU, 2)} V</span>
            <b>Δu</b>
            <span>
              {formatZahl(res.prozent, 2)} %{" "}
              {ok ? "Im Rahmen (≤ 3 %)" : "Grenzwert überschritten — größeren Querschnitt wählen"}
            </span>
          </div>
          <div className="rf-formel">
            {ph === 3 ? "ΔU = √3 · l · I · cos φ / (κ · A)" : "ΔU = 2 · l · I · cos φ / (κ · A)"} · κ = 56
          </div>
        </Ergebnis>
      ) : (
        <Ergebnis ok={false}>Länge und Strom eingeben.</Ergebnis>
      )}
    </div>
  );
}
