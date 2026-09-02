import { useEffect, useRef, useState } from "react";
import { SELTENHEITEN, SKINS, SKIN_MAP } from "../data/skins.js";
import { KISTENPREIS, PITY_GRENZE } from "../lib/lootbox.js";
import Header from "./Header.jsx";
import Icon from "./Icon.jsx";
import TabBar from "./TabBar.jsx";

const PARTIKEL = Array.from({ length: 18 }, (_, i) => i);

function bildUrl(pfad) {
  return `${import.meta.env.BASE_URL}${pfad}`;
}

export default function LootboxScreen({ rewards, streak, level, onTabWechsel }) {
  const [oeffnet, setOeffnet] = useState(false);
  const [fund, setFund] = useState(null);
  const timer = useRef(null);
  const state = rewards.state;
  const aktiv = state.ausgeruestet ? SKIN_MAP[state.ausgeruestet] : null;
  const gesammelt = SKINS.filter((skin) => state.besitz[skin.id]).length;
  const naechsteGarantie = PITY_GRENZE - state.pity;
  const effektStufe = fund?.skin.seltenheit || "standard";

  useEffect(() => () => clearTimeout(timer.current), []);

  function kisteStarten() {
    if (oeffnet || state.chips < KISTENPREIS) return;
    setFund(null);
    setOeffnet(true);
    timer.current = setTimeout(() => {
      const ergebnis = rewards.kisteOeffnen();
      if (ergebnis.ok) setFund(ergebnis);
      setOeffnet(false);
    }, 1450);
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

        <section className="crate-console" aria-labelledby="crate-title">
          <div className="crate-info">
            <span className="console-code">ENERGY DROP / 01</span>
            <h2 id="crate-title">Energie-Kiste</h2>
            <p>Eine Öffnung enthält garantiert einen Werkzeug-Skin. Noch <b>{naechsteGarantie}</b> {naechsteGarantie === 1 ? "Kiste" : "Kisten"} bis mindestens Episch.</p>
            <div className="crate-price"><Icon name="chip" size={17} /><b>{KISTENPREIS}</b><span>pro Öffnung</span></div>
            <button className="crate-open" onClick={kisteStarten} disabled={oeffnet || state.chips < KISTENPREIS}>
              <Icon name={oeffnet ? "bolt" : "box"} size={20} />
              {oeffnet ? "Energie wird geladen …" : state.chips < KISTENPREIS ? "Nicht genug Volt-Chips" : "Kiste öffnen"}
            </button>
            <small className="fair-play">Nur erspielte Volt-Chips · kein Kauf · kein Echtgeldwert</small>
          </div>

          <div className={`reveal-stage rarity-${effektStufe}${oeffnet ? " is-opening" : ""}${fund ? " has-reveal" : ""}`} aria-live="polite">
            <div className="reveal-grid" aria-hidden="true" />
            <div className="energy-rings" aria-hidden="true"><i /><i /><i /></div>
            <div className="energy-particles" aria-hidden="true">{PARTIKEL.map((p) => <i key={p} style={{ "--p": p }} />)}</div>
            <div className="energy-beams" aria-hidden="true"><i /><i /><i /><i /></div>
            {fund ? (
              <div className="skin-reveal">
                <img src={bildUrl(fund.skin.bild)} alt={fund.skin.werkzeug + " – " + fund.skin.name} />
                <div className="reveal-copy">
                  <span>{SELTENHEITEN[fund.skin.seltenheit].label}</span>
                  <h3>{fund.skin.name}</h3>
                  <p>{fund.skin.werkzeug}</p>
                  {fund.duplikat ? <small>Duplikat · {fund.rueckgabe} Volt-Chips zurück</small> : <small>Neu in deiner Sammlung</small>}
                </div>
              </div>
            ) : (
              <div className="energy-crate" aria-label={oeffnet ? "Kiste wird geöffnet" : "Geschlossene Energie-Kiste"}>
                <Icon name="box" size={70} />
                <i aria-hidden="true" />
              </div>
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
