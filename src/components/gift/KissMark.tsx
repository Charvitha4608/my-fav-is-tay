"use client";

import { useId } from "react";

/**
 * A glossy lipstick kiss-print, drawn as one lip silhouette (cupid's-bow
 * top edge, fuller bottom lip) with a gradient fill, a soft mouth seam,
 * and a gloss highlight. Reused as the closed envelope's "wax seal" and,
 * scaled down + faded, as the scattered background print on the open letter.
 */
export function KissMark({ className = "" }: { className?: string }) {
  const uid = useId();
  const lip = `kiss-lip-${uid}`;
  const gloss = `kiss-gloss-${uid}`;

  const lips =
    "M18,42 C18,28 35,15 60,20 C75,10 90,26 100,29 C110,26 125,10 140,20 " +
    "C165,15 182,28 182,42 C182,62 148,76 100,77 C52,76 18,62 18,42 Z";

  return (
    <svg viewBox="0 0 200 90" className={className} aria-hidden>
      <defs>
        <linearGradient id={lip} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff3f6f" />
          <stop offset="55%" stopColor="#d81b4f" />
          <stop offset="100%" stopColor="#7c0f2c" />
        </linearGradient>
        <radialGradient id={gloss} cx="30%" cy="20%" r="45%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={lips} fill={`url(#${lip})`} stroke="#5a071c" strokeWidth="1.4" strokeOpacity="0.4" />
      <path
        d="M24,45 C50,52 150,52 176,45"
        fill="none"
        stroke="#5a071c"
        strokeWidth="2.2"
        strokeOpacity="0.32"
        strokeLinecap="round"
      />
      <path d={lips} fill={`url(#${gloss})`} />
    </svg>
  );
}
