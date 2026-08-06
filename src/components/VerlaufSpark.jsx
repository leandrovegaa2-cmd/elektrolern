// Kleine Trendlinie (Sparkline) über den Fortschritts-Verlauf — bewusst
// minimal (keine Achsen/Legenden), zeigt nur "geht's aufwärts".
export default function VerlaufSpark({ verlauf }) {
  const punkte = (verlauf || []).slice(-30);
  if (punkte.length < 2) {
    return <div className="verlauf-leer">Verlauf sammelt sich nach ein paar Lerntagen.</div>;
  }

  const w = 300;
  const h = 48;
  const pad = 4;
  const werte = punkte.map((p) => p.prozent);
  const min = Math.min(...werte, 0);
  const max = Math.max(...werte, 100);
  const spanne = Math.max(max - min, 1);

  const koords = punkte.map((p, i) => {
    const x = pad + (i / (punkte.length - 1)) * (w - pad * 2);
    const y = h - pad - ((p.prozent - min) / spanne) * (h - pad * 2);
    return [x, y];
  });
  const pfad = koords.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ");
  const [letzteX, letzteY] = koords[koords.length - 1];
  const erster = punkte[0];
  const letzter = punkte[punkte.length - 1];

  return (
    <div className="verlauf-wrap">
      <svg className="verlauf-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img" aria-label={`Fortschritt von ${erster.prozent}% auf ${letzter.prozent}% über ${punkte.length} Tage`}>
        <path d={pfad} fill="none" stroke="url(#vgrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={letzteX} cy={letzteY} r="3.5" fill="#22d3ee" />
        <defs>
          <linearGradient id="vgrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#3b82f6" />
            <stop offset="1" stopColor="#22d3ee" />
          </linearGradient>
        </defs>
      </svg>
      <div className="sel-line" style={{ marginTop: 2 }}>
        {erster.datum} · {erster.prozent}% → {letzter.datum} · {letzter.prozent}%
      </div>
    </div>
  );
}
