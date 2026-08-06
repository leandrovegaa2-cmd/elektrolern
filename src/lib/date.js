// Reine Datumshilfen (kein Date.now() versteckt in Fachlogik — alles testbar,
// weil das Referenzdatum immer explizit übergeben wird).

/** Formatiert ein Date als lokales YYYY-MM-DD (kein UTC-Shift). */
export function toISODate(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

/** Heutiges Datum als YYYY-MM-DD, Referenzdatum optional (Default: jetzt). */
export function todayISO(ref = new Date()) {
  return toISODate(ref);
}

/** n Tage nach dem Referenzdatum, als YYYY-MM-DD. */
export function addDaysISO(n, ref = new Date()) {
  const d = new Date(ref);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}

/** Gestern relativ zum Referenzdatum, als YYYY-MM-DD. */
export function yesterdayISO(ref = new Date()) {
  return addDaysISO(-1, ref);
}
