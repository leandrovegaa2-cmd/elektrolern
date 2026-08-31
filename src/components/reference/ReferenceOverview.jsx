import Icon from "../Icon.jsx";

const BEREICHE = [
  { id: "formeln", icon: "formula", wert: "14", label: "Formeln & Tabellen", text: "Grundformeln, Leiterfarben, Schutzklassen und Schaltzeichen." },
  { id: "rechner", icon: "calculator", wert: "6", label: "Fachrechner", text: "Ohm, Leistung, Spannungsfall, Querschnitt, Sicherung und RCD." },
  { id: "wissen", icon: "book", wert: "13", label: "Lernfelder", text: "Das kompakte Wissen aus LF 1 bis LF 13 an einem Ort." },
  { id: "karten", icon: "layers", wert: "273", label: "Karten", text: "Alle Fragen und Antworten nach Lehrjahr und Lernfeld filtern." },
];

const DIREKT = [
  { icon: "safety", titel: "5 Sicherheitsregeln", sub: "Reihenfolge sicher beherrschen", segment: "formeln", ziel: "sicherheit" },
  { icon: "calculator", titel: "Ohmsches Gesetz", sub: "U, R und I direkt berechnen", segment: "rechner", ziel: "Ohmsches Gesetz" },
  { icon: "trend", titel: "Spannungsfall", sub: "Volt und Prozent bestimmen", segment: "rechner", ziel: "Spannungsfall" },
  { icon: "palette", titel: "Leiterfarben", sub: "PE, N und L1 bis L3", segment: "formeln", ziel: "leiterfarben" },
];

export default function ReferenceOverview({ kartenAnzahl, onNavigate, onSearch }) {
  return (
    <section className="reference-overview" aria-labelledby="overview-title">
      <div className="overview-heading">
        <div>
          <span className="overview-kicker">Schnell finden</span>
          <h2 id="overview-title">Was brauchst du gerade?</h2>
        </div>
        <button className="overview-search-link" onClick={() => onSearch("RCD")}>Beispielsuche: RCD</button>
      </div>

      <div className="reference-bento">
        {BEREICHE.map((bereich, index) => (
          <button key={bereich.id} className={"reference-area" + (index === 0 ? " primary" : "")} onClick={() => onNavigate(bereich.id)}>
            <span className="reference-area-icon" aria-hidden="true"><Icon name={bereich.icon} size={21} /></span>
            <span className="reference-area-count">{bereich.id === "karten" ? kartenAnzahl : bereich.wert}</span>
            <b>{bereich.label}</b>
            <small>{bereich.text}</small>
            <i aria-hidden="true">→</i>
          </button>
        ))}
      </div>

      <div className="overview-section-title"><span>Direkt gebraucht</span><small>Häufige Themen in Prüfung und Praxis</small></div>
      <div className="reference-direct">
        {DIREKT.map((item) => (
          <button key={item.titel} onClick={() => onNavigate(item.segment, item.ziel)}>
            <span aria-hidden="true"><Icon name={item.icon} size={19} /></span><b>{item.titel}</b><small>{item.sub}</small><i aria-hidden="true">→</i>
          </button>
        ))}
      </div>

      <button className="sources-teaser" onClick={() => onNavigate("quellen")}>
        <span aria-hidden="true"><Icon name="safety" size={22} /></span>
        <span><b>Mit offiziellen Fachquellen arbeiten</b><small>DGUV, BIBB, DIN Media und DKE</small></span><i aria-hidden="true">→</i>
      </button>
    </section>
  );
}
