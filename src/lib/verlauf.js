// Fortschritts-Verlauf: ein Datenpunkt pro Tag (Gesamt-Prozent + XP), damit
// im Fortschritt-Tab eine kleine Trendlinie über die letzten Wochen gezeigt
// werden kann. Wird bei jeder Antwort aktualisiert; der heutige Punkt wird
// dabei überschrieben statt dupliziert (ein Eintrag pro Kalendertag).
import { todayISO } from "./date.js";

export const VERLAUF_MAX = 60; // ~2 Monate Tagespunkte reichen für eine Trendlinie

export function verlaufAktualisieren(verlauf, eintrag, ref = new Date()) {
  const t = todayISO(ref);
  const liste = Array.isArray(verlauf) ? [...verlauf] : [];
  const punkt = { datum: t, prozent: eintrag.prozent, xp: eintrag.xp };
  if (liste.length && liste[liste.length - 1].datum === t) {
    liste[liste.length - 1] = punkt;
  } else {
    liste.push(punkt);
  }
  return liste.length > VERLAUF_MAX ? liste.slice(liste.length - VERLAUF_MAX) : liste;
}
