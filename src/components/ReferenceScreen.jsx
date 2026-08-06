import { useState } from "react";
import Header from "./Header.jsx";
import TabBar from "./TabBar.jsx";
import FormulasPanel from "./reference/FormulasPanel.jsx";
import WissenPanel from "./reference/WissenPanel.jsx";
import CardsPanel from "./reference/CardsPanel.jsx";
import SearchResults from "./reference/SearchResults.jsx";

const SEGMENTE = [
  { id: "formeln", label: "📐 Formeln" },
  { id: "wissen", label: "📖 Wissen" },
  { id: "karten", label: "🃏 Karten" },
];

export default function ReferenceScreen({ progress, onTabWechsel }) {
  const [seg, setSeg] = useState("formeln");
  const [query, setQuery] = useState("");

  return (
    <>
      <Header streak={progress.state.streak.count} level={progress.level} />
      <div className="screen-titel">Nachschlagen</div>
      <div className="sel-line">Formeln &amp; Tabellen, Lernfeld-Wissen oder alle Karten</div>
      <input
        className="such"
        type="search"
        placeholder="Suchen: z. B. Ohm, FI, KNX, Trafo …"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Suche im Nachschlagewerk"
      />
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
            {s.label}
          </button>
        ))}
      </div>

      {query.trim() ? (
        <SearchResults query={query} />
      ) : seg === "formeln" ? (
        <FormulasPanel />
      ) : seg === "wissen" ? (
        <WissenPanel />
      ) : (
        <CardsPanel />
      )}

      <TabBar aktiv="ref" onWechsel={onTabWechsel} />
    </>
  );
}
