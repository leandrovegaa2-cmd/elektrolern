# ElektroLern (React/Vite-Version)

React-Neubau der Lernapp (siehe `../00 Fahrplan.md` und `../01 App-Doku.md` für
den Projektkontext). Ersetzt schrittweise die Einzeldatei-Version in `../website/`.

## Entwickeln

```bash
npm install
npm run dev       # lokaler Dev-Server
npm test          # Vitest: Logik-Tests (Leitner, Streak, XP, Prüfung) + Render-Smoketests
npm run build     # baut nach dist/ — dieser Ordner kann direkt bei Netlify Drop
                   # (https://app.netlify.com/drop) hochgeladen werden, wie bisher.
```

`node_modules/` und `dist/` sind absichtlich nicht mit ins Obsidian-Vault eingecheckt
(siehe `.gitignore`) — `dist/` liegt trotzdem einmal fertig gebaut daneben, damit du
sofort deployen kannst, ohne selbst Node zu installieren.

## Architektur

- `src/data/` — Kartendaten (293 Karten: 198 1:1 aus `website/karten.js` übernommen,
  21 Karten i199–i219 vom 20.07.2026, 28 Rechenkarten i220–i247 in
  `rechenkarten.js`, 26 visuelle Karten und 20 geprüfte Lichtechnik-Karten;
  siehe `../03 Fachcheck-Report.md`), Rechen-Vorlagen für den
  Generator (`rechenVorlagen.js`), Formeln, Schaubilder (SVG), Lernfeld-Wissen,
  Praxis-Tabellen.
- `src/lib/` — reine, getestete Funktionen ohne React-Abhängigkeit: Leitner-Algorithmus,
  Streak, XP/Level, Prüfungsauswahl, Schwächen-Analyse, Datumshilfen, Tagesziel,
  Problemkarten, Fortschritts-Verlauf, Erfolge, Zahlenprüfung (`rechnen.js`),
  Rückwärts-Lernplan (`lernplan.js`), Karten-Store (`kartenStore.js`).
- `src/hooks/useProgress.js` — verbindet die reine Logik mit React-State + localStorage.
- `src/hooks/useKarten.js` — liest die aktuell gültige Kartenliste aus dem
  Karten-Store (`useSyncExternalStore`), damit Editor-Änderungen sofort überall
  ankommen, ohne Context-Provider um die ganze App.
- `src/components/` — je ein Screen/Baustein pro Datei statt einer 1764-Zeilen-`index.html`.
- `src/__tests__/`, `src/lib/__tests__/` — Vitest: 196 Tests (Logik + End-to-End-Rendering
  mit React Testing Library), decken Karteikarten-, Quiz-, Prüfungs-, Rechen- und
  Editor-Flow ab.

## Was neu ist ggü. der Vanilla-Version

- **Lichtechnik** (08.09.2026): eigener Nachschlagebereich mit Lichtgrößen,
  lichttechnischen Berechnungen, LED und Betriebsgeräten, Lichtqualität, DALI,
  Schutzarten, ASR-Praxiswerten, Planungscheckliste und einem klar als
  Überschlagsrechnung gekennzeichneten Leuchtenzahl-Rechner. 20 neue Karten sind
  in LF10 eingebunden; die verwendeten Primär- und Normquellen stehen direkt an
  den Inhalten.
- **Situatives Fachgespräch** (08.09.2026): drei auftragsbezogene Szenarien mit
  freien Antworten, transparenter Kernpunktauswertung, einer adaptiven Nachfrage
  und einem kopierbaren Prüfprotokoll. Die Trainingsphasen und Gewichtung lehnen
  sich an den IHK-Musterbogen an; die Anzeige kennzeichnet ausdrücklich, dass sie
  keine offizielle IHK-Bewertung ersetzt.

- **Persistente Schwächen-Ansicht** im Fortschritt-Tab (nicht nur nach einer Prüfung).
- **XP & Level** neben dem Streak — dezent, passend zur Markenpersönlichkeit
  (kein Konfetti-Overkill, siehe `../PRODUCT.md`).
- **Tagesziel** (`src/lib/tagesziel.js`, `HeuteKarte.jsx`): editierbares
  Karten-Tagesziel mit Balken auf dem Dashboard, zählt jede beantwortete
  Karteikarte/Quizfrage, setzt sich an einem neuen Kalendertag automatisch zurück.
- **Problemkarten** (`src/lib/problemkarten.js`): eigener Fehler-Zähler je Karte
  (unabhängig von der Leitner-Box), Karten ab 2 Fehlversuchen erscheinen in einer
  Liste im Fortschritt-Tab und als eigener Übungsmodus (`onProblemkarten` in
  `App.jsx`, wiederverwendet `FlashcardSession` über die neue `kartenOverride`-Prop).
- **Fortschritts-Verlauf** (`src/lib/verlauf.js`, `VerlaufSpark.jsx`): ein
  Datenpunkt (Gesamt-% + XP) pro Kalendertag, gekappt auf die letzten 60 Tage,
  als kleine SVG-Trendlinie im Fortschritt-Tab.
- **Erfolge** (`src/lib/erfolge.js`, `ErfolgeGrid.jsx`): 10 Abzeichen
  (Streak-Meilensteine, Level 5/10, Lernfeld „sicher", alle LF „gelernt",
  Prüfung bestanden/mit Glanz) als reine Prüf-Funktionen über einen Kontext —
  bewusst **ohne** Toasts/Popups/Konfetti, nur eine Galerie im Fortschritt-Tab
  (siehe `../PRODUCT.md`: Belohnung über Momentum, nicht über Effekt-Feuerwerk).
- **Rechen-Modus** (24.07.2026, `src/lib/rechnen.js`, `RechnenSession.jsx`): Aufgaben
  mit echter Zahleneingabe statt Multiple Choice. Zwei Quellen — 28 feste
  Rechenkarten (`data/rechenkarten.js`, Kartenfeld `r = {loesung, einheit, tol}`),
  die ganz normal in den Leitner-Boxen mitlaufen, und ein Generator aus 18
  Formel-Vorlagen (`data/rechenVorlagen.js`) mit Zufallswerten für unbegrenztes
  Üben. Der Generator zahlt über `uebungVerbuchen()` nur auf XP/Tagesziel ein, weil
  es keine wiederholbare Karten-ID gibt. `parseZahl()` akzeptiert deutsche
  Kommazahlen, Tausenderpunkte und angehängte Einheiten; geprüft wird mit
  relativer Toleranz (Standard 1 %). Einstieg: „🔢 Rechentrainer" auf dem Dashboard
  (Generator) bzw. „🔢 Rechnen" in der Modus-Auswahl (feste Karten des Lernfelds).
- **Prüfungs-Countdown & Rückwärts-Lernplan** (24.07.2026, `src/lib/lernplan.js`,
  `HeuteKarte.jsx`): Prüfungstermin (`state.pruefDatum`) eintragen, die App
  rechnet Tage bis zur Prüfung, offene Karten (alles unter Box 4) und daraus das
  nötige Tagespensum — plus einen Knopf, der genau dieses Pensum als Tagesziel
  übernimmt. Ab einem Pensum über `MAX_TAGESZIEL` wird der Plan als „nicht machbar"
  markiert statt still eine unrealistische Zahl anzuzeigen.
- **Karten-Editor** (24.07.2026, `src/lib/kartenStore.js`, `CardEditor.jsx`): eigene
  Karten anlegen/bearbeiten/löschen (IDs `e1`, `e2` …) und Original-Karten
  korrigieren. Korrekturen liegen als Feld-Überschreibung im Store
  (`elektrolern_karten_v1`), das Original im Code bleibt unangetastet und ist per
  „Original wiederherstellen" zurückholbar — ein App-Update mit neuen Karten
  überschreibt also nie eigene Arbeit. Eigene Karten sind als JSON exportierbar
  (Weitergabe an Mitschüler, Import wahlweise ergänzend oder ersetzend). Erreichbar
  über den Fortschritt-Tab.
- Barrierefreiheit: Tastatursteuerung für Karteikarten (Leertaste/Pfeiltasten) sowie
  für Quiz und Prüfungssimulation (Zifferntasten 1–4 wählen eine Antwort,
  Enter/Leertaste geht weiter), `aria-live`-Regionen (inkl. Ansage bei jedem
  Bildschirmwechsel in `App.jsx`), Skip-Link, durchgängige `aria-label`s.
- Automatisch versionierter Service-Worker-Cache (vite-plugin-pwa) statt manuellem
  Hochzählen der `CACHE`-Konstante.
- Fortschritt liegt weiterhin im selben `localStorage`-Schlüssel (`elektrolern_v1`) —
  bestehender Lernstand der Klasse geht beim Umstieg nicht verloren, solange die App
  unter derselben Domain läuft. Neue Felder (`tagesziel`, `heute`, `verlauf`, `erfolge`,
  `pruefDatum`) werden beim Laden alter Stände automatisch mit sinnvollen Defaults
  aufgefüllt. Eigene Karten liegen bewusst in einem eigenen Schlüssel
  (`elektrolern_karten_v1`), damit „Fortschritt zurücksetzen" sie nicht mitlöscht.

## Bewusste Abkürzungen

Die 14 handgezeichneten SVG-Schaubilder und die 13 Lernfeld-Wissensblöcke sind als
statische, selbst verfasste HTML-Strings übernommen (`src/data/diagrams.js`,
`src/data/lfWissen.js`) statt sie voll in JSX nachzubauen — das ist vertretbar, weil es
sich um festen, von uns kontrollierten Inhalt handelt (kein Nutzer-Input, kein
XSS-Risiko). Der dynamisch geparste Teil (Kartenantworten) läuft dagegen über echte
JSX-Elemente (`src/components/FormattedAnswer.jsx`) statt über zusammengeklebte
HTML-Strings.
