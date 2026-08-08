// Karten-Quelle mit eigenen Karten und Korrekturen.
//
// Die 247 mitgelieferten Karten stehen fest im Code (data/karten.js +
// data/rechenkarten.js). Der Editor legt NICHTS davon an — er speichert
// zusätzlich in localStorage:
//   eigene       … selbst angelegte Karten (IDs "e1", "e2", …)
//   korrekturen  … Feld-Überschreibungen für Original-Karten, Schlüssel = Karten-ID
//
// Dadurch bleibt das Original jederzeit wiederherstellbar (Korrektur löschen),
// und ein App-Update mit neuen/besseren Karten überschreibt keine eigene Arbeit.
//
// Der Store ist ein kleiner externer Store (subscribe/getSnapshot), damit
// Komponenten ihn per useSyncExternalStore lesen können, ohne dass die ganze
// App durch einen Context-Provider muss.

import { KARTEN as STAMM } from "../data/karten.js";
import { RECHENKARTEN } from "../data/rechenkarten.js";
import { BILD_KARTEN } from "../data/bildkarten.js";
import { VISUELL_KARTEN } from "../data/visuellKarten.js";

export const LS_KARTEN = "elektrolern_karten_v1";

/** Alle fest eingebauten Karten (Original-Stand, nie verändert). */
export const BASIS_KARTEN = [...STAMM, ...RECHENKARTEN, ...BILD_KARTEN, ...VISUELL_KARTEN];

export function leererKartenStore() {
  return { eigene: [], korrekturen: {} };
}

/** Ist die ID eine selbst angelegte Karte? */
export function istEigeneId(id) {
  return typeof id === "string" && /^e\d+$/.test(id);
}

/** Prüft die Pflichtfelder einer Karte. Gibt eine Fehlerliste zurück (leer = ok). */
export function karteFehler(k) {
  const fehler = [];
  if (!k || typeof k !== "object") return ["Keine Karte."];
  if (!String(k.f || "").trim()) fehler.push("Frage fehlt.");
  if (!String(k.a || "").trim()) fehler.push("Antwort fehlt.");
  if (!/^LF\d{1,2}$/.test(String(k.lf || ""))) fehler.push("Lernfeld fehlt (z. B. LF5).");
  if (![1, 2, 3, 4].includes(Number(k.j))) fehler.push("Lehrjahr muss 1–4 sein.");
  const m = k.m;
  if (m !== undefined && m !== null) {
    if (!Array.isArray(m) || m.length < 2) fehler.push("Quiz braucht mindestens 2 Antwortmöglichkeiten.");
    else if (m.some((o) => !String(o || "").trim())) fehler.push("Leere Antwortmöglichkeit.");
  }
  if (k.r) {
    if (!Number.isFinite(Number(k.r.loesung))) fehler.push("Rechen-Lösung ist keine Zahl.");
  }
  return fehler;
}

/**
 * Baut die Karten-Liste, die die App tatsächlich benutzt: Original-Karten mit
 * angewandten Korrekturen, danach die eigenen Karten. Reine Funktion (testbar).
 */
export function mergeKarten(basis, store) {
  const korr = (store && store.korrekturen) || {};
  const eigene = (store && Array.isArray(store.eigene) ? store.eigene : []).filter((k) => !karteFehler(k).length);
  const angepasst = basis.map((k) => {
    const c = korr[k.i];
    if (!c) return k;
    // Nur bekannte Felder übernehmen — kaputte Altdaten sollen die Karte nicht zerlegen.
    const neu = { ...k };
    if (typeof c.f === "string" && c.f.trim()) neu.f = c.f;
    if (typeof c.a === "string" && c.a.trim()) neu.a = c.a;
    if (Array.isArray(c.m) && c.m.length >= 2) neu.m = c.m;
    if (c.r && Number.isFinite(Number(c.r.loesung))) neu.r = { ...c.r, loesung: Number(c.r.loesung) };
    neu.korrigiert = true;
    return neu;
  });
  return [...angepasst, ...eigene.map((k) => ({ ...k, eigen: true }))];
}

/** Nächste freie ID für eine eigene Karte ("e1", "e2", …). */
export function naechsteEigeneId(store) {
  const zahlen = (store.eigene || [])
    .map((k) => (istEigeneId(k.i) ? Number(String(k.i).slice(1)) : 0))
    .filter((n) => Number.isFinite(n));
  return "e" + (Math.max(0, ...zahlen) + 1);
}

// ---------------------------------------------------------------- Persistenz

function laden() {
  try {
    const roh = JSON.parse(localStorage.getItem(LS_KARTEN));
    if (!roh || typeof roh !== "object") return leererKartenStore();
    return {
      eigene: Array.isArray(roh.eigene) ? roh.eigene : [],
      korrekturen: roh.korrekturen && typeof roh.korrekturen === "object" ? roh.korrekturen : {},
    };
  } catch {
    return leererKartenStore();
  }
}

function speichern(store) {
  try {
    localStorage.setItem(LS_KARTEN, JSON.stringify(store));
  } catch {
    // Privater Modus o. Ä. — Editor funktioniert dann nur für diese Sitzung.
  }
}

// ------------------------------------------------------------- Externer Store

let store = laden();
let snapshot = mergeKarten(BASIS_KARTEN, store);
const hoerer = new Set();

function neuBerechnen() {
  snapshot = mergeKarten(BASIS_KARTEN, store);
  hoerer.forEach((fn) => fn());
}

function schreibe(next) {
  store = next;
  speichern(store);
  neuBerechnen();
}

export function subscribe(fn) {
  hoerer.add(fn);
  return () => hoerer.delete(fn);
}

/** Aktuelle Kartenliste (stabile Referenz, bis sich etwas ändert). */
export function getKarten() {
  return snapshot;
}

/** Roher Store-Inhalt (eigene Karten + Korrekturen) — für Editor und Export. */
export function getKartenStore() {
  return store;
}

/**
 * Speichert eine Karte. Ist die ID eine eigene ("e…") oder fehlt sie ganz,
 * landet sie in `eigene`; bei einer Original-ID wird eine Korrektur abgelegt.
 * Gibt die gespeicherte ID zurück, oder null bei Validierungsfehlern.
 */
export function karteSpeichern(karte) {
  if (karteFehler(karte).length) return null;
  const rein = {
    i: karte.i,
    j: Number(karte.j),
    lf: karte.lf,
    f: String(karte.f).trim(),
    a: String(karte.a).trim(),
  };
  if (Array.isArray(karte.m) && karte.m.length >= 2) rein.m = karte.m.map((o) => String(o).trim());
  if (karte.r && Number.isFinite(Number(karte.r.loesung))) {
    rein.r = { loesung: Number(karte.r.loesung), einheit: String(karte.r.einheit || "").trim() };
    if (Number.isFinite(Number(karte.r.tol))) rein.r.tol = Number(karte.r.tol);
  }

  const istOriginal = karte.i !== undefined && karte.i !== null && karte.i !== "" && !istEigeneId(karte.i);
  if (istOriginal) {
    const korrekturen = { ...store.korrekturen, [karte.i]: rein };
    schreibe({ ...store, korrekturen });
    return karte.i;
  }

  const id = istEigeneId(karte.i) ? karte.i : naechsteEigeneId(store);
  rein.i = id;
  const vorhanden = (store.eigene || []).some((k) => k.i === id);
  const eigene = vorhanden ? store.eigene.map((k) => (k.i === id ? rein : k)) : [...(store.eigene || []), rein];
  schreibe({ ...store, eigene });
  return id;
}

/**
 * Löscht eine eigene Karte bzw. setzt eine korrigierte Original-Karte zurück.
 * Original-Karten selbst lassen sich nicht löschen.
 */
export function karteLoeschen(id) {
  if (istEigeneId(id)) {
    schreibe({ ...store, eigene: (store.eigene || []).filter((k) => k.i !== id) });
    return true;
  }
  if (store.korrekturen && store.korrekturen[id] !== undefined) {
    const korrekturen = { ...store.korrekturen };
    delete korrekturen[id];
    schreibe({ ...store, korrekturen });
    return true;
  }
  return false;
}

export function istKorrigiert(id) {
  return !!(store.korrekturen && store.korrekturen[id]);
}

/** Alle eigenen Karten + Korrekturen verwerfen (Auslieferungszustand). */
export function kartenZuruecksetzen() {
  schreibe(leererKartenStore());
}

/** Export-Objekt für die JSON-Sicherung der eigenen Karten. */
export function kartenExport() {
  return { app: "elektrolern-karten", v: 1, karten: store };
}

/**
 * Importiert eine Kartensicherung. `modus`:
 *   "ersetzen"  … alles überschreiben
 *   "ergaenzen" … eigene Karten anhängen (neue IDs), Korrekturen mischen
 * Gibt die Anzahl übernommener eigener Karten zurück, oder null bei Fehler.
 */
export function kartenImport(daten, modus = "ersetzen") {
  const k = daten && daten.karten;
  if (!k || typeof k !== "object") return null;
  const eingehendEigene = (Array.isArray(k.eigene) ? k.eigene : []).filter((x) => !karteFehler(x).length);
  const eingehendKorr = k.korrekturen && typeof k.korrekturen === "object" ? k.korrekturen : {};

  if (modus === "ersetzen") {
    schreibe({ eigene: eingehendEigene, korrekturen: eingehendKorr });
    return eingehendEigene.length;
  }

  let next = { eigene: [...(store.eigene || [])], korrekturen: { ...store.korrekturen, ...eingehendKorr } };
  eingehendEigene.forEach((karte) => {
    const id = naechsteEigeneId(next);
    next = { ...next, eigene: [...next.eigene, { ...karte, i: id }] };
  });
  schreibe(next);
  return eingehendEigene.length;
}
