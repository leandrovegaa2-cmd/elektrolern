export default function Header({ streak, level }) {
  return (
    <header>
      <div className="logo">
        ⚡ Elektro<span>Lern</span>
      </div>
      <div className="header-right">
        {level > 1 ? (
          <span className="level-badge" aria-label={"Level " + level}>
            ⭐ Lvl {level}
          </span>
        ) : null}
        <div className="streak num" aria-label={streak + " Tage Streak"}>
          🔥 {streak}
        </div>
      </div>
    </header>
  );
}
