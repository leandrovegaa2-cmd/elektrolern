import { useEffect, useRef } from "react";

function reduzierteBewegung() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Kreisförmiger Fortschritts-Ring mit Füll-Animation (portiert aus ringHTML()). */
export default function Ring({ prozent, caption }) {
  const circleRef = useRef(null);
  const r = 34;
  const u = 2 * Math.PI * r;
  const ziel = (u * (1 - Math.min(prozent, 100) / 100)).toFixed(1);

  useEffect(() => {
    const el = circleRef.current;
    if (!el) return;
    el.style.strokeDashoffset = String(u.toFixed(1));
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        el.style.strokeDashoffset = ziel;
      });
      el.dataset.raf2 = raf2;
    });
    return () => cancelAnimationFrame(raf1);
  }, [ziel, u]);

  return (
    <div className="ring-wrap">
      <svg className="ring" width="84" height="84" viewBox="0 0 84 84" aria-hidden="true">
        <defs>
          <linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
        <circle className="ring-bg" cx="42" cy="42" r={r} />
        <circle
          ref={circleRef}
          className="ring-fg"
          cx="42"
          cy="42"
          r={r}
          strokeDasharray={u.toFixed(1)}
          strokeDashoffset={reduzierteBewegung() ? ziel : u.toFixed(1)}
        />
      </svg>
      <div className="ring-text num">{prozent}%</div>
      {caption ? <div className="ring-cap">{caption}</div> : null}
    </div>
  );
}
