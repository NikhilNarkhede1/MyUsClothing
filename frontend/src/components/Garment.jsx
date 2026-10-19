import { useId } from "react";

// Draws a clean clothing illustration for a product, in the product's colour.
// type: tshirt, polo, shirt, jeans, shorts, hoodie, jacket, frock
const LINE = "rgba(0,0,0,0.28)";
const SHADE = "rgba(0,0,0,0.14)";
const LIGHT = "rgba(255,255,255,0.55)";

export default function Garment({ type, color }) {
  const patternId = "check" + useId().replace(/:/g, "");

  let body = "";
  let extras = null;

  if (type === "tshirt") {
    body = "M34 12 L16 22 L6 40 L20 48 L27 40 L27 90 L73 90 L73 40 L80 48 L94 40 L84 22 L66 12 Q50 24 34 12 Z";
    extras = (
      <>
        <path d="M34 12 Q50 26 66 12 Q50 20 34 12 Z" fill={SHADE} />
        <path d="M27 40 Q28 26 34 12 M73 40 Q72 26 66 12" stroke={LINE} fill="none" strokeWidth="1" />
        <path d="M27 84 L73 84" stroke={LINE} strokeWidth="1" />
      </>
    );
  } else if (type === "polo") {
    body = "M34 12 L16 22 L6 40 L20 48 L27 40 L27 90 L73 90 L73 40 L80 48 L94 40 L84 22 L66 12 Q50 24 34 12 Z";
    extras = (
      <>
        <path d="M34 12 L46 9 L50 26 L38 20 Z M66 12 L54 9 L50 26 L62 20 Z" fill={LIGHT} stroke={LINE} strokeWidth="1" />
        <path d="M50 26 L50 50" stroke={LINE} strokeWidth="1" />
        <circle cx="50" cy="33" r="1.5" fill={LINE} />
        <circle cx="50" cy="42" r="1.5" fill={LINE} />
        <path d="M27 40 Q28 26 34 12 M73 40 Q72 26 66 12" stroke={LINE} fill="none" strokeWidth="1" />
        <path d="M10 41 L21 47 M90 41 L79 47" stroke={LIGHT} strokeWidth="2" />
      </>
    );
  } else if (type === "shirt") {
    body = "M34 11 L16 20 L8 70 L21 72 L27 44 L27 90 L73 90 L73 44 L79 72 L92 70 L84 20 L66 11 Q50 22 34 11 Z";
    extras = (
      <>
        <defs>
          <pattern id={patternId} width="9" height="9" patternUnits="userSpaceOnUse">
            <rect width="9" height="9" fill="none" />
            <path d="M0 4.5 H9 M4.5 0 V9" stroke="rgba(255,255,255,0.28)" strokeWidth="2" />
          </pattern>
        </defs>
        <path d={body} fill={"url(#" + patternId + ")"} />
        <path d="M34 11 L46 8 L50 24 L38 19 Z M66 11 L54 8 L50 24 L62 19 Z" fill={LIGHT} stroke={LINE} strokeWidth="1" />
        <path d="M50 24 L50 90" stroke={LINE} strokeWidth="1" />
        <circle cx="50" cy="34" r="1.4" fill={LINE} />
        <circle cx="50" cy="48" r="1.4" fill={LINE} />
        <circle cx="50" cy="62" r="1.4" fill={LINE} />
        <circle cx="50" cy="76" r="1.4" fill={LINE} />
        <rect x="57" y="40" width="11" height="12" rx="1" fill="none" stroke={LINE} strokeWidth="1" />
        <path d="M9 66 L20 68 M91 66 L80 68" stroke={LINE} strokeWidth="1.5" />
      </>
    );
  } else if (type === "jeans") {
    body = "M27 10 L73 10 L78 92 L55 92 L50 34 L45 92 L22 92 Z";
    extras = (
      <>
        <path d="M27 10 L73 10 L73.6 18 L26.4 18 Z" fill={SHADE} />
        <path d="M50 18 L50 34" stroke={LINE} strokeWidth="1" />
        <path d="M28 18 Q36 32 44 20 M72 18 Q64 32 56 20" stroke={LIGHT} fill="none" strokeWidth="1.2" strokeDasharray="2 2" />
        <path d="M37 10 V16 M63 10 V16" stroke={LINE} strokeWidth="1.5" />
        <path d="M24 86 L46 86 M54 86 L76 86" stroke={LIGHT} strokeWidth="1" strokeDasharray="2 2" />
      </>
    );
  } else if (type === "shorts") {
    body = "M26 22 L74 22 L80 66 L54 66 L50 44 L46 66 L20 66 Z";
    extras = (
      <>
        <path d="M26 22 L74 22 L74.6 29 L25.4 29 Z" fill={SHADE} />
        <path d="M50 29 L50 44" stroke={LINE} strokeWidth="1" />
        <path d="M44 29 L43 40 M56 29 L57 40" stroke={LIGHT} strokeWidth="1.5" />
        <path d="M28 30 Q35 42 43 32 M72 30 Q65 42 57 32" stroke={LIGHT} fill="none" strokeWidth="1.2" strokeDasharray="2 2" />
        <path d="M21 61 L46 61 M54 61 L79 61" stroke={LIGHT} strokeWidth="1" strokeDasharray="2 2" />
      </>
    );
  } else if (type === "hoodie") {
    body = "M32 20 L14 30 L8 74 L22 76 L27 50 L27 90 L73 90 L73 50 L78 76 L92 74 L86 30 L68 20 Q50 34 32 20 Z";
    extras = (
      <>
        <path d="M33 20 Q34 3 50 3 Q66 3 67 20 Q50 34 33 20 Z" fill={SHADE} stroke={LINE} strokeWidth="1" />
        <path d="M40 18 Q50 29 60 18 Q58 9 50 9 Q42 9 40 18 Z" fill="rgba(0,0,0,0.38)" />
        <path d="M46 28 L45 42 M54 28 L55 42" stroke="rgba(255,255,255,0.8)" strokeWidth="1.4" />
        <path d="M36 62 L64 62 L68 82 L32 82 Z" fill={SHADE} stroke={LINE} strokeWidth="1" />
        <path d="M27 84 L73 84" stroke={LINE} strokeWidth="1.5" />
        <path d="M9 70 L23 72 M91 70 L77 72" stroke={LINE} strokeWidth="2" />
      </>
    );
  } else if (type === "jacket") {
    body = "M32 14 L14 24 L8 72 L22 74 L27 46 L27 90 L73 90 L73 46 L78 74 L92 72 L86 24 L68 14 Q50 24 32 14 Z";
    extras = (
      <>
        <path d="M33 13 L33 7 Q50 19 67 7 L67 13 Q50 26 33 13 Z" fill={SHADE} stroke={LINE} strokeWidth="1" />
        <path d="M50 25 L50 90" stroke="rgba(255,255,255,0.85)" strokeWidth="1.6" />
        <path d="M33 62 L44 62 M67 62 L56 62" stroke={LINE} strokeWidth="1.4" />
        <path d="M27 84 L73 84" stroke={LINE} strokeWidth="1.5" />
        <path d="M9 68 L23 70 M91 68 L77 70" stroke={LINE} strokeWidth="2" />
        <path d="M27 46 Q28 30 32 14 M73 46 Q72 30 68 14" stroke={LINE} fill="none" strokeWidth="1" />
      </>
    );
  } else {
    // frock
    body = "M40 10 L36 20 L28 22 L33 38 L20 90 L80 90 L67 38 L72 22 L64 20 L60 10 Q50 20 40 10 Z";
    extras = (
      <>
        <path d="M40 10 Q50 22 60 10 Q50 16 40 10 Z" fill={SHADE} />
        <path d="M33 38 L67 38" stroke={LINE} strokeWidth="1.2" />
        <path d="M50 38 L38 90 M50 38 L50 90 M50 38 L62 90" stroke={SHADE} strokeWidth="1.2" />
        <path d="M50 38 L42 33 L42 43 Z M50 38 L58 33 L58 43 Z" fill={LIGHT} stroke={LINE} strokeWidth="0.8" />
        <path d="M22 84 L78 84" stroke={LIGHT} strokeWidth="1" strokeDasharray="2 2" />
      </>
    );
  }

  return (
    <svg viewBox="0 0 100 100" className="garment" role="img" aria-label={type}>
      <path d={body} fill={color} stroke={LINE} strokeWidth="1.2" strokeLinejoin="round" />
      {extras}
    </svg>
  );
}
