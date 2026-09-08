import { useMemo, useState } from "react";
import { FACHQUELLEN } from "../../data/fachquellen.js";
import { LICHT_GROESSEN, LICHT_PRAXISWERTE, LICHT_WISSEN } from "../../data/lichttechnik.js";
import Icon from "../Icon.jsx";

function QuellenLink({ id }) {
  const quelle = FACHQUELLEN.find((eintrag) => eintrag.id === id);
  if (!quelle) return null;
  return <a className="light-source" href={quelle.url} target="_blank" rel="noreferrer"><Icon name="safety" size={14} /> {quelle.titel}<span aria-hidden="true">↗</span></a>;
}

function Zahl({ id, label, value, onChange, min, max, step = 1, einheit }) {
  return (
    <label className="light-field" htmlFor={id}>
      <span>{label}</span>
      <span className="light-input-wrap">
        <input id={id} type="number" inputMode="decimal" min={min} max={max} step={step} value={value} onChange={(event) => onChange(event.target.value)} />
        <b>{einheit}</b>
      </span>
    </label>
  );
}

function PlanungsRechner() {
  const [laenge, setLaenge] = useState("8");
  const [breite, setBreite] = useState("6");
  const [ziel, setZiel] = useState("500");
  const [lichtstrom, setLichtstrom] = useState("4000");
  const [nutzung, setNutzung] = useState("0.60");
  const [wartung, setWartung] = useState("0.80");

  const ergebnis = useMemo(() => {
    const werte = [laenge, breite, ziel, lichtstrom, nutzung, wartung].map(Number);
    if (werte.some((wert) => !Number.isFinite(wert) || wert <= 0)) return null;
    const [l, b, e, phi, uf, mf] = werte;
    if (uf > 1 || mf > 1) return null;
    const flaeche = l * b;
    const roh = (e * flaeche) / (phi * uf * mf);
    const anzahl = Math.ceil(roh);
    const neuwert = (anzahl * phi * uf) / flaeche;
    return { flaeche, roh, anzahl, neuwert, wartungswert: neuwert * mf };
  }, [laenge, breite, ziel, lichtstrom, nutzung, wartung]);

  return (
    <section className="light-calculator" aria-labelledby="light-calc-title">
      <div className="light-section-head">
        <span><Icon name="calculator" size={18} /></span>
        <div><small>Überschlagsrechnung</small><h2 id="light-calc-title">Leuchtenzahl vorplanen</h2></div>
      </div>
      <p className="light-calc-lead">Wirkungsgradverfahren mit frei einstellbarem Nutzungs- und Wartungsfaktor.</p>
      <div className="light-fields">
        <Zahl id="licht-laenge" label="Raumlänge" value={laenge} onChange={setLaenge} min="0.5" max="500" step="0.1" einheit="m" />
        <Zahl id="licht-breite" label="Raumbreite" value={breite} onChange={setBreite} min="0.5" max="500" step="0.1" einheit="m" />
        <Zahl id="licht-ziel" label="Wartungswert" value={ziel} onChange={setZiel} min="1" max="10000" einheit="lx" />
        <Zahl id="licht-phi" label="Lichtstrom je Leuchte" value={lichtstrom} onChange={setLichtstrom} min="1" max="200000" einheit="lm" />
        <Zahl id="licht-uf" label="Nutzungsfaktor UF" value={nutzung} onChange={setNutzung} min="0.01" max="1" step="0.01" einheit="" />
        <Zahl id="licht-mf" label="Wartungsfaktor MF" value={wartung} onChange={setWartung} min="0.01" max="1" step="0.01" einheit="" />
      </div>
      {ergebnis ? (
        <div className="light-result" aria-live="polite">
          <div><span>Benötigt</span><b>{ergebnis.anzahl}</b><small>Leuchten</small></div>
          <dl>
            <div><dt>Fläche</dt><dd>{ergebnis.flaeche.toLocaleString("de-DE", { maximumFractionDigits: 1 })} m²</dd></div>
            <div><dt>Rechenwert</dt><dd>{ergebnis.roh.toLocaleString("de-DE", { maximumFractionDigits: 2 })}</dd></div>
            <div><dt>Neuwert, rechnerisch</dt><dd>{Math.round(ergebnis.neuwert)} lx</dd></div>
            <div><dt>Wartungswert, rechnerisch</dt><dd>{Math.round(ergebnis.wartungswert)} lx</dd></div>
          </dl>
        </div>
      ) : <div className="light-result invalid">Bitte positive Werte verwenden; UF und MF dürfen höchstens 1 sein.</div>}
      <div className="light-warning"><Icon name="problem" size={17} /><p><b>Vorplanung, kein Normnachweis.</b> Der Rechner kennt keine Lichtstärkeverteilung, Raumreflexionen, Montagepunkte, Gleichmäßigkeit oder Blendung. Diese Punkte müssen mit Herstellerdaten und einer geeigneten Lichtplanung geprüft werden.</p></div>
      <div className="light-formula">N = E<sub>m</sub> · A / (Φ<sub>Leuchte</sub> · UF · MF)</div>
    </section>
  );
}

export default function LichttechnikPanel({ onFachgespraech }) {
  return (
    <section className="light-module" aria-labelledby="light-title">
      <div className="light-hero">
        <div>
          <span className="light-kicker"><Icon name="light" size={16} /> Fachmodul · Quellenstand 08.09.2026</span>
          <h2 id="light-title" aria-label="Lichtechnik richtig planen">Lichtechnik<br /><em>richtig planen.</em></h2>
          <p>Von Lumen und Lux bis LED-Treiber, Blendung, Wartungswert und Abnahme — fachlich geprüft und auf die Praxis reduziert.</p>
        </div>
        <div className="light-hero-readout" aria-label="20 neue Lernkarten">
          <span>Neues Lernpaket</span><b>20</b><small>Karten in LF10</small>
        </div>
      </div>

      <div className="light-metrics" aria-label="Lichttechnische Grundgrößen">
        {LICHT_GROESSEN.map((groesse) => (
          <article key={groesse.name}>
            <span>{groesse.symbol}</span><b>{groesse.name}</b><strong>{groesse.einheit}</strong><small>{groesse.bedeutung}</small>
          </article>
        ))}
      </div>

      <div className="light-layout">
        <div className="light-knowledge">
          <div className="light-section-head">
            <span><Icon name="book" size={18} /></span>
            <div><small>Geprüftes Wissen</small><h2>Acht Bausteine für Planung und Prüfung</h2></div>
          </div>
          {LICHT_WISSEN.map((block, index) => (
            <details className="light-topic" key={block.id} open={index === 0}>
              <summary><span>{String(index + 1).padStart(2, "0")}</span><div><b>{block.titel}</b><small>{block.kurz}</small></div><i aria-hidden="true">+</i></summary>
              <div className="light-topic-body">
                <ul>{block.punkte.map((punkt) => <li key={punkt}>{punkt}</li>)}</ul>
                <QuellenLink id={block.quelle} />
              </div>
            </details>
          ))}
        </div>
        <PlanungsRechner />
      </div>

      <section className="light-values" aria-labelledby="light-values-title">
        <div className="light-section-head">
          <span><Icon name="limits" size={18} /></span>
          <div><small>ASR A3.4 · Auswahl</small><h2 id="light-values-title">Mindestwerte für typische Bereiche</h2></div>
        </div>
        <p>Die Werte beziehen sich auf die jeweilige Bezugsfläche und sind nicht pauschal auf jeden Raum übertragbar.</p>
        <div className="light-value-grid">
          {LICHT_PRAXISWERTE.map((wert) => <article key={wert.bereich}><b>{wert.lux}<small> lx</small></b><span>{wert.bereich}</span><em>{wert.hinweis}</em></article>)}
        </div>
        <QuellenLink id="asr-a3-4-2023" />
      </section>

      <section className="light-checklist">
        <div><span className="light-kicker">Planungsroute</span><h2>Vom Auftrag zur Übergabe</h2></div>
        <ol>
          <li><b>01</b><span><strong>Erfassen</strong>Sehaufgabe, Raum, Nutzer, Bestand und Umgebung</span></li>
          <li><b>02</b><span><strong>Festlegen</strong>Bezugsfläche, Wartungswert und Qualitätsanforderungen</span></li>
          <li><b>03</b><span><strong>Berechnen</strong>Leuchten, Verteilung, Gleichmäßigkeit und Blendung</span></li>
          <li><b>04</b><span><strong>Auswählen</strong>Leuchte, Treiber, Steuerung, Schutzart und Montage</span></li>
          <li><b>05</b><span><strong>Prüfen</strong>Elektrische Sicherheit, Messraster, Funktion und Dokumentation</span></li>
        </ol>
      </section>

      <button className="light-talk-cta" onClick={onFachgespraech}>
        <span aria-hidden="true"><Icon name="conversation" size={28} /></span>
        <span><small>Prüfungsmodus</small><b>Fachgespräch aus einem Lichtauftrag erstellen</b><em>Freie Antworten · adaptive Nachfragen · Prüfprotokoll</em></span>
        <Icon name="arrow" size={21} />
      </button>
    </section>
  );
}
