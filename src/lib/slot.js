import { SLOT_EINSAETZE, SLOT_LINIEN, SLOT_SYMBOLE, SLOT_SYMBOL_MAP } from "../data/slot.js";

export function zieheSlotSymbol(zufall = Math.random) {
  const wurf = zufall() * 100;
  let summe = 0;
  for (const symbol of SLOT_SYMBOLE) {
    summe += symbol.gewicht;
    if (wurf < summe) return symbol.id;
  }
  return "wild";
}

export function erzeugeSlotRaster(zufall = Math.random) {
  return Array.from({ length: 5 }, () => Array.from({ length: 3 }, () => zieheSlotSymbol(zufall)));
}

export function werteSlotLinie(raster, linie) {
  const symbole = linie.map((reihe, walze) => raster[walze][reihe]);
  const basis = symbole.find((id) => id !== "wild") || "wild";
  let anzahl = 0;
  for (const id of symbole) {
    if (id !== basis && id !== "wild") break;
    anzahl += 1;
  }
  if (anzahl < 3) return null;
  const multiplikator = SLOT_SYMBOL_MAP[basis].auszahlung[anzahl];
  return { basis, anzahl, multiplikator };
}

export function berechneSlotGewinn(raster, einsatz) {
  const linienEinsatz = einsatz / SLOT_LINIEN.length;
  const treffer = [];
  const positionen = new Set();
  let gewinn = 0;

  SLOT_LINIEN.forEach((linie, index) => {
    const trefferInfo = werteSlotLinie(raster, linie);
    if (!trefferInfo) return;
    const auszahlung = Math.round(linienEinsatz * trefferInfo.multiplikator);
    gewinn += auszahlung;
    for (let walze = 0; walze < trefferInfo.anzahl; walze += 1) positionen.add(`${walze}-${linie[walze]}`);
    treffer.push({ linie: index + 1, auszahlung, ...trefferInfo });
  });

  const stufe = gewinn >= einsatz * 20 ? "jackpot" : gewinn >= einsatz * 5 ? "gross" : gewinn > 0 ? "gewinn" : "leer";
  return { gewinn, treffer, positionen: [...positionen], stufe };
}

export function spieleSlotRunde(state, einsatz, zufall = Math.random) {
  if (!SLOT_EINSAETZE.includes(einsatz)) return { ok: false, grund: "ungueltiger_einsatz", state };
  if (state.chips < einsatz) return { ok: false, grund: "zu_wenig_chips", state };

  const raster = erzeugeSlotRaster(zufall);
  const auswertung = berechneSlotGewinn(raster, einsatz);
  const eintrag = { einsatz, gewinn: auswertung.gewinn, stufe: auswertung.stufe, zeit: Date.now() };
  const next = {
    ...state,
    chips: state.chips - einsatz + auswertung.gewinn,
    slotVerlauf: [eintrag, ...(state.slotVerlauf || [])].slice(0, 12),
  };
  return { ok: true, state: next, einsatz, raster, ...auswertung };
}
