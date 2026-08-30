// Merge zweier Lernstände (lokal + von Supabase geladen). Reine Funktionen,
// kein Supabase-Import → testbar wie der Rest von lib/.
//
// Leitidee: Fortschritt darf beim Sync NIE verloren gehen. Wo zwei Geräte
// unterschiedliche Stände haben, gewinnt immer der weiter fortgeschrittene
// (höhere Leitner-Box, mehr XP, längere Streak). Für Einstellungen ohne
// "besser/schlechter" (Tagesziel, Prüfungsdatum, Tageszähler) gilt
// last-writer-wins über den `updated_at`-Zeitstempel der beiden Stände.
import { STANDARD_TAGESZIEL } from "./tagesziel.js";
import { VERLAUF_MAX } from "./verlauf.js";

function leer() {
  return {
    prog: {},
    streak: { last: null, count: 0 },
    xp: 0,
    tagesziel: STANDARD_TAGESZIEL,
    heute: { datum: null, anzahl: 0 },
    verlauf: [],
    erfolge: {},
    pruefDatum: null,
    fehlerheft: {},
  };
}

/** Karten-Boxen: pro Karte gewinnt die höhere Box; Fehlerzähler = Maximum. */
export function mergeProg(a = {}, b = {}) {
  const out = {};
  for (const id of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const pa = a[id];
    const pb = b[id];
    if (!pa) {
      out[id] = pb;
      continue;
    }
    if (!pb) {
      out[id] = pa;
      continue;
    }
    const boxA = pa.box || 0;
    const boxB = pb.box || 0;
    const box = Math.max(boxA, boxB);
    // Fälligkeitsdatum vom höher einsortierten Stand; bei Gleichstand das spätere.
    let due;
    if (boxA === boxB) due = (pa.due || "") >= (pb.due || "") ? pa.due : pb.due;
    else due = box === boxA ? pa.due : pb.due;
    out[id] = { box, due, fehler: Math.max(pa.fehler || 0, pb.fehler || 0) };
  }
  return out;
}

/** Streak: höherer Zähler gewinnt, `last` = das jüngere (spätere) Datum. */
export function mergeStreak(a, b) {
  const sa = a || { last: null, count: 0 };
  const sb = b || { last: null, count: 0 };
  const daten = [sa.last, sb.last].filter(Boolean).sort();
  return { count: Math.max(sa.count || 0, sb.count || 0), last: daten.length ? daten[daten.length - 1] : null };
}

/** Verlauf: ein Punkt je Kalendertag, je Tag das Maximum aus beiden Geräten. */
export function mergeVerlauf(a = [], b = []) {
  const proTag = new Map();
  for (const p of [...(Array.isArray(a) ? a : []), ...(Array.isArray(b) ? b : [])]) {
    if (!p || !p.datum) continue;
    const vorher = proTag.get(p.datum);
    proTag.set(p.datum, {
      datum: p.datum,
      prozent: Math.max(vorher?.prozent || 0, p.prozent || 0),
      xp: Math.max(vorher?.xp || 0, p.xp || 0),
    });
  }
  const liste = [...proTag.values()].sort((x, y) => (x.datum < y.datum ? -1 : 1));
  return liste.length > VERLAUF_MAX ? liste.slice(liste.length - VERLAUF_MAX) : liste;
}

/** Erfolge: Vereinigung; bei doppeltem Abzeichen das frühere Freischalt-Datum. */
export function mergeErfolge(a = {}, b = {}) {
  const out = { ...(a || {}) };
  for (const [id, datum] of Object.entries(b || {})) {
    if (!out[id] || datum < out[id]) out[id] = datum;
  }
  return out;
}

/** Fehlerheft: Notizen folgen dem jüngeren Stand, Fehlerzahlen gehen nie verloren. */
export function mergeFehlerheft(a = {}, b = {}, remoteNeuer = false) {
  const out = {};
  for (const id of new Set([...Object.keys(a || {}), ...Object.keys(b || {})])) {
    const ea = a?.[id];
    const eb = b?.[id];
    if (!ea) { out[id] = eb; continue; }
    if (!eb) { out[id] = ea; continue; }
    const neuer = remoteNeuer ? eb : ea;
    const aelter = remoteNeuer ? ea : eb;
    out[id] = {
      ...aelter,
      ...neuer,
      anzahl: Math.max(ea.anzahl || 0, eb.anzahl || 0),
      zuletzt: (ea.zuletzt || "") >= (eb.zuletzt || "") ? ea.zuletzt : eb.zuletzt,
      richtigSeitFehler: Math.max(ea.richtigSeitFehler || 0, eb.richtigSeitFehler || 0),
    };
  }
  return out;
}

/** Tageszähler: der spätere Kalendertag; bei gleichem Tag die höhere Anzahl. */
function mergeHeute(a, b) {
  const ha = a && typeof a === "object" ? a : { datum: null, anzahl: 0 };
  const hb = b && typeof b === "object" ? b : { datum: null, anzahl: 0 };
  if (!ha.datum) return hb;
  if (!hb.datum) return ha;
  if (ha.datum === hb.datum) return { datum: ha.datum, anzahl: Math.max(ha.anzahl || 0, hb.anzahl || 0) };
  return ha.datum > hb.datum ? ha : hb;
}

/**
 * Führt lokalen und entfernten Stand zusammen.
 * @param {object} lokal  aktueller Stand auf diesem Gerät
 * @param {object} remote von Supabase geladener Stand
 * @param {boolean} remoteNeuer  true, wenn remote.updated_at jünger ist als der
 *   lokale — steuert last-writer-wins für Tagesziel/Prüfungsdatum/Tageszähler.
 */
export function mergeState(lokal, remote, remoteNeuer = false) {
  const a = lokal && typeof lokal === "object" ? lokal : leer();
  const b = remote && typeof remote === "object" ? remote : leer();
  // Für Werte ohne "besser/schlechter" zählt der jüngere Schreiber.
  const neuer = remoteNeuer ? b : a;
  const aelter = remoteNeuer ? a : b;
  const tagesziel = typeof neuer.tagesziel === "number" ? neuer.tagesziel : aelter.tagesziel;
  const pruefDatum = neuer.pruefDatum ?? aelter.pruefDatum ?? null;
  return {
    prog: mergeProg(a.prog, b.prog),
    streak: mergeStreak(a.streak, b.streak),
    xp: Math.max(a.xp || 0, b.xp || 0),
    tagesziel: typeof tagesziel === "number" ? tagesziel : STANDARD_TAGESZIEL,
    heute: mergeHeute(a.heute, b.heute),
    verlauf: mergeVerlauf(a.verlauf, b.verlauf),
    erfolge: mergeErfolge(a.erfolge, b.erfolge),
    pruefDatum,
    fehlerheft: mergeFehlerheft(a.fehlerheft, b.fehlerheft, remoteNeuer),
  };
}
