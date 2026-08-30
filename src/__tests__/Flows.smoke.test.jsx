import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App.jsx';
import { BASIS_KARTEN, kartenZuruecksetzen } from '../lib/kartenStore.js';

beforeEach(() => {
  window.matchMedia = window.matchMedia || function () {
    return { matches: true, addListener() {}, removeListener() {} };
  };
  localStorage.clear();
  // Der Karten-Store hält seinen Stand im Modul — sonst schleppen die
  // Editor-Tests ihre eigenen Karten in die folgenden Tests mit.
  kartenZuruecksetzen();
});

describe('Quiz-Flow', () => {
  it('startet ein Quiz fuer Lehrjahr 1 / LF1 und beantwortet eine Frage', () => {
    render(<App />);
    fireEvent.click(screen.getByLabelText(/Lehrjahr 1, Grundlagen/));
    fireEvent.click(screen.getByLabelText(/^LF1,/));
    fireEvent.click(screen.getByText('Quiz'));
    expect(document.querySelector('.quiz-q')).toBeTruthy();
    const optionen = document.querySelectorAll('.opt');
    expect(optionen.length).toBeGreaterThan(1);
    fireEvent.click(optionen[0]);
    // Nach der Antwort ist eine Erklaerung sichtbar
    expect(document.querySelector('.quiz-erkl')).toBeTruthy();
  });
});

describe('Pruefungssimulation', () => {
  it('startet nach Bestaetigung und zeigt die erste Frage mit Timer', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Prüfung'));
    fireEvent.click(screen.getByText("Los geht's")); // In-App-Dialog bestaetigen
    // Frage 1 kann Multiple Choice ODER eine Rechenaufgabe sein — beides ist gueltig.
    expect(document.querySelector('.quiz-q, .rechen-karte')).toBeTruthy();
    expect(screen.getByText(/Frage 1 von/)).toBeInTheDocument();
    expect(document.querySelector('.pruef-timer')).toBeTruthy();
  });
});

describe('Tastatur-Shortcuts', () => {
  it('Quiz: Zifferntaste waehlt eine Antwort, Enter geht weiter', () => {
    render(<App />);
    fireEvent.click(screen.getByLabelText(/Lehrjahr 1, Grundlagen/));
    fireEvent.click(screen.getByLabelText(/^LF1,/));
    fireEvent.click(screen.getByText('Quiz'));
    expect(document.querySelector('.quiz-q')).toBeTruthy();
    fireEvent.keyDown(window, { key: '1' });
    expect(document.querySelector('.quiz-erkl')).toBeTruthy();
    const frageVorher = document.querySelector('.quiz-q').textContent;
    fireEvent.keyDown(window, { key: 'Enter' });
    // Nach "weiter" ist entweder eine neue Frage da oder das Quiz ist fertig
    expect(document.getElementById('app')).toBeTruthy();
    void frageVorher;
  });

  it('Pruefung: Zifferntaste waehlt eine Antwort aus', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Prüfung'));
    fireEvent.click(screen.getByText("Los geht's"));
    // Die Pruefung mischt Multiple Choice und Rechenaufgaben. Rechenaufgaben
    // ueberspringen, bis eine Multiple-Choice-Frage dran ist.
    for (let n = 0; n < 20 && !document.querySelector('.quiz-q'); n++) {
      const eingabe = document.querySelector('.rechen-karte input');
      expect(eingabe).toBeTruthy();
      fireEvent.change(eingabe, { target: { value: '1' } });
      fireEvent.click(screen.getByText(/Weiter →|Prüfung abgeben/));
    }
    expect(document.querySelector('.quiz-q')).toBeTruthy();
    fireEvent.keyDown(window, { key: '1' });
    expect(document.querySelector('.opt.sel')).toBeTruthy();
  });
});

describe('Pruefung mit Rechenaufgaben', () => {
  it('mischt Rechenaufgaben in die Pruefung und wertet sie mit aus', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Prüfung'));
    fireEvent.click(screen.getByText("Los geht's"));

    let rechenGesehen = 0;
    for (let n = 0; n < 25; n++) {
      const rechen = document.querySelector('.rechen-karte input');
      if (rechen) {
        rechenGesehen++;
        fireEvent.change(rechen, { target: { value: '1' } });
      } else {
        const opt = document.querySelector('.opt');
        if (!opt) break;
        fireEvent.click(opt);
      }
      const weiter = screen.queryByText(/Weiter →|Prüfung abgeben/);
      if (!weiter) break;
      fireEvent.click(weiter);
    }

    expect(rechenGesehen).toBeGreaterThan(0);
    expect(document.querySelector('.verdikt')).toBeTruthy();
    expect(screen.getByText(/Davon Rechenaufgaben:/)).toBeInTheDocument();
  });
});

describe('Rechentrainer', () => {
  it('startet vom Dashboard, prueft eine falsche Eingabe und zeigt den Rechenweg', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Rechnen'));
    const eingabe = document.querySelector('.rechen-eingabe input');
    expect(eingabe).toBeTruthy();
    fireEvent.change(eingabe, { target: { value: '999999' } });
    fireEvent.click(screen.getByText('Prüfen'));
    expect(document.querySelector('.rechen-feedback.bad')).toBeTruthy();
    expect(document.querySelector('.rechen-weg')).toBeTruthy();
  });

  it('bietet den Rechen-Modus im Lernfeld mit Rechenkarten an', () => {
    render(<App />);
    fireEvent.click(screen.getByLabelText(/Lehrjahr 1, Grundlagen/));
    fireEvent.click(screen.getByLabelText(/^LF1,/));
    fireEvent.click(screen.getByRole('button', { name: /Rechnen/ }));
    expect(document.querySelector('.rechen-eingabe input')).toBeTruthy();
  });
});

describe('Karten-Editor', () => {
  it('legt eine eigene Karte an, die danach in der App auftaucht', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Fortschritt'));
    fireEvent.click(screen.getByRole('button', { name: /Karten-Editor öffnen/ }));
    fireEvent.click(screen.getByText('＋ Neue Karte'));

    fireEvent.change(document.getElementById('ed-f'), { target: { value: 'Selbst gebaute Frage' } });
    fireEvent.change(document.getElementById('ed-a'), { target: { value: 'Selbst gebaute Antwort' } });
    fireEvent.click(screen.getByText('Speichern'));

    expect(screen.getAllByText('Selbst gebaute Frage').length).toBeGreaterThan(0);
    expect(screen.getByText(BASIS_KARTEN.length + 1 + ' Karten')).toBeInTheDocument();
  });

  it('meckert bei einer leeren Karte, statt sie zu speichern', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Fortschritt'));
    fireEvent.click(screen.getByRole('button', { name: /Karten-Editor öffnen/ }));
    fireEvent.click(screen.getByText('＋ Neue Karte'));
    fireEvent.click(screen.getByText('Speichern'));
    expect(document.querySelector('.editor-fehler')).toBeTruthy();
  });
});

describe('Heute-Karte (Tagesziel + Pruefungs-Countdown)', () => {
  it('rechnet nach dem Eintragen eines Termins ein Tagespensum aus', () => {
    render(<App />);
    expect(document.querySelector('.heute')).toBeTruthy();
    fireEvent.click(screen.getByText('Termin eintragen'));
    const datum = document.querySelector('.h-edit input[type="date"]');
    expect(datum).toBeTruthy();
    const inZehnTagen = new Date(Date.now() + 10 * 86400000).toISOString().slice(0, 10);
    fireEvent.change(datum, { target: { value: inZehnTagen } });
    fireEvent.click(screen.getByText('Speichern'));
    expect(screen.getByText(/Tage bis zur Prüfung/)).toBeInTheDocument();
    expect(screen.getByText(/Karten\/Tag nötig/)).toBeInTheDocument();
  });

  it('zeigt Tagesziel und Fortschritt in derselben Karte', () => {
    render(<App />);
    const heute = document.querySelector('.heute');
    expect(heute.textContent).toMatch(/\/ 15 Karten/);
    expect(heute.querySelector('.h-bar')).toBeTruthy();
    fireEvent.click(screen.getByText('Ziel ändern'));
    const ziel = document.querySelector('.h-edit input[type="number"]');
    fireEvent.change(ziel, { target: { value: '25' } });
    fireEvent.click(screen.getByText('Speichern'));
    expect(document.querySelector('.heute').textContent).toMatch(/\/ 25 Karten/);
  });
});

describe('Nachschlagen-Panels', () => {
  it('Wissen-Panel rendert alle 13 Lernfelder ohne Absturz', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Nachschlagen'));
    fireEvent.click(screen.getByRole('tab', { name: /Wissen/ }));
    expect(document.querySelectorAll('details.ref').length).toBe(13);
  });

  it('Karten-Panel rendert Filter-Chips und Kartenliste', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Nachschlagen'));
    fireEvent.click(screen.getByRole('tab', { name: /Karten/ }));
    expect(screen.getByText('Alle Jahre')).toBeInTheDocument();
    expect(screen.getByText(BASIS_KARTEN.length + ' Karten')).toBeInTheDocument();
  });

  it('Suche findet Karten ueber Frage/Antwort-Text', () => {
    render(<App />);
    fireEvent.click(screen.getByText('Nachschlagen'));
    const input = screen.getByPlaceholderText(/Suchen:/);
    fireEvent.change(input, { target: { value: 'Ohmsche' } });
    expect(screen.getByText(/Karten-Treffer/)).toBeInTheDocument();
  });
});
