import { useEffect } from "react";

/**
 * Globale Tastenkürzel. `map` ist ein Objekt Taste→Funktion:
 *   - Ein-Zeichen-Tasten sind case-insensitive und kleingeschrieben ("l", "?", "3").
 *   - Sondertasten mit ihrem KeyboardEvent.key-Namen ("Escape", "Enter", "ArrowRight").
 *
 * Ignoriert Eingaben in Formularfeldern (input/textarea/select/contenteditable) und
 * Tasten mit Ctrl/Alt/Meta, damit normales Tippen und Browser-Shortcuts frei bleiben.
 * `enabled=false` hängt den Listener ab (z. B. während ein Dialog offen ist).
 */
export function useHotkeys(map, enabled = true) {
  useEffect(() => {
    if (!enabled || !map) return;
    function onKey(e) {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const t = e.target;
      if (
        t &&
        (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable)
      )
        return;
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const fn = map[key];
      if (fn) {
        e.preventDefault();
        fn(e);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [map, enabled]);
}
