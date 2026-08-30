import { useState } from "react";
import Header from "./Header.jsx";
import TabBar from "./TabBar.jsx";
import FormulasPanel from "./reference/FormulasPanel.jsx";
import WissenPanel from "./reference/WissenPanel.jsx";
import CardsPanel from "./reference/CardsPanel.jsx";
import RechnerPanel from "./reference/rechner/RechnerPanel.jsx";
import SearchResults from "./reference/SearchResults.jsx";
import SourcesPanel from "./reference/SourcesPanel.jsx";
import Icon from "./Icon.jsx";

const SEGMENTE = [
  { id: "formeln", label: "Formeln", icon: "formula" },
  { id: "rechner", label: "Rechner", icon: "calculator" },
  { id: "wissen", label: "Wissen", icon: "book" },
  { id: "karten", label: "Karten", icon: "layers" },
  { id: "quellen", label: "Quellen", icon: "safety" },
];

export default function ReferenceScreen({ progress, onTabWechsel }) {
  const [seg, setSeg] = useState("formeln");
  const [query, setQuery] = useState("");

  return (
    <>
      <Header streak={progress.state.streak.count} level={progress.level} />
      <section className="screen-intro reference-intro">
        <span className="screen-code">WERKZEUG / ARCHIV</span>
        <h1>Nachschlagen</h1>
        <p>Formeln, Rechner &amp; Tabellen, Lernfeld-Wissen oder alle Karten</p>
        <label className="search-command">
          <span aria-hidden="true">⌕</span>
          <input
            className="such"
            type="search"
            placeholder="Suchen: z. B. Ohm, FI, KNX, Trafo …"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Suche im Nachschlagewerk"
          />
          <kbd>SUCHEN</kbd>
        </label>
      </section>
      <div className="seg-nav" role="tablist">
        {SEGMENTE.map((s) => (
          <button
            key={s.id}
            className={"seg-btn" + (seg === s.id ? " active" : "")}
            role="tab"
            aria-selected={seg === s.id}
            onClick={() => {
              setSeg(s.id);
              setQuery("");
            }}
          >
            <Icon name={s.icon} size={16} /> {s.label}
          </button>
        ))}
      </div>

      {query.trim() ? (
        <SearchResults query={query} />
      ) : seg === "formeln" ? (
        <FormulasPanel />
      ) : seg === "rechner" ? (
        <RechnerPanel />
      ) : seg === "wissen" ? (
        <WissenPanel />
      ) : seg === "quellen" ? (
        <SourcesPanel />
      ) : (
        <CardsPanel />
      )}

      <TabBar aktiv="ref" onWechsel={onTabWechsel} />
    </>
  );
}
