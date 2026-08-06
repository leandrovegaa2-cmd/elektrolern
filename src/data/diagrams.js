// Auto-migrated from website/index.html (inline SVG diagrams, static trusted content)
export const DIA = {
sinus:`<div class="dia"><svg viewBox="0 0 320 158" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Sinuskurve mit Scheitel- und Effektivwert">
<line x1="14" y1="75" x2="306" y2="75" stroke="var(--muted)" stroke-opacity=".45" stroke-width="1.5"/>
<line x1="14" y1="30" x2="306" y2="30" stroke="var(--muted)" stroke-opacity=".5" stroke-width="1" stroke-dasharray="4 4"/>
<line x1="14" y1="43" x2="306" y2="43" stroke="var(--accent)" stroke-opacity=".8" stroke-width="1" stroke-dasharray="4 4"/>
<path d="M20,75 Q55,-15 90,75 Q125,165 160,75 Q195,-15 230,75 Q265,165 300,75" fill="none" stroke="var(--accent2)" stroke-width="2.5" stroke-linecap="round"/>
<text x="20" y="22" font-size="11" fill="var(--text)" font-weight="700">û ≈ 325 V (Spitze)</text>
<text x="300" y="40" font-size="11" fill="var(--text)" text-anchor="end" font-weight="700">U = 230 V (Effektivwert)</text>
<line x1="20" y1="140" x2="160" y2="140" stroke="var(--muted)" stroke-width="1.5"/>
<line x1="20" y1="135" x2="20" y2="145" stroke="var(--muted)" stroke-width="1.5"/>
<line x1="160" y1="135" x2="160" y2="145" stroke="var(--muted)" stroke-width="1.5"/>
<text x="90" y="155" font-size="11" fill="var(--muted)" text-anchor="middle">T = 20 ms (50 Hz)</text>
</svg><div class="dia-cap">Eine Netz-Periode: 230 V sind der Effektivwert — die Spitze liegt bei √2 · 230 V ≈ 325 V.</div></div>`,
drehstrom:`<div class="dia"><svg viewBox="0 0 320 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Drei um 120 Grad versetzte Außenleiter">
<defs><clipPath id="dsc"><rect x="20" y="20" width="280" height="100"/></clipPath></defs>
<line x1="14" y1="70" x2="306" y2="70" stroke="var(--muted)" stroke-opacity=".45" stroke-width="1.5"/>
<g clip-path="url(#dsc)" fill="none" stroke-width="2.2" stroke-linecap="round">
<path d="M20,70 Q55,0 90,70 Q125,140 160,70 Q195,0 230,70 Q265,140 300,70" stroke="#e8a33d"/>
<path d="M-73,70 Q-38,0 -3,70 Q32,140 67,70 Q102,0 137,70 Q172,140 207,70 Q242,0 277,70 Q312,140 347,70" stroke="#e4e4e7"/>
<path d="M-27,70 Q8,0 43,70 Q78,140 113,70 Q148,0 183,70 Q218,140 253,70 Q288,0 323,70" stroke="#8b8f98"/>
</g>
<g font-size="11" font-weight="700">
<line x1="20" y1="12" x2="34" y2="12" stroke="#e8a33d" stroke-width="3"/><text x="39" y="16" fill="var(--text)">L1</text>
<line x1="66" y1="12" x2="80" y2="12" stroke="#e4e4e7" stroke-width="3"/><text x="85" y="16" fill="var(--text)">L2</text>
<line x1="112" y1="12" x2="126" y2="12" stroke="#8b8f98" stroke-width="3"/><text x="131" y="16" fill="var(--text)">L3</text>
<text x="300" y="16" fill="var(--muted)" text-anchor="end" font-weight="500">je 120° versetzt</text>
</g>
</svg><div class="dia-cap">Drei Außenleiter, zeitlich um 120° verschoben — zusammen ergeben sie das Drehfeld für Motoren.</div></div>`,
sternDreieck:`<div class="dia"><svg viewBox="0 0 320 168" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Stern- und Dreieckschaltung">
<text x="80" y="18" font-size="12" font-weight="800" fill="var(--text)" text-anchor="middle">Stern (Y)</text>
<text x="240" y="18" font-size="12" font-weight="800" fill="var(--text)" text-anchor="middle">Dreieck (Δ)</text>
<g stroke="var(--accent2)" stroke-width="2">
<line x1="80" y1="95" x2="80" y2="40"/><line x1="80" y1="95" x2="42" y2="135"/><line x1="80" y1="95" x2="118" y2="135"/>
</g>
<path d="M84,44 Q128,78 121,128" fill="none" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 3"/>
<circle cx="80" cy="95" r="4" fill="var(--accent)"/>
<circle cx="80" cy="40" r="4" fill="var(--accent2)"/><circle cx="42" cy="135" r="4" fill="var(--accent2)"/><circle cx="118" cy="135" r="4" fill="var(--accent2)"/>
<text x="80" y="33" font-size="10" fill="var(--text)" text-anchor="middle" font-weight="700">L1</text>
<text x="34" y="148" font-size="10" fill="var(--text)" text-anchor="middle" font-weight="700">L2</text>
<text x="126" y="148" font-size="10" fill="var(--text)" text-anchor="middle" font-weight="700">L3</text>
<text x="90" y="106" font-size="10" fill="var(--muted)">N</text>
<text x="72" y="68" font-size="10" fill="var(--accent2)" text-anchor="end">230 V</text>
<text x="133" y="88" font-size="10" fill="var(--muted)">400 V</text>
<path d="M240,40 L205,135 L275,135 Z" fill="none" stroke="var(--accent2)" stroke-width="2"/>
<circle cx="240" cy="40" r="4" fill="var(--accent2)"/><circle cx="205" cy="135" r="4" fill="var(--accent2)"/><circle cx="275" cy="135" r="4" fill="var(--accent2)"/>
<text x="240" y="33" font-size="10" fill="var(--text)" text-anchor="middle" font-weight="700">L1</text>
<text x="197" y="148" font-size="10" fill="var(--text)" text-anchor="middle" font-weight="700">L2</text>
<text x="283" y="148" font-size="10" fill="var(--text)" text-anchor="middle" font-weight="700">L3</text>
<text x="213" y="85" font-size="10" fill="var(--accent2)" text-anchor="end">400 V</text>
</svg><div class="dia-cap">Stern: 230 V gegen N (Strang), 400 V zwischen Außenleitern — Faktor √3. Dreieck: Strangspannung = Leiterspannung = 400 V.</div></div>`,
reiheParallel:`<div class="dia"><svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Reihen- und Parallelschaltung">
<text x="89" y="18" font-size="12" font-weight="800" fill="var(--text)" text-anchor="middle">Reihe</text>
<text x="245" y="18" font-size="12" font-weight="800" fill="var(--text)" text-anchor="middle">Parallel</text>
<g stroke="var(--accent2)" stroke-width="2" fill="none">
<path d="M30,50 H60 M88,50 H96 M124,50 H148 V110 H92 M86,110 H30 V50"/>
<rect x="60" y="42" width="28" height="16" rx="3"/>
<rect x="96" y="42" width="28" height="16" rx="3"/>
</g>
<line x1="86" y1="100" x2="86" y2="120" stroke="var(--text)" stroke-width="2"/>
<line x1="92" y1="105" x2="92" y2="115" stroke="var(--text)" stroke-width="3.5"/>
<text x="74" y="54" font-size="9" fill="var(--text)" text-anchor="middle">R1</text>
<text x="110" y="54" font-size="9" fill="var(--text)" text-anchor="middle">R2</text>
<path d="M42,46 L50,50 L42,54 Z" fill="var(--accent2)"/>
<text x="38" y="42" font-size="10" fill="var(--accent2)" font-weight="700">I</text>
<g stroke="var(--accent2)" stroke-width="2" fill="none">
<line x1="210" y1="40" x2="210" y2="110"/><line x1="280" y1="40" x2="280" y2="110"/>
<path d="M210,55 H228 M262,55 H280 M210,95 H228 M262,95 H280"/>
<rect x="228" y="47" width="34" height="16" rx="3"/><rect x="228" y="87" width="34" height="16" rx="3"/>
</g>
<text x="245" y="59" font-size="9" fill="var(--text)" text-anchor="middle">R1</text>
<text x="245" y="99" font-size="9" fill="var(--text)" text-anchor="middle">R2</text>
<text x="89" y="140" font-size="10" fill="var(--muted)" text-anchor="middle">I überall gleich</text>
<text x="245" y="140" font-size="10" fill="var(--muted)" text-anchor="middle">U überall gleich</text>
</svg><div class="dia-cap">Reihe: ein Weg — Strom überall gleich, Spannungen addieren sich. Parallel: mehrere Wege — Spannung gleich, Ströme addieren sich.</div></div>`,
fi:`<div class="dia"><svg viewBox="0 0 320 148" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Funktionsprinzip FI-Schutzschalter">
<line x1="20" y1="55" x2="300" y2="55" stroke="var(--accent2)" stroke-width="2"/>
<line x1="20" y1="90" x2="300" y2="90" stroke="var(--muted)" stroke-width="2"/>
<path d="M84,51 L94,55 L84,59 Z" fill="var(--accent2)"/>
<path d="M94,86 L84,90 L94,94 Z" fill="var(--muted)"/>
<circle cx="160" cy="72" r="38" fill="none" stroke="var(--accent)" stroke-width="2.5"/>
<text x="160" y="130" font-size="10" fill="var(--muted)" text-anchor="middle">Summenstromwandler: vergleicht Hin- und Rückstrom</text>
<text x="14" y="50" font-size="11" font-weight="700" fill="var(--text)">L</text>
<text x="14" y="104" font-size="11" font-weight="700" fill="var(--text)">N</text>
<line x1="252" y1="55" x2="252" y2="112" stroke="#f87171" stroke-width="2" stroke-dasharray="5 4"/>
<path d="M248,106 L252,116 L256,106 Z" fill="#f87171"/>
<line x1="240" y1="120" x2="264" y2="120" stroke="#f87171" stroke-width="2"/>
<line x1="244" y1="125" x2="260" y2="125" stroke="#f87171" stroke-width="2"/>
<line x1="248" y1="130" x2="256" y2="130" stroke="#f87171" stroke-width="2"/>
<text x="258" y="78" font-size="10" fill="#f87171" font-weight="700">Fehlerstrom</text>
</svg><div class="dia-cap">Geht Strom „verloren" (z. B. durch den Körper zur Erde), ist Hin ≠ Rück — der FI löst bei 30 mA Differenz aus.</div></div>`,
netzformen:`<div class="dia"><svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="TN-C-S-System: PEN teilt sich in N und PE">
<g stroke="var(--muted)" stroke-width="2">
<line x1="20" y1="30" x2="300" y2="30"/><line x1="20" y1="46" x2="300" y2="46"/><line x1="20" y1="62" x2="300" y2="62"/>
</g>
<text x="22" y="26" font-size="9" fill="var(--muted)">L1</text>
<text x="22" y="42" font-size="9" fill="var(--muted)">L2</text>
<text x="22" y="58" font-size="9" fill="var(--muted)">L3</text>
<line x1="20" y1="95" x2="160" y2="95" stroke="#16a34a" stroke-width="3"/>
<line x1="20" y1="95" x2="160" y2="95" stroke="#facc15" stroke-width="3" stroke-dasharray="6 6"/>
<text x="60" y="88" font-size="10" font-weight="700" fill="var(--text)">PEN</text>
<line x1="160" y1="95" x2="182" y2="80" stroke="#3b82f6" stroke-width="2.5"/>
<line x1="182" y1="80" x2="300" y2="80" stroke="#3b82f6" stroke-width="2.5"/>
<line x1="160" y1="95" x2="182" y2="110" stroke="#16a34a" stroke-width="3"/>
<line x1="182" y1="110" x2="300" y2="110" stroke="#16a34a" stroke-width="3"/>
<line x1="182" y1="110" x2="300" y2="110" stroke="#facc15" stroke-width="3" stroke-dasharray="6 6"/>
<text x="292" y="74" font-size="10" font-weight="700" fill="#60a5fa" text-anchor="end">N</text>
<text x="292" y="126" font-size="10" font-weight="700" fill="#4ade80" text-anchor="end">PE</text>
<line x1="160" y1="18" x2="160" y2="118" stroke="var(--muted)" stroke-width="1" stroke-dasharray="4 4" stroke-opacity=".6"/>
<text x="88" y="136" font-size="10" fill="var(--muted)" text-anchor="middle">TN-C (kombiniert)</text>
<text x="237" y="136" font-size="10" fill="var(--muted)" text-anchor="middle">TN-S (getrennt)</text>
</svg><div class="dia-cap">TN-C-S: Bis zur Hauptverteilung läuft der PEN-Leiter kombiniert (TN-C), danach getrennt als N und PE (TN-S) — Regelfall im Gebäude.</div></div>`,
wechsel:`<div class="dia"><svg viewBox="0 0 320 118" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Wechselschaltung">
<text x="14" y="70" font-size="11" font-weight="700" fill="var(--text)">L</text>
<line x1="26" y1="66" x2="72" y2="66" stroke="var(--accent2)" stroke-width="2"/>
<line x1="75" y1="66" x2="103" y2="50" stroke="var(--accent2)" stroke-width="2"/>
<line x1="107" y1="50" x2="213" y2="50" stroke="var(--accent2)" stroke-width="2"/>
<line x1="107" y1="82" x2="213" y2="82" stroke="var(--muted)" stroke-width="2"/>
<line x1="217" y1="50" x2="245" y2="66" stroke="var(--accent2)" stroke-width="2"/>
<line x1="248" y1="66" x2="270" y2="66" stroke="var(--accent2)" stroke-width="2"/>
<circle cx="75" cy="66" r="3.5" fill="var(--text)"/>
<circle cx="105" cy="50" r="3" fill="var(--muted)"/><circle cx="105" cy="82" r="3" fill="var(--muted)"/>
<circle cx="215" cy="50" r="3" fill="var(--muted)"/><circle cx="215" cy="82" r="3" fill="var(--muted)"/>
<circle cx="245" cy="66" r="3.5" fill="var(--text)"/>
<circle cx="284" cy="66" r="11" fill="none" stroke="var(--text)" stroke-width="2"/>
<line x1="277" y1="59" x2="291" y2="73" stroke="var(--text)" stroke-width="2"/>
<line x1="291" y1="59" x2="277" y2="73" stroke="var(--text)" stroke-width="2"/>
<text x="75" y="108" font-size="10" fill="var(--muted)" text-anchor="middle">Schalter 1</text>
<text x="245" y="108" font-size="10" fill="var(--muted)" text-anchor="middle">Schalter 2</text>
<text x="160" y="42" font-size="9" fill="var(--muted)" text-anchor="middle">korrespondierende Adern</text>
</svg><div class="dia-cap">Eine Lampe von zwei Stellen (Flur/Treppe): Jeder Schalter kippt zwischen den beiden korrespondierenden Adern um.</div></div>`,
ohmDreieck:`<div class="dia"><svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="U-R-I-Dreieck zum Ohmschen Gesetz">
<path d="M160,24 L60,126 L260,126 Z" fill="rgba(59,130,246,.06)" stroke="var(--accent)" stroke-width="2"/>
<line x1="110" y1="80" x2="210" y2="80" stroke="var(--accent)" stroke-width="1.5" stroke-opacity=".55"/>
<line x1="160" y1="80" x2="160" y2="126" stroke="var(--accent)" stroke-width="1.5" stroke-opacity=".55"/>
<text x="160" y="66" font-size="26" font-weight="800" fill="var(--accent2)" text-anchor="middle">U</text>
<text x="132" y="116" font-size="24" font-weight="800" fill="var(--text)" text-anchor="middle">R</text>
<text x="192" y="116" font-size="24" font-weight="800" fill="var(--text)" text-anchor="middle">I</text>
</svg><div class="dia-cap">Merkdreieck: U oben abdecken → U = R · I. R abdecken → R = U/I. I abdecken → I = U/R.</div></div>`,
leistungsDreieck:`<div class="dia"><svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Leistungsdreieck P Q S">
<path d="M50,120 L250,120 L250,40 Z" fill="rgba(59,130,246,.06)" stroke="var(--accent2)" stroke-width="2"/>
<path d="M50,120 L250,40" stroke="var(--accent2)" stroke-width="2.5"/>
<path d="M74,120 A24,24 0 0 0 68,104" fill="none" stroke="var(--muted)" stroke-width="1.5"/>
<text x="80" y="112" font-size="11" fill="var(--muted)">φ</text>
<rect x="238" y="108" width="12" height="12" fill="none" stroke="var(--muted)" stroke-width="1"/>
<text x="150" y="137" font-size="12" font-weight="800" fill="var(--text)" text-anchor="middle">P — Wirkleistung (W)</text>
<text x="258" y="84" font-size="12" font-weight="800" fill="var(--text)">Q</text>
<text x="140" y="72" font-size="12" font-weight="800" fill="var(--accent2)" text-anchor="middle" transform="rotate(-22 140 72)">S — Scheinleistung</text>
</svg><div class="dia-cap">S ist die Hypotenuse aus Wirkleistung P und Blindleistung Q. cos φ = P/S — je kleiner der Winkel φ, desto besser.</div></div>`,
trafo:`<div class="dia"><svg viewBox="0 0 320 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Transformator mit zwei Wicklungen">
<rect x="150" y="26" width="20" height="88" fill="none" stroke="var(--muted)" stroke-width="3"/>
<g stroke="var(--accent2)" stroke-width="2.5" fill="none">
<path d="M120,40 a9,9 0 0 0 0,18 a9,9 0 0 0 0,18 a9,9 0 0 0 0,18 a9,9 0 0 0 0,18"/>
</g>
<g stroke="#e8a33d" stroke-width="2.5" fill="none">
<path d="M200,40 a9,9 0 0 1 0,18 a9,9 0 0 1 0,18 a9,9 0 0 1 0,18 a9,9 0 0 1 0,18"/>
</g>
<line x1="120" y1="40" x2="90" y2="40" stroke="var(--accent2)" stroke-width="2"/>
<line x1="120" y1="112" x2="90" y2="112" stroke="var(--accent2)" stroke-width="2"/>
<line x1="200" y1="40" x2="230" y2="40" stroke="#e8a33d" stroke-width="2"/>
<line x1="200" y1="112" x2="230" y2="112" stroke="#e8a33d" stroke-width="2"/>
<text x="88" y="30" font-size="11" font-weight="700" fill="var(--accent2)" text-anchor="end">U1 · N1</text>
<text x="232" y="30" font-size="11" font-weight="700" fill="#e8a33d">U2 · N2</text>
<text x="160" y="130" font-size="10" fill="var(--muted)" text-anchor="middle">gemeinsamer Eisenkern</text>
</svg><div class="dia-cap">U1/U2 = N1/N2: Das Spannungsverhältnis folgt dem Windungsverhältnis. Energie geht übers Magnetfeld im Kern über.</div></div>`,
spsZyklus:`<div class="dia"><svg viewBox="0 0 320 132" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="SPS-Zyklus Eingänge CPU Ausgänge">
<g font-size="11" font-weight="700" text-anchor="middle">
<rect x="18" y="46" width="72" height="40" rx="8" fill="rgba(59,130,246,.08)" stroke="var(--accent)" stroke-width="1.5"/>
<text x="54" y="63" fill="var(--text)">Eingänge</text><text x="54" y="77" fill="var(--muted)" font-size="9">Sensoren</text>
<rect x="124" y="46" width="72" height="40" rx="8" fill="rgba(59,130,246,.08)" stroke="var(--accent)" stroke-width="1.5"/>
<text x="160" y="63" fill="var(--text)">CPU</text><text x="160" y="77" fill="var(--muted)" font-size="9">Programm</text>
<rect x="230" y="46" width="72" height="40" rx="8" fill="rgba(59,130,246,.08)" stroke="var(--accent)" stroke-width="1.5"/>
<text x="266" y="63" fill="var(--text)">Ausgänge</text><text x="266" y="77" fill="var(--muted)" font-size="9">Aktoren</text>
</g>
<path d="M90,66 L120,66" stroke="var(--accent2)" stroke-width="2" marker-end="url(#arh)"/>
<path d="M196,66 L226,66" stroke="var(--accent2)" stroke-width="2" marker-end="url(#arh)"/>
<path d="M266,90 C266,116 54,116 54,90" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-dasharray="5 4" marker-end="url(#arh)"/>
<defs><marker id="arh" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L6,3.5 L0,7 Z" fill="var(--accent2)"/></marker></defs>
<text x="160" y="112" font-size="9" fill="var(--muted)" text-anchor="middle">zyklisch — immer wieder von vorn</text>
</svg><div class="dia-cap">Die SPS arbeitet in Millisekunden im Kreis: Eingänge lesen → Programm abarbeiten → Ausgänge setzen → von vorn.</div></div>`,
selbsthaltung:`<div class="dia"><svg viewBox="0 0 320 150" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Selbsthaltung mit Schütz">
<line x1="40" y1="20" x2="40" y2="130" stroke="var(--muted)" stroke-width="2"/>
<line x1="280" y1="20" x2="280" y2="130" stroke="var(--muted)" stroke-width="2"/>
<line x1="40" y1="34" x2="90" y2="34" stroke="var(--accent2)" stroke-width="2"/>
<line x1="94" y1="30" x2="112" y2="22" stroke="var(--accent2)" stroke-width="2"/>
<circle cx="92" cy="34" r="3" fill="var(--text)"/><circle cx="114" cy="21" r="3" fill="var(--muted)"/>
<text x="70" y="18" font-size="9" fill="var(--muted)">Start (Taster)</text>
<line x1="40" y1="70" x2="90" y2="70" stroke="var(--accent2)" stroke-width="2"/>
<line x1="94" y1="70" x2="112" y2="62" stroke="var(--accent2)" stroke-width="2"/>
<circle cx="92" cy="70" r="3" fill="var(--text)"/>
<text x="60" y="86" font-size="9" fill="var(--accent2)">Haltekontakt</text>
<line x1="114" y1="21" x2="200" y2="21" stroke="var(--accent2)" stroke-width="2"/>
<line x1="112" y1="62" x2="140" y2="62" stroke="var(--accent2)" stroke-width="2"/>
<line x1="140" y1="62" x2="140" y2="21" stroke="var(--accent2)" stroke-width="2"/>
<line x1="200" y1="21" x2="200" y2="60" stroke="var(--accent2)" stroke-width="2"/>
<rect x="186" y="60" width="28" height="26" rx="3" fill="none" stroke="var(--text)" stroke-width="2"/>
<text x="200" y="77" font-size="12" font-weight="800" fill="var(--text)" text-anchor="middle">K</text>
<line x1="200" y1="86" x2="200" y2="130" stroke="var(--accent2)" stroke-width="2"/>
<line x1="40" y1="130" x2="280" y2="130" stroke="var(--muted)" stroke-width="2"/>
<line x1="280" y1="60" x2="280" y2="60" stroke="var(--muted)" stroke-width="2"/>
</svg><div class="dia-cap">Kurzer Druck auf Start zieht Schütz K an; sein eigener Haltekontakt (parallel) überbrückt den Taster — K bleibt an, bis Stopp kommt.</div></div>`,
pvKette:`<div class="dia"><svg viewBox="0 0 320 118" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="PV-Anlage Modul Wechselrichter Netz">
<g font-size="10" font-weight="700" text-anchor="middle">
<rect x="16" y="34" width="66" height="46" rx="6" fill="rgba(59,130,246,.08)" stroke="var(--accent)" stroke-width="1.5"/>
<line x1="34" y1="40" x2="34" y2="74" stroke="var(--accent)" stroke-opacity=".5"/><line x1="49" y1="40" x2="49" y2="74" stroke="var(--accent)" stroke-opacity=".5"/><line x1="64" y1="40" x2="64" y2="74" stroke="var(--accent)" stroke-opacity=".5"/>
<text x="49" y="97" fill="var(--text)">PV-Modul</text>
<rect x="127" y="34" width="66" height="46" rx="6" fill="rgba(59,130,246,.08)" stroke="var(--accent)" stroke-width="1.5"/>
<text x="160" y="53" fill="var(--text)" font-size="11">~</text><text x="160" y="66" fill="var(--muted)" font-size="8">DC → AC</text>
<text x="160" y="97" fill="var(--text)">Wechselrichter</text>
<rect x="238" y="34" width="66" height="46" rx="6" fill="rgba(59,130,246,.08)" stroke="var(--accent)" stroke-width="1.5"/>
<text x="271" y="60" fill="var(--text)">Netz / Haus</text>
</g>
<text x="104" y="50" font-size="8" fill="#e8a33d" text-anchor="middle" font-weight="700">DC</text>
<text x="215" y="50" font-size="8" fill="var(--accent2)" text-anchor="middle" font-weight="700">AC</text>
<path d="M82,57 L125,57" stroke="#e8a33d" stroke-width="2" marker-end="url(#arh)"/>
<path d="M193,57 L236,57" stroke="var(--accent2)" stroke-width="2" marker-end="url(#arh)"/>
</svg><div class="dia-cap">Module liefern Gleichstrom (DC) aus dem Photoeffekt; der Wechselrichter macht daraus netzkonformen Wechselstrom (AC).</div></div>`,
kreuz:`<div class="dia"><svg viewBox="0 0 320 120" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Kreuzschaltung">
<text x="14" y="66" font-size="11" font-weight="700" fill="var(--text)">L</text>
<line x1="26" y1="62" x2="60" y2="62" stroke="var(--accent2)" stroke-width="2"/>
<line x1="63" y1="62" x2="80" y2="50" stroke="var(--accent2)" stroke-width="2"/>
<circle cx="62" cy="62" r="3" fill="var(--text)"/>
<line x1="82" y1="50" x2="130" y2="50" stroke="var(--accent2)" stroke-width="2"/>
<line x1="82" y1="74" x2="130" y2="74" stroke="var(--muted)" stroke-width="2"/>
<rect x="130" y="42" width="40" height="40" rx="4" fill="none" stroke="var(--text)" stroke-width="2"/>
<line x1="136" y1="50" x2="164" y2="74" stroke="var(--accent2)" stroke-width="1.6"/>
<line x1="136" y1="74" x2="164" y2="50" stroke="var(--accent2)" stroke-width="1.6"/>
<line x1="170" y1="50" x2="218" y2="50" stroke="var(--accent2)" stroke-width="2"/>
<line x1="170" y1="74" x2="218" y2="74" stroke="var(--muted)" stroke-width="2"/>
<line x1="220" y1="50" x2="238" y2="62" stroke="var(--accent2)" stroke-width="2"/>
<line x1="240" y1="62" x2="262" y2="62" stroke="var(--accent2)" stroke-width="2"/>
<circle cx="240" cy="62" r="3" fill="var(--text)"/>
<circle cx="278" cy="62" r="11" fill="none" stroke="var(--text)" stroke-width="2"/>
<line x1="271" y1="55" x2="285" y2="69" stroke="var(--text)" stroke-width="2"/><line x1="285" y1="55" x2="271" y2="69" stroke="var(--text)" stroke-width="2"/>
<text x="60" y="104" font-size="9" fill="var(--muted)" text-anchor="middle">Wechsel</text>
<text x="150" y="104" font-size="9" fill="var(--accent2)" text-anchor="middle">Kreuz</text>
<text x="240" y="104" font-size="9" fill="var(--muted)" text-anchor="middle">Wechsel</text>
</svg><div class="dia-cap">Ab 3 Schaltstellen: außen zwei Wechselschalter, in der Mitte ein (oder mehrere) Kreuzschalter, der beide Adern überkreuzt.</div></div>`,
// Eigenes Schaltzeichen, neu gezeichnet (Vorlage: Fachbuch "Schaltgeräte").
// Wird als BILD-FRAGE genutzt: absichtlich OHNE Bauteilnamen im Bild.
schuetz:`<div class="dia"><svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Schaltzeichen: Spule links, drei Schließer rechts, gestrichelte mechanische Kopplung">
<g stroke="var(--accent2)" stroke-width="2" fill="none" stroke-linecap="round">
<rect x="46" y="66" width="42" height="34" rx="2"/>
<line x1="67" y1="30" x2="67" y2="66"/>
<line x1="67" y1="100" x2="67" y2="140"/>
<line x1="180" y1="30" x2="180" y2="72"/><line x1="230" y1="30" x2="230" y2="72"/><line x1="280" y1="30" x2="280" y2="72"/>
<line x1="180" y1="140" x2="180" y2="104"/><line x1="230" y1="140" x2="230" y2="104"/><line x1="280" y1="140" x2="280" y2="104"/>
<line x1="180" y1="104" x2="194" y2="74"/><line x1="230" y1="104" x2="244" y2="74"/><line x1="280" y1="104" x2="294" y2="74"/>
</g>
<g fill="var(--accent)"><circle cx="67" cy="30" r="3"/><circle cx="67" cy="140" r="3"/>
<circle cx="180" cy="30" r="3"/><circle cx="230" cy="30" r="3"/><circle cx="280" cy="30" r="3"/>
<circle cx="180" cy="140" r="3"/><circle cx="230" cy="140" r="3"/><circle cx="280" cy="140" r="3"/></g>
<line x1="88" y1="83" x2="180" y2="83" stroke="var(--muted)" stroke-width="1.4" stroke-dasharray="4 3"/>
<line x1="180" y1="83" x2="280" y2="83" stroke="var(--muted)" stroke-width="1.4" stroke-dasharray="4 3"/>
<g font-size="10" font-weight="700" fill="var(--text)">
<text x="78" y="26">A1</text><text x="78" y="152">A2</text>
<text x="168" y="26" text-anchor="end">1</text><text x="218" y="26" text-anchor="end">3</text><text x="268" y="26" text-anchor="end">5</text>
<text x="168" y="152" text-anchor="end">2</text><text x="218" y="152" text-anchor="end">4</text><text x="268" y="152" text-anchor="end">6</text>
</g>
</svg></div>`,
// Eigenes Schaltbild, neu gezeichnet (Vorlage: Fachbuch "Motoren", Klemmkasten).
klemmbrettStern:`<div class="dia"><svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Motor-Klemmbrett: obere Reihe U1 V1 W1, untere Reihe W2 U2 V2, untere drei zum Sternpunkt gebrückt">
<rect x="40" y="34" width="240" height="102" rx="8" fill="rgba(255,255,255,.03)" stroke="var(--gb2)" stroke-width="1.5"/>
<g stroke="var(--accent2)" stroke-width="2" fill="none">
<line x1="90" y1="20" x2="90" y2="60"/><line x1="160" y1="20" x2="160" y2="60"/><line x1="230" y1="20" x2="230" y2="60"/>
<line x1="90" y1="110" x2="90" y2="128"/><line x1="160" y1="110" x2="160" y2="128"/><line x1="230" y1="110" x2="230" y2="128"/>
</g>
<line x1="90" y1="119" x2="230" y2="119" stroke="var(--accent)" stroke-width="2.5"/>
<g fill="var(--accent2)"><circle cx="90" cy="62" r="7"/><circle cx="160" cy="62" r="7"/><circle cx="230" cy="62" r="7"/>
<circle cx="90" cy="108" r="7"/><circle cx="160" cy="108" r="7"/><circle cx="230" cy="108" r="7"/></g>
<g font-size="11" font-weight="800" fill="var(--text)" text-anchor="middle">
<text x="90" y="16">L1</text><text x="160" y="16">L2</text><text x="230" y="16">L3</text>
<text x="90" y="82">U1</text><text x="160" y="82">V1</text><text x="230" y="82">W1</text>
<text x="90" y="102">W2</text><text x="160" y="102">U2</text><text x="230" y="102">V2</text>
</g>
</svg></div>`
};
