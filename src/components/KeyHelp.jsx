import { useEffect, useRef } from "react";

// Tastenkürzel-Übersicht als Overlay. Öffnet mit „?", schließt mit Esc, Klick
// auf den Hintergrund oder den Schließen-Knopf. aria-modal wie ConfirmDialog.
const GRUPPEN = [
  {
    titel: "Überall",
    kuerzel: [
      ["?", "Diese Hilfe öffnen/schließen"],
      ["Esc", "Zurück / Abbrechen"],
    ],
  },
  {
    titel: "Navigation",
    kuerzel: [
      ["L", "Lernen"],
      ["N", "Nachschlagen"],
      ["F", "Fortschritt"],
    ],
  },
  {
    titel: "Startseite",
    kuerzel: [
      ["S", "Jetzt lernen (Schnellstart)"],
      ["P", "Prüfung starten"],
      ["R", "Rechentrainer"],
    ],
  },
  {
    titel: "Karteikarten",
    kuerzel: [
      ["Leer / Enter", "Antwort aufdecken"],
      ["→", "Gewusst"],
      ["←", "Nicht gewusst"],
    ],
  },
  {
    titel: "Quiz & Rechnen",
    kuerzel: [
      ["1 – 4", "Antwort wählen (Quiz)"],
      ["Enter", "Prüfen / Weiter"],
    ],
  },
];

export default function KeyHelp({ onSchliessen }) {
  const boxRef = useRef(null);
  const btnRef = useRef(null);
  const vorherAktiv = useRef(null);

  useEffect(() => {
    vorherAktiv.current = document.activeElement;
    btnRef.current?.focus();
    function onKeyDown(e) {
      if (e.key === "Escape" || e.key === "?") {
        e.preventDefault();
        onSchliessen();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      if (vorherAktiv.current instanceof HTMLElement) vorherAktiv.current.focus();
    };
  }, [onSchliessen]);

  return (
    <div className="dialog-overlay" onClick={onSchliessen}>
      <div
        className="dialog keyhelp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyhelp-titel"
        ref={boxRef}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="dialog-titel" id="keyhelp-titel">
          ⌨️ Tastenkürzel
        </div>
        <div className="keyhelp-body">
          {GRUPPEN.map((g) => (
            <div className="kh-gruppe" key={g.titel}>
              <div className="kh-titel">{g.titel}</div>
              {g.kuerzel.map(([taste, text]) => (
                <div className="kh-zeile" key={taste}>
                  <kbd className="kh-key">{taste}</kbd>
                  <span>{text}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="dialog-aktionen">
          <button className="dialog-btn bestaetigen" onClick={onSchliessen} ref={btnRef}>
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
}
