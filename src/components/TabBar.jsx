const TABS = [
  { id: "lernen", label: "Lernen", path: "M5 4.5h10a3 3 0 0 1 3 3v12H8a3 3 0 0 1-3-3v-12Zm3 4h7m-7 4h7" },
  { id: "ref", label: "Nachschlagen", path: "M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Zm16 0A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z" },
  { id: "werkstatt", label: "Werkstatt", path: "M5 8.5 9 4l3 3 3-3 4 4.5-2.5 3L19 20H5l2.5-8.5L5 8.5Zm3.5 3h7M9 16h6" },
  { id: "stats", label: "Fortschritt", path: "M5 20V10m7 10V4m7 16v-7" },
];

export default function TabBar({ aktiv, onWechsel }) {
  return (
    <nav className="tabbar" aria-label="Hauptnavigation">
      {TABS.map((t) => (
        <button
          key={t.id}
          className={"tab" + (aktiv === t.id ? " active" : "")}
          onClick={() => onWechsel(t.id)}
          aria-current={aktiv === t.id ? "page" : undefined}
        >
          <span className="t-ico" aria-hidden="true">
            <svg viewBox="0 0 24 24" focusable="false"><path d={t.path} /></svg>
          </span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
