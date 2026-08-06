// Auto-migrated from website/index.html
import { DIA } from './diagrams.js';
export const LF_HTML = {
LF1:`<div class="w-sec">Grundgrößen</div>
<div class="kv"><b>U</b><span>Spannung in Volt — der „Druck"</span><b>I</b><span>Strom in Ampere — der „Fluss"</span><b>R</b><span>Widerstand in Ohm — die „Bremse"</span></div>
<div class="merk">💧 Wasser-Analogie: Druck = Spannung, Durchfluss = Strom, enges Rohr = Widerstand.</div>
<div class="w-sec">Die drei Kernformeln</div>
<div class="kv"><b>U = R · I</b><span>Ohmsches Gesetz — sicher umstellen können</span><b>P = U · I</b><span>Leistung in Watt</span><b>W = P · t</b><span>Arbeit — als kWh auf der Stromrechnung</span></div>
<div class="w-sec">Reihe vs. Parallel</div>
${DIA.reiheParallel}
<div class="kv"><b>Reihe</b><span>Strom überall gleich, Spannungen und Widerstände addieren sich. Ein Ausfall = alles tot.</span><b>Parallel</b><span>Spannung überall gleich, Ströme addieren sich, Gesamtwiderstand sinkt. So sind Steckdosen verschaltet.</span></div>
<div class="w-sec">Kirchhoff &amp; Messen</div>
<ul class="w-list"><li>Knotenregel: Summe aller Ströme am Knoten = 0</li><li>Maschenregel: Summe aller Spannungen im Umlauf = 0</li><li>Messen: Spannung parallel, Strom in Reihe (oder Stromzange)</li></ul>`,
LF2:`<div class="w-sec">Wann wird's gefährlich?</div>
<div class="kv"><b>50 V AC / 120 V DC</b><span>ab hier gefährliche Spannung</span><b>ca. 50 mA</b><span>durch den Körper: Gefahr von Herzkammerflimmern</span></div>
<div class="merk">🛑 Die 5 Sicherheitsregeln in fester Reihenfolge — auswendig! (Als Tabelle unter „Formeln".)</div>
<div class="w-sec">Netzsysteme</div>
${DIA.netzformen}
<div class="kv"><b>TN-C</b><span>PEN kombiniert — ältere Anlagen</span><b>TN-S</b><span>N und PE getrennt — heutiger Standard</span><b>TN-C-S</b><span>erst kombiniert, ab Hauptverteilung getrennt</span><b>TT</b><span>eigener Erder beim Verbraucher (oft ländlich)</span><b>IT</b><span>isoliert — OP-Saal/Industrie, erster Fehler schaltet nicht ab</span></div>
<div class="w-sec">Schutzorgane</div>
${DIA.fi}
<div class="kv"><b>LS-Schalter</b><span>schützt die LEITUNG (B Haushalt, C Motoren)</span><b>FI / RCD</b><span>schützt MENSCHEN — löst bei 30 mA Differenzstrom aus</span></div>
<div class="w-sec">Merkwerte</div>
<div class="kv"><b>Farben</b><span>PE grün-gelb (niemals anders nutzen!), N blau, L1–L3 braun/schwarz/grau</span><b>Querschnitte</b><span>Licht 1,5 mm² · Steckdosen 2,5 mm² · Herd 6–10 mm²</span><b>Schutzklassen</b><span>I mit PE · II doppelt isoliert · III Schutzkleinspannung</span></div>`,
LF3:`<div class="w-sec">Steuern vs. Regeln</div>
<div class="kv"><b>Steuern</b><span>offene Kette, keine Rückmeldung (Lichtschalter)</span><b>Regeln</b><span>geschlossener Kreis mit Soll-Ist-Vergleich (Thermostat)</span></div>
<div class="w-sec">Logik-Grundlagen</div>
<div class="kv"><b>UND</b><span>Ausgang 1, wenn ALLE Eingänge 1 sind</span><b>ODER</b><span>Ausgang 1, wenn mindestens ein Eingang 1 ist</span><b>NICHT</b><span>kehrt das Signal um</span><b>NAND / NOR / XOR</b><span>kombinierte Gatter (XOR: 1 bei ungleichen Eingängen)</span></div>
<div class="w-sec">Schütz &amp; Kontakte</div>
<ul class="w-list"><li>Relais/Schütz: kleiner Steuerstrom schaltet großen Laststrom</li><li>Kontakte: Schließer (NO), Öffner (NC, z. B. NOT-AUS), Wechsler</li></ul>
<div class="merk">⭐ Selbsthaltung: Schütz hält sich nach kurzem Impuls über den eigenen Kontakt — DIE Grundschaltung der Steuerungstechnik.</div>`,
LF4:`<div class="w-sec">Digitale Grundlagen</div>
<div class="kv"><b>Bit</b><span>kleinste Einheit: 0 oder 1</span><b>Byte</b><span>8 Bit</span><b>Zahlensysteme</b><span>Dezimal (10) · Binär (2) · Hexadezimal (16, Ziffern 0–9 + A–F)</span><b>Analog / Digital</b><span>analog = stufenlos, digital = feste Stufen</span></div>
<div class="w-sec">Bus &amp; Netzwerk</div>
<ul class="w-list"><li>Bus-System: viele Teilnehmer an EINER gemeinsamen Leitung (Basis für KNX)</li><li>IP-Adresse (logisch) vs. MAC-Adresse (hardwarefest)</li><li>LAN mit Twisted-Pair, RJ45-Stecker, Cat-Kategorien</li></ul>`,
LF5:`<div class="w-sec">Wechselstrom</div>
${DIA.sinus}
<div class="kv"><b>f = 50 Hz</b><span>Periodendauer T = 1/f = 20 ms</span><b>230 V</b><span>ist der EFFEKTIVWERT — Spitze û = 230 V · √2 ≈ 325 V</span></div>
<div class="w-sec">Widerstände im AC-Kreis</div>
<div class="kv"><b>R</b><span>Wirkwiderstand — macht Wärme</span><b>X</b><span>Blindwiderstand — Spule (X<sub>L</sub>) und Kondensator (X<sub>C</sub>) verschieben Strom und Spannung</span><b>Z</b><span>Scheinwiderstand (Impedanz) — Kombination aus beidem</span></div>
<div class="w-sec">Leistungen</div>
<div class="kv"><b>P (W)</b><span>Wirkleistung — echte Arbeit</span><b>Q (var)</b><span>Blindleistung — pendelt nur hin und her</span><b>S (VA)</b><span>Scheinleistung</span><b>cos φ</b><span>= P/S, der Leistungsfaktor</span></div>
<div class="w-sec">Drehstrom</div>
${DIA.drehstrom}
${DIA.sternDreieck}
<div class="kv"><b>Stern (Y)</b><span>230 V gegen N, 400 V zwischen Außenleitern (Faktor √3)</span><b>Dreieck (Δ)</b><span>Strangspannung = Leiterspannung, Ströme um √3 verkettet</span></div>
<div class="w-sec">Trafo &amp; Bauteile</div>
<ul class="w-list"><li>Trafo: U1/U2 = N1/N2 — Energie übers Magnetfeld. Hochspannung beim Transport = weniger Verluste</li><li>Kondensator (Farad, elektrisches Feld) · Spule (Henry, Magnetfeld)</li><li>Diode (Ventil) · Gleichrichter (AC → DC)</li></ul>`,
LF6:`<div class="merk">📋 Prüfreihenfolge VDE 0100-600: <b>Besichtigen → Erproben → Messen</b> — die Reihenfolge ist Prüfungsstoff!</div>
<div class="w-sec">Messungen der Erstprüfung</div>
<ul class="w-list"><li>Schutzleiter-Durchgängigkeit — niederohmig</li><li>Isolationswiderstand — hoch (&gt; 1 MΩ)</li><li>Schleifenimpedanz — schaltet die Sicherung schnell genug ab?</li><li>RCD-Test (Auslösestrom und -zeit)</li><li>Drehfeld — rechtsdrehend</li></ul>
<div class="w-sec">Merkwerte</div>
<div class="kv"><b>0,4 s</b><span>max. Abschaltzeit im TN-Netz, Endstromkreise bis 32 A</span><b>VDE 0701/0702</b><span>Wiederholungsprüfung Geräte: Sicht, Schutzleiter, Isolation, Funktion, Doku</span></div>
<div class="merk">⚠️ Ohne Messprotokoll keine Abnahme — Haftung!</div>`,
LF7:`<div class="w-sec">Aufbau &amp; Arbeitsweise</div>
<ul class="w-list"><li>Eingänge (Sensoren) → CPU (Programm) → Ausgänge (Aktoren)</li><li>Zyklisch: Eingänge lesen → Programm abarbeiten → Ausgänge setzen → von vorn (Millisekunden)</li><li>Vorteil: Änderung im Programm statt Umverdrahten</li></ul>
<div class="w-sec">Sprachen (IEC 61131-3)</div>
<div class="kv"><b>KOP</b><span>Kontaktplan — wie ein Stromlaufplan</span><b>FUP</b><span>Funktionsplan — Logikblöcke</span><b>AWL</b><span>Anweisungsliste — Text, maschinennah</span><b>ST</b><span>Strukturierter Text — Hochsprache</span></div>
<div class="w-sec">Bausteine &amp; Adressen</div>
<div class="kv"><b>Timer</b><span>Ein-/Ausschaltverzögerung</span><b>Zähler</b><span>vorwärts/rückwärts</span><b>Merker</b><span>interne Bits — Selbsthaltung in Software</span><b>E / A</b><span>Eingang/Ausgang, z. B. E0.1 = Byte 0, Bit 1</span></div>
<div class="merk">🚨 NOT-AUS nie nur in Software — hartverdrahtet oder über Sicherheitsrelais!</div>`,
LF8:`<div class="w-sec">Grundprinzip</div>
<ul class="w-list"><li>Kraft auf stromdurchflossenen Leiter im Magnetfeld (Lorentzkraft)</li><li>Asynchronmotor: Rotor läuft langsamer als das Drehfeld (Schlupf) — das Arbeitspferd der Industrie</li></ul>
<div class="w-sec">Merkformeln &amp; Regeln</div>
<div class="kv"><b>n = f / p</b><span>Drehfelddrehzahl (50 Hz, p = 1 → 3000 U/min)</span><b>Drehrichtung</b><span>zwei Außenleiter tauschen</span><b>Y-Δ-Anlauf</b><span>reduziert den Anlaufstrom auf ca. 1/3 — Start in Stern, dann Dreieck</span></div>
<div class="w-sec">Drehzahl &amp; Schutz</div>
<ul class="w-list"><li>Frequenzumrichter: Drehzahl stufenlos über die Frequenz, Sanftanlauf, Energieeffizienz</li><li>Motorschutzschalter / Thermorelais gegen Überlast</li></ul>`,
LF9:`<div class="w-sec">KNX-Grundprinzip</div>
<ul class="w-list"><li>Alle Geräte an gemeinsamer 2-Draht-Busleitung, tauschen Telegramme</li><li>Funktion per Software statt Verdrahtung</li><li>Busspannung ca. 29 V DC (SELV), Buskabel typisch grün</li><li>Sensor sendet (Taster), Aktor führt aus (schaltet/dimmt)</li></ul>
<div class="w-sec">Adressen &amp; Tools</div>
<div class="kv"><b>Physikalisch</b><span>WO das Gerät sitzt (z. B. 1.1.5)</span><b>Gruppenadresse</b><span>WER mit wem redet (Funktion)</span><b>ETS</b><span>herstellerübergreifendes Projektierungs-Tool</span></div>
<div class="w-sec">Netzwerk im Gebäude</div>
<ul class="w-list"><li>Strukturierte Verkabelung</li><li>PoE: Strom übers Netzwerkkabel (Kameras, Access Points)</li></ul>`,
LF10:`<div class="w-sec">Installationsschaltungen</div>
${DIA.wechsel}
<div class="kv"><b>Ausschaltung</b><span>1 Lampe von 1 Stelle</span><b>Serienschaltung</b><span>2 Lampengruppen von 1 Stelle</span><b>Wechselschaltung</b><span>1 Lampe von 2 Stellen (Flur)</span><b>Kreuzschaltung</b><span>3+ Stellen: 2 Wechsel- + Kreuzschalter dazwischen</span><b>Stromstoß</b><span>Taster + Relais — Treppenhaus, beliebig viele Taster</span></div>
<div class="w-sec">Licht</div>
<div class="kv"><b>Lumen (lm)</b><span>Lichtstrom — was die Lampe abgibt</span><b>Lux (lx)</b><span>Beleuchtungsstärke — was auf der Fläche ankommt</span><b>lm/W</b><span>Lichtausbeute — Effizienz</span></div>
<ul class="w-list"><li>LED heute Standard — nur LED-taugliche Dimmer verwenden</li><li>Inbetriebnahme: prüfen wie LF6, Messprotokoll, Kunde einweisen, Doku übergeben</li></ul>`,
LF11:`<div class="w-sec">Photovoltaik</div>
<ul class="w-list"><li>Module erzeugen Gleichstrom (Photoeffekt) → Wechselrichter macht netzkonformen AC</li><li>Reihe (Strings) erhöht die Spannung, parallel erhöht den Strom</li><li>kWp = Nennleistung unter Standard-Testbedingungen</li></ul>
<div class="merk">⚠️ DC-Seite steht unter Spannung, sobald Licht auf die Module fällt — Feuerwehrschalter, besondere Vorsicht!</div>
<div class="w-sec">Energiekonzept</div>
<div class="kv"><b>Speicher</b><span>Batterie für PV-Überschuss</span><b>Wallbox</b><span>mit Lastmanagement</span><b>Wärmepumpe</b><span>elektrischer Großverbraucher</span></div>
<div class="w-sec">Blitz- &amp; Überspannungsschutz</div>
<div class="kv"><b>Äußerer</b><span>Fangeinrichtung, Ableitung, Erdung</span><b>Innerer</b><span>SPD Typ 1/2/3 + Potentialausgleich</span><b>Potentialausgleich</b><span>alle leitfähigen Teile auf gleiches Potential</span></div>`,
LF12:`<div class="w-sec">Planungsunterlagen</div>
<div class="kv"><b>Stromlaufplan</b><span>die Schaltungs-LOGIK</span><b>Installationsplan</b><span>die LAGE im Grundriss</span><b>Klemmenplan</b><span>Anschlüsse</span><b>Stückliste</b><span>Material</span></div>
<div class="w-sec">Dimensionierung &amp; Vorgaben</div>
<ul class="w-list"><li>Strombelastbarkeit, Spannungsfall, Verlegeart, Abschaltbedingungen</li><li>Kundenauftrag analysieren, Normen (VDE/DIN), Budget</li></ul>
<div class="kv"><b>Lastenheft</b><span>WAS will der Kunde</span><b>Pflichtenheft</b><span>WIE setzen wir es um</span><b>BIM</b><span>digitales 3D-Gebäudemodell, alle Gewerke in einem Datenmodell</span></div>
<div class="merk">💰 Kalkulation: Material + Lohn + Gemeinkosten (+ Gewinn) = Angebot</div>`,
LF13:`<div class="w-sec">Instandhaltung (DIN 31051)</div>
<div class="kv"><b>Wartung</b><span>Zustand ERHALTEN (reinigen, schmieren)</span><b>Inspektion</b><span>Zustand FESTSTELLEN (prüfen, messen)</span><b>Instandsetzung</b><span>Zustand WIEDERHERSTELLEN (reparieren)</span><b>Verbesserung</b><span>Anlage optimieren</span></div>
<div class="merk">🔧 Vorbeugend (geplant, vor dem Ausfall) schlägt ausfallbedingt (reaktiv, teuer).</div>
<div class="w-sec">Systematische Fehlersuche</div>
<ol class="steps"><li>Symptom genau erfassen</li><li>Fehlerbereich eingrenzen</li><li>Ursache messen und bestätigen</li><li>Fehler beheben</li><li>Funktion prüfen + dokumentieren</li></ol>
<ul class="w-list"><li>Strategien: Hälfte-Methode, Signalverfolgung, Referenzvergleich — messen statt raten!</li><li>Änderungen: Normkonformität sicherstellen, Doku aktualisieren (Pflicht)</li></ul>
<div class="w-sec">Gesellenprüfung Teil 2 (60 %)</div>
<ul class="w-list"><li>Betrieblicher Auftrag + Fachgespräch</li><li>Schriftlich: Systementwurf, Funktions-/Systemanalyse, WISO</li></ul>`
};

// Reintext-Version für die Volltextsuche (Tags entfernt), aus LF_HTML abgeleitet.
export const LF_INFO = {};
Object.keys(LF_HTML).forEach((k) => {
  LF_INFO[k] = LF_HTML[k].replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
});
