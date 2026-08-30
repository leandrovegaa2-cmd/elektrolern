import { FACHQUELLEN } from "../../data/fachquellen.js";
import Icon from "../Icon.jsx";

export default function SourcesPanel() {
  return (
    <section className="sources-panel" aria-labelledby="sources-title">
      <div className="ref-h" id="sources-title">Geprüfte Fachquellen</div>
      <p className="sel-line">
        Offizielle Ausgangspunkte für Ausbildung, Arbeitsschutz und Normen. Normtexte können kostenpflichtig sein;
        die verlinkten Seiten zeigen Titel, Ausgabe und Status.
      </p>
      <div className="sources-grid">
        {FACHQUELLEN.map((quelle) => (
          <article className="source-card" key={quelle.id}>
            <div className="source-top">
              <span className="source-icon" aria-hidden="true"><Icon name="book" size={19} /></span>
              <span className="source-status">{quelle.status}</span>
            </div>
            <h2>{quelle.titel}</h2>
            <p>{quelle.untertitel}</p>
            <dl>
              <div><dt>Herausgeber</dt><dd>{quelle.herausgeber}</dd></div>
              <div><dt>Stand</dt><dd>{quelle.stand}</dd></div>
            </dl>
            <div className="source-tags">
              {quelle.themen.map((thema) => <span key={thema}>{thema}</span>)}
            </div>
            <a className="source-link" href={quelle.url} target="_blank" rel="noreferrer">
              Offizielle Quelle öffnen <span aria-hidden="true">↗</span>
            </a>
          </article>
        ))}
      </div>
      <p className="source-note">
        Hinweis: ElektroLern ist eine Lernhilfe. Bei praktischen Arbeiten gelten betriebliche Vorgaben, aktuelle
        Regelwerke und die Anweisungen der verantwortlichen Elektrofachkraft.
      </p>
    </section>
  );
}

