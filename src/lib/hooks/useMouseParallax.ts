"use client";

import { useEffect } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Pointer position as springy MotionValues in [-1, 1] (0,0 = screen
 * center). Multiply per layer for depth: clouds barely move, Taylor
 * drifts, foreground albums move the most. Returns still zeros when the
 * user prefers reduced motion.
 */
export function useMouseParallax(): { px: MotionValue<number>; py: MotionValue<number> } {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const px = useSpring(x, { stiffness: 40, damping: 16, mass: 0.6 });
  const py = useSpring(y, { stiffness: 40, damping: 16, mass: 0.6 });
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      x.set((e.clientX / window.innerWidth) * 2 - 1);
      y.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [x, y, reduced]);

  return { px, py };
}
