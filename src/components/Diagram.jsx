import { DIA } from "../data/diagrams.js";

/**
 * Rendert eines der 14 handgezeichneten Inline-SVG-Schaubilder.
 * DIA-Werte sind statischer, von uns verfasster Markup — kein Nutzer-Input —
 * daher ist dangerouslySetInnerHTML hier unproblematisch (kein XSS-Vektor).
 */
export default function Diagram({ name }) {
  if (!name || !DIA[name]) return null;
  return <div dangerouslySetInnerHTML={{ __html: DIA[name] }} />;
}
