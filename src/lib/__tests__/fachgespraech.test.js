import { describe, expect, it } from "vitest";
import { FACHGESPRAECH_SZENARIEN } from "../../data/fachgespraech.js";
import { WEITERE_FACHGESPRAECH_SZENARIEN } from "../../data/fachgespraechErweitert.js";
import { adaptiveFolgefrage, bewerteFachantwort, erstelleEigenesSzenario, erstelleFachgespraech, fachgespraechProtokoll, ihkNote, zufaelligesSzenario } from "../fachgespraech.js";

describe("Fachgespräch", () => {
  it("bewertet fachliche Kernpunkte transparent statt per exaktem Satz", () => {
    const frage = FACHGESPRAECH_SZENARIEN[0].fragen[0];
    const erg = bewerteFachantwort("Ich kläre die Sehaufgabe, vermesse den Raum und prüfe ASR sowie Staub und IP.", frage.kernpunkte);
    expect(erg.prozent).toBe(100);
    expect(erg.treffer).toHaveLength(4);
  });

  it("erzeugt eine Sitzung mit allen vier Auftragsphasen", () => {
    const fragen = erstelleFachgespraech(FACHGESPRAECH_SZENARIEN[0], 5, "basis", () => 0.4);
    expect(fragen).toHaveLength(4);
    expect(new Set(fragen.map((frage) => frage.phase))).toEqual(new Set(["information", "planung", "durchfuehrung", "kontrolle"]));
  });

  it("füllt die lange Basis-Variante mit einer Vertiefungsfrage auf", () => {
    const fragen = erstelleFachgespraech(FACHGESPRAECH_SZENARIEN[2], 7, "basis", () => 0.4);
    expect(fragen).toHaveLength(6);
    expect(fragen.some((frage) => frage.niveau === "fortgeschritten")).toBe(true);
  });

  it("wählt eine Nachfrage passend zur Antwortqualität", () => {
    const frage = FACHGESPRAECH_SZENARIEN[0].fragen[0];
    expect(adaptiveFolgefrage(frage, { anteil: 0.2 }).id).toContain("schwach");
    expect(adaptiveFolgefrage(frage, { anteil: 1 }).id).toContain("stark");
  });

  it("berechnet den offiziellen IHK-Notenschlüssel als Trainingswert", () => {
    expect(ihkNote(92)).toEqual({ note: 1, text: "sehr gut" });
    expect(ihkNote(50)).toEqual({ note: 4, text: "ausreichend" });
    expect(ihkNote(29).note).toBe(6);
    const antworten = [
      { frage: { phase: "information" }, bewertung: { prozent: 100 } },
      { frage: { phase: "planung" }, bewertung: { prozent: 80 } },
      { frage: { phase: "durchfuehrung" }, bewertung: { prozent: 60 } },
      { frage: { phase: "kontrolle" }, bewertung: { prozent: 50 } },
    ];
    expect(fachgespraechProtokoll(antworten).punkte).toBe(69);
  });

  it("liefert neue Aufträge aus Installation, Steuerung und Energie", () => {
    expect(WEITERE_FACHGESPRAECH_SZENARIEN).toHaveLength(4);
    expect(new Set(WEITERE_FACHGESPRAECH_SZENARIEN.map((item) => item.kategorie))).toEqual(new Set(["installation", "steuerung", "energie"]));
    WEITERE_FACHGESPRAECH_SZENARIEN.forEach((szenario) => {
      expect(szenario.fragen).toHaveLength(6);
      expect(new Set(szenario.fragen.map((frage) => frage.phase))).toEqual(new Set(["information", "planung", "durchfuehrung", "kontrolle"]));
    });
  });

  it("teilt einen Zufallsauftrag nur aus dem gewählten Fachgebiet zu", () => {
    const auswahl = zufaelligesSzenario(WEITERE_FACHGESPRAECH_SZENARIEN, "steuerung", () => 0.99);
    expect(auswahl.kategorie).toBe("steuerung");
    expect(zufaelligesSzenario([], "alle")).toBeNull();
  });

  it("erstellt einen lokalen Fragenlauf für einen eigenen Auftrag", () => {
    const szenario = erstelleEigenesSzenario({
      titel: "Eigene Unterverteilung",
      auftrag: "Eine Unterverteilung soll erweitert und anschließend vollständig geprüft werden.",
      rahmen: "TN-S;Leitungsweg 25 m",
      schwerpunkt: "installation",
    });
    expect(szenario.eigenerAuftrag).toBe(true);
    expect(szenario.daten).toEqual(["TN-S", "Leitungsweg 25 m"]);
    expect(erstelleFachgespraech(szenario, 7, "fortgeschritten", () => 0.5)).toHaveLength(6);
    expect(adaptiveFolgefrage(szenario.fragen[0], { anteil: 1 })).not.toBeNull();
  });

  it("nennt starke Phasen und priorisiert wiederholt fehlende Lernpunkte", () => {
    const antworten = [
      { frage: { phase: "information" }, bewertung: { prozent: 100, fehlend: [] } },
      { frage: { phase: "planung" }, bewertung: { prozent: 40, fehlend: [{ titel: "Schutz", erklaerung: "Schutz begründen." }] } },
      { frage: { phase: "durchfuehrung" }, bewertung: { prozent: 50, fehlend: [{ titel: "Schutz", erklaerung: "Schutz begründen." }] } },
      { frage: { phase: "kontrolle" }, bewertung: { prozent: 80, fehlend: [{ titel: "Protokoll", erklaerung: "Werte dokumentieren." }] } },
    ];
    const protokoll = fachgespraechProtokoll(antworten);
    expect(protokoll.staerken.map((phase) => phase.id)).toEqual(["information", "kontrolle"]);
    expect(protokoll.lernfelder.map((phase) => phase.id)).toEqual(["planung", "durchfuehrung"]);
    expect(protokoll.lernempfehlungen[0]).toMatchObject({ titel: "Schutz", anzahl: 2 });
  });
});
