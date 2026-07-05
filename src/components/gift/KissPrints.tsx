"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { KissMark } from "./KissMark";

interface Print {
  id: number;
  left: number;
  top: number;
  size: number;
  rotate: number;
  opacity: number;
  duration: number;
  delay: number;
}

/**
 * Scattered lipstick kiss prints behind the open letter's content — organic
 * (varied rotation/scale, not a grid), low-opacity so the note and song
 * list stay readable, drifting gently unless reduced-motion is set. Seeded
 * after mount (random) so server/client markup always match.
 */
export function KissPrints({ count = 16 }: { count?: number }) {
  const reduced = usePrefersReducedMotion();
  const [prints, setPrints] = useState<Print[]>([]);

  useEffect(() => {
    setPrints(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 44 + Math.random() * 64,
        rotate: Math.random() * 70 - 35,
        opacity: 0.05 + Math.random() * 0.09,
        duration: 8 + Math.random() * 8,
        delay: Math.random() * 6,
      })),
    );
  }, [count]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {prints.map((p) => (
        <div
          key={p.id}
          className={reduced ? "absolute" : "absolute kiss-print"}
          style={
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              opacity: p.opacity,
              transform: `rotate(${p.rotate}deg)`,
              "--kr": `${p.rotate}deg`,
              "--kd": `${p.duration}s`,
              "--kdelay": `${p.delay}s`,
            } as React.CSSProperties
          }
        >
          <KissMark className="w-full" />
        </div>
      ))}
    </div>
  );
}
