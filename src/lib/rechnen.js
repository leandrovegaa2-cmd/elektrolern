// Numerische Antworten prüfen — reine Funktionen, keine UI.
//
// Azubis tippen deutsch: "0,5", "2,3", manchmal "2.300" als Tausender. Der Parser
// akzeptiert beides und ist bewusst gutmütig (Leerzeichen, Einheit dahinter),
// weil eine richtig gerechnete Aufgabe nicht an der Schreibweise scheitern soll.

export const STANDARD_TOLERANZ = 0.01; // 1 % relativ — deckt Rundung auf 2 Stellen ab

/**
 * Wandelt eine Nutzereingabe in eine Zahl. Gibt null zurück, wenn nichts
 * Zählbares drinsteht.
 * Akzeptiert: "5", "5,0", "5.0", "2 300", "2.300", "0,75 A" (Einheit wird ignoriert).
 */
export function parseZahl(eingabe) {
  if (typeof eingabe === "number") return Number.isFinite(eingabe) ? eingabe : null;
  if (typeof eingabe !== "string") return null;

  let t = eingabe.trim().replace(/ /g, " ");
  if (!t) return null;

  // Alles ab dem ersten Buchstaben abschneiden (Einheit wie "A", "kW", "Ω").
  const einheitStart = t.search(/[^0-9\s.,+\-eE]/);
  if (einheitStart === 0) return null;
  if (einheitStart > 0) t = t.slice(0, einheitStart);

  t = t.replace(/\s|'/g, "");
  if (!t) return null;

  if (t.includes(",")) {
    // Deutsches Format: Komma = Dezimaltrenner, Punkte sind Tausender.
    t = t.replace(/\./g, "").replace(",", ".");
  } else if (/^[+-]?\d{1,3}(\.\d{3})+$/.test(t)) {
    // Reine Tausenderpunkte ohne Komma: "2.300" → 2300
    t = t.replace(/\./g, "");
  }

  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

/** Prüft eine Eingabe gegen die Lösung mit relativer Toleranz (Default 1 %). */
export function istRichtig(eingabe, loesung, toleranz = STANDARD_TOLERANZ) {
  const n = parseZahl(eingabe);
  if (n === null || !Number.isFinite(loesung)) return false;
  const spielraum = Math.max(Math.abs(loesung) * toleranz, 1e-9);
  return Math.abs(n - loesung) <= spielraum;
}

/** Wie weit daneben, in Prozent? Für die Rückmeldung „knapp daneben". */
export function abweichungProzent(eingabe, loesung) {
  const n = parseZahl(eingabe);
  if (n === null || !loesung) return null;
  return Math.abs((n - loesung) / loesung) * 100;
}

/** Zahl deutsch formatieren (Komma, max. `stellen` Nachkommastellen, keine Nullen am Ende). */
export function formatZahl(n, stellen = 2) {
  if (!Number.isFinite(n)) return "—";
  const gerundet = Number(n.toFixed(stellen));
  return String(gerundet).replace(".", ",");
}

/** Auf `stellen` Nachkommastellen runden — für die Aufgaben-Generatoren. */
export function runde(n, stellen = 2) {
  const f = Math.pow(10, stellen);
  return Math.round(n * f) / f;
}
