import { useState } from "react";
import { useProgress } from "./hooks/useProgress.js";
import { useSync } from "./hooks/useSync.js";
import HomeScreen from "./components/HomeScreen.jsx";
import FieldPicker from "./components/FieldPicker.jsx";
import ModePicker from "./components/ModePicker.jsx";
import FlashcardSession from "./components/FlashcardSession.jsx";
import QuizSession from "./components/QuizSession.jsx";
import RechnenSession from "./components/RechnenSession.jsx";
import CardEditor from "./components/CardEditor.jsx";
import ExamSession from "./components/ExamSession.jsx";
import ExamResult from "./components/ExamResult.jsx";
import ResultScreen from "./components/ResultScreen.jsx";
import ReferenceScreen from "./components/ReferenceScreen.jsx";
import ProgressScreen from "./components/ProgressScreen.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";
import KeyHelp from "./components/KeyHelp.jsx";
import { useHotkeys } from "./hooks/useHotkeys.js";
import { PRUEF_ANZAHL, PRUEF_RECHNEN } from "./lib/exam.js";
import Icon from "./components/Icon.jsx";
import ErrorNotebook from "./components/ErrorNotebook.jsx";
import InteractiveSession from "./components/InteractiveSession.jsx";

export default function App() {
  const progress = useProgress();
  // Optionaler Geräte-Sync (Supabase). Hängt sich außen an useProgress an und
  // ist ohne konfigurierte Keys still inaktiv.
  const sync = useSync(progress.state, progress.importState);

  const [screen, setScreen] = useState("home");
  const [gewaehltesLJ, setGewaehltesLJ] = useState(0);
  const [gewaehltesLF, setGewaehltesLF] = useState(null);
  const [erzwingeUeben, setErzwingeUeben] = useState(false);
  const [kartenOverride, setKartenOverride] = useState(null);
  const [ergebnis, setErgebnis] = useState(null);
  const [pruefErgebnis, setPruefErgebnis] = useState(null);
  const [rechenQuelle, setRechenQuelle] = useState("karten");
  const [sessionKey, setSessionKey] = useState(0);
  // In-App-Dialog statt nativem alert()/confirm(). null = kein Dialog offen.
  const [dialog, setDialog] = useState(null);
  const [hilfeOffen, setHilfeOffen] = useState(false);

  function gehHeim() {
    setScreen("home");
  }

  /** Esc: kontextabhängig zurück / abbrechen (spiegelt die Abbrechen-Knöpfe). */
  function aufEsc() {
    switch (screen) {
      case "lf":
        return setScreen("home");
      case "modus":
        return setScreen(gewaehltesLJ === 0 ? "home" : "lf");
      case "flash":
        return setScreen(kartenOverride ? "home" : "modus");
      case "quiz":
        return setScreen("modus");
      case "rechnen":
        return setScreen(rechenQuelle === "generator" ? "home" : "modus");
      case "pruefung":
        return gehHeim();
      case "interaktiv":
        return gehHeim();
      case "editor":
        return setScreen("stats");
      case "fehlerheft":
        return setScreen("stats");
      case "ref":
      case "stats":
        return setScreen("home");
      default:
        return;
    }
  }

  function onTabWechsel(tab) {
    if (tab === "lernen") setScreen("home");
    else if (tab === "ref") setScreen("ref");
    else setScreen("stats");
  }

  function onWaehleLJ(lj) {
    setGewaehltesLJ(lj);
    setGewaehltesLF(null);
    setScreen(lj === 0 ? "modus" : "lf");
  }

  function onWaehleLF(lf) {
    setGewaehltesLF(lf);
    setScreen("modus");
  }

  function onSchnellstart() {
    setGewaehltesLJ(0);
    setGewaehltesLF(null);
    const paketGroesse = Math.min(progress.state.tagesziel, 15);
    setKartenOverride(progress.tagespaketVon(0, null, paketGroesse));
    setErzwingeUeben(false);
    setSessionKey((k) => k + 1);
    setScreen("flash");
  }

  function onProblemkarten() {
    uebeKarten(progress.problemkartenListe);
  }

  /** Startet eine Karteikarten-Session mit genau dieser Kartenliste. */
  function uebeKarten(liste) {
    if (!liste || !liste.length) return;
    setKartenOverride(liste);
    setErzwingeUeben(true);
    setSessionKey((k) => k + 1);
    setScreen("flash");
  }

  /** „Hier üben" aus der Schwächen-Analyse: gezielt ein Lernfeld, alle Lehrjahre. */
  function onLernfeldUeben(lf) {
    setGewaehltesLJ(0);
    setGewaehltesLF(lf);
    setKartenOverride(null);
    setErzwingeUeben(true);
    setSessionKey((k) => k + 1);
    setScreen("flash");
  }

  function onPruefung() {
    const alle = progress.kartenVon(0);
    const mcPool = alle.filter((k) => k.m);
    const rechenPool = alle.filter((k) => k.r);
    if (mcPool.length + rechenPool.length < 5) {
      setDialog({
        titel: "Noch keine Prüfung möglich",
        text: "Zu wenige Prüfungsfragen vorhanden.",
        nurInfo: true,
        onBestaetigen: () => setDialog(null),
      });
      return;
    }
    const gesamt = Math.min(PRUEF_ANZAHL, mcPool.length + rechenPool.length);
    const rechen = Math.min(PRUEF_RECHNEN, rechenPool.length, gesamt);
    setDialog({
      titel: "Prüfungssimulation starten?",
      text:
        gesamt +
        " Fragen quer durch alle Lernfelder" +
        (rechen > 0 ? ", davon " + rechen + " Rechenaufgaben zum Eintippen" : "") +
        " · 20 Minuten · Lösungen erst am Ende. Bestanden ab 50 %.",
      bestaetigenText: "Los geht's",
      onBestaetigen: () => {
        setDialog(null);
        setSessionKey((k) => k + 1);
        setScreen("pruefung");
      },
      onAbbrechen: () => setDialog(null),
    });
  }

  function onReset() {
    setDialog({
      titel: "Fortschritt zurücksetzen?",
      text: "Wirklich den kompletten Lernfortschritt löschen? Das lässt sich nicht rückgängig machen.",
      bestaetigenText: "Löschen",
      gefahr: true,
      onBestaetigen: () => {
        progress.resetAll();
        setDialog(null);
      },
      onAbbrechen: () => setDialog(null),
    });
  }

  function starteFlash(force) {
    setKartenOverride(null);
    setErzwingeUeben(!!force);
    setSessionKey((k) => k + 1);
    setScreen("flash");
  }

  function starteQuiz() {
    setSessionKey((k) => k + 1);
    setScreen("quiz");
  }

  /** Rechen-Modus mit den festen Rechenkarten der aktuellen Auswahl. */
  function starteRechnen() {
    setRechenQuelle("karten");
    setSessionKey((k) => k + 1);
    setScreen("rechnen");
  }

  /** Rechentrainer vom Dashboard: frisch gewürfelte Aufgaben, unbegrenzt. */
  function onRechentrainer() {
    setRechenQuelle("generator");
    setSessionKey((k) => k + 1);
    setScreen("rechnen");
  }

  function onInteraktiv() {
    setSessionKey((k) => k + 1);
    setScreen("interaktiv");
  }

  // Globale Tastenkürzel. Buchstaben (nicht Ziffern), damit im Quiz die 1–4
  // frei bleiben. Während Session nur „?" + Esc, sonst auch die Navigation.
  const istSession = ["flash", "quiz", "rechnen", "pruefung", "interaktiv"].includes(screen);
  const hotkeys = {
    "?": () => setHilfeOffen((v) => !v),
    Escape: aufEsc,
  };
  if (!istSession) {
    hotkeys.l = () => setScreen("home");
    hotkeys.n = () => setScreen("ref");
    hotkeys.f = () => setScreen("stats");
  }
  if (screen === "home") {
    hotkeys.s = onSchnellstart;
    hotkeys.p = onPruefung;
    hotkeys.r = onRechentrainer;
  }
  // Bei offenem Dialog/Hilfe übernehmen diese ihre eigene Tastatur (Esc etc.).
  useHotkeys(hotkeys, !dialog && !hilfeOffen);

  const screenTitel = {
    home: "Start",
    lf: "Lernfeld wählen",
    modus: "Modus wählen",
    flash: "Karteikarten",
    quiz: "Quiz",
    rechnen: "Rechnen",
    interaktiv: "Interaktiv üben",
    fehlerheft: "Fehlerheft",
    editor: "Karten bearbeiten",
    pruefung: "Prüfungssimulation",
    pruefungErgebnis: "Prüfungsergebnis",
    ergebnis: "Ergebnis",
    ref: "Nachschlagen",
    stats: "Fortschritt",
  }[screen];

  return (
    <div id="app" role="main">
      <div aria-live="polite" className="sr-only">
        {screenTitel}
      </div>
      {screen === "home" && (
        <HomeScreen
          progress={progress}
          onWaehleLJ={onWaehleLJ}
          onSchnellstart={onSchnellstart}
          onPruefung={onPruefung}
          onProblemkarten={onProblemkarten}
          onRechentrainer={onRechentrainer}
          onInteraktiv={onInteraktiv}
          onFehlerheft={() => setScreen("fehlerheft")}
          onReset={onReset}
          onTabWechsel={onTabWechsel}
        />
      )}

      {screen === "lf" && (
        <FieldPicker
          progress={progress}
          gewaehltesLJ={gewaehltesLJ}
          onZurueck={gehHeim}
          onWaehleLF={onWaehleLF}
          onTabWechsel={onTabWechsel}
        />
      )}

      {screen === "modus" && (
        <ModePicker
          progress={progress}
          gewaehltesLJ={gewaehltesLJ}
          gewaehltesLF={gewaehltesLF}
          onZurueck={() => setScreen(gewaehltesLJ === 0 ? "home" : "lf")}
          onFlash={() => starteFlash(false)}
          onQuiz={starteQuiz}
          onRechnen={starteRechnen}
          onTabWechsel={onTabWechsel}
        />
      )}

      {screen === "flash" && (
        <FlashcardSession
          key={"flash-" + sessionKey}
          progress={progress}
          gewaehltesLJ={gewaehltesLJ}
          gewaehltesLF={gewaehltesLF}
          erzwingeUeben={erzwingeUeben}
          kartenOverride={kartenOverride}
          onAbbrechen={() => setScreen(kartenOverride ? "home" : "modus")}
          onErgebnis={(erg) => {
            setErgebnis(erg);
            setScreen("ergebnis");
          }}
        />
      )}

      {screen === "quiz" && (
        <QuizSession
          key={"quiz-" + sessionKey}
          progress={progress}
          gewaehltesLJ={gewaehltesLJ}
          gewaehltesLF={gewaehltesLF}
          onAbbrechen={() => setScreen("modus")}
          onErgebnis={(erg) => {
            setErgebnis(erg);
            setScreen("ergebnis");
          }}
        />
      )}

      {screen === "rechnen" && (
        <RechnenSession
          key={"rechnen-" + sessionKey}
          progress={progress}
          gewaehltesLJ={gewaehltesLJ}
          gewaehltesLF={gewaehltesLF}
          quelle={rechenQuelle}
          onAbbrechen={() => setScreen(rechenQuelle === "generator" ? "home" : "modus")}
          onErgebnis={(erg) => {
            setErgebnis(erg);
            setScreen("ergebnis");
          }}
        />
      )}

      {screen === "interaktiv" && (
        <InteractiveSession
          key={"interaktiv-" + sessionKey}
          progress={progress}
          onAbbrechen={gehHeim}
          onErgebnis={(erg) => {
            setErgebnis(erg);
            setScreen("ergebnis");
          }}
        />
      )}

      {screen === "fehlerheft" && (
        <ErrorNotebook progress={progress} onUeben={uebeKarten} onTabWechsel={onTabWechsel} />
      )}

      {screen === "editor" && <CardEditor onZurueck={() => setScreen("stats")} onTabWechsel={onTabWechsel} />}

      {screen === "pruefung" && (
        <ExamSession
          key={"pruefung-" + sessionKey}
          progress={progress}
          onAbbrechen={gehHeim}
          onTabWechsel={onTabWechsel}
          onErgebnis={(erg) => {
            progress.pruefungAbschliessen(erg.punkte, erg.antworten.length);
            setPruefErgebnis(erg);
            setScreen("pruefungErgebnis");
          }}
        />
      )}

      {screen === "pruefungErgebnis" && pruefErgebnis && (
        <ExamResult ergebnis={pruefErgebnis} onNeuePruefung={onPruefung} onHeim={gehHeim} />
      )}

      {screen === "ergebnis" && ergebnis && (
        <ResultScreen
          ergebnis={ergebnis}
          streakCount={progress.state.streak.count}
          onNochmal={() => {
            if (ergebnis.typ === "flash") starteFlash(true);
            else if (ergebnis.typ === "interaktiv") onInteraktiv();
            else if (ergebnis.typ !== "rechnen") starteQuiz();
            else if (ergebnis.quelle === "generator") onRechentrainer();
            else starteRechnen();
          }}
          onFalscheWiederholen={uebeKarten}
          onHeim={gehHeim}
        />
      )}

      {screen === "ref" && <ReferenceScreen progress={progress} onTabWechsel={onTabWechsel} />}

      {screen === "stats" && (
        <ProgressScreen
          progress={progress}
          sync={sync}
          onProblemkarten={onProblemkarten}
          onFehlerheft={() => setScreen("fehlerheft")}
          onLernfeldUeben={onLernfeldUeben}
          onEditor={() => setScreen("editor")}
          onTabWechsel={onTabWechsel}
        />
      )}

      {dialog && (
        <ConfirmDialog
          titel={dialog.titel}
          text={dialog.text}
          bestaetigenText={dialog.bestaetigenText}
          gefahr={dialog.gefahr}
          nurInfo={dialog.nurInfo}
          onBestaetigen={dialog.onBestaetigen}
          onAbbrechen={dialog.onAbbrechen}
        />
      )}

      <button
        className="keyhelp-hint"
        onClick={() => setHilfeOffen(true)}
        aria-label="Tastenkürzel anzeigen"
        title="Tastenkürzel (?)"
      >
        <Icon name="keyboard" size={18} />
      </button>

      {hilfeOffen && <KeyHelp onSchliessen={() => setHilfeOffen(false)} />}
    </div>
  );
}
