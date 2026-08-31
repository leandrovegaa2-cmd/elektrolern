import { useEffect, useRef, useState } from "react";
import Header from "./Header.jsx";
import TabBar from "./TabBar.jsx";
import FormulasPanel from "./reference/FormulasPanel.jsx";
import WissenPanel from "./reference/WissenPanel.jsx";
import CardsPanel from "./reference/CardsPanel.jsx";
import RechnerPanel from "./reference/rechner/RechnerPanel.jsx";
import SearchResults from "./reference/SearchResults.jsx";
import SourcesPanel from "./reference/SourcesPanel.jsx";
import ReferenceOverview from "./reference/ReferenceOverview.jsx";
import Icon from "./Icon.jsx";

const SEGMENTE = [
  { id: "uebersicht", label: "Übersicht", icon: "search" },
  { id: "formeln", label: "Formeln", icon: "formula" },
  { id: "rechner", label: "Rechner", icon: "calculator" },
  { id: "wissen", label: "Wissen", icon: "book" },
  { id: "karten", label: "Karten", icon: "layers" },
  { id: "quellen", label: "Quellen", icon: "safety" },
];

export default function ReferenceScreen({ progress, onTabWechsel }) {
  const [seg, setSeg] = useState("uebersicht");
  const [query, setQuery] = useState("");
  const [panelZiel, setPanelZiel] = useState(null);
  const suchRef = useRef(null);

  function navigiere(segment, ziel = null) {
    setSeg(segment);
    setPanelZiel(ziel);
    setQuery("");
  }

  useEffect(() => {
    function tastatur(e) {
      if (e.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || "")) {
        e.preventDefault();
        suchRef.current?.focus();
      }
      if (e.key === "Escape" && suchRef.current?.value) {
        setQuery("");
        suchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", tastatur);
    return () => window.removeEventListener("keydown", tastatur);
  }, []);

  return (
    <>
      <Header streak={progress.state.streak.count} level={progress.level} />
      <section className="screen-intro reference-intro">
        <span className="screen-code">WERKZEUG / ARCHIV</span>
        <h1>Nachschlagen</h1>
        <p>Formeln, Rechner, Lernfeld-Wissen und geprüfte Quellen – zentral und schnell erreichbar.</p>
        <label className="search-command">
          <span aria-hidden="true"><Icon name="search" size={18} /></span>
          <input
            ref={suchRef}
            className="such"
            type="search"
            placeholder="Thema, Formel, Norm oder Karteninhalt suchen …"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Suche im Nachschlagewerk"
          />
          {query ? (
            <button type="button" className="search-clear" onClick={() => { setQuery(""); suchRef.current?.focus(); }} aria-label="Suche leeren"><Icon name="close" size={15} /></button>
          ) : <kbd>/</kbd>}
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
              navigiere(s.id);
            }}
          >
            <Icon name={s.icon} size={16} /> {s.label}
          </button>
        ))}
      </div>

      <div className="reference-panel" role="tabpanel" aria-label={query.trim() ? "Suchergebnisse" : SEGMENTE.find((s) => s.id === seg)?.label}>
      {query.trim() ? (
        <SearchResults query={query} onNavigate={navigiere} />
      ) : seg === "uebersicht" ? (
        <ReferenceOverview kartenAnzahl={progress.karten.length} onNavigate={navigiere} onSearch={(wert) => { setQuery(wert); suchRef.current?.focus(); }} />
      ) : seg === "formeln" ? (
        <FormulasPanel key={panelZiel || "formeln"} initialOpen={panelZiel} />
      ) : seg === "rechner" ? (
        <RechnerPanel key={panelZiel || "rechner"} initialOpen={panelZiel} />
      ) : seg === "wissen" ? (
        <WissenPanel />
      ) : seg === "quellen" ? (
        <SourcesPanel />
      ) : (
        <CardsPanel />
      )}
      </div>

      <TabBar aktiv="ref" onWechsel={onTabWechsel} />
    </>
  );
}
