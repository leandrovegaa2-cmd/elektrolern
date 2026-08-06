import { describe, it, expect } from 'vitest';
import { tageBis, pruefDatumGueltig, lernplan, empfohlenesTagesziel, planText } from '../lernplan.js';
import { MAX_TAGESZIEL, MIN_TAGESZIEL } from '../tagesziel.js';

const HEUTE = new Date('2026-07-24T10:00:00');

/** Baut n Karten, davon `sicher` viele in Box 5. */
function baueKarten(n, sicher = 0) {
  const karten = [];
  const prog = {};
  for (let i = 1; i <= n; i++) {
    karten.push({ i, j: 1, lf: 'LF1', f: 'F' + i, a: 'A' + i });
    if (i <= sicher) prog[i] = { box: 5, due: '2026-08-01' };
  }
  return { karten, prog };
}

describe('pruefDatumGueltig', () => {
  it('akzeptiert nur YYYY-MM-DD', () => {
    expect(pruefDatumGueltig('2026-09-14')).toBe(true);
    expect(pruefDatumGueltig('14.09.2026')).toBe(false);
    expect(pruefDatumGueltig('')).toBe(false);
    expect(pruefDatumGueltig(null)).toBe(false);
  });
});

describe('tageBis', () => {
  it('zaehlt heute als 0 und morgen als 1', () => {
    expect(tageBis('2026-07-24', HEUTE)).toBe(0);
    expect(tageBis('2026-07-25', HEUTE)).toBe(1);
  });

  it('liefert negative Werte fuer vergangene Termine', () => {
    expect(tageBis('2026-07-20', HEUTE)).toBe(-4);
  });

  it('rechnet ueber Monatsgrenzen', () => {
    expect(tageBis('2026-08-24', HEUTE)).toBe(31);
  });

  it('gibt null bei ungueltigem Datum', () => {
    expect(tageBis('kaputt', HEUTE)).toBe(null);
  });
});

describe('lernplan', () => {
  it('ist inaktiv ohne Pruefungstermin, zaehlt aber trotzdem die Karten', () => {
    const { karten, prog } = baueKarten(100, 30);
    const plan = lernplan(karten, prog, null, HEUTE);
    expect(plan.aktiv).toBe(false);
    expect(plan.gesamt).toBe(100);
    expect(plan.sicher).toBe(30);
    expect(plan.offen).toBe(70);
    expect(plan.proTag).toBe(0);
  });

  it('verteilt die offenen Karten auf die verbleibenden Tage', () => {
    const { karten, prog } = baueKarten(100, 30);
    // 70 offen auf 10 Tage = 7 pro Tag
    const plan = lernplan(karten, prog, '2026-08-03', HEUTE);
    expect(plan.aktiv).toBe(true);
    expect(plan.tage).toBe(10);
    expect(plan.offen).toBe(70);
    expect(plan.proTag).toBe(7);
    expect(plan.machbar).toBe(true);
  });

  it('rundet das Tagespensum auf', () => {
    const { karten, prog } = baueKarten(10, 0);
    const plan = lernplan(karten, prog, '2026-07-27', HEUTE); // 3 Tage
    expect(plan.proTag).toBe(4);
  });

  it('markiert ein unrealistisches Pensum als nicht machbar', () => {
    const { karten, prog } = baueKarten(300, 0);
    const plan = lernplan(karten, prog, '2026-07-26', HEUTE); // 2 Tage, 150/Tag
    expect(plan.proTag).toBe(150);
    expect(plan.machbar).toBe(false);
  });

  it('erkennt einen vergangenen Termin', () => {
    const { karten, prog } = baueKarten(10, 0);
    const plan = lernplan(karten, prog, '2026-07-20', HEUTE);
    expect(plan.vorbei).toBe(true);
    expect(plan.tage).toBe(-4);
  });

  it('meldet Pensum 0, wenn alles sicher sitzt', () => {
    const { karten, prog } = baueKarten(20, 20);
    const plan = lernplan(karten, prog, '2026-08-01', HEUTE);
    expect(plan.offen).toBe(0);
    expect(plan.proTag).toBe(0);
    expect(planText(plan)).toMatch(/sicher/i);
  });

  it('packt am Pruefungstag selbst alles Offene auf heute', () => {
    const { karten, prog } = baueKarten(10, 6);
    const plan = lernplan(karten, prog, '2026-07-24', HEUTE);
    expect(plan.tage).toBe(0);
    expect(plan.proTag).toBe(4);
  });
});

describe('empfohlenesTagesziel', () => {
  it('gibt null ohne aktiven Plan', () => {
    const { karten, prog } = baueKarten(10, 0);
    expect(empfohlenesTagesziel(lernplan(karten, prog, null, HEUTE))).toBe(null);
  });

  it('begrenzt den Vorschlag auf den erlaubten Tagesziel-Bereich', () => {
    const viel = baueKarten(1000, 0);
    const planViel = lernplan(viel.karten, viel.prog, '2026-07-25', HEUTE);
    expect(empfohlenesTagesziel(planViel)).toBe(MAX_TAGESZIEL);

    const wenig = baueKarten(2, 0);
    const planWenig = lernplan(wenig.karten, wenig.prog, '2026-12-24', HEUTE);
    expect(empfohlenesTagesziel(planWenig)).toBe(MIN_TAGESZIEL);
  });
});
