"use client";

import { useId } from "react";

/**
 * A glossy heart mark with a gradient fill and a gloss highlight.
 * Reused as the closed envelope's "wax seal" and, scaled down + faded,
 * as the scattered background print on the open letter.
 */
export function KissMark({ className = "" }: { className?: string }) {
  const uid = useId();
  const fill = `kiss-heart-${uid}`;
  const gloss = `kiss-gloss-${uid}`;

  const heart =
    "M100,85 C60,58 52,40 52,27 C52,13 63,6 74,6 C85,6 95,13 100,22 " +
    "C105,13 115,6 126,6 C137,6 148,13 148,27 C148,40 140,58 100,85 Z";

  return (
    <svg viewBox="0 0 200 90" className={className} aria-hidden>
      <defs>
        <linearGradient id={fill} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff3f6f" />
          <stop offset="55%" stopColor="#d81b4f" />
          <stop offset="100%" stopColor="#7c0f2c" />
        </linearGradient>
        <radialGradient id={gloss} cx="30%" cy="20%" r="45%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d={heart} fill={`url(#${fill})`} stroke="#5a071c" strokeWidth="1.4" strokeOpacity="0.4" />
      <path d={heart} fill={`url(#${gloss})`} />
    </svg>
  );
}
