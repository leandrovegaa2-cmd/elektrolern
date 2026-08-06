// Gemeinsame Eingabe-/Ausgabe-Bausteine der Rechner. Klein gehalten, damit
// jeder Rechner nur seine Logik enthält.

/** Zahlenfeld mit Label und optionaler Einheit. value/onChange als String. */
export function NumFeld({ label, value, onChange, einheit, step, min, placeholder }) {
  return (
    <label className="rf-feld">
      <span className="rf-label">{label}</span>
      <span className="rf-input">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          step={step}
          min={min}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
        {einheit ? <span className="rf-einheit">{einheit}</span> : null}
      </span>
    </label>
  );
}

/** Auswahlfeld (Dropdown). optionen: [{ value, label }]. */
export function WahlFeld({ label, value, onChange, optionen }) {
  return (
    <label className="rf-feld">
      <span className="rf-label">{label}</span>
      <span className="rf-input">
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {optionen.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}

/** Ergebnis-Box unter den Eingaben. ok=false färbt als Warnung. */
export function Ergebnis({ children, ok = true }) {
  return <div className={"rf-ergebnis" + (ok ? "" : " warn")}>{children}</div>;
}

/** Farb-Chip für Leiterfarben (grün-gelb als Streifen). */
export function FarbChip({ farbe }) {
  if (farbe === "pe") {
    return (
      <span
        className="farb-chip"
        style={{ background: "repeating-linear-gradient(45deg,#16a34a 0 4px,#facc15 4px 8px)" }}
      />
    );
  }
  return <span className="farb-chip" style={{ background: farbe }} />;
}
