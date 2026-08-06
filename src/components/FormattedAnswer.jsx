import { Fragment } from "react";
import { KARTE_DIA } from "../data/karteDia.js";
import Diagram from "./Diagram.jsx";

const MERK_RE = /^(Merke|Achtung|Vorsicht|Wichtig|Tipp|Faustregel|Beispiel|Cave|Hinweis)\b\s*:?\s*(.*)$/i;
const NUM_RE = /^(\d{1,2})[.)]\s+(.+)$/;
const KV_RE = /^([^:]{2,32}):\s+(\S.*)$/;

/**
 * Parst den rohen Antworttext einer Karte (Zeilen, "Begriff: Wert", Merksätze,
 * Aufzählungen, Formeln) in strukturierte React-Elemente.
 *
 * Das ist eine 1:1-Portierung der Original-Logik aus website/index.html
 * (antwortHTML()) — dort baute die Funktion einen HTML-String zusammen und
 * setzte ihn per innerHTML ein. Hier entstehen echte JSX-Elemente: gleiches
 * Ergebnis, aber ohne String-Konkatenation und ohne dangerouslySetInnerHTML
 * für dynamisch geparsten Text.
 */
export default function FormattedAnswer({ karte }) {
  const zeilen = String(karte.a || "").split("\n");
  const bloecke = [];
  let listBuf = [];
  let listTag = null;
  let kvBuf = [];
  let leadGesetzt = false;

  const flushList = () => {
    if (listBuf.length) {
      const Tag = listTag;
      bloecke.push(
        <Tag key={bloecke.length} className={listTag === "ol" ? "steps" : "w-list"}>
          {listBuf}
        </Tag>
      );
      listBuf = [];
      listTag = null;
    }
  };
  const flushKv = () => {
    if (kvBuf.length) {
      bloecke.push(
        <div className="kv" key={bloecke.length}>
          {kvBuf}
        </div>
      );
      kvBuf = [];
    }
  };
  const flush = () => {
    flushList();
    flushKv();
  };

  zeilen.forEach((roh, idx) => {
    const t = roh.trim();
    if (!t) {
      flush();
      return;
    }

    const mk = t.match(MERK_RE);
    if (mk) {
      flush();
      bloecke.push(
        <div className="merk" key={bloecke.length}>
          {t}
        </div>
      );
      return;
    }

    if (/^[•‣·\-]\s+/.test(t)) {
      flushKv();
      listTag = "ul";
      listBuf.push(<li key={idx}>{t.replace(/^[•‣·\-]\s+/, "")}</li>);
      return;
    }

    const num = t.match(NUM_RE);
    if (num) {
      flushKv();
      listTag = "ol";
      listBuf.push(<li key={idx}>{num[2]}</li>);
      return;
    }

    const kv = t.match(KV_RE);
    if (kv && !/[.!?]/.test(kv[1]) && kv[1].trim().split(/\s+/).length <= 3) {
      flushList();
      kvBuf.push(
        <Fragment key={idx}>
          <b>{kv[1]}</b>
          <span>{kv[2]}</span>
        </Fragment>
      );
      return;
    }

    if (/=/.test(t) && /[·×√²*/()]/.test(t) && t.length <= 52) {
      flush();
      bloecke.push(
        <div className="a-formel" key={bloecke.length}>
          {t}
        </div>
      );
      return;
    }

    flush();
    if (!leadGesetzt) {
      bloecke.push(
        <div className="a-lead" key={bloecke.length}>
          {t}
        </div>
      );
      leadGesetzt = true;
    } else {
      bloecke.push(
        <div className="a-p" key={bloecke.length}>
          {t}
        </div>
      );
    }
  });
  flush();

  const diagramName = KARTE_DIA[karte.i];

  return (
    <div className="a-wrap">
      {bloecke}
      {diagramName ? <Diagram name={diagramName} /> : null}
    </div>
  );
}
