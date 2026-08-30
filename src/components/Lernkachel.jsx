import MiniRing from "./MiniRing.jsx";
import Icon from "./Icon.jsx";

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
export default function Lernkachel({ farbe, badge, kicker, titel, anzahl, faellig, neu = 0, prozent, onClick }) {
  const status = faellig > 0 ? `${faellig} Wiederholungen fällig` : neu > 0 ? `${neu} neue Karten` : "alles aufgeholt";
  const label = `${kicker ? kicker + ", " : ""}${titel}: ${anzahl} Karten, ${status}, ${prozent} Prozent gelernt`;

  return (
    <button className="lk" style={{ "--lk": farbe }} onClick={onClick} aria-label={label}>
      <span className="lk-kopf">
        <span className={"lk-badge" + (String(badge).length > 1 ? " lang" : "")} aria-hidden="true">
          {/^\d+$/.test(String(badge)) ? badge : <Icon name={badge} size={19} />}
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
        ) : neu > 0 ? (
          <span className="lk-neu">{neu} neu</span>
        ) : (
          <span className="lk-fertig"><Icon name="check" size={13} /> aufgeholt</span>
        )}
      </span>

      <span className="lk-bar" aria-hidden="true">
        <i style={{ transform: `scaleX(${Math.min(prozent, 100) / 100})` }} />
      </span>
    </button>
  );
}
