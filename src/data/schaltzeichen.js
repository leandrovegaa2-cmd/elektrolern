// Schaltzeichen (IEC 60617), selbst gezeichnet als schlanke Inline-SVGs.
// Eine Quelle für zwei Verwendungen:
//   - Referenz-Grid im Nachschlagen (Symbol + Name + Bedeutung)
//   - Abfrage-Bildkarten „Welches Bauteil?" (via diagrams.js → DIA[name])
//
// Bewusst monochrom (var(--text)); Kontakte in vertikaler Anordnung wie im
// deutschen Stromlaufplan. `svg` ist der nackte <svg>-String ohne .dia-Rahmen.

const A = 'viewBox="0 0 80 92" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="var(--text)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"';
const DOT = 'fill="var(--text)" stroke="none"';
const T = 'text-anchor="middle" fill="var(--text)" stroke="none" font-weight="700"';

export const SCHALTZEICHEN = [
  {
    name: "sz_schliesser",
    label: "Schließer",
    bedeutung: "Öffnet in Ruhe, schließt bei Betätigung (NO). Grundkontakt für Ein-Befehle.",
    svg: `<svg ${A} role="img" aria-label="Schließer-Kontakt"><line x1="40" y1="8" x2="40" y2="30"/><line x1="40" y1="84" x2="40" y2="60"/><line x1="40" y1="60" x2="27" y2="34"/><circle cx="40" cy="30" r="2.6" ${DOT}/><circle cx="40" cy="60" r="2.6" ${DOT}/></svg>`,
  },
  {
    name: "sz_oeffner",
    label: "Öffner",
    bedeutung: "Geschlossen in Ruhe, öffnet bei Betätigung (NC). Für Aus-/Stopp-Befehle.",
    svg: `<svg ${A} role="img" aria-label="Öffner-Kontakt"><line x1="40" y1="8" x2="40" y2="30"/><line x1="29" y1="30" x2="51" y2="30"/><line x1="40" y1="84" x2="40" y2="60"/><line x1="40" y1="60" x2="30" y2="31"/><circle cx="40" cy="60" r="2.6" ${DOT}/></svg>`,
  },
  {
    name: "sz_wechsler",
    label: "Wechsler",
    bedeutung: "Ein gemeinsamer Anschluss schaltet zwischen zwei Kontakten um (Umschalter).",
    svg: `<svg ${A} role="img" aria-label="Wechsler-Kontakt"><line x1="26" y1="8" x2="26" y2="32"/><line x1="54" y1="8" x2="54" y2="32"/><circle cx="26" cy="32" r="2.6" ${DOT}/><circle cx="54" cy="32" r="2.6" ${DOT}/><line x1="40" y1="84" x2="40" y2="58"/><circle cx="40" cy="58" r="2.6" ${DOT}/><line x1="40" y1="58" x2="26" y2="34"/></svg>`,
  },
  {
    name: "sz_taster",
    label: "Taster",
    bedeutung: "Schließer, der nur solange schaltet, wie gedrückt wird (Tastfunktion).",
    svg: `<svg ${A} role="img" aria-label="Taster"><line x1="40" y1="8" x2="40" y2="30"/><line x1="40" y1="84" x2="40" y2="60"/><line x1="40" y1="60" x2="27" y2="34"/><circle cx="40" cy="30" r="2.6" ${DOT}/><circle cx="40" cy="60" r="2.6" ${DOT}/><line x1="33" y1="47" x2="55" y2="47" stroke-dasharray="2.5 3"/><line x1="55" y1="40" x2="55" y2="54"/></svg>`,
  },
  {
    name: "sz_schuetzspule",
    label: "Schützspule",
    bedeutung: "Antriebsspule (A1/A2) eines Schützes/Relais. Unter Strom zieht es an.",
    svg: `<svg ${A} role="img" aria-label="Schützspule"><rect x="26" y="30" width="28" height="32" rx="2"/><line x1="40" y1="8" x2="40" y2="30"/><line x1="40" y1="84" x2="40" y2="62"/></svg>`,
  },
  {
    name: "sz_sicherung",
    label: "Sicherung",
    bedeutung: "Schmelzsicherung — trennt bei Überstrom durch Durchschmelzen.",
    svg: `<svg ${A} role="img" aria-label="Sicherung"><rect x="32" y="26" width="16" height="40" rx="2"/><line x1="40" y1="8" x2="40" y2="26"/><line x1="40" y1="84" x2="40" y2="66"/><line x1="40" y1="26" x2="40" y2="66"/></svg>`,
  },
  {
    name: "sz_lsschalter",
    label: "LS-Schalter (MCB)",
    bedeutung: "Leitungsschutzschalter — schaltet bei Überlast/Kurzschluss automatisch ab.",
    svg: `<svg ${A} role="img" aria-label="Leitungsschutzschalter"><line x1="40" y1="8" x2="40" y2="30"/><line x1="40" y1="84" x2="40" y2="60"/><line x1="40" y1="60" x2="27" y2="34"/><circle cx="40" cy="60" r="2.6" ${DOT}/><line x1="35" y1="25" x2="45" y2="35"/><line x1="45" y1="25" x2="35" y2="35"/></svg>`,
  },
  {
    name: "sz_fi",
    label: "FI / RCD",
    bedeutung: "Fehlerstrom-Schutzschalter — trennt, wenn die Stromsumme ≠ 0 ist.",
    svg: `<svg ${A} role="img" aria-label="FI-Schutzschalter"><rect x="20" y="24" width="40" height="44" rx="3"/><circle cx="40" cy="42" r="9"/><line x1="40" y1="8" x2="40" y2="24"/><line x1="40" y1="84" x2="40" y2="68"/><line x1="40" y1="51" x2="40" y2="60"/></svg>`,
  },
  {
    name: "sz_motor3",
    label: "Motor 3~",
    bedeutung: "Drehstrom-Asynchronmotor (M 3~).",
    svg: `<svg ${A} role="img" aria-label="Drehstrommotor"><circle cx="40" cy="48" r="23"/><line x1="40" y1="8" x2="40" y2="25"/><text x="40" y="46" font-size="17" ${T}>M</text><text x="40" y="62" font-size="11" ${T}>3~</text></svg>`,
  },
  {
    name: "sz_lampe",
    label: "Leuchte",
    bedeutung: "Signal-/Beleuchtungslampe (Kreis mit Kreuz).",
    svg: `<svg ${A} role="img" aria-label="Leuchte"><circle cx="40" cy="46" r="18"/><line x1="27" y1="33" x2="53" y2="59"/><line x1="53" y1="33" x2="27" y2="59"/><line x1="40" y1="8" x2="40" y2="28"/><line x1="40" y1="84" x2="40" y2="64"/></svg>`,
  },
  {
    name: "sz_steckdose",
    label: "Steckdose",
    bedeutung: "Schutzkontakt-Steckdose (Halbkreis mit Kontaktlinie).",
    svg: `<svg ${A} role="img" aria-label="Steckdose"><path d="M22,56 A18,18 0 0 1 58,56"/><line x1="18" y1="56" x2="62" y2="56"/><line x1="40" y1="56" x2="40" y2="10"/></svg>`,
  },
  {
    name: "sz_erde",
    label: "Erde / PE",
    bedeutung: "Schutzleiter-/Erdungsanschluss.",
    svg: `<svg ${A} role="img" aria-label="Erde"><line x1="40" y1="10" x2="40" y2="50"/><line x1="24" y1="52" x2="56" y2="52"/><line x1="30" y1="60" x2="50" y2="60"/><line x1="36" y1="68" x2="44" y2="68"/></svg>`,
  },
];
