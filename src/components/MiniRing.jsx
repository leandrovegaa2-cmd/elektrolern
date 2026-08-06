import { useEffect, useRef } from "react";

function reduzierteBewegung() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Kleiner Fortschrittsring für Auswahl-Karten — gleiche Formsprache wie der große
 * Ring auf dem Dashboard, aber einfarbig in der Farbe des Lernfelds statt im
 * Marken-Verlauf (der Verlauf braucht eine SVG-Gradient-ID, die bei 13 Ringen
 * auf einem Bildschirm nur Ärger machen würde).
 */
export default function MiniRing({ prozent, farbe }) {
  const circleRef = useRef(null);
  const r = 17;
  const u = 2 * Math.PI * r;
  const ziel = (u * (1 - Math.min(prozent, 100) / 100)).toFixed(1);

  useEffect(() => {
    const el = circleRef.current;
    if (!el || reduzierteBewegung()) return;
    el.style.strokeDashoffset = String(u.toFixed(1));
    const raf = requestAnimationFrame(() => {
      el.style.strokeDashoffset = ziel;
    });
    return () => cancelAnimationFrame(raf);
  }, [ziel, u]);

  return (
    <span className="mini-ring">
      <svg width="44" height="44" viewBox="0 0 44 44" aria-hidden="true">
        <circle className="mr-bg" cx="22" cy="22" r={r} />
        <circle
          ref={circleRef}
          className="mr-fg"
          cx="22"
          cy="22"
          r={r}
          stroke={farbe}
          strokeDasharray={u.toFixed(1)}
          strokeDashoffset={reduzierteBewegung() ? ziel : u.toFixed(1)}
        />
      </svg>
      <span className="mr-text num">{prozent}</span>
    </span>
  );
}
