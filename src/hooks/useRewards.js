import { useCallback, useEffect, useState } from "react";
import { SKIN_MAP } from "../data/skins.js";
import { leererBelohnungsstand, normalisiereBelohnungsstand, oeffneEnergieKiste } from "../lib/lootbox.js";
import { spieleSlotRunde } from "../lib/slot.js";

const STORAGE_KEY = "elektrolern_rewards_v1";

function laden(xp) {
  try {
    const gespeichert = localStorage.getItem(STORAGE_KEY);
    return normalisiereBelohnungsstand(gespeichert ? JSON.parse(gespeichert) : null, xp);
  } catch {
    return leererBelohnungsstand(xp);
  }
}

function speichern(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function useRewards(xp) {
  const [state, setState] = useState(() => laden(xp));

  useEffect(() => {
    const aktuell = Math.max(0, Number(xp) || 0);
    setState((vorher) => {
      if (aktuell === vorher.trackedXp) return vorher;
      const verdient = Math.max(0, aktuell - vorher.trackedXp);
      return speichern({ ...vorher, chips: vorher.chips + verdient, trackedXp: aktuell });
    });
  }, [xp]);

  const kisteOeffnen = useCallback(
    (zufall) => {
      const ergebnis = oeffneEnergieKiste(state, zufall);
      if (ergebnis.ok) setState(speichern(ergebnis.state));
      return ergebnis;
    },
    [state]
  );

  const ausruesten = useCallback((skinId) => {
    setState((vorher) => {
      if (!vorher.besitz[skinId] || !SKIN_MAP[skinId]) return vorher;
      return speichern({ ...vorher, ausgeruestet: skinId });
    });
  }, []);

  const slotDrehen = useCallback(
    (einsatz, zufall) => {
      const ergebnis = spieleSlotRunde(state, einsatz, zufall);
      if (ergebnis.ok) setState(speichern(ergebnis.state));
      return ergebnis;
    },
    [state]
  );

  const reset = useCallback((neuesXp = 0) => setState(speichern(leererBelohnungsstand(neuesXp))), []);

  return { state, kisteOeffnen, ausruesten, slotDrehen, reset };
}
