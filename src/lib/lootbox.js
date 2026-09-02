import { SELTENHEITEN, SKINS } from "../data/skins.js";

export const KISTENPREIS = 250;
export const START_CHIPS = 500;
export const PITY_GRENZE = 10;

const REIHENFOLGE = ["standard", "ungewoehnlich", "selten", "episch", "meisterstueck"];

export function leererBelohnungsstand(xp = 0) {
  return {
    chips: START_CHIPS,
    trackedXp: Math.max(0, Number(xp) || 0),
    besitz: {},
    ausgeruestet: null,
    pity: 0,
    geoeffnet: 0,
    verlauf: [],
  };
}

export function normalisiereBelohnungsstand(rohdaten, xp = 0) {
  const basis = leererBelohnungsstand(xp);
  if (!rohdaten || typeof rohdaten !== "object") return basis;
  return {
    ...basis,
    ...rohdaten,
    chips: Math.max(0, Number(rohdaten.chips) || 0),
    trackedXp: Math.max(0, Number(rohdaten.trackedXp) || 0),
    besitz: rohdaten.besitz && typeof rohdaten.besitz === "object" ? rohdaten.besitz : {},
    pity: Math.max(0, Math.min(PITY_GRENZE - 1, Number(rohdaten.pity) || 0)),
    geoeffnet: Math.max(0, Number(rohdaten.geoeffnet) || 0),
    verlauf: Array.isArray(rohdaten.verlauf) ? rohdaten.verlauf.slice(0, 12) : [],
  };
}

export function zieheSeltenheit(pity = 0, zufall = Math.random) {
  if (pity >= PITY_GRENZE - 1) return zufall() < 0.8 ? "episch" : "meisterstueck";
  const wurf = zufall() * 100;
  let summe = 0;
  for (const id of REIHENFOLGE) {
    summe += SELTENHEITEN[id].chance;
    if (wurf < summe) return id;
  }
  return "meisterstueck";
}

export function oeffneEnergieKiste(state, zufall = Math.random) {
  if (state.chips < KISTENPREIS) return { ok: false, grund: "zu_wenig_chips", state };

  const seltenheit = zieheSeltenheit(state.pity, zufall);
  const alle = SKINS.filter((skin) => skin.seltenheit === seltenheit);
  const neue = alle.filter((skin) => !state.besitz[skin.id]);
  const pool = neue.length ? neue : alle;
  const index = Math.min(pool.length - 1, Math.floor(zufall() * pool.length));
  const skin = pool[index];
  const duplikat = Boolean(state.besitz[skin.id]);
  const rueckgabe = duplikat ? SELTENHEITEN[seltenheit].duplikat : 0;
  const hochwertig = seltenheit === "episch" || seltenheit === "meisterstueck";
  const eintrag = {
    skinId: skin.id,
    seltenheit,
    duplikat,
    rueckgabe,
    zeit: Date.now(),
  };
  const next = {
    ...state,
    chips: state.chips - KISTENPREIS + rueckgabe,
    besitz: { ...state.besitz, [skin.id]: (state.besitz[skin.id] || 0) + 1 },
    ausgeruestet: state.ausgeruestet || skin.id,
    pity: hochwertig ? 0 : state.pity + 1,
    geoeffnet: state.geoeffnet + 1,
    verlauf: [eintrag, ...state.verlauf].slice(0, 12),
  };
  return { ok: true, state: next, skin, duplikat, rueckgabe };
}
