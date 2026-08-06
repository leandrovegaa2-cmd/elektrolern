// Kleine Konfetti-Feier bei bestandener Prüfung / guter Session.
// DOM-Seiteneffekt bewusst außerhalb von React (kurzlebiges Overlay, das sich
// selbst wieder entfernt) — für sowas lohnt kein State/Reconciliation-Aufwand.
const FARBEN = ["#3b82f6", "#22d3ee", "#a78bfa", "#34d399", "#fbbf24", "#f472b6"];

export function reduzierteBewegung() {
  return typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function konfetti(anzahl = 46) {
  if (reduzierteBewegung()) return;
  const box = document.createElement("div");
  box.className = "konfetti";
  for (let i = 0; i < anzahl; i++) {
    const s = document.createElement("i");
    s.style.left = Math.random() * 100 + "%";
    s.style.background = FARBEN[i % FARBEN.length];
    s.style.animationDelay = Math.random() * 0.6 + "s";
    s.style.animationDuration = 1.7 + Math.random() * 1.5 + "s";
    box.appendChild(s);
  }
  document.body.appendChild(box);
  setTimeout(() => box.remove(), 4200);
}
