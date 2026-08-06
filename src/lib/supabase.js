// Supabase-Client für den optionalen Geräte-Sync — LAZY geladen.
//
// Die App ist offline-first: localStorage bleibt die Wahrheit. Supabase ist
// nur Backup + Merge über mehrere Geräte. Damit die ~40 KB der Supabase-Lib
// nicht im Erststart-Bundle liegen (die meisten Nutzer haben keinen Sync
// konfiguriert), wird `@supabase/supabase-js` erst per dynamischem import()
// nachgeladen, wenn Sync konfiguriert IST und tatsächlich gebraucht wird.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Synchron abfragbar (fürs UI): Ist Sync überhaupt eingerichtet? Der anon-Key
// ist bewusst public — die Zeilen-Sicherheit (RLS) in Supabase schützt die
// Daten, nicht die Geheimhaltung des Keys.
export const SYNC_KONFIGURIERT = !!(url && anonKey);

// Tabelle: lernstand (user_id uuid PK, state jsonb, updated_at timestamptz).
export const LERNSTAND_TABELLE = "lernstand";

let clientPromise = null;

/**
 * Liefert den Supabase-Client (einmalig erzeugt) oder null, wenn kein Sync
 * konfiguriert ist. Der erste Aufruf lädt die Lib als eigenen Chunk nach.
 */
export function getSupabase() {
  if (!SYNC_KONFIGURIERT) return Promise.resolve(null);
  if (!clientPromise) {
    clientPromise = import("@supabase/supabase-js").then(({ createClient }) => createClient(url, anonKey));
  }
  return clientPromise;
}
