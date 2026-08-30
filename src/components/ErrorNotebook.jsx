import { useMemo, useState } from "react";
import Header from "./Header.jsx";
import TabBar from "./TabBar.jsx";
import Icon from "./Icon.jsx";

export default function ErrorNotebook({ progress, onUeben, onTabWechsel }) {
  const [filter, setFilter] = useState("offen");
  const liste = progress.fehlerheftListe;
  const offen = useMemo(() => liste.filter((k) => !k.fehlerheft.geklaert), [liste]);
  const sichtbar = filter === "alle" ? liste : filter === "geklaert" ? liste.filter((k) => k.fehlerheft.geklaert) : offen;

  return (
    <>
      <Header streak={progress.state.streak.count} level={progress.level} />
      <section className="screen-intro error-intro">
        <span className="screen-code">FEHLER / LERNCHANCE</span>
        <h1>Dein Fehlerheft</h1>
        <p>Jede falsch beantwortete Karte landet hier – mit eigener Notiz und gezielter Wiederholung.</p>
        <div className="error-summary">
          <span><b>{offen.length}</b> offen</span>
          <span><b>{liste.length - offen.length}</b> geklärt</span>
        </div>
      </section>

      <div className="filter-row" role="group" aria-label="Fehlerheft filtern">
        {[["offen", "Offen"], ["geklaert", "Geklärt"], ["alle", "Alle"]].map(([id, label]) => (
          <button key={id} className={filter === id ? "active" : ""} onClick={() => setFilter(id)}>{label}</button>
        ))}
      </div>

      {offen.length > 0 && (
        <button className="next-btn" onClick={() => onUeben(offen)}>
          <Icon name="repeat" size={18} /> Offene Fehler gezielt üben · {offen.length}
        </button>
      )}

      {sichtbar.length ? (
        <div className="error-list">
          {sichtbar.map((karte) => {
            const eintrag = karte.fehlerheft;
            return (
              <article className={"error-card" + (eintrag.geklaert ? " resolved" : "")} key={karte.i}>
                <div className="error-card-top">
                  <span>LF {karte.lf}</span>
                  <span>{eintrag.anzahl}× falsch</span>
                </div>
                <h2>{karte.f}</h2>
                <div className="error-answer"><span>Richtige Antwort</span>{karte.a}</div>
                <label>
                  <span>Meine Merkhilfe</span>
                  <textarea
                    value={eintrag.notiz || ""}
                    maxLength={500}
                    placeholder="Warum war die Antwort falsch? Was hilft dir beim nächsten Mal?"
                    onChange={(e) => progress.fehlerNotizSetzen(karte.i, e.target.value)}
                  />
                </label>
                <div className="error-card-actions">
                  <span>{eintrag.richtigSeitFehler || 0}× seitdem richtig</span>
                  <button onClick={() => progress.fehlerGeklaertSetzen(karte.i, !eintrag.geklaert)}>
                    <Icon name={eintrag.geklaert ? "repeat" : "check"} size={16} />
                    {eintrag.geklaert ? "Wieder öffnen" : "Als geklärt markieren"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state">
          <Icon name="check" size={28} />
          <h2>Hier ist gerade alles geklärt</h2>
          <p>Neue falsche Antworten werden automatisch in diesem Filter sichtbar.</p>
        </div>
      )}
      <TabBar aktiv="stats" onWechsel={onTabWechsel} />
    </>
  );
}

