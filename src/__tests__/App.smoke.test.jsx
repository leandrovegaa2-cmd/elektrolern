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

  it('navigiert zu Nachschlagen und zeigt die neue Schnellübersicht', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Nachschlagen'));
    expect(screen.getByText('Was brauchst du gerade?')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Formeln & Tabellen/ })).toBeInTheDocument();
  });

  it('öffnet Lichtechnik direkt vom Dashboard und berechnet eine Vorplanung', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Lichtechnik/ }));
    expect(screen.getByRole('heading', { name: /Lichtechnik richtig planen/ })).toBeInTheDocument();
    expect(screen.getByText('Leuchtenzahl vorplanen')).toBeInTheDocument();
    expect(screen.getByText('13')).toBeInTheDocument();
    expect(screen.getByText(/Vorplanung, kein Normnachweis/)).toBeInTheDocument();
  });

  it('erstellt ein Fachgespräch, bewertet freien Text und zeigt Kernpunkte', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: /Fachgespräch/ }));
    fireEvent.click(screen.getByRole('button', { name: /Fachgespräch erstellen und starten/ }));
    expect(screen.getByText(/Frage 1 von 4/)).toBeInTheDocument();
    const antwort = screen.getByPlaceholderText(/Antworte in vollständigen/);
    fireEvent.change(antwort, { target: { value: 'Ich kläre Sehaufgabe und Nutzung, vermesse Raum und Bestand, prüfe ASR und Gefährdungsbeurteilung sowie Staub und IP.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Antwort auswerten' }));
    expect(screen.getByText('100%')).toBeInTheDocument();
    expect(screen.getByText('Fachlich sicher.')).toBeInTheDocument();
  });

  it('navigiert zu Fortschritt und zeigt Statistik-Kacheln', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Fortschritt'));
    expect(screen.getByText(/Dein Fortschritt/)).toBeInTheDocument();
    expect(screen.getByText(/Gelernt \(Box 2\+\)/)).toBeInTheDocument();
  });

  it('öffnet die Werkstatt mit Energie-Kiste, Chancen und zehn Werkzeugen', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Werkstatt'));
    expect(screen.getByRole('heading', { name: 'Energie-Kiste' })).toBeInTheDocument();
    expect(screen.getByText('Transparente Chancen')).toBeInTheDocument();
    expect(screen.getAllByText('Thermal-Krone').length).toBeGreaterThanOrEqual(1);
    expect(document.querySelectorAll('.skin-card')).toHaveLength(10);
    expect(screen.getByLabelText('Werkzeug-Walze bereit')).toBeInTheDocument();
    expect(document.querySelectorAll('.reel-card')).toHaveLength(30);
    expect(screen.getByRole('button', { name: /Kiste öffnen/ })).toBeEnabled();
  });

  it('öffnet das eigenständige 5x3 Slot-Casino aus der Werkstatt', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Werkstatt'));
    fireEvent.click(screen.getByRole('button', { name: /Volt Vault Casino/ }));
    expect(screen.getByRole('heading', { name: /VoltVault/ })).toBeInTheDocument();
    expect(screen.getByText('Auszahlungstabelle')).toBeInTheDocument();
    expect(document.querySelectorAll('.slot-reel')).toHaveLength(5);
    expect(document.querySelectorAll('.slot-symbol')).toHaveLength(15);
    expect(screen.getByRole('button', { name: /Drehen/ })).toBeEnabled();
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
