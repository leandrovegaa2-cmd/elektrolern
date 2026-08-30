import { describe, it, expect } from 'vitest';
import { mergeState, mergeProg, mergeStreak, mergeVerlauf, mergeErfolge, mergeFehlerheft } from '../sync.js';
import { STANDARD_TAGESZIEL } from '../tagesziel.js';

describe('mergeProg', () => {
  it('nimmt Karten, die nur ein Gerät kennt, unverändert mit', () => {
    const r = mergeProg({ i1: { box: 3, due: '2026-08-01', fehler: 0 } }, {});
    expect(r.i1.box).toBe(3);
  });

  it('behält bei Box-Konflikt immer die höhere Box (Fortschritt geht nie verloren)', () => {
    const a = { i1: { box: 5, due: '2026-08-10', fehler: 1 } };
    const b = { i1: { box: 2, due: '2026-08-02', fehler: 3 } };
    const r = mergeProg(a, b);
    expect(r.i1.box).toBe(5);
    expect(r.i1.due).toBe('2026-08-10'); // due vom höheren Stand
    expect(r.i1.fehler).toBe(3); // Fehlerzähler = Maximum
  });

  it('nimmt bei gleicher Box das spätere Fälligkeitsdatum', () => {
    const r = mergeProg(
      { i1: { box: 3, due: '2026-08-01', fehler: 0 } },
      { i1: { box: 3, due: '2026-08-09', fehler: 0 } }
    );
    expect(r.i1.due).toBe('2026-08-09');
  });
});

describe('mergeStreak', () => {
  it('nimmt den höheren Zähler und das spätere last-Datum', () => {
    const r = mergeStreak({ count: 4, last: '2026-08-01' }, { count: 7, last: '2026-08-04' });
    expect(r.count).toBe(7);
    expect(r.last).toBe('2026-08-04');
  });
});

describe('mergeVerlauf', () => {
  it('führt einen Punkt pro Tag zusammen und nimmt je Tag das Maximum', () => {
    const a = [{ datum: '2026-08-01', prozent: 20, xp: 100 }];
    const b = [
      { datum: '2026-08-01', prozent: 25, xp: 90 },
      { datum: '2026-08-02', prozent: 30, xp: 150 },
    ];
    const r = mergeVerlauf(a, b);
    expect(r).toHaveLength(2);
    expect(r[0]).toEqual({ datum: '2026-08-01', prozent: 25, xp: 100 });
    expect(r[1].datum).toBe('2026-08-02');
  });
});

describe('mergeErfolge', () => {
  it('vereinigt Abzeichen und behält das frühere Freischalt-Datum', () => {
    const r = mergeErfolge({ streak7: '2026-08-05' }, { streak7: '2026-08-01', level5: '2026-08-03' });
    expect(r.streak7).toBe('2026-08-01');
    expect(r.level5).toBe('2026-08-03');
  });
});

describe('mergeFehlerheft', () => {
  it('behaelt die hoechste Fehlerzahl und nimmt Notiz/Status vom neueren Stand', () => {
    const lokal = { k1: { anzahl: 3, notiz: 'lokal', geklaert: false, zuletzt: '2026-08-20' } };
    const remote = { k1: { anzahl: 2, notiz: 'remote', geklaert: true, zuletzt: '2026-08-21' } };
    expect(mergeFehlerheft(lokal, remote, true).k1).toMatchObject({
      anzahl: 3,
      notiz: 'remote',
      geklaert: true,
      zuletzt: '2026-08-21',
    });
  });
});

describe('mergeState', () => {
  it('leer ↔ voll: liefert den vollen Stand zurück', () => {
    const voll = {
      prog: { i1: { box: 4, due: '2026-08-10', fehler: 0 } },
      streak: { count: 5, last: '2026-08-05' },
      xp: 300,
      tagesziel: 15,
      heute: { datum: '2026-08-05', anzahl: 8 },
      verlauf: [{ datum: '2026-08-05', prozent: 40, xp: 300 }],
      erfolge: { streak5: '2026-08-05' },
      pruefDatum: '2027-01-01',
    };
    const r = mergeState(undefined, voll, true);
    expect(r.prog.i1.box).toBe(4);
    expect(r.xp).toBe(300);
    expect(r.streak.count).toBe(5);
  });

  it('xp nimmt das Maximum beider Geräte', () => {
    const r = mergeState({ xp: 500 }, { xp: 200 });
    expect(r.xp).toBe(500);
  });

  it('last-writer-wins für Tagesziel: remoteNeuer=true nimmt das entfernte Ziel', () => {
    const r = mergeState({ tagesziel: 10 }, { tagesziel: 25 }, true);
    expect(r.tagesziel).toBe(25);
  });

  it('last-writer-wins für Tagesziel: remoteNeuer=false behält das lokale Ziel', () => {
    const r = mergeState({ tagesziel: 10 }, { tagesziel: 25 }, false);
    expect(r.tagesziel).toBe(10);
  });

  it('fällt bei komplett leeren Ständen auf sinnvolle Defaults zurück', () => {
    const r = mergeState({}, {});
    expect(r.tagesziel).toBe(STANDARD_TAGESZIEL);
    expect(r.pruefDatum).toBeNull();
    expect(r.prog).toEqual({});
  });
});
