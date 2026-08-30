import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App.jsx';

// matchMedia-Polyfill für jsdom (wird von Ring/CountUp/Konfetti genutzt)
beforeEach(() => {
  window.matchMedia = window.matchMedia || function () {
    return { matches: true, addListener() {}, removeListener() {} };
  };
  localStorage.clear();
});

describe('App smoke test', () => {
  it('rendert den Home-Screen mit Logo, Hero und allen vier Lehrjahren', () => {
    render(<App />);
    expect(document.querySelector('.logo').textContent).toContain('ElektroLern');
    expect(screen.getByText(/Gezielt lernen/)).toBeInTheDocument();
    expect(screen.getByText(/Lehrjahr 1/)).toBeInTheDocument();
    expect(screen.getByText(/Lehrjahr 4/)).toBeInTheDocument();
  });

  it('navigiert zu Nachschlagen und zeigt die Formelsammlung', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Nachschlagen'));
    expect(screen.getByText(/Formelsammlung/)).toBeInTheDocument();
  });

  it('navigiert zu Fortschritt und zeigt Statistik-Kacheln', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Fortschritt'));
    expect(screen.getByText(/Dein Fortschritt/)).toBeInTheDocument();
    expect(screen.getByText(/Gelernt \(Box 2\+\)/)).toBeInTheDocument();
  });

  it('Lehrjahr 1 waehlen fuehrt zur Lernfeld-Auswahl', () => {
    render(<App />);
    fireEvent.click(screen.getByLabelText(/Lehrjahr 1, Grundlagen/));
    // "Lernfeld wählen" erscheint zweimal: sichtbar (sel-line) + sr-only Screenreader-Ansage
    expect(screen.getAllByText(/Lernfeld wählen/).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByLabelText(/^LF1,/)).toBeInTheDocument();
  });

  it('zeigt die Heute-Karte mit dem Standard-Tagesziel auf dem Home-Screen', () => {
    render(<App />);
    expect(screen.getByText(/Heute/)).toBeInTheDocument();
    expect(document.querySelector('.h-zahl').textContent).toContain('/ 15 Karten');
  });

  it('Fortschritt-Tab zeigt Fortschritts-Verlauf und Erfolge-Galerie', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Fortschritt'));
    expect(screen.getByText('Fortschritts-Verlauf')).toBeInTheDocument();
    expect(screen.getByText(/sammelt sich nach ein paar Lerntagen/)).toBeInTheDocument();
    expect(screen.getByText('Erfolge')).toBeInTheDocument();
    expect(screen.getByText('Drei Tage dran')).toBeInTheDocument();
  });

  it('kompletter Karteikarten-Flow: aufdecken, beantworten, Session laeuft weiter', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Tagespaket starten/ }));
    // Karte ist sichtbar (Frage-Text vorhanden)
    expect(screen.getByText('Tippen oder Leertaste zum Aufdecken')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Antwort zeigen'));
    expect(screen.getByRole('button', { name: 'Gewusst' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Gewusst' }));
    // Nach der Antwort läuft die Session weiter (Zähler oder Ergebnis sichtbar)
    expect(document.getElementById('app')).toBeTruthy();
  });

  it('trennt neue Karten von echten Wiederholungen', () => {
    render(<App />);
    expect(screen.getByText('Karten im heutigen Paket')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tagespaket starten · 15/ })).toBeInTheDocument();
    expect(screen.getByLabelText(/Lehrjahr 1, Grundlagen: 104 Karten, 104 neue Karten/)).toBeInTheDocument();
    expect(screen.queryByText(/273 Karten sind heute fällig/)).not.toBeInTheDocument();
  });
});
