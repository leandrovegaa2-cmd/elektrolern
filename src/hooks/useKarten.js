import { useSyncExternalStore } from "react";
import { subscribe, getKarten } from "../lib/kartenStore.js";

/**
 * Liefert die aktuell gültige Kartenliste (Original + Korrekturen + eigene
 * Karten) und rendert die Komponente neu, sobald der Editor etwas ändert.
 */
export function useKarten() {
  return useSyncExternalStore(subscribe, getKarten, getKarten);
}
