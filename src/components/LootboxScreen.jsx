import { useEffect, useRef, useState } from "react";
import { SELTENHEITEN, SKINS, SKIN_MAP } from "../data/skins.js";
import { KISTENPREIS, PITY_GRENZE } from "../lib/lootbox.js";
import Header from "./Header.jsx";
import Icon from "./Icon.jsx";
import TabBar from "./TabBar.jsx";

const WALZEN_LAENGE = 46;
const ZIEL_INDEX = 39;
const KARTEN_SCHRITT = 144;
const VORSCHAU = [...SKINS, ...SKINS, ...SKINS];

function bildUrl(pfad) {
  return `${import.meta.env.BASE_URL}${pfad}`;
}

function zufallsWalzenSkin() {
  const wurf = Math.random() * 100;
  let summe = 0;
  const seltenheit = Object.entries(SELTENHEITEN).find(([, meta]) => {
    summe += meta.chance;
    return wurf < summe;
  })?.[0] || "meisterstueck";
  const pool = SKINS.filter((skin) => skin.seltenheit === seltenheit);
  return pool[Math.floor(Math.random() * pool.length)];
}

function baueWalze(gewinner) {
  const items = Array.from({ length: WALZEN_LAENGE }, zufallsWalzenSkin);
  items[ZIEL_INDEX] = gewinner;
  const landepunkt = Math.round((Math.random() - 0.5) * 72);
  return {
    id: Date.now(),
    items,
    zielIndex: ZIEL_INDEX,
    verschiebung: -(ZIEL_INDEX * KARTEN_SCHRITT + KARTEN_SCHRITT / 2 + landepunkt),
  };
}

export default function LootboxScreen({ rewards, streak, level, onCasino, onTabWechsel }) {
  const [oeffnet, setOeffnet] = useState(false);
  const [fund, setFund] = useState(null);
  const [walze, setWalze] = useState(null);
  const timer = useRef(null);
  const state = rewards.state;
  const aktiv = state.ausgeruestet ? SKIN_MAP[state.ausgeruestet] : null;
  const gesammelt = SKINS.filter((skin) => state.besitz[skin.id]).length;
  const naechsteGarantie = PITY_GRENZE - state.pity;
  const effektStufe = fund?.skin.seltenheit || "standard";
  const sichtbareWalze = walze || {
    id: "vorschau",
    items: VORSCHAU,
    zielIndex: -1,
    verschiebung: -(10 * KARTEN_SCHRITT + KARTEN_SCHRITT / 2),
  };

  useEffect(() => () => clearTimeout(timer.current), []);

  function kisteStarten() {
    if (oeffnet || state.chips < KISTENPREIS) return;
    const ergebnis = rewards.kisteOeffnen();
    if (!ergebnis.ok) return;
    const neueWalze = baueWalze(ergebnis.skin);
    const reduziert = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setFund(null);
    setWalze(neueWalze);
    setOeffnet(true);
    timer.current = setTimeout(() => {
      setFund(ergebnis);
      setOeffnet(false);
    }, reduziert ? 200 : 5400);
  }

  return (
    <>
      <Header streak={streak} level={level} />
      <div className="workshop">
        <section className="workshop-head" aria-labelledby="workshop-title">
          <div>
            <span className="workshop-kicker"><Icon name="workshop" size={15} /> Elektro-Werkstatt</span>
            <h1 id="workshop-title">Verdiene. Öffne.<br /><em>Rüste aus.</em></h1>
            <p>Dein Lernfortschritt wird zu Volt-Chips. Sammle zehn eigenständige Werkzeug-Skins mit Effekten, die je nach Seltenheit stärker werden.</p>
          </div>
          <div className="chip-bank" aria-label={`${state.chips} Volt-Chips verfügbar`}>
            <span><Icon name="chip" size={18} /> Guthaben</span>
            <b className="num">{state.chips}</b>
            <small>Volt-Chips</small>
          </div>
        </section>

        <button className="casino-entry" onClick={onCasino}>
          <span className="casino-entry-icon"><Icon name="slotCasino" size={28} /></span>
          <span><small>18+ Spielmodus · getrennt vom Arsenal</small><b>Volt Vault Casino</b><em>5×3 Walzen · 10 Gewinnlinien · nur Volt-Chips</em></span>
          <span className="casino-entry-action">Casino öffnen <Icon name="arrow" size={17} /></span>
        </button>

        <section className="crate-console case-console" aria-labelledby="crate-title">
          <div className="crate-info case-info">
            <div className="case-copy">
              <span className="console-code">ENERGY DROP / 01</span>
              <h2 id="crate-title">Energie-Kiste</h2>
              <p>Die Walze stoppt auf deinem Werkzeug-Skin. Noch <b>{naechsteGarantie}</b> {naechsteGarantie === 1 ? "Kiste" : "Kisten"} bis mindestens Episch.</p>
            </div>
            <div className="case-actions">
              <div className="crate-price"><Icon name="chip" size={17} /><b>{KISTENPREIS}</b><span>pro Öffnung</span></div>
              <button className="crate-open" onClick={kisteStarten} disabled={oeffnet || state.chips < KISTENPREIS}>
                <Icon name={oeffnet ? "bolt" : "box"} size={20} />
                {oeffnet ? "Walze läuft …" : state.chips < KISTENPREIS ? "Nicht genug Volt-Chips" : "Kiste öffnen"}
              </button>
              <small className="fair-play">Nur erspielte Volt-Chips · kein Kauf · kein Echtgeldwert</small>
            </div>
          </div>

          <div className={`case-machine rarity-${effektStufe}${oeffnet ? " is-rolling" : ""}${fund ? " roll-complete" : ""}`}>
            <div className="case-status" aria-hidden="true">
              <span>{oeffnet ? "Öffnung läuft" : fund ? "Fund ermittelt" : "Walze bereit"}</span>
              <i>{oeffnet ? "Synchronisiere Drop" : "Gesicherter Lernfortschritt"}</i>
            </div>
            <div className="reel-window" aria-label={oeffnet ? "Die Werkzeug-Walze läuft" : "Werkzeug-Walze bereit"}>
              <div className="reel-marker" aria-hidden="true"><i /><i /></div>
              <div className="reel-fade reel-fade-left" aria-hidden="true" />
              <div className="reel-fade reel-fade-right" aria-hidden="true" />
              <div
                className={`reel-track${oeffnet ? " is-spinning" : ""}${fund ? " is-finished" : ""}`}
                key={sichtbareWalze.id}
                style={{ "--reel-shift": `${sichtbareWalze.verschiebung}px` }}
                aria-hidden="true"
              >
                {sichtbareWalze.items.map((skin, index) => {
                  const meta = SELTENHEITEN[skin.seltenheit];
                  const gewinner = fund && index === sichtbareWalze.zielIndex;
                  return (
                    <div className={`reel-card rarity-${skin.seltenheit}${gewinner ? " is-winner" : ""}`} style={{ "--reel-rarity": meta.farbe }} key={`${skin.id}-${index}`}>
                      <img src={bildUrl(skin.bild)} alt="" />
                      <span>{meta.label}</span>
                      <b>{skin.name}</b>
                      <i aria-hidden="true" />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="reel-scale" aria-hidden="true">{Array.from({ length: 31 }, (_, index) => <i key={index} />)}</div>
          </div>

          <div className={`case-result rarity-${effektStufe}${fund ? " is-visible" : ""}`} aria-live="polite">
            {fund ? (
              <>
                <div className="result-thumb"><img src={bildUrl(fund.skin.bild)} alt={fund.skin.werkzeug + " – " + fund.skin.name} /></div>
                <div className="result-copy">
                  <span>{SELTENHEITEN[fund.skin.seltenheit].label} · Dein Fund</span>
                  <h3>{fund.skin.name}</h3>
                  <p>{fund.skin.werkzeug}</p>
                </div>
                <div className="result-state">
                  {fund.duplikat ? <><b>Duplikat</b><small>{fund.rueckgabe} Volt-Chips zurück</small></> : <><b>Neu</b><small>Im Arsenal ausrüstbar</small></>}
                </div>
              </>
            ) : (
              <span className="result-placeholder"><Icon name="target" size={18} /> Dein Fund erscheint nach dem Stopp der Walze</span>
            )}
          </div>
        </section>

        <section className="odds-panel" aria-labelledby="odds-title">
          <div><span className="section-index">01</span><h2 id="odds-title">Transparente Chancen</h2></div>
          <div className="odds-row">
            {Object.entries(SELTENHEITEN).map(([id, meta]) => (
              <div className={`odds-item rarity-${id}`} key={id}>
                <i style={{ background: meta.farbe }} />
                <span>{meta.label}</span>
                <b className="num">{meta.chance}%</b>
              </div>
            ))}
          </div>
          <p>Spätestens jede 10. Öffnung ist mindestens Episch. Innerhalb einer Seltenheit erhältst du zuerst noch fehlende Werkzeuge.</p>
        </section>

        <section className="collection" aria-labelledby="collection-title">
          <div className="collection-head">
            <div><span className="section-index">02</span><div><h2 id="collection-title">Werkzeug-Arsenal</h2><p>{gesammelt} von {SKINS.length} freigeschaltet</p></div></div>
            {aktiv ? <span className="equipped-readout"><Icon name="equip" size={15} /> Aktiv: <b>{aktiv.name}</b></span> : null}
          </div>
          <div className="skin-grid">
            {SKINS.map((skin, index) => {
              const meta = SELTENHEITEN[skin.seltenheit];
              const besitzt = Boolean(state.besitz[skin.id]);
              const istAktiv = state.ausgeruestet === skin.id;
              return (
                <article className={`skin-card rarity-${skin.seltenheit}${besitzt ? " is-owned" : " is-locked"}${istAktiv ? " is-equipped" : ""}`} key={skin.id} style={{ "--rarity": meta.farbe }}>
                  <div className="skin-visual">
                    <img src={bildUrl(skin.bild)} alt={besitzt ? `${skin.werkzeug} im Skin ${skin.name}` : "Noch nicht freigeschalteter Werkzeug-Skin"} loading="lazy" />
                    <div className="card-effects" aria-hidden="true"><i /><i /><i /></div>
                    <span className="skin-number num">{String(index + 1).padStart(2, "0")}</span>
                    {!besitzt ? <span className="skin-lock"><Icon name="lock" size={18} /> Gesperrt</span> : null}
                  </div>
                  <div className="skin-card-copy">
                    <span className="rarity-label"><i />{meta.label}</span>
                    <h3>{skin.name}</h3>
                    <p>{skin.werkzeug}</p>
                    <small>{skin.beschreibung}</small>
                    {besitzt ? (
                      <button onClick={() => rewards.ausruesten(skin.id)} disabled={istAktiv}>
                        <Icon name={istAktiv ? "check" : "equip"} size={15} />{istAktiv ? "Ausgerüstet" : "Ausrüsten"}
                      </button>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </div>
      <TabBar aktiv="werkstatt" onWechsel={onTabWechsel} />
    </>
  );
}
