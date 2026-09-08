import { FACHGESPRAECH_PHASES } from "../data/fachgespraech.js";

function normalisiere(wert) {
  return String(wert || "")
    .toLocaleLowerCase("de")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function begriffGefunden(text, begriff) {
  const gesucht = normalisiere(begriff);
  if (!gesucht) return false;
  return (` ${text} `).includes(` ${gesucht} `) || (gesucht.length > 5 && text.includes(gesucht));
}

export function bewerteFachantwort(antwort, kernpunkte = []) {
  const text = normalisiere(antwort);
  const details = kernpunkte.map((punkt) => ({
    ...punkt,
    getroffen: (punkt.begriffe || []).some((begriff) => begriffGefunden(text, begriff)),
  }));
  const treffer = details.filter((punkt) => punkt.getroffen);
  const fehlend = details.filter((punkt) => !punkt.getroffen);
  const anteil = details.length ? treffer.length / details.length : 0;
  return {
    anteil,
    prozent: Math.round(anteil * 100),
    punkte: Math.round(anteil * 10),
    treffer,
    fehlend,
    niveau: anteil >= 0.8 ? "sicher" : anteil >= 0.5 ? "solide" : "lueckenhaft",
  };
}

function mischen(liste, zufall = Math.random) {
  const kopie = [...liste];
  for (let i = kopie.length - 1; i > 0; i--) {
    const j = Math.floor(zufall() * (i + 1));
    [kopie[i], kopie[j]] = [kopie[j], kopie[i]];
  }
  return kopie;
}

export function erstelleFachgespraech(szenario, anzahl = 5, niveau = "basis", zufall = Math.random) {
  if (!szenario) return [];
  const maximum = Math.max(5, Math.min(7, Number(anzahl) || 5));
  const bevorzugt = szenario.fragen.filter((frage) => niveau === "fortgeschritten" || frage.niveau === "basis");
  // Bei einem langen Basis-Gespräch dienen die fortgeschrittenen Fragen als
  // Vertiefung. So enthält die gewählte 7er-Variante auch wirklich 7 Fragen.
  const ergaenzung = niveau === "basis" ? szenario.fragen.filter((frage) => frage.niveau !== "basis") : [];
  const pool = [...bevorzugt, ...ergaenzung];
  const kernAnzahl = maximum - 1;
  const pflicht = FACHGESPRAECH_PHASES
    .map((phase) => pool.find((frage) => frage.phase === phase.id))
    .filter(Boolean);
  const pflichtIds = new Set(pflicht.map((frage) => frage.id));
  const rest = mischen(pool.filter((frage) => !pflichtIds.has(frage.id)), zufall);
  const gewaehlt = [...pflicht, ...rest].slice(0, kernAnzahl);
  const reihenfolge = new Map(FACHGESPRAECH_PHASES.map((phase, index) => [phase.id, index]));
  return gewaehlt.sort((a, b) => reihenfolge.get(a.phase) - reihenfolge.get(b.phase));
}

export function adaptiveFolgefrage(frage, bewertung) {
  if (!frage?.folge) return null;
  const variante = bewertung.anteil >= 0.75 ? frage.folge.stark : frage.folge.schwach;
  return variante ? { ...variante, adaptiv: true, elternId: frage.id } : null;
}

export function ihkNote(punkte) {
  if (punkte >= 92) return { note: 1, text: "sehr gut" };
  if (punkte >= 81) return { note: 2, text: "gut" };
  if (punkte >= 67) return { note: 3, text: "befriedigend" };
  if (punkte >= 50) return { note: 4, text: "ausreichend" };
  if (punkte >= 30) return { note: 5, text: "mangelhaft" };
  return { note: 6, text: "ungenügend" };
}

export function fachgespraechProtokoll(antworten = []) {
  const phasen = FACHGESPRAECH_PHASES.map((phase) => {
    const passend = antworten.filter((antwort) => antwort.frage.phase === phase.id);
    const prozent = passend.length
      ? Math.round(passend.reduce((summe, antwort) => summe + antwort.bewertung.prozent, 0) / passend.length)
      : 0;
    return { ...phase, prozent, beantwortet: passend.length };
  });
  const gewichtSumme = phasen.filter((phase) => phase.beantwortet).reduce((summe, phase) => summe + phase.gewicht, 0);
  const punkte = gewichtSumme
    ? Math.round(phasen.reduce((summe, phase) => summe + (phase.beantwortet ? phase.prozent * phase.gewicht : 0), 0) / gewichtSumme)
    : 0;
  return { punkte, bewertung: ihkNote(punkte), phasen };
}
