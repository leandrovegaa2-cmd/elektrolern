import { useCallback, useEffect, useRef, useState } from "react";
import { getSupabase, SYNC_KONFIGURIERT, LERNSTAND_TABELLE } from "../lib/supabase.js";
import { mergeState } from "../lib/sync.js";

/**
 * Optionaler Geräte-Sync über Supabase. Hängt sich AUSSEN an useProgress an:
 * bekommt den aktuellen `state` und die `importState`-Funktion und braucht den
 * bestehenden Progress-Hook nicht anzufassen.
 *
 * Die Supabase-Lib wird lazy geladen (getSupabase()), damit sie nur bei
 * konfiguriertem Sync überhaupt in den Browser kommt — der Erststart bleibt
 * für alle ohne Sync schlank.
 *
 * Ablauf:
 *  - Ohne Env-Keys (`SYNC_KONFIGURIERT === false`) tut der Hook nichts,
 *    Status "aus". Die App läuft unverändert nur mit localStorage.
 *  - Nach Login (Magic-Link) wird der entfernte Stand geladen, per mergeState
 *    mit dem lokalen zusammengeführt (Fortschritt geht nie verloren), lokal
 *    übernommen und der gemergte Stand zurück in die Cloud geschrieben.
 *  - Danach pusht jede lokale Änderung debounced (2 s) nach Supabase.
 */
async function pushState(userId, state) {
  const supabase = await getSupabase();
  if (!supabase) return;
  await supabase
    .from(LERNSTAND_TABELLE)
    .upsert({ user_id: userId, state, updated_at: new Date().toISOString() });
}

export function useSync(state, importState) {
  const [session, setSession] = useState(null);
  const [status, setStatus] = useState(SYNC_KONFIGURIERT ? "abgemeldet" : "aus");
  const [zuletzt, setZuletzt] = useState(null);

  // Refs, damit der debounced Push immer den frischesten Wert liest, ohne den
  // Effekt bei jeder Änderung neu zu verdrahten.
  const stateRef = useRef(state);
  stateRef.current = state;
  const importRef = useRef(importState);
  importRef.current = importState;
  // Erst nach dem initialen Merge darf gepusht werden (sonst überschriebe ein
  // früher Push den noch nicht geladenen Cloud-Stand).
  const geladenRef = useRef(false);

  // Auth-Session verfolgen (Supabase-Lib wird hier erstmals nachgeladen).
  useEffect(() => {
    if (!SYNC_KONFIGURIERT) return;
    let aktiv = true;
    let unsub = null;
    getSupabase().then((supabase) => {
      if (!aktiv || !supabase) return;
      supabase.auth.getSession().then(({ data }) => aktiv && setSession(data.session));
      const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => aktiv && setSession(s));
      unsub = () => sub.subscription.unsubscribe();
    });
    return () => {
      aktiv = false;
      unsub?.();
    };
  }, []);

  // Bei bestehender Session: Cloud-Stand laden, mergen, lokal übernehmen, zurückschreiben.
  useEffect(() => {
    if (!SYNC_KONFIGURIERT) return;
    if (!session) {
      geladenRef.current = false;
      setStatus("abgemeldet");
      return;
    }
    let abgebrochen = false;
    (async () => {
      setStatus("sync");
      const supabase = await getSupabase();
      if (abgebrochen || !supabase) return;
      const { data } = await supabase
        .from(LERNSTAND_TABELLE)
        .select("state")
        .eq("user_id", session.user.id)
        .maybeSingle();
      if (abgebrochen) return;
      const remote = data?.state || null;
      // Auf einem frisch angemeldeten Gerät gelten die Cloud-Einstellungen als
      // die zuletzt gewollten (Fortschritt selbst wird ohnehin max-gemergt).
      const merged = mergeState(stateRef.current, remote, !!remote);
      importRef.current(merged);
      await pushState(session.user.id, merged);
      geladenRef.current = true;
      if (!abgebrochen) {
        setStatus("angemeldet");
        setZuletzt(new Date());
      }
    })();
    return () => {
      abgebrochen = true;
    };
  }, [session]);

  // Debounced Push nach jeder lokalen Änderung.
  useEffect(() => {
    if (!SYNC_KONFIGURIERT || !session || !geladenRef.current) return;
    const t = setTimeout(() => {
      pushState(session.user.id, stateRef.current).then(() => setZuletzt(new Date()));
    }, 2000);
    return () => clearTimeout(t);
  }, [state, session]);

  const anmelden = useCallback(async (email) => {
    const supabase = await getSupabase();
    if (!supabase) return "Sync ist nicht eingerichtet.";
    setStatus("sende");
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin },
    });
    setStatus(error ? "abgemeldet" : "link-gesendet");
    return error ? error.message : null;
  }, []);

  const abmelden = useCallback(async () => {
    const supabase = await getSupabase();
    if (supabase) await supabase.auth.signOut();
  }, []);

  return {
    verfuegbar: SYNC_KONFIGURIERT,
    email: session?.user?.email || null,
    status,
    zuletzt,
    anmelden,
    abmelden,
  };
}
