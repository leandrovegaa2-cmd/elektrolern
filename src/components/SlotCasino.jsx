import { useEffect, useRef, useState } from "react";
import { SLOT_EINSAETZE, SLOT_LINIEN, SLOT_SYMBOLE, SLOT_SYMBOL_MAP } from "../data/slot.js";
import Header from "./Header.jsx";
import Icon from "./Icon.jsx";
import TabBar from "./TabBar.jsx";

const START_RASTER = [
  ["strom", "werk", "kern"],
  ["schaltung", "wild", "antrieb"],
  ["krone", "strom", "werk"],
  ["kern", "schaltung", "antrieb"],
  ["werk", "wild", "strom"],
];

const FUNKEN = Array.from({ length: 24 }, (_, index) => index);

export default function SlotCasino({ rewards, streak, level, onZurueck, onTabWechsel }) {
  const [einsatz, setEinsatz] = useState(25);
  const [raster, setRaster] = useState(START_RASTER);
  const [dreht, setDreht] = useState(false);
  const [gestoppteWalzen, setGestoppteWalzen] = useState(5);
  const [ergebnis, setErgebnis] = useState(null);
  const [anzeigeChips, setAnzeigeChips] = useState(null);
  const timer = useRef([]);
  const positionen = new Set(ergebnis?.positionen || []);
  const verlauf = rewards.state.slotVerlauf || [];
  const einsatzIndex = SLOT_EINSAETZE.indexOf(einsatz);

  useEffect(() => () => timer.current.forEach(clearTimeout), []);

  function rundeAbschliessen(runde) {
    setGestoppteWalzen(5);
    setDreht(false);
    setErgebnis(runde);
    setAnzeigeChips(null);
  }

  function drehen() {
    if (dreht || rewards.state.chips < einsatz) return;
    timer.current.forEach(clearTimeout);
    timer.current = [];
    const vorherigeChips = rewards.state.chips;
    const runde = rewards.slotDrehen(einsatz);
    if (!runde.ok) return;
    setRaster(runde.raster);
    setErgebnis(null);
    setAnzeigeChips(vorherigeChips - einsatz);

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      rundeAbschliessen(runde);
      return;
    }

    setGestoppteWalzen(0);
    setDreht(true);
    [1250, 1550, 1870, 2210, 2580].forEach((dauer, index) => {
      timer.current.push(setTimeout(() => setGestoppteWalzen(index + 1), dauer));
    });
    timer.current.push(setTimeout(() => rundeAbschliessen(runde), 2850));
  }

  function einsatzAendern(richtung) {
    const next = Math.max(0, Math.min(SLOT_EINSAETZE.length - 1, einsatzIndex + richtung));
    setEinsatz(SLOT_EINSAETZE[next]);
    setErgebnis(null);
  }

  const status = dreht
    ? `Walze ${Math.min(gestoppteWalzen + 1, 5)} von 5 läuft`
    : ergebnis?.stufe === "jackpot"
      ? "Jackpot-Gewinn"
      : ergebnis?.gewinn > 0
        ? `${ergebnis.gewinn} Volt-Chips gewonnen`
        : ergebnis
          ? "Kein Liniengewinn"
          : "Bereit für den ersten Dreh";

  return (
    <>
      <Header streak={streak} level={level} />
      <div className={`slot-page slot-state-${ergebnis?.stufe || "bereit"}`}>
        <button className="slot-back" onClick={onZurueck}><Icon name="arrow" size={16} /> Zur Werkstatt</button>

        <section className="slot-hero" aria-labelledby="slot-title">
          <div>
            <span className="slot-kicker"><Icon name="slotCasino" size={16} /> 18+ Spielmodus · nur Volt-Chips</span>
            <h1 id="slot-title">Volt<br /><em>Vault</em></h1>
            <p>Fünf Walzen, zehn feste Gewinnlinien und ein Hochspannungs-Wild. Gewinne und Verluste bleiben vollständig getrennt von deinem Skin-Arsenal.</p>
          </div>
          <div className="slot-bank" aria-label={`${anzeigeChips ?? rewards.state.chips} Volt-Chips verfügbar`}>
            <span>Spielkonto</span>
            <b className="num">{anzeigeChips ?? rewards.state.chips}</b>
            <small>Volt-Chips</small>
          </div>
        </section>

        <section className={`slot-cabinet${dreht ? " is-spinning" : ""}${ergebnis?.gewinn ? " is-win" : ""}`} aria-labelledby="slot-machine-title">
          <header className="slot-cabinet-head">
            <div><span>VV–503</span><h2 id="slot-machine-title">Hochspannungs-Slot</h2></div>
            <div className="slot-jackpot"><small>Maximalgewinn</small><b className="num">2.500×</b><span>Linien-Einsatz</span></div>
          </header>

          <div className="slot-display">
            <div className="slot-scanlines" aria-hidden="true" />
            <div className="slot-grid" role="img" aria-label={`5 mal 3 Slot-Raster. ${status}`}>
              {raster.map((walze, walzenIndex) => (
                <div className={`slot-reel${dreht && walzenIndex >= gestoppteWalzen ? " is-moving" : " is-stopped"}`} style={{ "--reel-index": walzenIndex }} key={walzenIndex}>
                  {walze.map((symbolId, reihe) => {
                    const symbol = SLOT_SYMBOL_MAP[symbolId];
                    const gewonnen = positionen.has(`${walzenIndex}-${reihe}`);
                    return (
                      <div className={`slot-symbol symbol-${symbolId}${gewonnen ? " is-hit" : ""}`} key={`${walzenIndex}-${reihe}`}>
                        <span aria-hidden="true"><Icon name={symbol.icon} size={38} /></span>
                        <small>{symbol.label}</small>
                        <i aria-hidden="true" />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
            <div className="slot-win-fx" aria-hidden="true">{FUNKEN.map((index) => <i style={{ "--spark": index }} key={index} />)}</div>
            <div className="slot-status" aria-live="polite">
              <span className={`status-light${dreht ? " active" : ""}`} />
              <b>{status}</b>
              {ergebnis?.treffer.length ? <small>{ergebnis.treffer.map((treffer) => `Linie ${treffer.linie}`).join(" · ")}</small> : <small>{SLOT_LINIEN.length} Linien aktiv</small>}
            </div>
          </div>

          <div className="slot-controls">
            <div className="slot-readout">
              <small>Letzter Gewinn</small>
              <b className="num">{ergebnis?.gewinn || 0}</b>
              <span>Volt-Chips</span>
            </div>
            <div className="bet-control" aria-label={`Einsatz ${einsatz} Volt-Chips`}>
              <small>Einsatz</small>
              <div>
                <button onClick={() => einsatzAendern(-1)} disabled={dreht || einsatzIndex === 0} aria-label="Einsatz verringern">−</button>
                <b className="num">{einsatz}</b>
                <button onClick={() => einsatzAendern(1)} disabled={dreht || einsatzIndex === SLOT_EINSAETZE.length - 1} aria-label="Einsatz erhöhen">+</button>
              </div>
            </div>
            <button className="slot-spin" onClick={drehen} disabled={dreht || rewards.state.chips < einsatz}>
              <Icon name="slotSpin" size={23} />
              <span><b>{dreht ? "Walzen laufen" : rewards.state.chips < einsatz ? "Zu wenig Chips" : "Drehen"}</b><small>{einsatz} Volt-Chips einsetzen</small></span>
            </button>
          </div>
        </section>

        <div className="slot-info-grid">
          <section className="slot-paytable" aria-labelledby="paytable-title">
            <div className="slot-section-head"><span className="section-index">01</span><div><h2 id="paytable-title">Auszahlungstabelle</h2><p>Multiplikator pro Gewinnlinie</p></div></div>
            <div className="paytable-head"><span>Symbol</span><b>3×</b><b>4×</b><b>5×</b></div>
            {SLOT_SYMBOLE.map((symbol) => (
              <div className={`paytable-row symbol-${symbol.id}`} key={symbol.id}>
                <span><Icon name={symbol.icon} size={18} /><b>{symbol.label}</b>{symbol.wild ? <small>ersetzt alle</small> : null}</span>
                <b className="num">{symbol.auszahlung[3]}×</b><b className="num">{symbol.auszahlung[4]}×</b><b className="num">{symbol.auszahlung[5]}×</b>
              </div>
            ))}
          </section>

          <aside className="slot-history" aria-labelledby="history-title">
            <div className="slot-section-head"><span className="section-index">02</span><div><h2 id="history-title">Letzte Runden</h2><p>Nur auf diesem Gerät gespeichert</p></div></div>
            {verlauf.length ? (
              <div className="history-list">
                {verlauf.slice(0, 7).map((runde, index) => {
                  const saldo = runde.gewinn - runde.einsatz;
                  return <div className={saldo >= 0 ? "positive" : "negative"} key={`${runde.zeit}-${index}`}><span>Runde {verlauf.length - index}</span><small>Einsatz {runde.einsatz}</small><b className="num">{saldo >= 0 ? "+" : ""}{saldo}</b></div>;
                })}
              </div>
            ) : <div className="history-empty"><Icon name="trend" size={24} /><span>Noch keine Runde gespielt</span></div>}
            <p className="slot-disclaimer">Modell-RTP ca. 92 % · kein Echtgeld · keine Käufe · keine Auszahlung · zufallsbasierter Spielmodus mit erspielten Volt-Chips.</p>
          </aside>
        </div>
      </div>
      <TabBar aktiv="werkstatt" onWechsel={onTabWechsel} />
    </>
  );
}
