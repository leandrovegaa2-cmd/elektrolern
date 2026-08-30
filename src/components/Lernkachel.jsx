import MiniRing from "./MiniRing.jsx";

/**
 * Auswahl-Karte für „Gezielt lernen" — einmal für Lehrjahre, einmal für Lernfelder.
 *
 * Aufbau von oben nach unten nach Wichtigkeit:
 *   Badge (Symbol/Nummer in der eigenen Farbe) · Kicker + Titel · Fortschrittsring
 *   Kartenzahl · „fällig"-Pille (die einzige Handlungszahl, deshalb farbig)
 *   Fortschrittsbalken über die volle Kartenbreite
 *
 * Die Farbe kommt als CSS-Variable rein, damit Badge, Ring und Balken garantiert
 * denselben Ton tragen, ohne dass die Farbe dreimal durch die Props wandert.
 */
export default function Lernkachel({ farbe, badge, kicker, titel, anzahl, faellig, prozent, onClick }) {
  const label = `${kicker ? kicker + ", " : ""}${titel}: ${anzahl} Karten, ${faellig} fällig, ${prozent} Prozent gelernt`;

  return (
    <button className="lk" style={{ "--lk": farbe }} onClick={onClick} aria-label={label}>
      <span className="lk-kopf">
        <span className={"lk-badge" + (String(badge).length > 1 ? " lang" : "")} aria-hidden="true">
          {badge}
        </span>
        <span className="lk-text">
          {kicker ? <span className="lk-kicker">{kicker}</span> : null}
          <span className="lk-titel">{titel}</span>
        </span>
        <MiniRing prozent={prozent} farbe={farbe} />
      </span>

      <span className="lk-zeile">
        <span className="lk-anzahl">{anzahl} Karten</span>
        {faellig > 0 ? (
          <span className="lk-faellig">
            <i aria-hidden="true" /> {faellig} fällig
          </span>
        ) : (
          <span className="lk-fertig">✓ aufgeholt</span>
        )}
      </span>

      <span className="lk-bar" aria-hidden="true">
        <i style={{ transform: `scaleX(${Math.min(prozent, 100) / 100})` }} />
      </span>
    </button>
  );
}
