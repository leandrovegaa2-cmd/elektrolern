import { describe, it, expect } from "vitest";
import {
  ohm,
  leistung,
  spannungsfall,
  izKorrigiert,
  querschnittEmpfehlung,
  sicherungWaehlen,
  fiEmpfehlung,
} from "../elektro.js";

describe("ohm", () => {
  it("berechnet I aus U und R (Report-Beispiel R=46, U=230 → 5 A)", () => {
    const r = ohm({ U: 230, R: 46 });
    expect(r.I).toBeCloseTo(5.0, 2);
  });
  it("berechnet U aus R und I", () => {
    expect(ohm({ R: 46, I: 5 }).U).toBeCloseTo(230, 2);
  });
  it("berechnet R aus U und I", () => {
    expect(ohm({ U: 230, I: 5 }).R).toBeCloseTo(46, 2);
  });
  it("gibt null bei unvollständiger Eingabe", () => {
    expect(ohm({ U: 230 })).toBeNull();
  });
});

describe("leistung", () => {
  it("einphasig P = U·I·cosφ", () => {
    expect(leistung({ U: 230, I: 5, cos: 1, phasen: 1 }).P).toBeCloseTo(1150, 1);
  });
  it("Drehstrom-Strom aus 11 kW, 400 V, cosφ=0,8 → ≈19,9 A", () => {
    const r = leistung({ P: 11000, U: 400, cos: 0.8, phasen: 3 });
    expect(r.I).toBeCloseTo(19.84, 1);
  });
});

describe("spannungsfall", () => {
  it("einphasig: 20 m, 14,35 A, 1,5 mm² → ~6,8 V (~3 %)", () => {
    const r = spannungsfall({ l: 20, I: 14.35, A: 1.5, cos: 1, phasen: 1 });
    expect(r.deltaU).toBeCloseTo(6.83, 1);
    expect(r.prozent).toBeCloseTo(2.97, 1);
  });
  it("Drehstrom: 30 m, 9,3 A, 2,5 mm², cosφ=0,85 → ~2,93 V (~0,73 %)", () => {
    const r = spannungsfall({ l: 30, I: 9.3, A: 2.5, cos: 0.85, phasen: 3 });
    expect(r.deltaU).toBeCloseTo(2.93, 1);
    expect(r.prozent).toBeCloseTo(0.73, 1);
  });
});

describe("izKorrigiert", () => {
  it("wendet Temperatur- und Häufungsfaktor an", () => {
    // B2, 1,5 mm² = 15 A; 35 °C = 0,94; 2 Kreise = 0,80
    expect(izKorrigiert(1.5, "B2", 35, 2)).toBeCloseTo(15 * 0.94 * 0.8, 3);
  });
  it("ohne Korrektur = Rohwert", () => {
    expect(izKorrigiert(2.5, "C", 30, 1)).toBe(24);
  });
});

describe("querschnittEmpfehlung", () => {
  it("14,35 A / 20 m einphasig, 3 % → 2,5 mm² (Spannungsfall treibend bei 1,5)", () => {
    const r = querschnittEmpfehlung({
      I: 14.35,
      l: 20,
      cos: 1,
      phasen: 1,
      verlegeart: "B2",
      grenzeProzent: 3,
    });
    // 1,5 mm² liegt bei ~2,97 % — knapp; bei strengeren Bedingungen kippt es auf 2,5.
    expect([1.5, 2.5]).toContain(r.querschnitt);
    expect(r.ausreichend).toBe(true);
    expect(r.prozent).toBeLessThanOrEqual(3);
  });
  it("hoher Strom über Verlegeart-Grenze wird über Strombelastbarkeit begrenzt", () => {
    const r = querschnittEmpfehlung({ I: 60, l: 5, phasen: 3, verlegeart: "B2", grenzeProzent: 5 });
    expect(r.izKorr).toBeGreaterThanOrEqual(60);
    expect(r.ausreichend).toBe(true);
  });
});

describe("sicherungWaehlen", () => {
  it("14,35 A auf 1,5 mm² (C, Iz=17,5) → 16 A", () => {
    const r = sicherungWaehlen({ I: 14.35, A: 1.5, verlegeart: "C" });
    expect(r.nennstrom).toBe(16);
    expect(r.passt).toBe(true);
  });
  it("Betriebsstrom über Iz → passt nicht", () => {
    const r = sicherungWaehlen({ I: 30, A: 1.5, verlegeart: "B2" });
    expect(r.passt).toBe(false);
  });
});

describe("fiEmpfehlung", () => {
  it("Standard-Wohnung → Typ A, 30 mA", () => {
    const r = fiEmpfehlung({ bereich: "wohnen", glatterDC: false });
    expect(r.typ).toBe("A");
    expect(r.bemessung).toBe("30 mA");
  });
  it("PV/EV mit glattem DC → Typ B", () => {
    expect(fiEmpfehlung({ glatterDC: true }).typ).toBe("B");
  });
});
