import { useState } from "react";
import { MIN_TAGESZIEL, MAX_TAGESZIEL, tageszielGueltig } from "../lib/tagesziel.js";
import { empfohlenesTagesziel, planText } from "../lib/lernplan.js";
import { todayISO } from "../lib/date.js";

/** Datum als "14.09.2026" — kurz, passt in die Countdown-Pille. */
function datumKurz(iso) {
  return new Date(iso + "T00:00:00").toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

/**
 * „Heute"-Karte fürs Dashboard: Tagesziel und Prüfungs-Lernplan in EINER Karte.
 *
 * Vorher waren das zwei gestapelte Widgets, die beide dieselbe Frage beantwortet
 * haben („wie viel muss ich heute machen?"). Zusammengelegt bleibt eine Zahl im
 * Fokus — geschaffte Karten von Tagesziel — und der Prüfungstermin liefert die
 * Begründung dafür, statt eine zweite konkurrierende Zahl aufzumachen.
 */
export default function HeuteKarte({
  heuteAnzahl,
  tagesziel,
  plan,
  pruefDatum,
  onSetTagesziel,
  onSetPruefDatum,
}) {
  const [bearbeiten, setBearbeiten] = useState(null); // null | "ziel" | "termin"
  const [zielEntwurf, setZielEntwurf] = useState(String(tagesziel));
  const [terminEntwurf, setTerminEntwurf] = useState(pruefDatum || "");

  const anteil = tagesziel > 0 ? Math.min(1, heuteAnzahl / tagesziel) : 0;
  const geschafft = heuteAnzahl >= tagesziel;
  const empfehlung = empfohlenesTagesziel(plan);
  const zielZuNiedrig = empfehlung !== null && !plan.vorbei && tagesziel < empfehlung;
  const eng = plan.aktiv && !plan.machbar && !plan.vorbei;

  function zielSpeichern() {
    const n = parseInt(zielEntwurf, 10);
    if (tageszielGueltig(n)) onSetTagesziel(n);
    setBearbeiten(null);
  }

  function terminSpeichern() {
    onSetPruefDatum(terminEntwurf || null);
    setBearbeiten(null);
  }

  function terminEntfernen() {
    setTerminEntwurf("");
    onSetPruefDatum(null);
    setBearbeiten(null);
  }

  function oeffneTermin() {
    setTerminEntwurf(pruefDatum || "");
    setBearbeiten("termin");
  }

  return (
    <div className={"heute" + (eng ? " eng" : "") + (geschafft ? " fertig" : "")}>
      <div className="h-top">
        <span className="h-label">🎯 Heute</span>
        {plan.aktiv && !plan.vorbei ? (
          <button className="h-pille" onClick={oeffneTermin} title={"Prüfung am " + datumKurz(plan.datum)}>
            <b>{plan.tage}</b> {plan.tage === 1 ? "Tag" : "Tage"} bis zur Prüfung
          </button>
        ) : (
          <button className="h-pille leer" onClick={oeffneTermin}>
            📅 {plan.vorbei ? "Termin abgelaufen" : "Prüfungstermin?"}
          </button>
        )}
      </div>

      <div className="h-zahl">
        <b>{heuteAnzahl}</b>
        <span>
          / {tagesziel} Karten{geschafft ? " ✓" : ""}
        </span>
      </div>
      <div className="h-bar" aria-hidden="true">
        <i style={{ transform: `scaleX(${anteil})` }} />
      </div>

      <div className="h-text">
        {plan.aktiv && !plan.vorbei && plan.offen > 0 ? (
          <>
            <b>{plan.proTag}</b> Karten/Tag nötig · {plan.sicher} von {plan.gesamt} sitzen sicher
          </>
        ) : (
          planText(plan)
        )}
      </div>

      {zielZuNiedrig ? (
        <button className="h-uebernehmen" onClick={() => onSetTagesziel(empfehlung)}>
          Tagesziel auf {empfehlung} anheben
        </button>
      ) : null}

      {bearbeiten === "ziel" ? (
        <div className="h-edit">
          <label htmlFor="hk-ziel">Karten pro Tag</label>
          <input
            id="hk-ziel"
            type="number"
            min={MIN_TAGESZIEL}
            max={MAX_TAGESZIEL}
            value={zielEntwurf}
            onChange={(e) => setZielEntwurf(e.target.value)}
          />
          <button className="h-ok" onClick={zielSpeichern}>
            Speichern
          </button>
          <button className="h-weg" onClick={() => setBearbeiten(null)}>
            Abbrechen
          </button>
        </div>
      ) : bearbeiten === "termin" ? (
        <div className="h-edit">
          <label htmlFor="hk-termin">Prüfungstermin</label>
          <input
            id="hk-termin"
            type="date"
            min={todayISO()}
            value={terminEntwurf}
            onChange={(e) => setTerminEntwurf(e.target.value)}
          />
          <button className="h-ok" onClick={terminSpeichern}>
            Speichern
          </button>
          {plan.aktiv ? (
            <button className="h-weg" onClick={terminEntfernen}>
              Entfernen
            </button>
          ) : (
            <button className="h-weg" onClick={() => setBearbeiten(null)}>
              Abbrechen
            </button>
          )}
        </div>
      ) : (
        <div className="h-links">
          <button
            onClick={() => {
              setZielEntwurf(String(tagesziel));
              setBearbeiten("ziel");
            }}
          >
            Ziel ändern
          </button>
          <span aria-hidden="true">·</span>
          <button onClick={oeffneTermin}>{plan.aktiv ? "Termin ändern" : "Termin eintragen"}</button>
        </div>
      )}
    </div>
  );
}
