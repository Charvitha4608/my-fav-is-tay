"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

interface Flight {
  id: number;
  x: number;
  y: number;
}

/**
 * Renders the little heart that flies from a tapped song card into the
 * playlist dock at the bottom of the screen.
 */
export function FlightLayer() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    let n = 0;
    const onFly = (e: Event) => {
      const { x, y } = (e as CustomEvent<{ x: number; y: number }>).detail;
      const id = ++n;
      setFlights((f) => [...f, { id, x, y }]);
      setTimeout(() => setFlights((f) => f.filter((fl) => fl.id !== id)), 1000);
    };
    window.addEventListener("mfit:fly", onFly);
    return () => window.removeEventListener("mfit:fly", onFly);
  }, []);

  if (reduced) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden>
      <AnimatePresence>
        {flights.map((f) => (
          <motion.span
            key={f.id}
            className="absolute text-2xl"
            initial={{ left: f.x, top: f.y, opacity: 1, scale: 1 }}
            animate={{
              left: window.innerWidth / 2,
              top: window.innerHeight - 48,
              opacity: 0.2,
              scale: 0.5,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.75, ease: [0.3, 0.7, 0.4, 1] }}
          >
            💗
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
