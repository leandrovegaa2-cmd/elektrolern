import OhmRechner from "./OhmRechner.jsx";
import LeistungRechner from "./LeistungRechner.jsx";
import SpannungsfallRechner from "./SpannungsfallRechner.jsx";
import QuerschnittRechner from "./QuerschnittRechner.jsx";
import SicherungRechner from "./SicherungRechner.jsx";
import FiRechner from "./FiRechner.jsx";
import { FarbcodeBlock, IpBlock, TabBlock, DinVdeBlock } from "./Merktabellen.jsx";

// Alle Rechner + Merktabellen als Klappblöcke (Muster wie FormulasPanel).
const BLOECKE = [
  { titel: "🧮 Ohmsches Gesetz", sub: "U · R · I · P", inhalt: <OhmRechner /> },
  { titel: "⚡ Leistungsrechner", sub: "P = U · I · cos φ", inhalt: <LeistungRechner /> },
  { titel: "📉 Spannungsfall", sub: "ΔU & Δu in %", inhalt: <SpannungsfallRechner /> },
  { titel: "📐 Kabelquerschnitt & Dimensionierung", sub: "VDE 0298-4, Kupfer", inhalt: <QuerschnittRechner /> },
  { titel: "🔌 Sicherungswahl", sub: "LS-Nennstrom & Charakteristik", inhalt: <SicherungRechner /> },
  { titel: "🛡️ FI/RCD-Auswahl", sub: "Typ & Bemessungsstrom", inhalt: <FiRechner /> },
  { titel: "🎨 Farbcode Leitungen", sub: "L1–L3, N, PE", inhalt: <FarbcodeBlock /> },
  { titel: "💧 IP-Schutzarten", sub: "beide Ziffern + Beispiele", inhalt: <IpBlock /> },
  { titel: "📋 TAB-Übersicht", sub: "Anschlussbedingungen", inhalt: <TabBlock /> },
  { titel: "📚 DIN-VDE-Merkzettel", sub: "wichtigste Normen", inhalt: <DinVdeBlock /> },
];

export default function RechnerPanel() {
  return (
    <>
      {BLOECKE.map((b) => (
        <details className="ref" key={b.titel}>
          <summary>
            {b.titel}
            <span className="ref-sub">{b.sub}</span>
          </summary>
          {b.inhalt}
        </details>
      ))}
    </>
  );
}
