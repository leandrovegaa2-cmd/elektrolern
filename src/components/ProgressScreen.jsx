import { useRef } from "react";
import Header from "./Header.jsx";
import TabBar from "./TabBar.jsx";
import VerlaufSpark from "./VerlaufSpark.jsx";
import ErfolgeGrid from "./ErfolgeGrid.jsx";
import AccountPanel from "./AccountPanel.jsx";
import { LF_NAMEN, LJ_NAMEN } from "../data/namen.js";
import { lfMeta, LJ_META } from "../data/lernfelder.js";
import { schwaechenAnalyse } from "../lib/schwaechen.js";
import { fehlerVon } from "../lib/problemkarten.js";
import { todayISO } from "../lib/date.js";
import { schwelleFuerLevel } from "../lib/xp.js";

const BOX_NAMEN = ["Neu", "Box 1", "Box 2", "Box 3", "Box 4", "Box 5", "Box 6"];

export default function ProgressScreen({ progress, sync, onProblemkarten, onLernfeldUeben, onEditor, onTabWechsel }) {
  const fileInputRef = useRef(null);
  const karten = progress.karten;
  const gesamt = karten.length;
  const boxVon = (k) => progress.boxVon(k.i);
  const gelernt = karten.filter((k) => progress.istGelernt(k.i)).length;
  const sicher = karten.filter((k) => progress.istSicher(k.i)).length;
  const neu = karten.filter((k) => !progress.state.prog[k.i]).length;
  const eigene = karten.filter((k) => k.eigen).length;
  const faellig = progress.faelligVon(0).length;

  const boxen = BOX_NAMEN.map(() => 0);
  karten.forEach((k) => boxen[boxVon(k)]++);
  const maxBox = Math.max(...boxen, 1);

  const schwaechen = schwaechenAnalyse(karten, progress.state.prog);
  const xp = progress.state.xp || 0;
  const naechsteSchwelle = schwelleFuerLevel(progress.level + 1);

  function exportProgress() {
    const daten = JSON.stringify(
      { app: "elektrolern", v: 2, exportiert: todayISO(), state: progress.state },
      null,
      2
    );
    const blob = new Blob([daten], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "elektrolern-fortschritt-" + todayISO() + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function importProgress(e) {
    const datei = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!datei) return;
    const leser = new FileReader();
    leser.onload = () => {
      let geladen;
      try {
        geladen = JSON.parse(leser.result);
      } catch {
        alert("Datei konnte nicht gelesen werden — ist das die richtige .json-Sicherung?");
        return;
      }
      const s = geladen && geladen.state;
      if (!s || typeof s !== "object" || typeof s.prog !== "object") {
        alert("Das sieht nicht nach einer ElektroLern-Sicherung aus.");
        return;
      }
      const anzahl = Object.keys(s.prog || {}).length;
      if (
        !window.confirm(
          "Sicherung laden?\n\nErsetzt deinen aktuellen Stand durch " +
            anzahl +
            " gespeicherte Karten" +
            (s.streak ? " (Streak: " + (s.streak.count || 0) + ")" : "") +
            "."
        )
      )
        return;
      progress.importState(s);
    };
    leser.readAsText(datei);
  }

  return (
    <>
      <Header streak={progress.state.streak.count} level={progress.level} />
      <div className="screen-titel">Dein Fortschritt</div>
      <div className="sel-line">
        {gesamt} Karten insgesamt · {neu} noch nie gesehen
        {eigene > 0 ? " · " + eigene + " davon eigene" : ""}
      </div>

      <div className="stat-kacheln">
        <div className="stat-k">
          <div className="sz">{Math.round((gelernt / gesamt) * 100)} %</div>
          <div className="sl">Gelernt (Box 2+)</div>
        </div>
        <div className="stat-k">
          <div className="sz">{faellig}</div>
          <div className="sl">Heute fällig</div>
        </div>
        <div className="stat-k">
          <div className="sz">🔥 {progress.state.streak.count}</div>
          <div className="sl">Tage-Streak</div>
        </div>
        <div className="stat-k">
          <div className="sz">{sicher}</div>
          <div className="sl">Sicher (Box 4–5)</div>
        </div>
      </div>

      <div className="ref-h">Level &amp; XP</div>
      <div className="stat-k" style={{ marginBottom: 16 }}>
        <div className="sz">⭐ Level {progress.level}</div>
        <div className="sl">
          {xp} XP{Number.isFinite(naechsteSchwelle) ? ` · noch ${Math.max(naechsteSchwelle - xp, 0)} bis Level ${progress.level + 1}` : ""}
        </div>
        <div className="level-bar" aria-hidden="true">
          <i style={{ transform: `scaleX(${progress.levelProgress})` }} />
        </div>
      </div>

      <div className="ref-h">Fortschritts-Verlauf</div>
      <VerlaufSpark verlauf={progress.state.verlauf} />

      {progress.problemkartenListe.length > 0 ? (
        <>
          <div className="ref-h">Problemkarten — sitzen noch nicht</div>
          <div className="sel-line">Karten, die mehrfach als "nicht gewusst" markiert wurden.</div>
          <div className="problem-liste">
            {progress.problemkartenListe.slice(0, 6).map((k) => (
              <div className="problem-karte" key={k.i}>
                <span className="pk-frage">{k.f}</span>
                <span className="pk-fehler">{fehlerVon(progress.state.prog[k.i])}×</span>
              </div>
            ))}
          </div>
          <button className="next-btn secondary" onClick={onProblemkarten} style={{ marginBottom: 16 }}>
            🧩 Problemkarten üben
          </button>
        </>
      ) : null}

      <div className="ref-h">Erfolge</div>
      <ErfolgeGrid erfolge={progress.state.erfolge} />

      <div className="ref-h">Schwächen zuerst — Meisterschaft je Lernfeld</div>
      <div className="sel-line">Das schwächste Lernfeld steht oben. Tippen startet sofort eine Session daraus.</div>
      {schwaechen.map((s) => {
        const meta = lfMeta(s.lf);
        return (
          <button className="lf-zeile" key={s.lf} style={{ "--lk": meta.farbe }} onClick={() => onLernfeldUeben(s.lf)}>
            <span className="lz-badge" aria-hidden="true">
              {meta.icon}
            </span>
            <span className="lz-text">
              <span className="lz-name">
                {s.lf} — {LF_NAMEN[s.lf] || ""}
              </span>
              <span className="lz-bar">
                <i style={{ transform: `scaleX(${s.quote})` }} />
              </span>
            </span>
            <span className="lz-zahl">
              {s.gelernt}/{s.anzahl}
            </span>
            <span className="lz-ueben">Üben</span>
          </button>
        );
      })}

      <div className="ref-h">Je Lehrjahr</div>
      {[1, 2, 3, 4].map((lj) => {
        const pz = progress.fortschrittProzent(lj);
        return (
          <div className="stat-zeile" key={lj} style={{ "--lk": LJ_META[lj].farbe }} title={LJ_NAMEN[lj]}>
            {/* Kurzlabel statt vollem Lehrjahr-Namen: die Zeile lebt vom Balken-
                Vergleich, den langen Namen trägt die Kachel auf dem Dashboard.
                Die Jahresfarbe steckt im Balken, deshalb hier kein zweites Abzeichen. */}
            <span className="sn">Lehrjahr {lj}</span>
            <span className="stat-bar puls eigen">
              <i style={{ transform: `scaleX(${pz / 100})` }} />
            </span>
            <span className="sp">{pz} %</span>
          </div>
        );
      })}

      <div className="ref-h">Leitner-Boxen (je öfter richtig, desto höher)</div>
      {boxen.map((n, i) => (
        <div className="stat-zeile" key={i}>
          <span className="sn">{BOX_NAMEN[i]}</span>
          <span className="stat-bar">
            <i style={{ transform: `scaleX(${n / maxBox})` }} />
          </span>
          <span className="sp">{n}</span>
        </div>
      ))}

      <div className="footer-note">
        Karten wandern bei „Gewusst" eine Box hoch (längere Pause bis zur Wiederholung), bei „Nicht gewusst" zurück
        in Box 1.
      </div>

      <AccountPanel sync={sync} />

      <div className="ref-h">Fortschritt sichern</div>
      <div className="sel-line">Dein Lernstand liegt nur in diesem Browser. Sichere ihn, bevor du das Gerät wechselst oder den Cache löschst.</div>
      <div className="backup-row">
        <button className="mode-btn secondary" onClick={exportProgress}>
          ⬇ Sichern
        </button>
        <button className="mode-btn secondary" onClick={() => fileInputRef.current?.click()}>
          ⬆ Laden
        </button>
      </div>
      <input type="file" accept="application/json,.json" hidden ref={fileInputRef} onChange={importProgress} />

      <div className="ref-h">Karten bearbeiten</div>
      <div className="sel-line">
        Eigene Karten anlegen — oder eine Original-Karte korrigieren, wenn dir ein Fehler auffällt.
      </div>
      <button className="next-btn secondary" onClick={onEditor} style={{ marginBottom: 16 }}>
        🛠 Karten-Editor öffnen
      </button>

      <TabBar aktiv="stats" onWechsel={onTabWechsel} />
    </>
  );
}
