import { describe, expect, it } from "vitest";
import { FACHGESPRAECH_SZENARIEN } from "../../data/fachgespraech.js";
import { adaptiveFolgefrage, bewerteFachantwort, erstelleFachgespraech, fachgespraechProtokoll, ihkNote } from "../fachgespraech.js";

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
});
