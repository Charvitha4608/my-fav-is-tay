"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/** A one-shot confetti/sparkle burst from screen center on gift open. */
export function SparkleBurst({ fire }: { fire: boolean }) {
  const reduced = usePrefersReducedMotion();
  const [pieces, setPieces] = useState<number[]>([]);

  useEffect(() => {
    if (fire && !reduced) {
      setPieces(Array.from({ length: 40 }, (_, i) => i));
      const t = setTimeout(() => setPieces([]), 1600);
      return () => clearTimeout(t);
    }
  }, [fire, reduced]);

  const glyphs = ["💋", "✨", "💗", "🩷"];

  return (
    <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden>
      <AnimatePresence>
        {pieces.map((i) => {
          const angle = (i / pieces.length) * Math.PI * 2 + Math.random();
          const dist = 120 + Math.random() * 320;
          return (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 text-xl"
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.4 }}
              animate={{
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist - 40,
                opacity: 0,
                scale: 1 + Math.random(),
                rotate: Math.random() * 360,
              }}
              transition={{ duration: 1.2 + Math.random() * 0.4, ease: "easeOut" }}
            >
              {glyphs[i % glyphs.length]}
            </motion.span>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
