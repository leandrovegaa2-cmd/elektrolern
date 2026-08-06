const TABS = [
  { id: "lernen", icon: "🃏", label: "Lernen" },
  { id: "ref", icon: "📖", label: "Nachschlagen" },
  { id: "stats", icon: "📊", label: "Fortschritt" },
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
            {t.icon}
          </span>
          {t.label}
        </button>
      ))}
    </nav>
  );
}
