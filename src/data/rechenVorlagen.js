// Rechentrainer — Aufgaben-Vorlagen mit Zufallswerten.
//
// Jede Vorlage baut aus einem injizierbaren Zufallsgenerator (`rng`, für Tests)
// eine konkrete Aufgabe: Frage, Lösung, Einheit und Rechenweg. Die Werte werden
// bewusst so gewählt, dass die Ergebnisse „prüfungsnah" aussehen (230 V, 400 V,
// 50 Hz, gängige Querschnitte) und nicht zu krummen Zahlen führen.
//
// Rückgabeformat einer Vorlage:
//   { frage, loesung, einheit, weg, toleranz? }

import { runde } from "../lib/rechnen.js";
import { SICHERUNG_REIHE } from "./vde.js";

const KAPPA_CU = 56; // Leitwert Kupfer in m/(Ω·mm²)
const RHO_CU = 0.0178; // spezifischer Widerstand Kupfer in Ω·mm²/m

function ganz(min, max, rng) {
  return min + Math.floor(rng() * (max - min + 1));
}

function ausListe(liste, rng) {
  return liste[Math.floor(rng() * liste.length)];
}

/**
 * Deutsche Zahl fürs Einsetzen in Frage-/Wegtexte. Ohne feste Stellenzahl wird
 * die Genauigkeit an die Größenordnung angepasst — sonst wäre der im Rechenweg
 * gezeigte Wert bei kleinen Ergebnissen (0,2857 → „0,29") gerundeter als die
 * Toleranz erlaubt, und die App würde ihre eigene Musterlösung ablehnen.
 */
function z(n, stellen) {
  if (stellen === undefined) {
    const abs = Math.abs(n);
    stellen = abs === 0 ? 0 : abs < 1 ? 4 : abs < 10 ? 3 : 2;
  }
  return String(runde(n, stellen)).replace(".", ",");
}

export const RECHEN_VORLAGEN = [
  {
    id: "ohm-i",
    titel: "Strom aus Spannung und Widerstand",
    lf: "LF1",
    bau(rng) {
      const U = ausListe([12, 24, 230, 400], rng);
      const R = ganz(2, 120, rng);
      return {
        frage: `An einem Widerstand von ${R} Ω liegen ${U} V an. Wie groß ist der Strom I?`,
        loesung: U / R,
        einheit: "A",
        weg: `I = U / R = ${U} V / ${R} Ω = ${z(U / R)} A`,
      };
    },
  },
  {
    id: "ohm-u",
    titel: "Spannung aus Strom und Widerstand",
    lf: "LF1",
    bau(rng) {
      const I = runde(ganz(2, 120, rng) / 10, 1);
      const R = ganz(5, 200, rng);
      return {
        frage: `Durch einen Widerstand von ${R} Ω fließen ${z(I, 1)} A. Welche Spannung fällt an ihm ab?`,
        loesung: I * R,
        einheit: "V",
        weg: `U = R · I = ${R} Ω · ${z(I, 1)} A = ${z(I * R)} V`,
      };
    },
  },
  {
    id: "ohm-r",
    titel: "Widerstand aus Spannung und Strom",
    lf: "LF1",
    bau(rng) {
      const U = ausListe([12, 24, 230, 400], rng);
      const I = runde(ganz(5, 160, rng) / 10, 1);
      return {
        frage: `Ein Verbraucher zieht bei ${U} V einen Strom von ${z(I, 1)} A. Wie groß ist sein Widerstand?`,
        loesung: U / I,
        einheit: "Ω",
        weg: `R = U / I = ${U} V / ${z(I, 1)} A = ${z(U / I)} Ω`,
      };
    },
  },
  {
    id: "leistung-p",
    titel: "Leistung aus Spannung und Strom",
    lf: "LF1",
    bau(rng) {
      const U = ausListe([230, 400, 24], rng);
      const I = runde(ganz(3, 160, rng) / 10, 1);
      return {
        frage: `Ein Gerät zieht bei ${U} V einen Strom von ${z(I, 1)} A. Welche Leistung nimmt es auf?`,
        loesung: U * I,
        einheit: "W",
        weg: `P = U · I = ${U} V · ${z(I, 1)} A = ${z(U * I)} W`,
      };
    },
  },
  {
    id: "leistung-i",
    titel: "Strom aus Leistung und Spannung",
    lf: "LF1",
    bau(rng) {
      const P = ausListe([1000, 1500, 2000, 2300, 3500], rng);
      const U = 230;
      return {
        frage: `Ein Heizgerät mit ${P} W hängt an ${U} V. Welchen Strom nimmt es auf?`,
        loesung: P / U,
        einheit: "A",
        weg: `I = P / U = ${P} W / ${U} V = ${z(P / U)} A`,
      };
    },
  },
  {
    id: "arbeit-kwh",
    titel: "Elektrische Arbeit in kWh",
    lf: "LF1",
    bau(rng) {
      const P = ausListe([600, 900, 1200, 2000, 2500], rng);
      const t = ganz(2, 12, rng);
      return {
        frage: `Ein Verbraucher mit ${P} W läuft ${t} Stunden. Wie viel elektrische Arbeit in kWh?`,
        loesung: (P / 1000) * t,
        einheit: "kWh",
        weg: `W = P · t = ${z(P / 1000)} kW · ${t} h = ${z((P / 1000) * t)} kWh`,
      };
    },
  },
  {
    id: "stromkosten",
    titel: "Stromkosten",
    lf: "LF1",
    bau(rng) {
      const kwh = ganz(20, 400, rng);
      const cent = ausListe([28, 32, 35, 40], rng);
      return {
        frage: `${kwh} kWh kosten bei ${cent} ct/kWh wie viel Euro?`,
        loesung: (kwh * cent) / 100,
        einheit: "€",
        weg: `Kosten = ${kwh} kWh · ${z(cent / 100)} €/kWh = ${z((kwh * cent) / 100)} €`,
      };
    },
  },
  {
    id: "reihe-r",
    titel: "Reihenschaltung — Gesamtwiderstand",
    lf: "LF1",
    bau(rng) {
      const R1 = ganz(10, 200, rng);
      const R2 = ganz(10, 200, rng);
      const R3 = ganz(10, 200, rng);
      return {
        frage: `Drei Widerstände in Reihe: ${R1} Ω, ${R2} Ω und ${R3} Ω. Wie groß ist der Gesamtwiderstand?`,
        loesung: R1 + R2 + R3,
        einheit: "Ω",
        weg: `Rges = R1 + R2 + R3 = ${R1} + ${R2} + ${R3} = ${R1 + R2 + R3} Ω`,
      };
    },
  },
  {
    id: "parallel-r",
    titel: "Parallelschaltung — Gesamtwiderstand",
    lf: "LF1",
    bau(rng) {
      const R1 = ganz(10, 200, rng);
      const R2 = ganz(10, 200, rng);
      const rges = (R1 * R2) / (R1 + R2);
      return {
        frage: `Zwei Widerstände parallel: ${R1} Ω und ${R2} Ω. Wie groß ist der Gesamtwiderstand?`,
        loesung: rges,
        einheit: "Ω",
        weg: `Rges = (R1 · R2) / (R1 + R2) = (${R1} · ${R2}) / ${R1 + R2} = ${z(rges)} Ω`,
      };
    },
  },
  {
    id: "leiterwiderstand",
    titel: "Leiterwiderstand aus Länge und Querschnitt",
    lf: "LF2",
    bau(rng) {
      const l = ausListe([10, 25, 40, 60, 80, 120], rng);
      const A = ausListe([1.5, 2.5, 4, 6, 10], rng);
      const R = (RHO_CU * l) / A;
      return {
        frage: `Eine Kupferleitung ist ${l} m lang und hat ${z(A, 1)} mm² Querschnitt (ρ = 0,0178 Ω·mm²/m). Wie groß ist ihr Widerstand?`,
        loesung: R,
        einheit: "Ω",
        toleranz: 0.02,
        weg: `R = ρ · l / A = 0,0178 · ${l} / ${z(A, 1)} = ${z(R, 4)} Ω`,
      };
    },
  },
  {
    id: "spannungsfall-1ph",
    titel: "Spannungsfall Wechselstrom (2-Leiter)",
    lf: "LF2",
    bau(rng) {
      const l = ausListe([15, 20, 30, 45, 60], rng);
      const I = ausListe([10, 13, 16, 20, 25], rng);
      const A = ausListe([1.5, 2.5, 4, 6], rng);
      const dU = (2 * l * I) / (KAPPA_CU * A);
      return {
        frage: `Wechselstromkreis: Leitungslänge ${l} m, Strom ${I} A, Querschnitt ${z(A, 1)} mm², κ = 56 m/(Ω·mm²). Wie groß ist der Spannungsfall ΔU?`,
        loesung: dU,
        einheit: "V",
        toleranz: 0.02,
        weg: `ΔU = (2 · l · I) / (κ · A) = (2 · ${l} · ${I}) / (56 · ${z(A, 1)}) = ${z(dU)} V`,
      };
    },
  },
  {
    id: "spannungsfall-3ph",
    titel: "Spannungsfall Drehstrom",
    lf: "LF2",
    bau(rng) {
      const l = ausListe([25, 40, 55, 70, 90], rng);
      const I = ausListe([16, 20, 25, 32, 40], rng);
      const A = ausListe([4, 6, 10, 16], rng);
      const dU = (Math.sqrt(3) * l * I) / (KAPPA_CU * A);
      return {
        frage: `Drehstromkreis (cos φ = 1): Länge ${l} m, Strom ${I} A, Querschnitt ${A} mm², κ = 56 m/(Ω·mm²). Wie groß ist ΔU?`,
        loesung: dU,
        einheit: "V",
        toleranz: 0.02,
        weg: `ΔU = (√3 · l · I) / (κ · A) = (1,732 · ${l} · ${I}) / (56 · ${A}) = ${z(dU)} V`,
      };
    },
  },
  {
    id: "drehstrom-p",
    titel: "Drehstromleistung",
    lf: "LF5",
    bau(rng) {
      const U = 400;
      const I = ausListe([6, 8, 10, 12, 16, 20], rng);
      const cos = ausListe([0.75, 0.8, 0.85, 0.9], rng);
      const P = Math.sqrt(3) * U * I * cos;
      return {
        frage: `Drehstromverbraucher an ${U} V, Strom ${I} A, cos φ = ${z(cos, 2)}. Wie groß ist die Wirkleistung P?`,
        loesung: P,
        einheit: "W",
        toleranz: 0.02,
        weg: `P = √3 · U · I · cos φ = 1,732 · ${U} · ${I} · ${z(cos, 2)} = ${z(P, 0)} W`,
      };
    },
  },
  {
    id: "effektivwert",
    titel: "Effektivwert aus Scheitelwert",
    lf: "LF5",
    bau(rng) {
      const u = ausListe([325, 100, 50, 566, 24], rng);
      return {
        frage: `Eine Sinusspannung hat den Scheitelwert û = ${u} V. Wie groß ist der Effektivwert U?`,
        loesung: u / Math.sqrt(2),
        einheit: "V",
        weg: `U = û / √2 = ${u} V / 1,414 = ${z(u / Math.sqrt(2))} V`,
      };
    },
  },
  {
    id: "drehfeld-n",
    titel: "Synchrondrehzahl aus Polpaarzahl",
    lf: "LF8",
    bau(rng) {
      const p = ganz(1, 4, rng);
      const f = 50;
      return {
        frage: `Ein Drehstrommotor mit ${p} Polpaar${p === 1 ? "" : "en"} läuft am 50-Hz-Netz. Wie groß ist die Synchrondrehzahl n₀ in 1/min?`,
        loesung: (f * 60) / p,
        einheit: "1/min",
        weg: `n₀ = f · 60 / p = 50 · 60 / ${p} = ${(f * 60) / p} 1/min`,
      };
    },
  },
  {
    id: "schlupf",
    titel: "Schlupf eines Asynchronmotors",
    lf: "LF8",
    bau(rng) {
      const p = ganz(1, 3, rng);
      const n0 = 3000 / p;
      const n = n0 - ganz(30, 160, rng);
      const s = ((n0 - n) / n0) * 100;
      return {
        frage: `Ein Asynchronmotor hat n₀ = ${n0} 1/min und läuft mit n = ${n} 1/min. Wie groß ist der Schlupf in %?`,
        loesung: s,
        einheit: "%",
        toleranz: 0.02,
        weg: `s = (n₀ − n) / n₀ · 100 % = (${n0} − ${n}) / ${n0} · 100 % = ${z(s)} %`,
      };
    },
  },
  {
    id: "wirkungsgrad",
    titel: "Wirkungsgrad",
    lf: "LF8",
    bau(rng) {
      const Pab = ausListe([1100, 1500, 2200, 3000, 4000, 5500], rng);
      const verlust = ganz(120, 600, rng);
      const Pzu = Pab + verlust;
      const eta = (Pab / Pzu) * 100;
      return {
        frage: `Ein Motor gibt ${Pab} W ab und nimmt ${Pzu} W auf. Wie groß ist der Wirkungsgrad in %?`,
        loesung: eta,
        einheit: "%",
        weg: `η = Pab / Pzu · 100 % = ${Pab} / ${Pzu} · 100 % = ${z(eta)} %`,
      };
    },
  },
  {
    id: "trafo",
    titel: "Transformator — Sekundärspannung",
    lf: "LF5",
    bau(rng) {
      const N1 = ausListe([500, 800, 1000, 1200], rng);
      const N2 = ausListe([20, 40, 50, 100], rng);
      const U1 = 230;
      const U2 = (U1 * N2) / N1;
      return {
        frage: `Ein Trafo hat N1 = ${N1} und N2 = ${N2} Windungen. Bei U1 = ${U1} V — wie groß ist U2?`,
        loesung: U2,
        einheit: "V",
        weg: `U1/U2 = N1/N2 → U2 = U1 · N2 / N1 = ${U1} · ${N2} / ${N1} = ${z(U2)} V`,
      };
    },
  },
  {
    id: "spannungsfall-prozent",
    titel: "Spannungsfall in Prozent",
    lf: "LF2",
    bau(rng) {
      const l = ausListe([15, 20, 25, 30, 40], rng);
      const I = ausListe([10, 13, 16, 20], rng);
      const A = ausListe([1.5, 2.5, 4], rng);
      const dU = (2 * l * I) / (KAPPA_CU * A);
      const prozent = (dU / 230) * 100;
      return {
        frage: `Wechselstromkreis 230 V: Länge ${l} m, Strom ${I} A, Querschnitt ${z(A, 1)} mm², κ = 56. Wie groß ist der Spannungsfall in Prozent?`,
        loesung: prozent,
        einheit: "%",
        toleranz: 0.03,
        weg: `ΔU = (2 · l · I) / (κ · A) = (2 · ${l} · ${I}) / (56 · ${z(A, 1)}) = ${z(dU)} V\nΔu = ΔU / 230 V · 100 % = ${z(prozent)} %`,
      };
    },
  },
  {
    id: "leistung-drehstrom-i",
    titel: "Strom aus Drehstromleistung",
    lf: "LF5",
    bau(rng) {
      const P = ausListe([4000, 5500, 7500, 11000, 15000], rng);
      const U = 400;
      const cos = ausListe([0.8, 0.85, 0.9], rng);
      const I = P / (Math.sqrt(3) * U * cos);
      return {
        frage: `Ein Drehstromverbraucher nimmt ${P} W bei ${U} V auf (cos φ = ${z(cos, 2)}). Wie groß ist der Strom I?`,
        loesung: I,
        einheit: "A",
        toleranz: 0.02,
        weg: `I = P / (√3 · U · cos φ) = ${P} / (1,732 · ${U} · ${z(cos, 2)}) = ${z(I)} A`,
      };
    },
  },
  {
    id: "iz-korrektur",
    titel: "Strombelastbarkeit mit Korrekturfaktoren",
    lf: "LF2",
    bau(rng) {
      const iz = ausListe([20, 24, 27, 32, 41], rng);
      const fTemp = ausListe([0.94, 0.87, 1.06], rng);
      const fHaeuf = ausListe([0.8, 0.7, 0.65], rng);
      const izKorr = iz * fTemp * fHaeuf;
      return {
        frage: `Ein Kabel hat Iz = ${iz} A. Umrechnungsfaktoren: Temperatur ${z(fTemp, 2)}, Häufung ${z(fHaeuf, 2)}. Wie groß ist die korrigierte Strombelastbarkeit?`,
        loesung: izKorr,
        einheit: "A",
        toleranz: 0.02,
        weg: `Iz' = Iz · fTemp · fHäufung = ${iz} · ${z(fTemp, 2)} · ${z(fHaeuf, 2)} = ${z(izKorr)} A`,
      };
    },
  },
  {
    id: "sicherungswahl",
    titel: "Passende Normsicherung wählen",
    lf: "LF3",
    bau(rng) {
      // In direkt wählen, dann I_B darunter und Iz knapp darüber (unter dem
      // nächsten Normwert), damit genau dieses In die richtige Antwort bleibt.
      const naechste = { 10: 13, 16: 20, 20: 25, 25: 32 };
      const In = ausListe([10, 16, 20, 25], rng);
      const Ib = In - ausListe([1, 2, 3], rng);
      const iz = Math.min(In + ausListe([0, 1, 2], rng), naechste[In] - 1);
      const reihe = SICHERUNG_REIHE.filter((w) => w <= 32).join(", ");
      return {
        frage: `Betriebsstrom I_B = ${Ib} A, Kabel-Belastbarkeit Iz = ${iz} A. Welcher LS-Nennstrom passt (Normreihe: ${reihe})? Regel: I_B ≤ I_n ≤ Iz.`,
        loesung: In,
        einheit: "A",
        toleranz: 0.02,
        weg: `Größter Normwert mit I_B ≤ I_n ≤ Iz: ${Ib} A ≤ I_n ≤ ${iz} A ⇒ I_n = ${In} A`,
      };
    },
  },

  // ---- Praxisnahe Aufgaben (Werkstatt/Baustelle) ----
  {
    id: "motor-strom",
    titel: "Motor-Nennstrom aus Wellenleistung",
    lf: "LF8",
    bau(rng) {
      const P = ausListe([1.5, 2.2, 3, 4, 5.5, 7.5], rng); // kW mechanisch (Typenschild)
      const U = 400;
      const cos = ausListe([0.8, 0.82, 0.85], rng);
      const eta = ausListe([0.8, 0.83, 0.86], rng);
      const I = (P * 1000) / (Math.sqrt(3) * U * cos * eta);
      return {
        frage: `Ein Drehstrommotor hat ${z(P, 1)} kW Wellenleistung an ${U} V (cos φ = ${z(cos, 2)}, η = ${z(eta, 2)}). Welchen Netzstrom nimmt er ungefähr auf?`,
        loesung: I,
        einheit: "A",
        toleranz: 0.03,
        weg: `I = P / (√3 · U · cos φ · η) = ${P * 1000} W / (1,732 · ${U} · ${z(cos, 2)} · ${z(eta, 2)}) = ${z(I)} A`,
      };
    },
  },
  {
    id: "motor-faustformel",
    titel: "Motorstrom-Faustformel (400 V)",
    lf: "LF8",
    bau(rng) {
      const P = ausListe([1.5, 2.2, 3, 4, 5.5], rng);
      return {
        frage: `Faustregel für Drehstrommotoren am 400-V-Netz: „Nennstrom ≈ 2 × Leistung in kW". Wie groß ist der Strom bei ${z(P, 1)} kW ungefähr?`,
        loesung: 2 * P,
        einheit: "A",
        toleranz: 0.05,
        weg: `I ≈ 2 · P[kW] = 2 · ${z(P, 1)} = ${z(2 * P, 1)} A (Merkwert; genau etwas weniger wegen cos φ und η)`,
      };
    },
  },
  {
    id: "heizstrom-3ph",
    titel: "Strom eines Drehstrom-Heizgeräts",
    lf: "LF5",
    bau(rng) {
      const P = ausListe([11, 15, 18, 21, 24], rng); // kW, z. B. Durchlauferhitzer/Herd
      const U = 400;
      const I = (P * 1000) / (Math.sqrt(3) * U); // rein ohmsch, cos φ = 1
      return {
        frage: `Ein rein ohmsches Drehstrom-Heizgerät (z. B. Durchlauferhitzer) hat ${P} kW an ${U} V. Wie groß ist der Strom je Außenleiter?`,
        loesung: I,
        einheit: "A",
        toleranz: 0.02,
        weg: `I = P / (√3 · U) = ${P * 1000} W / (1,732 · ${U} V) = ${z(I)} A`,
      };
    },
  },
  {
    id: "anlaufstrom",
    titel: "Anlaufstrom eines Motors",
    lf: "LF8",
    bau(rng) {
      const In = ausListe([4, 6, 8, 10, 16], rng);
      const faktor = ausListe([5, 6, 7], rng);
      return {
        frage: `Ein Motor hat den Nennstrom ${In} A. Beim Direktanlauf fließt etwa das ${faktor}-fache. Wie groß ist der Anlaufstrom?`,
        loesung: In * faktor,
        einheit: "A",
        weg: `I_A = ${faktor} · I_N = ${faktor} · ${In} A = ${In * faktor} A`,
      };
    },
  },
  {
    id: "strangspannung-stern",
    titel: "Strangspannung in Sternschaltung",
    lf: "LF8",
    bau(rng) {
      const UL = ausListe([400, 230], rng);
      const Ustr = UL / Math.sqrt(3);
      return {
        frage: `In Sternschaltung liegen ${UL} V zwischen den Außenleitern. Wie groß ist die Spannung an einer Wicklung (Strangspannung)?`,
        loesung: Ustr,
        einheit: "V",
        toleranz: 0.02,
        weg: `U_Str = U_L / √3 = ${UL} V / 1,732 = ${z(Ustr)} V`,
      };
    },
  },
  {
    id: "drehmoment",
    titel: "Drehmoment aus Leistung und Drehzahl",
    lf: "LF8",
    bau(rng) {
      const P = ausListe([1.5, 2.2, 3, 4, 5.5], rng); // kW
      const n = ausListe([1400, 1440, 2850, 950], rng); // 1/min
      const M = (9550 * P) / n;
      return {
        frage: `Ein Motor gibt ${z(P, 1)} kW bei ${n} 1/min ab. Wie groß ist das Drehmoment? (M = 9550 · P[kW] / n)`,
        loesung: M,
        einheit: "Nm",
        toleranz: 0.02,
        weg: `M = 9550 · P / n = 9550 · ${z(P, 1)} / ${n} = ${z(M)} Nm`,
      };
    },
  },
  {
    id: "motor-jahreskosten",
    titel: "Stromkosten eines Motors pro Jahr",
    lf: "LF1",
    bau(rng) {
      const P = ausListe([1.5, 2.2, 3, 4], rng); // kW aufgenommen
      const h = ausListe([500, 1000, 1500, 2000], rng);
      const cent = ausListe([30, 35, 40], rng);
      const kosten = P * h * (cent / 100);
      return {
        frage: `Ein Motor nimmt ${z(P, 1)} kW auf und läuft ${h} h im Jahr. Bei ${cent} ct/kWh — welche Stromkosten entstehen jährlich?`,
        loesung: kosten,
        einheit: "€",
        toleranz: 0.02,
        weg: `Kosten = P · t · Preis = ${z(P, 1)} kW · ${h} h · ${z(cent / 100)} €/kWh = ${z(kosten, 2)} €`,
      };
    },
  },
  {
    id: "leitung-max-laenge",
    titel: "Maximale Leitungslänge bei Spannungsfall",
    lf: "LF2",
    bau(rng) {
      const I = ausListe([16, 20, 25], rng);
      const A = ausListe([2.5, 4, 6], rng);
      const uMax = 0.03 * 230; // 3 % von 230 V
      const l = (uMax * KAPPA_CU * A) / (2 * I);
      return {
        frage: `Wechselstromkreis 230 V, ${I} A, ${z(A, 1)} mm² Kupfer (κ = 56). Wie lang darf die Leitung höchstens sein, damit der Spannungsfall 3 % (6,9 V) nicht übersteigt?`,
        loesung: l,
        einheit: "m",
        toleranz: 0.03,
        weg: `l = (ΔU · κ · A) / (2 · I) = (${z(uMax, 1)} · 56 · ${z(A, 1)}) / (2 · ${I}) = ${z(l, 1)} m`,
      };
    },
  },
];

/** Baut eine konkrete Aufgabe aus einer zufällig gewählten Vorlage. */
export function zufallsAufgabe(rng = Math.random, vorlagen = RECHEN_VORLAGEN) {
  const v = vorlagen[Math.floor(rng() * vorlagen.length)];
  return { vorlageId: v.id, titel: v.titel, lf: v.lf, ...v.bau(rng) };
}

/** Baut `anzahl` Aufgaben und vermeidet dabei zwei gleiche Vorlagen hintereinander. */
export function aufgabenSerie(anzahl, rng = Math.random, vorlagen = RECHEN_VORLAGEN) {
  const serie = [];
  let letzte = null;
  for (let n = 0; n < anzahl; n++) {
    let a = zufallsAufgabe(rng, vorlagen);
    if (vorlagen.length > 1 && a.vorlageId === letzte) a = zufallsAufgabe(rng, vorlagen);
    letzte = a.vorlageId;
    serie.push(a);
  }
  return serie;
}
