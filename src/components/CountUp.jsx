import { useEffect, useRef, useState } from "react";

function reduzierteBewegung() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Zählt beim Erscheinen von 0 auf `ziel` hoch (portiert aus countUp()). */
export default function CountUp({ ziel, className }) {
  const [wert, setWert] = useState(reduzierteBewegung() || ziel === 0 ? ziel : 0);
  const startRef = useRef(null);

  useEffect(() => {
    if (reduzierteBewegung() || ziel === 0) {
      setWert(ziel);
      return;
    }
    const dauer = 750;
    let raf;
    const tick = (t) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min((t - startRef.current) / dauer, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setWert(Math.round(ziel * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [ziel]);

  return <span className={className}>{wert}</span>;
}
