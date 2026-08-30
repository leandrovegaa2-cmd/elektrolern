import { useMemo, useRef, useState } from "react";
import TabBar from "./TabBar.jsx";
import CardDetail from "./CardDetail.jsx";
import { useKarten } from "../hooks/useKarten.js";
import { LF_NAMEN } from "../data/namen.js";
import { todayISO } from "../lib/date.js";
import Icon from "./Icon.jsx";
import {
  karteSpeichern,
  karteLoeschen,
  karteFehler,
  kartenExport,
  kartenImport,
  kartenZuruecksetzen,
} from "../lib/kartenStore.js";

const LF_LISTE = Object.keys(LF_NAMEN);

function leeresFormular() {
  return {
    i: null,
    j: 1,
    lf: "LF1",
    f: "",
    a: "",
    mcAn: false,
    m: ["", "", "", ""],
    rechenAn: false,
    loesung: "",
    einheit: "",
  };
}

/** Karte → Formularzustand. */
function formularAus(k) {
  return {
    i: k.i,
    j: k.j,
    lf: k.lf,
    f: k.f,
    a: k.a,
    mcAn: Array.isArray(k.m) && k.m.length >= 2,
    m: Array.isArray(k.m) ? [...k.m, "", "", "", ""].slice(0, 4) : ["", "", "", ""],
    rechenAn: !!k.r,
    loesung: k.r ? String(k.r.loesung).replace(".", ",") : "",
    einheit: k.r ? k.r.einheit || "" : "",
  };
}

/** Formularzustand → Karte (so, wie der Store sie erwartet). */
function karteAus(form) {
  const k = { i: form.i, j: Number(form.j), lf: form.lf, f: form.f, a: form.a };
  if (form.mcAn) {
    const optionen = form.m.map((o) => String(o).trim()).filter(Boolean);
    k.m = optionen;
  }
  if (form.rechenAn) {
    const zahl = Number(String(form.loesung).replace(",", "."));
    k.r = { loesung: zahl, einheit: form.einheit };
  }
  return k;
}

/**
 * Karten-Editor: eigene Karten anlegen/bearbeiten/löschen und Original-Karten
 * korrigieren. Korrekturen liegen als Überschreibung im Karten-Store — das
 * Original im Code bleibt unangetastet und ist jederzeit wiederherstellbar.
 */
export default function CardEditor({ onZurueck, onTabWechsel }) {
  const karten = useKarten();
  const [ansicht, setAnsicht] = useState("eigene"); // eigene | original
  const [form, setForm] = useState(null);
  const [fehler, setFehler] = useState([]);
  const [suche, setSuche] = useState("");
  const fileInputRef = useRef(null);

  const eigene = useMemo(() => karten.filter((k) => k.eigen), [karten]);
  const korrigierte = useMemo(() => karten.filter((k) => k.korrigiert), [karten]);
  const treffer = useMemo(() => {
    const q = suche.trim().toLowerCase();
    if (!q) return [];
    return karten.filter((k) => !k.eigen && (k.f + " " + k.a).toLowerCase().includes(q)).slice(0, 30);
  }, [karten, suche]);

  function setzeFeld(feld, wert) {
    setForm((f) => ({ ...f, [feld]: wert }));
  }

  function speichern() {
    const karte = karteAus(form);
    const probleme = karteFehler(karte);
    if (probleme.length) {
      setFehler(probleme);
      return;
    }
    if (karteSpeichern(karte) === null) {
      setFehler(["Speichern fehlgeschlagen — bitte Eingaben prüfen."]);
      return;
    }
    setFehler([]);
    setForm(null);
  }

  function loeschen(k) {
    const eigen = !!k.eigen;
    const frage = eigen
      ? "Diese eigene Karte wirklich löschen?"
      : "Korrektur verwerfen und die Original-Karte wiederherstellen?";
    if (!window.confirm(frage)) return;
    karteLoeschen(k.i);
    setForm(null);
  }

  function exportieren() {
    const daten = JSON.stringify(kartenExport(), null, 2);
    const blob = new Blob([daten], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "elektrolern-eigene-karten-" + todayISO() + ".json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  function importieren(e) {
    const datei = e.target.files && e.target.files[0];
    e.target.value = "";
    if (!datei) return;
    const leser = new FileReader();
    leser.onload = () => {
      let geladen;
      try {
        geladen = JSON.parse(leser.result);
      } catch {
        alert("Datei konnte nicht gelesen werden — ist das die richtige .json-Datei?");
        return;
      }
      if (!geladen || geladen.app !== "elektrolern-karten") {
        alert("Das sieht nicht nach einer ElektroLern-Kartendatei aus.");
        return;
      }
      const ergaenzen = window.confirm(
        "Karten hinzufügen?\n\nOK = zu deinen vorhandenen Karten dazu.\nAbbrechen = deine vorhandenen eigenen Karten ersetzen."
      );
      const anzahl = kartenImport(geladen, ergaenzen ? "ergaenzen" : "ersetzen");
      alert(anzahl === null ? "Import fehlgeschlagen." : anzahl + " Karten übernommen.");
    };
    leser.readAsText(datei);
  }

  function allesZuruecksetzen() {
    if (!window.confirm("Alle eigenen Karten UND alle Korrekturen löschen? Das lässt sich nicht rückgängig machen.")) return;
    kartenZuruecksetzen();
    setForm(null);
  }

  // ------------------------------------------------------------------ Formular
  if (form) {
    const istOriginal = form.i !== null && form.i !== undefined && !String(form.i).startsWith("e");
    return (
      <>
        <div className="topbar">
          <button className="back" onClick={() => setForm(null)}>
            ← Zurück
          </button>
          <span className="counter">{istOriginal ? "Original korrigieren" : form.i ? "Karte bearbeiten" : "Neue Karte"}</span>
        </div>

        <div className={"editor-fahne" + (istOriginal ? " korrektur" : "")}>
          <span className="ef-ico" aria-hidden="true">
            <Icon name={istOriginal ? "tools" : "edit"} size={19} />
          </span>
          <span>
            <b>{istOriginal ? "Korrektur an Karte " + form.i : form.i ? "Eigene Karte" : "Neue eigene Karte"}</b>
            <br />
            <span className="ef-sub">
              {istOriginal
                ? "Gilt nur bei dir lokal. Das Original bleibt erhalten und ist über „Original wiederherstellen“ zurückholbar."
                : "Lernt sich wie jede mitgelieferte Karte — inklusive Leitner-Boxen und Fortschritt."}
            </span>
          </span>
        </div>

        <div className="editor-sektion">
          <div className="es-titel">Einordnung</div>
          <div className="es-paar">
            <div className="editor-feld">
              <label htmlFor="ed-j">Lehrjahr</label>
              <select id="ed-j" value={form.j} onChange={(e) => setzeFeld("j", Number(e.target.value))}>
                {[1, 2, 3, 4].map((j) => (
                  <option key={j} value={j}>
                    Lehrjahr {j}
                  </option>
                ))}
              </select>
            </div>
            <div className="editor-feld">
              <label htmlFor="ed-lf">Lernfeld</label>
              <select id="ed-lf" value={form.lf} onChange={(e) => setzeFeld("lf", e.target.value)}>
                {LF_LISTE.map((lf) => (
                  <option key={lf} value={lf}>
                    {lf} — {LF_NAMEN[lf]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="editor-sektion">
          <div className="es-titel">Inhalt</div>
          <div className="editor-feld">
            <label htmlFor="ed-f">Frage</label>
            <textarea id="ed-f" rows={3} value={form.f} onChange={(e) => setzeFeld("f", e.target.value)} />
          </div>
          <div className="editor-feld">
            <label htmlFor="ed-a">Antwort / Erklärung</label>
            <textarea id="ed-a" rows={7} value={form.a} onChange={(e) => setzeFeld("a", e.target.value)} />
            <div className="editor-tipp">
              Formatierung passiert automatisch: Zeilen mit „•" werden zur Liste, „1." zu Schritten, „Begriff: Wert"
              zum Raster, „Merke: …" zur Merkbox. Die Vorschau unten zeigt dir sofort, was daraus wird.
            </div>
          </div>
        </div>

        <div className="editor-sektion">
          <div className="es-titel">Zusätzliche Übungsarten</div>
          <label className="editor-schalter">
            <input type="checkbox" checked={form.mcAn} onChange={(e) => setzeFeld("mcAn", e.target.checked)} />
            <span>
              Quizfrage (Multiple Choice)
              <span className="esch-sub">Karte taucht dann auch im Quiz und in der Prüfungssimulation auf.</span>
            </span>
          </label>
          {form.mcAn ? (
            <div className="editor-mc">
              <div className="editor-tipp">Die erste Antwort ist die richtige — beim Quiz wird gemischt.</div>
              {form.m.map((o, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={o}
                  placeholder={idx === 0 ? "Richtige Antwort" : "Falsche Antwort " + idx}
                  aria-label={idx === 0 ? "Richtige Antwort" : "Falsche Antwort " + idx}
                  className={idx === 0 ? "richtig" : ""}
                  onChange={(e) => {
                    const m = [...form.m];
                    m[idx] = e.target.value;
                    setzeFeld("m", m);
                  }}
                />
              ))}
            </div>
          ) : null}

          <label className="editor-schalter">
            <input type="checkbox" checked={form.rechenAn} onChange={(e) => setzeFeld("rechenAn", e.target.checked)} />
            <span>
              Rechenaufgabe (Zahleneingabe)
              <span className="esch-sub">Karte taucht dann auch im Rechen-Modus auf.</span>
            </span>
          </label>
          {form.rechenAn ? (
            <div className="editor-rechen">
              <input
                type="text"
                inputMode="decimal"
                value={form.loesung}
                placeholder="Lösung, z. B. 6,86"
                aria-label="Lösung"
                onChange={(e) => setzeFeld("loesung", e.target.value)}
              />
              <input
                type="text"
                value={form.einheit}
                placeholder="Einheit, z. B. V"
                aria-label="Einheit"
                onChange={(e) => setzeFeld("einheit", e.target.value)}
              />
            </div>
          ) : null}
        </div>

        <div className="editor-sektion vorschau">
          <div className="es-titel">Vorschau</div>
          {form.f.trim() || form.a.trim() ? (
            <CardDetail
              karte={{ ...karteAus(form), f: form.f.trim() || "(noch keine Frage)", a: form.a }}
              open
            />
          ) : (
            <div className="empty">Sobald du tippst, siehst du hier die fertige Karte.</div>
          )}
        </div>

        {fehler.length ? (
          <div className="editor-fehler" role="alert">
            {fehler.map((f) => (
              <div key={f}>• {f}</div>
            ))}
          </div>
        ) : null}

        <button className="next-btn" onClick={speichern}>
          Speichern
        </button>
        {form.i ? (
          <button className="next-btn secondary" onClick={() => loeschen(karten.find((k) => k.i === form.i) || form)}>
            {istOriginal ? "Original wiederherstellen" : "Karte löschen"}
          </button>
        ) : null}
      </>
    );
  }

  // -------------------------------------------------------------------- Liste
  return (
    <>
      <div className="topbar">
        <button className="back" onClick={onZurueck}>
          ← Zurück
        </button>
        <span className="counter">{karten.length} Karten</span>
      </div>
      <div className="screen-titel">Karten bearbeiten</div>
      <div className="sel-line">Eigene Karten anlegen oder Original-Karten korrigieren</div>

      <div className="seg-nav" role="tablist">
        <button
          className={"seg-btn" + (ansicht === "eigene" ? " active" : "")}
          role="tab"
          aria-selected={ansicht === "eigene"}
          onClick={() => setAnsicht("eigene")}
        >
          <Icon name="edit" size={16} /> Eigene ({eigene.length})
        </button>
        <button
          className={"seg-btn" + (ansicht === "original" ? " active" : "")}
          role="tab"
          aria-selected={ansicht === "original"}
          onClick={() => setAnsicht("original")}
        >
          <Icon name="tools" size={16} /> Korrigieren ({korrigierte.length})
        </button>
      </div>

      {ansicht === "eigene" ? (
        <>
          <button
            className="next-btn"
            onClick={() => {
              setFehler([]);
              setForm(leeresFormular());
            }}
          >
            ＋ Neue Karte
          </button>

          {eigene.length ? (
            <div className="editor-liste">
              {eigene.map((k) => (
                <div className="editor-zeile" key={k.i}>
                  <span className="ez-text">
                    <b>{k.f}</b>
                    <span className="ez-sub">
                      Lehrjahr {k.j} · {k.lf}
                      {k.m ? " · Quiz" : ""}
                      {k.r ? " · Rechnen" : ""}
                    </span>
                  </span>
                  <button
                    className="ez-btn"
                    onClick={() => {
                      setFehler([]);
                      setForm(formularAus(k));
                    }}
                  >
                    Bearbeiten
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty">
              Noch keine eigenen Karten. Alles, was du hier anlegst, lernt sich genau wie die mitgelieferten Karten —
              inklusive Leitner-Boxen und Fortschritt.
            </div>
          )}

          <div className="ref-h">Eigene Karten sichern</div>
          <div className="sel-line">
            Eigene Karten liegen nur in diesem Browser. Exportiere sie, bevor du das Gerät wechselst — die Datei kannst
            du auch an Mitschüler weitergeben.
          </div>
          <div className="backup-row">
            <button className="mode-btn secondary" onClick={exportieren}>
              <Icon name="download" size={18} /> Exportieren
            </button>
            <button className="mode-btn secondary" onClick={() => fileInputRef.current?.click()}>
              <Icon name="upload" size={18} /> Importieren
            </button>
          </div>
          <input type="file" accept="application/json,.json" hidden ref={fileInputRef} onChange={importieren} />
        </>
      ) : (
        <>
          <input
            className="such"
            type="search"
            placeholder="Karte suchen, die du korrigieren willst …"
            value={suche}
            onChange={(e) => setSuche(e.target.value)}
            aria-label="Original-Karte suchen"
          />

          {korrigierte.length ? (
            <>
              <div className="ref-h">Von dir korrigiert</div>
              <div className="editor-liste">
                {korrigierte.map((k) => (
                  <div className="editor-zeile" key={k.i}>
                    <span className="ez-text">
                      <b>{k.f}</b>
                      <span className="ez-sub">
                        Karte {k.i} · {k.lf}
                      </span>
                    </span>
                    <button
                      className="ez-btn"
                      onClick={() => {
                        setFehler([]);
                        setForm(formularAus(k));
                      }}
                    >
                      Bearbeiten
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {suche.trim() ? (
            <>
              <div className="ref-h">{treffer.length} Treffer</div>
              {treffer.length ? (
                treffer.map((k) => (
                  <div className="editor-zeile" key={k.i}>
                    <span className="ez-text">
                      <b>{k.f}</b>
                      <span className="ez-sub">
                        Karte {k.i} · Lehrjahr {k.j} · {k.lf}
                      </span>
                    </span>
                    <button
                      className="ez-btn"
                      onClick={() => {
                        setFehler([]);
                        setForm(formularAus(k));
                      }}
                    >
                      Korrigieren
                    </button>
                  </div>
                ))
              ) : (
                <div className="empty">Nichts gefunden.</div>
              )}
            </>
          ) : (
            <div className="empty">Suche nach einer Karte, bei der etwas falsch ist — Frage oder Antwort reicht.</div>
          )}

          {korrigierte.length || eigene.length ? (
            <div className="footer-note">
              <button className="danger-link" onClick={allesZuruecksetzen}>
                Alle eigenen Karten &amp; Korrekturen löschen
              </button>
            </div>
          ) : null}
        </>
      )}

      <TabBar aktiv="stats" onWechsel={onTabWechsel} />
    </>
  );
}
