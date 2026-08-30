import FormattedAnswer from "./FormattedAnswer.jsx";

/** Aufklappbare Karte fürs Nachschlagen (Frage als Titel, Antwort strukturiert). */
export default function CardDetail({ karte, open = false }) {
  return (
    <details className="ref" open={open}>
      <summary>
        {karte.f}
        <span className="ref-sub">
          Lehrjahr {karte.j} · {karte.lf}
        </span>
      </summary>
      <div className="ref-body w">
        <FormattedAnswer karte={karte} />
      </div>
    </details>
  );
}
