"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

interface Heart {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  glyph: string;
}

/**
 * Wedding-gift theming: soft hearts drift up the page. Purely decorative;
 * suppressed entirely under reduced-motion. Hearts are seeded after mount
 * (they're random) so server and client markup always match.
 */
export function FloatingHearts({ count = 14 }: { count?: number }) {
  const reduced = usePrefersReducedMotion();
  const [hearts, setHearts] = useState<Heart[]>([]);

  useEffect(() => {
    setHearts(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: 10 + Math.random() * 20,
        delay: Math.random() * 12,
        duration: 12 + Math.random() * 12,
        opacity: 0.3 + Math.random() * 0.4,
        glyph: ["💗", "🤍", "💕", "🕊️", "✨"][Math.floor(Math.random() * 5)],
      })),
    );
  }, [count]);

  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 -z-[1] overflow-hidden" aria-hidden>
      {hearts.map((h) => (
        <span
          key={h.id}
          className="floating-heart absolute bottom-0"
          style={{
            left: `${h.left}%`,
            fontSize: h.size,
            opacity: h.opacity,
            animationDelay: `${h.delay}s`,
            animationDuration: `${h.duration}s`,
          }}
        >
          {h.glyph}
        </span>
      ))}
    </div>
  );
}
