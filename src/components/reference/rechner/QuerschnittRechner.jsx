import { useState } from "react";
import { parseZahl, formatZahl } from "../../../lib/rechnen.js";
import { querschnittEmpfehlung } from "../../../lib/elektro.js";
import { VERLEGEARTEN, TEMP_FAKTOR, HAEUFUNG_FAKTOR } from "../../../data/vde.js";
import { NumFeld, WahlFeld, Ergebnis } from "./felder.jsx";

// Kabelquerschnitt / Leitungsdimensionierung nach VDE 0298-4 (Kupfer):
// kleinster Querschnitt, der Strombelastbarkeit UND Spannungsfall erfüllt.
export default function QuerschnittRechner() {
  const [phasen, setPhasen] = useState("1");
  const [i, setI] = useState("14.35");
  const [l, setL] = useState("20");
  const [cos, setCos] = useState("1");
  const [verlegeart, setVerlegeart] = useState("B2");
  const [temp, setTemp] = useState("30");
  const [haeufung, setHaeufung] = useState("1");
  const [grenze, setGrenze] = useState("3");

  const I = parseZahl(i);
  const L = parseZahl(l);
  const cosv = parseZahl(cos) ?? 1;

  const res =
    I !== null && L !== null
      ? querschnittEmpfehlung({
          I,
          l: L,
          cos: cosv,
          phasen: Number(phasen),
          verlegeart,
          temp: Number(temp),
          haeufung: Number(haeufung),
          grenzeProzent: Number(grenze),
        })
      : null;

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
      <NumFeld label="Betriebsstrom I" value={i} onChange={setI} einheit="A" />
      <NumFeld label="Leitungslänge l" value={l} onChange={setL} einheit="m" />
      <NumFeld label="cos φ" value={cos} onChange={setCos} step="0.05" min="0" />
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
        label="Max. Spannungsfall"
        value={grenze}
        onChange={setGrenze}
        optionen={[
          { value: "3", label: "3 % (Wohnbau, DIN 18015-1)" },
          { value: "4", label: "4 % (Beleuchtung)" },
          { value: "5", label: "5 % (sonstige Last)" },
        ]}
      />
      {res ? (
        <Ergebnis ok={res.ausreichend}>
          {res.ausreichend ? (
            <>
              <div className="rf-gross">
                {String(res.querschnitt).replace(".", ",")} mm² Kupfer
              </div>
              <div className="kv">
                <b>Iz korr.</b>
                <span>{formatZahl(res.izKorr, 1)} A (belastbar)</span>
                <b>Δu</b>
                <span>{formatZahl(res.prozent, 2)} %</span>
                <b>Grenze</b>
                <span>{res.grund === "spannungsfall" ? "Spannungsfall bestimmt den Querschnitt" : "Strombelastbarkeit bestimmt den Querschnitt"}</span>
              </div>
            </>
          ) : (
            <span>Kein Standard-Querschnitt (≤ 35 mm²) reicht — Länge/Strom prüfen oder aufteilen.</span>
          )}
        </Ergebnis>
      ) : (
        <Ergebnis ok={false}>Strom und Länge eingeben.</Ergebnis>
      )}
    </div>
  );
}
