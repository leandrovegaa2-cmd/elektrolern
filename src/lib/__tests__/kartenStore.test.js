import { describe, it, expect, beforeEach } from 'vitest';
import {
  mergeKarten,
  karteFehler,
  istEigeneId,
  naechsteEigeneId,
  leererKartenStore,
  BASIS_KARTEN,
  getKarten,
  getKartenStore,
  karteSpeichern,
  karteLoeschen,
  istKorrigiert,
  kartenZuruecksetzen,
  kartenExport,
  kartenImport,
} from '../kartenStore.js';

const ORIGINAL = [
  { i: 1, j: 1, lf: 'LF1', f: 'Frage 1', a: 'Antwort 1', m: ['a', 'b'] },
  { i: 2, j: 1, lf: 'LF2', f: 'Frage 2', a: 'Antwort 2' },
];

describe('karteFehler', () => {
  it('akzeptiert eine vollstaendige Karte', () => {
    expect(karteFehler({ j: 1, lf: 'LF5', f: 'F', a: 'A' })).toEqual([]);
  });

  it('meldet fehlende Pflichtfelder', () => {
    const fehler = karteFehler({ j: 9, lf: 'X', f: '  ', a: '' });
    expect(fehler.length).toBe(4);
  });

  it('lehnt eine Quizfrage mit nur einer Option ab', () => {
    expect(karteFehler({ j: 1, lf: 'LF1', f: 'F', a: 'A', m: ['nur eine'] }).length).toBe(1);
  });

  it('lehnt eine Rechenkarte ohne Zahl ab', () => {
    expect(karteFehler({ j: 1, lf: 'LF1', f: 'F', a: 'A', r: { loesung: 'viel' } }).length).toBe(1);
  });
});

describe('istEigeneId / naechsteEigeneId', () => {
  it('erkennt eigene IDs', () => {
    expect(istEigeneId('e1')).toBe(true);
    expect(istEigeneId('e42')).toBe(true);
    expect(istEigeneId(12)).toBe(false);
    expect(istEigeneId('12')).toBe(false);
  });

  it('zaehlt die naechste freie eigene ID hoch', () => {
    expect(naechsteEigeneId(leererKartenStore())).toBe('e1');
    expect(naechsteEigeneId({ eigene: [{ i: 'e1' }, { i: 'e7' }], korrekturen: {} })).toBe('e8');
  });
});

describe('mergeKarten', () => {
  it('laesst die Originale ohne Store unveraendert', () => {
    expect(mergeKarten(ORIGINAL, leererKartenStore())).toEqual(ORIGINAL);
  });

  it('wendet eine Korrektur an und markiert die Karte', () => {
    const merged = mergeKarten(ORIGINAL, {
      eigene: [],
      korrekturen: { 1: { f: 'Korrigierte Frage', a: 'Neue Antwort' } },
    });
    expect(merged[0].f).toBe('Korrigierte Frage');
    expect(merged[0].a).toBe('Neue Antwort');
    expect(merged[0].korrigiert).toBe(true);
    expect(merged[1].f).toBe('Frage 2');
    // Das Original-Array bleibt unangetastet
    expect(ORIGINAL[0].f).toBe('Frage 1');
  });

  it('ignoriert kaputte Korrekturfelder', () => {
    const merged = mergeKarten(ORIGINAL, { eigene: [], korrekturen: { 1: { f: '   ', m: ['nur eins'] } } });
    expect(merged[0].f).toBe('Frage 1');
    expect(merged[0].m).toEqual(['a', 'b']);
  });

  it('haengt gueltige eigene Karten an und wirft ungueltige raus', () => {
    const merged = mergeKarten(ORIGINAL, {
      eigene: [
        { i: 'e1', j: 2, lf: 'LF8', f: 'Eigene', a: 'Text' },
        { i: 'e2', j: 2, lf: 'LF8', f: '', a: '' },
      ],
      korrekturen: {},
    });
    expect(merged.length).toBe(3);
    expect(merged[2].eigen).toBe(true);
    expect(merged[2].f).toBe('Eigene');
  });
});

describe('Karten-Store (localStorage)', () => {
  beforeEach(() => {
    kartenZuruecksetzen();
  });

  it('startet mit den mitgelieferten Karten', () => {
    expect(getKarten().length).toBe(BASIS_KARTEN.length);
  });

  it('legt eine eigene Karte an und macht sie sichtbar', () => {
    const id = karteSpeichern({ j: 3, lf: 'LF10', f: 'Meine Frage', a: 'Meine Antwort' });
    expect(id).toBe('e1');
    const karten = getKarten();
    expect(karten.length).toBe(BASIS_KARTEN.length + 1);
    expect(karten[karten.length - 1].f).toBe('Meine Frage');
  });

  it('lehnt eine unvollstaendige Karte ab', () => {
    expect(karteSpeichern({ j: 1, lf: 'LF1', f: '', a: '' })).toBe(null);
    expect(getKarten().length).toBe(BASIS_KARTEN.length);
  });

  it('bearbeitet eine eigene Karte, statt sie zu duplizieren', () => {
    const id = karteSpeichern({ j: 1, lf: 'LF1', f: 'Erst so', a: 'A' });
    karteSpeichern({ i: id, j: 1, lf: 'LF1', f: 'Dann so', a: 'A' });
    const eigene = getKarten().filter((k) => k.eigen);
    expect(eigene.length).toBe(1);
    expect(eigene[0].f).toBe('Dann so');
  });

  it('loescht eine eigene Karte', () => {
    const id = karteSpeichern({ j: 1, lf: 'LF1', f: 'Weg damit', a: 'A' });
    expect(karteLoeschen(id)).toBe(true);
    expect(getKarten().length).toBe(BASIS_KARTEN.length);
  });

  it('korrigiert eine Original-Karte und stellt sie wieder her', () => {
    const original = BASIS_KARTEN[0];
    karteSpeichern({ i: original.i, j: original.j, lf: original.lf, f: 'Korrigiert', a: original.a });
    expect(istKorrigiert(original.i)).toBe(true);
    expect(getKarten()[0].f).toBe('Korrigiert');
    expect(getKarten().length).toBe(BASIS_KARTEN.length);

    karteLoeschen(original.i);
    expect(istKorrigiert(original.i)).toBe(false);
    expect(getKarten()[0].f).toBe(original.f);
  });

  it('exportiert und importiert eigene Karten', () => {
    karteSpeichern({ j: 1, lf: 'LF1', f: 'Sicherung', a: 'A' });
    const sicherung = JSON.parse(JSON.stringify(kartenExport()));
    kartenZuruecksetzen();
    expect(getKarten().length).toBe(BASIS_KARTEN.length);

    expect(kartenImport(sicherung, 'ersetzen')).toBe(1);
    expect(getKarten().filter((k) => k.eigen)[0].f).toBe('Sicherung');
  });

  it('haengt beim Ergaenzen mit neuen IDs an, statt zu ueberschreiben', () => {
    karteSpeichern({ j: 1, lf: 'LF1', f: 'Vorhanden', a: 'A' });
    const fremd = { app: 'elektrolern-karten', v: 1, karten: { eigene: [{ i: 'e1', j: 1, lf: 'LF1', f: 'Von Klasse', a: 'A' }], korrekturen: {} } };
    expect(kartenImport(fremd, 'ergaenzen')).toBe(1);
    const eigene = getKarten().filter((k) => k.eigen);
    expect(eigene.length).toBe(2);
    expect(new Set(eigene.map((k) => k.i)).size).toBe(2);
  });

  it('lehnt Muell beim Import ab', () => {
    expect(kartenImport({ app: 'was anderes' })).toBe(null);
  });

  it('schreibt den Store nach localStorage', () => {
    karteSpeichern({ j: 1, lf: 'LF1', f: 'Persistiert', a: 'A' });
    expect(getKartenStore().eigene.length).toBe(1);
    expect(JSON.parse(localStorage.getItem('elektrolern_karten_v1')).eigene.length).toBe(1);
  });
});
