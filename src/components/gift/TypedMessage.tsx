"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/**
 * Types the personal message out letter-by-letter. Under reduced-motion
 * the full message appears instantly (no animation, still fully readable).
 */
export function TypedMessage({
  text,
  start,
  onDone,
}: {
  text: string;
  start: boolean;
  onDone?: () => void;
}) {
  const reduced = usePrefersReducedMotion();
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!start) return;
    if (reduced) {
      setShown(text.length);
      onDone?.();
      return;
    }
    let i = 0;
    const step = () => {
      i += 1;
      setShown(i);
      if (i < text.length) {
        // slightly slower on punctuation for a natural, handwritten cadence
        const ch = text[i - 1];
        const delay = /[.,!?—\n]/.test(ch) ? 170 : 34;
        timer = window.setTimeout(step, delay);
      } else {
        onDone?.();
      }
    };
    let timer = window.setTimeout(step, 300);
    return () => window.clearTimeout(timer);
  }, [start, text, reduced, onDone]);

  return (
    <p className="font-display whitespace-pre-wrap text-xl italic leading-relaxed text-ink sm:text-2xl">
      {text.slice(0, shown)}
      {start && shown < text.length && (
        <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-[var(--era-accent)]" aria-hidden>
          &nbsp;
        </span>
      )}
    </p>
  );
}
