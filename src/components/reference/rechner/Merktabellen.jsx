import {
  LEITERFARBEN_VOLL,
  IP_ZIFFER1,
  IP_ZIFFER2,
  IP_BEISPIELE,
  TAB_PUNKTE,
  DIN_VDE_MERK,
} from "../../../data/vde.js";
import { FarbChip } from "./felder.jsx";

// Statische Merktabellen (kein Rechnen). Jede als eigener Klappblock im Panel.

export function FarbcodeBlock() {
  return (
    <div className="ref-body w">
      <div className="w-sec">Aderfarben (DIN VDE 0100-510, ab 2003)</div>
      <div className="kv">
        {LEITERFARBEN_VOLL.map((f) => (
          <div style={{ display: "contents" }} key={f.label}>
            <b>
              <FarbChip farbe={f.farbe} />
              {f.label}
            </b>
            <span>{f.text}</span>
          </div>
        ))}
      </div>
      <div className="merk">PE grün-gelb ist Pflicht und niemals umnutzen. N immer blau.</div>
    </div>
  );
}

export function IpBlock() {
  return (
    <div className="ref-body w">
      <div className="w-sec">1. Ziffer — Fremdkörper & Berührung</div>
      <div className="kv">
        {IP_ZIFFER1.map((e) => (
          <div style={{ display: "contents" }} key={e.z}>
            <b>{e.z}</b>
            <span>{e.text}</span>
          </div>
        ))}
      </div>
      <div className="w-sec">2. Ziffer — Wasser</div>
      <div className="kv">
        {IP_ZIFFER2.map((e) => (
          <div style={{ display: "contents" }} key={e.z}>
            <b>{e.z}</b>
            <span>{e.text}</span>
          </div>
        ))}
      </div>
      <div className="w-sec">Gängige Beispiele</div>
      <div className="kv">
        {IP_BEISPIELE.map((e) => (
          <div style={{ display: "contents" }} key={e.code}>
            <b>{e.code}</b>
            <span>{e.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TabBlock() {
  return (
    <div className="ref-body w">
      <ol className="w-list">
        {TAB_PUNKTE.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>
      <div className="merk">TAB = Technische Anschlussbedingungen des örtlichen Netzbetreibers.</div>
    </div>
  );
}

export function DinVdeBlock() {
  return (
    <div className="ref-body w">
      <div className="kv">
        {DIN_VDE_MERK.map((e) => (
          <div style={{ display: "contents" }} key={e.norm}>
            <b>{e.norm}</b>
            <span>{e.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
