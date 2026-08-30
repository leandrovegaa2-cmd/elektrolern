/**
 * ElektroLern-Symbolsystem: bewusst geometrisch, technisch und einfarbig.
 * Alle Symbole teilen 24×24 Raster, 1.7 px Strich und abgerundete Enden.
 */
export default function Icon({ name, size = 20, className = "" }) {
  const common = {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    focusable: false,
    className: "ui-icon " + className,
  };

  const shapes = {
    bolt: <path d="M13.4 2.8 5.8 13h5.7l-.8 8.2L18.3 11h-5.8l.9-8.2Z" />,
    circuit: <><path d="M5 7h5m4 0h5M5 17h5m4 0h5M12 5v14"/><circle cx="12" cy="7" r="2"/><circle cx="12" cy="17" r="2"/></>,
    control: <><path d="M5 6h14M5 12h14M5 18h14"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="11" cy="18" r="2"/></>,
    terminal: <><rect x="3.5" y="5" width="17" height="14" rx="2"/><path d="m7 10 2 2-2 2m5 0h4"/></>,
    factory: <><path d="M4 20V9l5 3V8l5 3V5l6 4v11H4Z"/><path d="M8 16h1m4 0h1m4 0h1"/></>,
    search: <><circle cx="10.5" cy="10.5" r="5.5"/><path d="m15 15 4.5 4.5M10.5 8v5m-2.5-2.5h5"/></>,
    plc: <><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 8h8v5H8zM8 17h.01m4-.01h.01m3.98.01h.01"/></>,
    motor: <><circle cx="12" cy="12" r="7"/><path d="M9 15V9l3 4 3-4v6M5 9H3m18 0h-2M5 15H3m18 0h-2"/></>,
    house: <><path d="m3.5 11 8.5-7 8.5 7M6 9.5V20h12V9.5"/><path d="M9 20v-6h6v6"/></>,
    water: <><path d="M12 3s5 6 5 10a5 5 0 0 1-10 0c0-4 5-10 5-10Z"/><path d="M9.5 14.5c.6 1 1.4 1.5 2.5 1.5"/></>,
    solar: <><circle cx="12" cy="8" r="3"/><path d="M12 2v2m0 8v2M6 8H4m16 0h-2M7.8 3.8 6.4 2.4m9.8 1.4 1.4-1.4M5 21h14l-1.5-6h-11L5 21Zm4-3h6"/></>,
    plan: <><path d="M4 20 20 4M6 4h14v14"/><path d="m9 15 2 2m1-5 2 2m1-5 2 2"/></>,
    tools: <><path d="m14 6 4-3 3 3-3 4m-2 2-7 7a2.1 2.1 0 0 1-3-3l7-7"/><path d="m4 5 4 4m-2-6 4 4"/></>,
    layers: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m4 12 8 4 8-4m-16 4 8 4 8-4"/></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4m8-4v4M4 10h16m-11 4h2m3 0h2m-7 3h2"/></>,
    target: <><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4V2m8 10h2"/></>,
    exam: <><path d="M7 3h10v3h3v15H4V6h3V3Z"/><path d="M8 11h8m-8 4h5"/></>,
    calculator: <><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8v3H8zm0 7h.01m4-.01h.01m4 .01h.01M8 18h.01m4-.01h.01m4 .01h.01"/></>,
    problem: <><path d="M12 3 3 8v8l9 5 9-5V8l-9-5Z"/><path d="M9.5 10a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.7m0 3h.01"/></>,
    keyboard: <><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M7 10h.01m3-.01h.01m3 .01h.01m3-.01h.01M7 14h10"/></>,
    cloud: <><path d="M7 18h10a4 4 0 0 0 .6-7.9A6 6 0 0 0 6.2 9 4.5 4.5 0 0 0 7 18Z"/><path d="M12 10v5m-2-2 2 2 2-2"/></>,
    edit: <><path d="M4 20h4l11-11-4-4L4 16v4Z"/><path d="m13 7 4 4"/></>,
    download: <><path d="M12 3v12m-4-4 4 4 4-4M5 20h14"/></>,
    upload: <><path d="M12 17V5m-4 4 4-4 4 4M5 20h14"/></>,
    formula: <><path d="M18 4H9L6 20m0-8h8"/><path d="m15 14 5 5m0-5-5 5"/></>,
    palette: <><circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/><circle cx="12" cy="12" r="3"/></>,
    safety: <><path d="M12 3 4 7v5c0 5 3.4 8 8 9 4.6-1 8-4 8-9V7l-8-4Z"/><path d="m8.5 12 2.2 2.2 4.8-5"/></>,
    limits: <><path d="M5 19 19 5M8 5h11v11"/><path d="M5 9v10h10"/></>,
    distribution: <><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h8M8 15h3m2 0h3"/></>,
    cable: <><path d="M5 12h4m6 0h4M9 8v8m6-8v8"/><circle cx="12" cy="12" r="3"/></>,
    trend: <><path d="M4 19V5m0 14h16M7 15l4-4 3 2 5-6"/></>,
    clipboard: <><path d="M9 4h6l1 3H8l1-3Z"/><path d="M7 6H5v15h14V6h-2M8 12h8m-8 4h6"/></>,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21.5v-16Zm16 0A2.5 2.5 0 0 0 17.5 3H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5v-16Z"/></>,
    repeat: <><path d="M20 7h-9a6 6 0 0 0-6 6v1m-1-3 1 3 3-1"/><path d="M4 17h9a6 6 0 0 0 6-6v-1m1 3-1-3-3 1"/></>,
    trophy: <><path d="M8 4h8v4a4 4 0 0 1-8 0V4Z"/><path d="M8 6H4v2a4 4 0 0 0 5 4m7-6h4v2a4 4 0 0 1-5 4m-3 0v5m-4 3h8"/></>,
    effort: <><path d="M7 20c-2-2-2-5 0-7l5-6 3 3-2 3 2 2 3-3c2 3 1 7-2 9"/><path d="M9 20h7"/></>,
    streak: <><path d="M13 2c1 4-2 5-2 8 0 1.5 1 2 2 2 2 0 3-2 3-4 3 3 4 6 2 9a7 7 0 0 1-12-1c-1-3 1-7 4-9 0 3 1 4 2 4 2-2 1-5 3-9Z"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
  };

  return <svg {...common}>{shapes[name] || shapes.circuit}</svg>;
}
