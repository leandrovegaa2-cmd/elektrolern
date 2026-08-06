import { useEffect, useRef } from "react";

/**
 * In-App-Dialog statt der nativen alert()/confirm()-Boxen.
 *
 * Zwei Modi:
 *  - Bestätigung (Default): „Abbrechen" + „Bestätigen". `gefahr` färbt den
 *    Bestätigen-Knopf rot (destruktive Aktion wie Fortschritt löschen).
 *  - `nurInfo`: nur ein „OK"-Knopf, kein Abbrechen (ersetzt einfaches alert()).
 *
 * Barrierefrei: role="dialog", aria-modal, Fokus wandert beim Öffnen auf den
 * Standardknopf, Tab bleibt im Dialog gefangen, Esc und Klick auf den
 * Hintergrund brechen ab. Die reduce-motion-Regel der App greift automatisch.
 */
export default function ConfirmDialog({
  titel,
  text,
  bestaetigenText = "Bestätigen",
  abbrechenText = "Abbrechen",
  gefahr = false,
  nurInfo = false,
  onBestaetigen,
  onAbbrechen,
}) {
  const dialogRef = useRef(null);
  const defaultBtnRef = useRef(null);
  // Beim Abbrechen fällt der Fokus auf das Element zurück, das den Dialog geöffnet hat.
  const vorherAktiv = useRef(null);

  // Abbrechen ist bei reinem Info-Dialog dasselbe wie Bestätigen (nur ein Weg raus).
  const schliessen = nurInfo ? onBestaetigen : onAbbrechen;

  useEffect(() => {
    vorherAktiv.current = document.activeElement;
    defaultBtnRef.current?.focus();

    function onKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        schliessen?.();
        return;
      }
      if (e.key !== "Tab") return;
      // Fokus-Falle: Tab zirkuliert nur zwischen den Knöpfen im Dialog.
      const fokusierbar = dialogRef.current?.querySelectorAll("button");
      if (!fokusierbar || !fokusierbar.length) return;
      const erste = fokusierbar[0];
      const letzte = fokusierbar[fokusierbar.length - 1];
      if (e.shiftKey && document.activeElement === erste) {
        e.preventDefault();
        letzte.focus();
      } else if (!e.shiftKey && document.activeElement === letzte) {
        e.preventDefault();
        erste.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      // Fokus zurück auf den Auslöser, damit die Tastaturbedienung nicht „springt".
      if (vorherAktiv.current instanceof HTMLElement) vorherAktiv.current.focus();
    };
  }, [schliessen]);

  return (
    <div className="dialog-overlay" onClick={schliessen}>
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-titel"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        {titel ? (
          <div className="dialog-titel" id="dialog-titel">
            {titel}
          </div>
        ) : null}
        <div className="dialog-text">{text}</div>
        <div className="dialog-aktionen">
          {!nurInfo ? (
            <button className="dialog-btn abbrechen" onClick={onAbbrechen}>
              {abbrechenText}
            </button>
          ) : null}
          <button
            className={"dialog-btn bestaetigen" + (gefahr ? " gefahr" : "")}
            onClick={onBestaetigen}
            ref={defaultBtnRef}
          >
            {nurInfo ? "OK" : bestaetigenText}
          </button>
        </div>
      </div>
    </div>
  );
}
