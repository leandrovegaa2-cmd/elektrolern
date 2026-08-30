import { describe, it, expect } from 'vitest';
import { parseZahl, istRichtig, abweichungProzent, formatZahl, runde } from '../rechnen.js';

describe('parseZahl', () => {
  it('liest einfache Zahlen', () => {
    expect(parseZahl('5')).toBe(5);
    expect(parseZahl('0')).toBe(0);
    expect(parseZahl('-3')).toBe(-3);
  });

  it('akzeptiert Komma und Punkt als Dezimaltrenner', () => {
    expect(parseZahl('6,86')).toBeCloseTo(6.86, 5);
    expect(parseZahl('6.86')).toBeCloseTo(6.86, 5);
  });

  it('versteht Tausenderpunkte', () => {
    expect(parseZahl('2.300')).toBe(2300);
    expect(parseZahl('1.234,5')).toBeCloseTo(1234.5, 5);
  });

  it('ignoriert eine angehaengte Einheit', () => {
    expect(parseZahl('0,75 A')).toBeCloseTo(0.75, 5);
    expect(parseZahl('9422 W')).toBe(9422);
    expect(parseZahl('26,45Ohm')).toBeCloseTo(26.45, 5);
  });

  it('gibt null zurueck, wenn keine Zahl drinsteht', () => {
    expect(parseZahl('')).toBe(null);
    expect(parseZahl('   ')).toBe(null);
    expect(parseZahl('keine Ahnung')).toBe(null);
    expect(parseZahl(null)).toBe(null);
    expect(parseZahl(undefined)).toBe(null);
  });
});

describe('istRichtig', () => {
  it('akzeptiert die exakte Loesung', () => {
    expect(istRichtig('16', 16)).toBe(true);
  });

  it('akzeptiert Rundung innerhalb der Standard-Toleranz (1 %)', () => {
    expect(istRichtig('6,86', 6.857142)).toBe(true);
    expect(istRichtig('6,9', 6.857142)).toBe(true);
  });

  it('lehnt Werte ausserhalb der Toleranz ab', () => {
    expect(istRichtig('7,5', 6.857142)).toBe(false);
    expect(istRichtig('68,6', 6.857142)).toBe(false);
  });

  it('respektiert eine groessere Einzeltoleranz', () => {
    expect(istRichtig('10,2', 10.49, 0.03)).toBe(true);
    expect(istRichtig('10,2', 10.49, 0.01)).toBe(false);
  });

  it('behandelt die Loesung 0 korrekt', () => {
    expect(istRichtig('0', 0)).toBe(true);
    expect(istRichtig('1', 0)).toBe(false);
  });

  it('wertet leere oder unlesbare Eingaben als falsch', () => {
    expect(istRichtig('', 5)).toBe(false);
    expect(istRichtig('bla', 5)).toBe(false);
  });
});

describe('abweichungProzent', () => {
  it('rechnet die relative Abweichung aus', () => {
    expect(abweichungProzent('11', 10)).toBeCloseTo(10, 5);
    expect(abweichungProzent('9', 10)).toBeCloseTo(10, 5);
  });

  it('gibt null bei unlesbarer Eingabe zurueck', () => {
    expect(abweichungProzent('nix', 10)).toBe(null);
  });
});

describe('formatZahl / runde', () => {
  it('formatiert deutsch mit Komma und ohne Nullen am Ende', () => {
    expect(formatZahl(6.857142)).toBe('6,86');
    expect(formatZahl(16)).toBe('16');
    expect(formatZahl(0.356, 3)).toBe('0,356');
  });

  it('rundet auf die gewuenschte Stellenzahl', () => {
    expect(runde(6.857142, 2)).toBe(6.86);
    expect(runde(1234.5678, 0)).toBe(1235);
  });
});
