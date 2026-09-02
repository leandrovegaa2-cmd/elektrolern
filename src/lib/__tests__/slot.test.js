import { describe, expect, it } from "vitest";
import { berechneSlotGewinn, erzeugeSlotRaster, spieleSlotRunde, werteSlotLinie, zieheSlotSymbol } from "../slot.js";
import { leererBelohnungsstand } from "../lootbox.js";

describe("Volt Vault Slot", () => {
  it("zieht Symbole anhand der veröffentlichten Gewichtung", () => {
    expect(zieheSlotSymbol(() => 0)).toBe("strom");
    expect(zieheSlotSymbol(() => 0.4)).toBe("schaltung");
    expect(zieheSlotSymbol(() => 0.99)).toBe("wild");
  });

  it("erzeugt fünf Walzen mit jeweils drei Symbolen", () => {
    const raster = erzeugeSlotRaster(() => 0.5);
    expect(raster).toHaveLength(5);
    raster.forEach((walze) => expect(walze).toHaveLength(3));
  });

  it("wertet gleiche Symbole von links nach rechts", () => {
    const raster = [
      ["kern", "strom", "strom"], ["kern", "strom", "strom"], ["kern", "strom", "strom"],
      ["werk", "strom", "strom"], ["kern", "strom", "strom"],
    ];
    expect(werteSlotLinie(raster, [0, 0, 0, 0, 0])).toMatchObject({ basis: "kern", anzahl: 3, multiplikator: 32 });
  });

  it("setzt Wild-Symbole für das folgende Symbol ein", () => {
    const raster = [
      ["wild", "strom", "strom"], ["wild", "strom", "strom"], ["krone", "strom", "strom"],
      ["krone", "strom", "strom"], ["werk", "strom", "strom"],
    ];
    expect(werteSlotLinie(raster, [0, 0, 0, 0, 0])).toMatchObject({ basis: "krone", anzahl: 4, multiplikator: 350 });
  });

  it("berechnet Gewinnlinien und markiert beteiligte Felder", () => {
    const raster = Array.from({ length: 5 }, () => ["strom", "schaltung", "werk"]);
    const ergebnis = berechneSlotGewinn(raster, 10);
    expect(ergebnis.gewinn).toBeGreaterThan(0);
    expect(ergebnis.treffer).toHaveLength(3);
    expect(ergebnis.positionen).toContain("4-2");
  });

  it("zieht den Einsatz ab und schreibt die Runde in den Verlauf", () => {
    const vorher = leererBelohnungsstand();
    const ergebnis = spieleSlotRunde(vorher, 25, () => 0);
    expect(ergebnis.ok).toBe(true);
    expect(ergebnis.state.chips).toBe(vorher.chips - 25 + ergebnis.gewinn);
    expect(ergebnis.state.slotVerlauf).toHaveLength(1);
  });

  it("blockiert ungültige oder nicht gedeckte Einsätze", () => {
    const vorher = { ...leererBelohnungsstand(), chips: 9 };
    expect(spieleSlotRunde(vorher, 10, () => 0).grund).toBe("zu_wenig_chips");
    expect(spieleSlotRunde(vorher, 17, () => 0).grund).toBe("ungueltiger_einsatz");
  });
});
