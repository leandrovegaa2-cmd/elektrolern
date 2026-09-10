import { describe, expect, it } from "vitest";
import { MULTIMETER_SZENARIEN } from "../../data/multimeter.js";
import { evaluateMeasurement, simulateMeasurement } from "../multimeter.js";

function scenario(id) {
  return MULTIMETER_SZENARIEN.find((item) => item.id === id);
}

describe("realistischer Multimeter-Simulator", () => {
  it("zeigt ohne vollständigen Aufbau noch keinen Messwert", () => {
    expect(simulateMeasurement(scenario("steckdose-spannung"), { mode: "vac" }).status).toBe("idle");
  });

  it("misst Netzspannung mit V~ parallel zwischen L und N", () => {
    const setup = { mode: "vac", redJack: "vohm", blackJack: "com", redPoint: "l", blackPoint: "n" };
    const result = simulateMeasurement(scenario("steckdose-spannung"), setup);
    expect(result).toMatchObject({ status: "reading", display: "230.4", unit: "V" });
    expect(evaluateMeasurement(scenario("steckdose-spannung"), setup, result).correct).toBe(true);
  });

  it("akzeptiert bei Wechselspannung die vertauschten Messspitzen", () => {
    const setup = { mode: "vac", redJack: "vohm", blackJack: "com", redPoint: "n", blackPoint: "l" };
    expect(evaluateMeasurement(scenario("steckdose-spannung"), setup).correct).toBe(true);
  });

  it("zeigt bei vertauschter Gleichspannung ein Minuszeichen und bewertet die Polarität", () => {
    const setup = { mode: "vdc", redJack: "vohm", blackJack: "com", redPoint: "minus", blackPoint: "plus" };
    const result = simulateMeasurement(scenario("tuerstation-dc"), setup);
    expect(result.display).toBe("-24.18");
    expect(evaluateMeasurement(scenario("tuerstation-dc"), setup, result).correct).toBe(false);
  });

  it("stoppt eine Widerstandsmessung an einem spannungsführenden Stromkreis", () => {
    const setup = { mode: "ohm", redJack: "vohm", blackJack: "com", redPoint: "l", blackPoint: "n" };
    expect(simulateMeasurement(scenario("steckdose-spannung"), setup)).toMatchObject({ status: "danger", display: "STOP" });
  });

  it("stoppt eine parallele Strommessung", () => {
    const setup = { mode: "aac", redJack: "10a", blackJack: "com", redPoint: "l", blackPoint: "n" };
    expect(simulateMeasurement(scenario("steckdose-spannung"), setup).title).toContain("Strommessung parallel");
  });

  it("erkennt die korrekte Durchgangsprüfung im freigeschalteten Stromkreis", () => {
    const setup = { mode: "continuity", redJack: "vohm", blackJack: "com", redPoint: "switch", blackPoint: "lamp" };
    const result = simulateMeasurement(scenario("schalterleitung-durchgang"), setup);
    expect(result).toMatchObject({ status: "reading", beep: true, unit: "Ω" });
    expect(evaluateMeasurement(scenario("schalterleitung-durchgang"), setup, result).correct).toBe(true);
  });

  it("fordert für den Türöffner den mA-Eingang und eine Reihenschaltung", () => {
    const setup = { mode: "adc", redJack: "ma", blackJack: "com", redPoint: "left", blackPoint: "right" };
    expect(simulateMeasurement(scenario("tuerkontakt-strom"), setup)).toMatchObject({ status: "reading", display: "182.6", unit: "mA" });
    expect(evaluateMeasurement(scenario("tuerkontakt-strom"), setup).correct).toBe(true);
    expect(evaluateMeasurement(scenario("tuerkontakt-strom"), { ...setup, redJack: "10a" }).correct).toBe(false);
  });

  it("zeigt OL, wenn der manuelle Spannungsbereich zu klein ist", () => {
    const setup = { mode: "vac", range: "60", redJack: "vohm", blackJack: "com", redPoint: "l", blackPoint: "n" };
    const result = simulateMeasurement(scenario("steckdose-spannung"), setup);
    expect(result).toMatchObject({ status: "overload", display: "OL" });
    expect(evaluateMeasurement(scenario("steckdose-spannung"), setup, result).correct).toBe(false);
    expect(simulateMeasurement(scenario("steckdose-spannung"), { ...setup, range: "600" }).status).toBe("reading");
  });

  it("sperrt die Strommessung bei ausgelöster Gerätesicherung", () => {
    const setup = { mode: "adc", range: "auto", redJack: "ma", blackJack: "com", redPoint: "left", blackPoint: "right", fuseOk: false };
    expect(simulateMeasurement(scenario("tuerkontakt-strom"), setup)).toMatchObject({ status: "fuse", display: "FUSE" });
  });

  it("bildet typische Fälle aus Energie- und Gebäudetechnik ab", () => {
    expect(MULTIMETER_SZENARIEN).toHaveLength(8);
    expect(MULTIMETER_SZENARIEN.every((item) => item.diagnosis.options.filter((option) => option.correct).length === 1)).toBe(true);
    const knx = { mode: "vdc", range: "60", redJack: "vohm", blackJack: "com", redPoint: "plus", blackPoint: "minus" };
    expect(simulateMeasurement(scenario("knx-busspannung"), knx)).toMatchObject({ status: "reading", display: "29.2", unit: "V" });
    const drehstrom = { mode: "vac", range: "600", redJack: "vohm", blackJack: "com", redPoint: "l1", blackPoint: "l2" };
    expect(simulateMeasurement(scenario("unterverteilung-drehstrom"), drehstrom)).toMatchObject({ status: "reading", display: "400.6" });
    const licht = { mode: "vac", range: "60", redJack: "vohm", blackJack: "com", redPoint: "lsw", blackPoint: "n" };
    expect(simulateMeasurement(scenario("licht-schaltader-fehlt"), licht)).toMatchObject({ status: "reading", display: "0.0" });
  });
});
