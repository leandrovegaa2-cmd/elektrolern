import { useState } from "react";
import { parseZahl, formatZahl } from "../../../lib/rechnen.js";
import { sicherungWaehlen } from "../../../lib/elektro.js";
import { VERLEGEARTEN, TEMP_FAKTOR, HAEUFUNG_FAKTOR, LS_CHARAKTERISTIK } from "../../../data/vde.js";
import { NumFeld, WahlFeld, Ergebnis } from "./felder.jsx";

const QUERSCHNITTE = [1.5, 2.5, 4, 6, 10, 16, 25, 35];

// Sicherungswahl: LS-Nennstrom In mit I_B ≤ In ≤ I_z (korrigiert). Plus
// Charakteristik-Empfehlung nach Lastart.
export default function SicherungRechner() {
  const [i, setI] = useState("14.35");
  const [a, setA] = useState("1.5");
  const [verlegeart, setVerlegeart] = useState("B2");
  const [temp, setTemp] = useState("30");
  const [haeufung, setHaeufung] = useState("1");
  const [last, setLast] = useState("normal");

  const I = parseZahl(i);
  const res =
    I !== null
      ? sicherungWaehlen({ I, A: Number(a), verlegeart, temp: Number(temp), haeufung: Number(haeufung) })
      : null;

  const charTyp = last === "motor" ? "C" : last === "trafo" ? "D" : "B";
  const charInfo = LS_CHARAKTERISTIK.find((c) => c.typ === charTyp);

  return (
    <div className="rechner">
      <NumFeld label="Betriebsstrom I" value={i} onChange={setI} einheit="A" />
      <WahlFeld
        label="Querschnitt A"
        value={a}
        onChange={setA}
        optionen={QUERSCHNITTE.map((q) => ({ value: String(q), label: `${String(q).replace(".", ",")} mm²` }))}
      />
      <WahlFeld
        label="Verlegeart"
        value={verlegeart}
        onChange={setVerlegeart}
        optionen={VERLEGEARTEN.map((v) => ({ value: v.id, label: `${v.id} — ${v.text}` }))}
      />
      <WahlFeld
        label="Umgebung"
        value={temp}
        onChange={setTemp}
        optionen={TEMP_FAKTOR.map((t) => ({ value: String(t.t), label: `${t.t} °C (×${String(t.f).replace(".", ",")})` }))}
      />
      <WahlFeld
        label="Häufung (Stromkreise)"
        value={haeufung}
        onChange={setHaeufung}
        optionen={HAEUFUNG_FAKTOR.map((h) => ({ value: String(h.n), label: `${h.n} (×${String(h.f).replace(".", ",")})` }))}
      />
      <WahlFeld
        label="Lastart"
        value={last}
        onChange={setLast}
        optionen={[
          { value: "normal", label: "Steckdose / Licht / Heizung" },
          { value: "motor", label: "Motor / Vorschaltgerät" },
          { value: "trafo", label: "Transformator / große Einschaltströme" },
        ]}
      />
      {res ? (
        res.passt ? (
          <Ergebnis>
            <div className="rf-gross">
              {res.nennstrom} A · Charakteristik {charTyp}
            </div>
            <div className="kv">
              <b>Iz korr.</b>
              <span>{formatZahl(res.izKorr, 1)} A — Kabel-Obergrenze</span>
              <b>Regel</b>
              <span>I_B ≤ I_n ≤ I_z</span>
              <b>{charTyp}</b>
              <span>{charInfo.ausloesung} — {charInfo.einsatz}</span>
            </div>
          </Ergebnis>
        ) : (
          <Ergebnis ok={false}>
            Kein Normwert passt: Betriebsstrom über Iz ({formatZahl(res.izKorr, 1)} A) — größeren Querschnitt wählen.
          </Ergebnis>
        )
      ) : (
        <Ergebnis ok={false}>Betriebsstrom eingeben.</Ergebnis>
      )}
    </div>
  );
}
