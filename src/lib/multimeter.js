import { MULTIMETER_MODES } from "../data/multimeter.js";

const modeById = Object.fromEntries(MULTIMETER_MODES.map((mode) => [mode.id, mode]));

function samePair(a, b, allowReverse = true) {
  if (!a || !b) return false;
  const direct = a[0] === b[0] && a[1] === b[1];
  const reverse = a[0] === b[1] && a[1] === b[0];
  return direct || (allowReverse && reverse);
}

function findMeasurement(scenario, setup) {
  return scenario.measurements.find((measurement) =>
    measurement.mode === setup.mode && samePair(measurement.between, [setup.redPoint, setup.blackPoint], true)
  );
}

function reversed(measurement, setup) {
  return measurement.between[0] === setup.blackPoint && measurement.between[1] === setup.redPoint;
}

export function simulateMeasurement(scenario, setup) {
  const mode = modeById[setup.mode] || modeById.off;
  if (mode.type === "off") {
    return { status: "idle", display: "OFF", unit: "", title: "Messgerät ausgeschaltet", explanation: "Wähle zuerst eine Messart." };
  }
  if (!setup.redJack || !setup.blackJack) {
    return { status: "idle", display: "----", unit: "", title: "Messleitungen nicht vollständig", explanation: "Stecke beide Leitungen in die passenden Buchsen." };
  }
  if (setup.blackJack !== "com") {
    return { status: "invalid", display: "LEAd", unit: "", title: "Schwarze Leitung falsch gesteckt", explanation: "Die schwarze Messleitung gehört für diese Aufgaben in COM." };
  }
  if (!setup.redPoint || !setup.blackPoint) {
    return { status: "idle", display: "----", unit: "", title: "Messspitzen frei", explanation: "Wähle Rot oder Schwarz und setze beide Messspitzen an Messpunkte." };
  }
  if (setup.redPoint === setup.blackPoint) {
    return { status: "invalid", display: "0.00", unit: mode.type === "resistance" ? "Ω" : "V", title: "Gleicher Messpunkt", explanation: "Beide Spitzen liegen am selben Potential. Wähle zwei unterschiedliche Messpunkte." };
  }

  if (mode.type === "resistance" && scenario.energized) {
    return {
      status: "danger",
      display: "STOP",
      unit: "",
      title: "Gefahr: Widerstand unter Spannung",
      explanation: "Ω und Durchgang werden nur am spannungsfreien Stromkreis verwendet. Freischalten, sichern und Spannungsfreiheit mit geeignetem Prüfgerät feststellen.",
    };
  }

  const pair = [setup.redPoint, setup.blackPoint];
  if (mode.type === "current" && scenario.energized && !samePair(scenario.currentPath, pair, true)) {
    return {
      status: "danger",
      display: "STOP",
      unit: "",
      title: "Gefahr: Strommessung parallel",
      explanation: "Im Strombereich hat das Messgerät einen sehr kleinen Innenwiderstand. Parallel an der Quelle drohen Kurzschluss und Lichtbogen. Strom nur in Reihe messen.",
    };
  }

  const requiredJack = mode.type === "current" ? (setup.redJack === "10a" || setup.redJack === "ma") : setup.redJack === "vohm";
  if (!requiredJack) {
    return {
      status: "invalid",
      display: "LEAd",
      unit: "",
      title: "Rote Leitung in falscher Buchse",
      explanation: mode.type === "current" ? "Für eine Strommessung muss Rot in einem abgesicherten Strom-Eingang stecken." : "Für Spannung, Widerstand und Durchgang gehört Rot in V/Ω.",
    };
  }

  const measurement = findMeasurement(scenario, setup);
  if (!measurement) {
    return {
      status: "invalid",
      display: mode.type === "resistance" ? "OL" : "0.00",
      unit: mode.type === "current" ? "A" : mode.type === "resistance" ? "Ω" : "V",
      title: "Messaufbau liefert nicht den gesuchten Wert",
      explanation: "Messart oder Messpunkte passen nicht zum Auftrag. Prüfe Schaltungsart, Messgröße und Bezugspunkt.",
    };
  }

  const dcReverse = setup.mode === "vdc" && reversed(measurement, setup);
  const tenAmpRange = mode.type === "current" && setup.redJack === "10a" && measurement.unit === "mA";
  const shownDisplay = tenAmpRange ? (measurement.value / 1000).toFixed(3) : measurement.display;
  return {
    status: "reading",
    display: dcReverse ? `-${shownDisplay}` : shownDisplay,
    unit: tenAmpRange ? "A" : measurement.unit,
    beep: !!measurement.beep,
    title: dcReverse ? "Polarität vertauscht" : "Messwert stabil",
    explanation: dcReverse ? "Das Minuszeichen zeigt: Rot liegt am niedrigeren Potential. Tausche die Messspitzen für die geforderte Polarität." : measurement.interpretation,
  };
}

export function evaluateMeasurement(scenario, setup, result = simulateMeasurement(scenario, setup)) {
  const issues = [];
  const expected = scenario.expected;
  if (result.status === "danger") issues.push(result.explanation);
  else {
    if (setup.blackJack !== expected.blackJack) issues.push("Schwarze Leitung in COM stecken.");
    if (setup.redJack !== expected.redJack) issues.push(`Rote Leitung in ${expected.redJack === "vohm" ? "V/Ω" : expected.redJack === "ma" ? "mA/µA" : "10 A"} stecken.`);
    if (setup.mode !== expected.mode) {
      const expectedMode = modeById[expected.mode];
      issues.push(`Drehschalter auf ${expectedMode.short} (${expectedMode.label}) stellen.`);
    }
    if (!samePair(expected.pair, [setup.redPoint, setup.blackPoint], expected.allowReverse)) {
      issues.push("Messspitzen an die im Auftrag verlangten Messpunkte setzen.");
    }
    if (result.status !== "reading" && issues.length === 0) issues.push(result.explanation);
  }
  return { correct: issues.length === 0 && result.status === "reading", issues };
}
