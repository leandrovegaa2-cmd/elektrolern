import { useState } from "react";
import Icon from "./Icon.jsx";

/**
 * Login-Panel für den Geräte-Sync. Zeigt sich nur, wenn Sync konfiguriert ist
 * (`sync.verfuegbar`). Anmeldung per Magic-Link — kein Passwort, damit hier
 * keine Zugangsdaten eingetippt werden müssen.
 */
export default function AccountPanel({ sync }) {
  const [email, setEmail] = useState("");
  const [fehler, setFehler] = useState(null);

  if (!sync?.verfuegbar) return null;

  const angemeldet = !!sync.email;

  async function absenden(e) {
    e.preventDefault();
    setFehler(null);
    const problem = await sync.anmelden(email.trim());
    if (problem) setFehler(problem);
  }

  const statusText = {
    sync: "Synchronisiere …",
    "link-gesendet": "Link verschickt — prüf dein Postfach.",
    sende: "Sende Link …",
  }[sync.status];

  return (
    <div className="konto">
      <div className="konto-kopf">
        <span className="konto-ico" aria-hidden="true">
          <Icon name="cloud" size={18} />
        </span>
        <span className="konto-titel">Geräte-Sync</span>
      </div>

      {angemeldet ? (
        <>
          <div className="konto-zeile">
            Angemeldet als <b>{sync.email}</b>
          </div>
          <div className="konto-sub">
            {sync.status === "sync"
              ? "Synchronisiere …"
              : sync.zuletzt
                ? "Zuletzt synchronisiert " +
                  sync.zuletzt.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" })
                : "Fortschritt wird automatisch gesichert."}
          </div>
          <button className="konto-btn abmelden" onClick={sync.abmelden}>
            Abmelden
          </button>
        </>
      ) : (
        <>
          <div className="konto-sub">
            E-Mail eintragen — du bekommst einen Anmelde-Link. Dein Lernstand ist dann auf Handy und PC gleich.
          </div>
          <form className="konto-form" onSubmit={absenden}>
            <input
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="deine@email.de"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="E-Mail für Anmelde-Link"
            />
            <button className="konto-btn" type="submit" disabled={sync.status === "sende"}>
              Link senden
            </button>
          </form>
          {statusText ? <div className="konto-status">{statusText}</div> : null}
          {fehler ? <div className="konto-status fehler">{fehler}</div> : null}
        </>
      )}
    </div>
  );
}
