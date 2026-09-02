import { describe, expect, it } from "vitest";
import { KISTENPREIS, PITY_GRENZE, leererBelohnungsstand, oeffneEnergieKiste, zieheSeltenheit } from "../lootbox.js";

const rng = (...werte) => {
  let index = 0;
  return () => werte[Math.min(index++, werte.length - 1)];
};

describe("Energie-Kiste", () => {
  it("bildet die veröffentlichten Seltenheitsgrenzen ab", () => {
    expect(zieheSeltenheit(0, () => 0.0)).toBe("standard");
    expect(zieheSeltenheit(0, () => 0.4)).toBe("ungewoehnlich");
    expect(zieheSeltenheit(0, () => 0.7)).toBe("selten");
    expect(zieheSeltenheit(0, () => 0.9)).toBe("episch");
    expect(zieheSeltenheit(0, () => 0.99)).toBe("meisterstueck");
  });

  it("garantiert in der zehnten Kiste mindestens Episch", () => {
    expect(zieheSeltenheit(PITY_GRENZE - 1, () => 0)).toBe("episch");
    expect(zieheSeltenheit(PITY_GRENZE - 1, () => 0.99)).toBe("meisterstueck");
  });

  it("zieht den Preis ab und schaltet einen Skin frei", () => {
    const vorher = leererBelohnungsstand();
    const ergebnis = oeffneEnergieKiste(vorher, rng(0, 0));
    expect(ergebnis.ok).toBe(true);
    expect(ergebnis.state.chips).toBe(vorher.chips - KISTENPREIS);
    expect(ergebnis.state.besitz[ergebnis.skin.id]).toBe(1);
    expect(ergebnis.state.ausgeruestet).toBe(ergebnis.skin.id);
  });

  it("bevorzugt innerhalb einer Seltenheit noch fehlende Werkzeuge", () => {
    const vorher = { ...leererBelohnungsstand(), besitz: { "volt-waechter": 1 } };
    const ergebnis = oeffneEnergieKiste(vorher, rng(0, 0));
    expect(ergebnis.skin.id).toBe("drehmoment-null");
    expect(ergebnis.duplikat).toBe(false);
  });

  it("wandelt unvermeidbare Duplikate in Volt-Chips um", () => {
    const vorher = { ...leererBelohnungsstand(), besitz: { "volt-waechter": 1, "drehmoment-null": 1 } };
    const ergebnis = oeffneEnergieKiste(vorher, rng(0, 0));
    expect(ergebnis.duplikat).toBe(true);
    expect(ergebnis.rueckgabe).toBe(45);
    expect(ergebnis.state.chips).toBe(vorher.chips - KISTENPREIS + 45);
  });

  it("verändert bei zu wenig Chips nichts", () => {
    const vorher = { ...leererBelohnungsstand(), chips: 249 };
    const ergebnis = oeffneEnergieKiste(vorher, rng(0, 0));
    expect(ergebnis.ok).toBe(false);
    expect(ergebnis.state).toBe(vorher);
  });
});
