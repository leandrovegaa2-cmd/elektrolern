import { useState } from "react";
import { parseZahl, formatZahl } from "../../../lib/rechnen.js";
import { ohm, leistung } from "../../../lib/elektro.js";
import { NumFeld, Ergebnis } from "./felder.jsx";

// Ohmsches Gesetz: zwei Größen eingeben, die dritte + Leistung werden berechnet.
export default function OhmRechner() {
  const [u, setU] = useState("230");
  const [r, setR] = useState("46");
  const [i, setI] = useState("");

  const U = parseZahl(u);
  const R = parseZahl(r);
  const I = parseZahl(i);
  const anzahl = [U, R, I].filter((x) => x !== null).length;
  const res = anzahl === 2 ? ohm({ U, R, I }) : null;
  const P = res ? leistung({ U: res.U, I: res.I, phasen: 1 }).P : null;

  return (
    <div className="rechner">
      <div className="rf-hint">Genau zwei Werte eingeben — der Rest wird berechnet.</div>
      <NumFeld label="Spannung U" value={u} onChange={setU} einheit="V" />
      <NumFeld label="Widerstand R" value={r} onChange={setR} einheit="Ω" />
      <NumFeld label="Strom I" value={i} onChange={setI} einheit="A" />
      {res ? (
        <Ergebnis>
          <div className="kv">
            <b>U</b>
            <span>{formatZahl(res.U, 2)} V</span>
            <b>R</b>
            <span>{formatZahl(res.R, 2)} Ω</span>
            <b>I</b>
            <span>{formatZahl(res.I, 3)} A</span>
            <b>P</b>
            <span>{formatZahl(P, 1)} W</span>
          </div>
        </Ergebnis>
      ) : (
        <Ergebnis ok={false}>
          {anzahl > 2 ? "Zu viele Werte — genau zwei angeben." : "Noch einen zweiten Wert eingeben."}
        </Ergebnis>
      )}
    </div>
  );
}
