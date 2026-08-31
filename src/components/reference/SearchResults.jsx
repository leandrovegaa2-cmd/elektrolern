import { useMemo } from "react";
import { useKarten } from "../../hooks/useKarten.js";
import { FORMELN } from "../../data/formeln.js";
import { LF_HTML, LF_INFO } from "../../data/lfWissen.js";
import { LF_NAMEN } from "../../data/namen.js";
import { FACHQUELLEN } from "../../data/fachquellen.js";
import { FAUSTWERTE, LEITERFARBEN, SCHUTZKLASSEN, SICHERHEITSREGELN } from "../../data/tabellen.js";
import CardDetail from "../CardDetail.jsx";
import Icon from "../Icon.jsx";

function normalisiere(text) {
  return String(text || "").toLocaleLowerCase("de").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const PRAXISWISSEN = [
  { id: "sicherheit", titel: "5 Sicherheitsregeln", text: SICHERHEITSREGELN.join(" "), icon: "safety", segment: "formeln", ziel: "sicherheit" },
  { id: "leiterfarben", titel: "Leiterfarben", text: LEITERFARBEN.map((x) => `${x.label} ${x.text}`).join(" "), icon: "palette", segment: "formeln", ziel: "leiterfarben" },
  { id: "grenzwerte", titel: "Faustwerte & Grenzen", text: [...FAUSTWERTE.querschnitte, ...FAUSTWERTE.grenzwerte].map((x) => `${x.label} ${x.text}`).join(" "), icon: "limits", segment: "formeln", ziel: "grenzwerte" },
  { id: "schutzklassen", titel: "Schutzklassen", text: SCHUTZKLASSEN.map((x) => `${x.label} ${x.text}`).join(" "), icon: "safety", segment: "formeln", ziel: "schutzklassen" },
  { id: "ohm", titel: "Ohmsches Gesetz berechnen", text: "Spannung Strom Widerstand U R I Rechner", icon: "calculator", segment: "rechner", ziel: "Ohmsches Gesetz" },
  { id: "spannungsfall", titel: "Spannungsfall berechnen", text: "Delta U Prozent Leitung Länge Querschnitt", icon: "trend", segment: "rechner", ziel: "Spannungsfall" },
  { id: "rcd", titel: "FI/RCD auswählen", text: "Fehlerstrom Schutzschalter Typ Bemessungsstrom 30 mA", icon: "safety", segment: "rechner", ziel: "FI/RCD-Auswahl" },
];

function BereichTitel({ icon, children, count }) {
  return <div className="search-group-title"><span><Icon name={icon} size={17} />{children}</span><b>{count}</b></div>;
}

export default function SearchResults({ query, onNavigate }) {
  const karten = useKarten();
  const q = normalisiere(query.trim());

  const ergebnis = useMemo(() => {
    const passt = (text) => normalisiere(text).includes(q);
    return {
      praxis: PRAXISWISSEN.filter((item) => passt(`${item.titel} ${item.text}`)),
      formeln: FORMELN.filter(([f, e]) => passt(`${f} ${e}`)),
      quellen: FACHQUELLEN.filter((quelle) => passt(`${quelle.titel} ${quelle.untertitel} ${quelle.herausgeber} ${quelle.status} ${quelle.themen.join(" ")}`)),
      lernfelder: Object.keys(LF_INFO).filter((lf) => passt(`${LF_NAMEN[lf] || ""} ${LF_INFO[lf]}`)),
      karten: karten.filter((k) => passt(`${k.f} ${k.a} ${k.lf}`)).slice(0, 40),
    };
  }, [q, karten]);

  const gesamt = Object.values(ergebnis).reduce((summe, liste) => summe + liste.length, 0);

  if (q.length < 2) {
    return <div className="search-empty"><Icon name="search" size={24} /><h2>Mindestens zwei Zeichen eingeben</h2><p>Suche zum Beispiel nach „RCD", „Ohm", „KNX" oder „0100-600".</p></div>;
  }

  if (!gesamt) {
    return <div className="search-empty"><Icon name="search" size={24} /><h2>Keine passenden Inhalte</h2><p>Versuche einen Oberbegriff, eine Abkürzung oder eine Formelgröße.</p></div>;
  }

  return (
    <section className="search-results" aria-live="polite">
      <div className="search-summary"><span>Suche nach</span><h2>„{query.trim()}“</h2><p>{gesamt} Treffer in {Object.values(ergebnis).filter((liste) => liste.length).length} Bereichen</p></div>

      {ergebnis.praxis.length ? <section className="search-group"><BereichTitel icon="bolt" count={ergebnis.praxis.length}>Direktzugriff</BereichTitel><div className="search-actions">
        {ergebnis.praxis.map((item) => <button key={item.id} onClick={() => onNavigate(item.segment, item.ziel)}><span><Icon name={item.icon} size={18} /></span><b>{item.titel}</b><i aria-hidden="true">→</i></button>)}
      </div></section> : null}

      {ergebnis.formeln.length ? <section className="search-group"><BereichTitel icon="formula" count={ergebnis.formeln.length}>Formeln</BereichTitel><div className="formula-results">
        {ergebnis.formeln.map(([formel, erklaerung]) => <div key={formel}><b>{formel}</b><span>{erklaerung}</span></div>)}
      </div></section> : null}

      {ergebnis.quellen.length ? <section className="search-group"><BereichTitel icon="book" count={ergebnis.quellen.length}>Fachquellen</BereichTitel><div className="source-search-results">
        {ergebnis.quellen.map((quelle) => <button key={quelle.id} onClick={() => onNavigate("quellen")}><span>{quelle.status}</span><b>{quelle.titel}</b><small>{quelle.untertitel}</small></button>)}
      </div></section> : null}

      {ergebnis.lernfelder.length ? <section className="search-group"><BereichTitel icon="book" count={ergebnis.lernfelder.length}>Lernfeld-Wissen</BereichTitel>
        {ergebnis.lernfelder.map((lf) => <details className="ref" key={lf}><summary>{lf} — {LF_NAMEN[lf] || ""}<span className="ref-sub">Kompakt-Wissen</span></summary><div className="ref-body w" dangerouslySetInnerHTML={{ __html: LF_HTML[lf] }} /></details>)}
      </section> : null}

      {ergebnis.karten.length ? <section className="search-group"><BereichTitel icon="layers" count={ergebnis.karten.length}>Karten-Treffer{ergebnis.karten.length === 40 ? " (max.)" : ""}</BereichTitel>
        {ergebnis.karten.map((karte) => <CardDetail karte={karte} key={karte.i} />)}
      </section> : null}
    </section>
  );
}
