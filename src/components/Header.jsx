import Icon from "./Icon.jsx";

export default function Header({ streak, level }) {
  return (
    <header>
      <div className="logo">
        <span className="logo-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M13.2 2 5.8 13.1h5.5L10.7 22l7.5-12h-5.6L13.2 2Z" />
          </svg>
        </span>
        <span className="logo-lockup">
          <span className="logo-type">Elektro<strong>Lern</strong></span>
          <small>Energie-Akademie</small>
        </span>
      </div>
      <div className="header-right">
        {level > 1 ? (
          <span className="level-badge" aria-label={"Level " + level}>
            LVL {level}
          </span>
        ) : null}
        <div className="streak num" aria-label={streak + " Tage Lernserie"}>
          <Icon name="streak" size={15} /> {streak}
        </div>
      </div>
    </header>
  );
}
