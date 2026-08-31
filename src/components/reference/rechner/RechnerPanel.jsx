import OhmRechner from "./OhmRechner.jsx";
import LeistungRechner from "./LeistungRechner.jsx";
import SpannungsfallRechner from "./SpannungsfallRechner.jsx";
import QuerschnittRechner from "./QuerschnittRechner.jsx";
import SicherungRechner from "./SicherungRechner.jsx";
import FiRechner from "./FiRechner.jsx";
import { FarbcodeBlock, IpBlock, TabBlock, DinVdeBlock } from "./Merktabellen.jsx";
import Icon from "../../Icon.jsx";

// Alle Rechner + Merktabellen als Klappblöcke (Muster wie FormulasPanel).
const BLOECKE = [
  { titel: "Ohmsches Gesetz", icon: "calculator", sub: "U · R · I · P", inhalt: <OhmRechner /> },
  { titel: "Leistungsrechner", icon: "bolt", sub: "P = U · I · cos φ", inhalt: <LeistungRechner /> },
  { titel: "Spannungsfall", icon: "trend", sub: "ΔU & Δu in %", inhalt: <SpannungsfallRechner /> },
  { titel: "Kabelquerschnitt & Dimensionierung", icon: "plan", sub: "VDE 0298-4, Kupfer", inhalt: <QuerschnittRechner /> },
  { titel: "Sicherungswahl", icon: "circuit", sub: "LS-Nennstrom & Charakteristik", inhalt: <SicherungRechner /> },
  { titel: "FI/RCD-Auswahl", icon: "safety", sub: "Typ & Bemessungsstrom", inhalt: <FiRechner /> },
  { titel: "Farbcode Leitungen", icon: "palette", sub: "L1–L3, N, PE", inhalt: <FarbcodeBlock /> },
  { titel: "IP-Schutzarten", icon: "water", sub: "beide Ziffern + Beispiele", inhalt: <IpBlock /> },
  { titel: "TAB-Übersicht", icon: "clipboard", sub: "Anschlussbedingungen", inhalt: <TabBlock /> },
  { titel: "DIN-VDE-Merkzettel", icon: "book", sub: "wichtigste Normen", inhalt: <DinVdeBlock /> },
];

export default function RechnerPanel({ initialOpen = null }) {
  return (
    <>
      {BLOECKE.map((b) => (
        <details className="ref" key={b.titel} open={initialOpen === b.titel || undefined}>
          <summary>
            <span className="ref-icon" aria-hidden="true"><Icon name={b.icon} size={18} /></span> {b.titel}
            <span className="ref-sub">{b.sub}</span>
          </summary>
          {b.inhalt}
        </details>
      ))}
    </>
  );
}
