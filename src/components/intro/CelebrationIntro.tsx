"use client";

import { motion } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { ConfettiCanvas } from "./ConfettiCanvas";

/**
 * Full-screen celebration splash shown once per fresh load, before the
 * coverflow. Purely in-memory (no localStorage) — Home unmounts it once
 * the visitor taps through, and a hard refresh brings it back.
 */
export function CelebrationIntro({ onCelebrate }: { onCelebrate: () => void }) {
  const reduced = usePrefersReducedMotion();

  return (
    <motion.div
      key="celebration-intro"
      className="fixed inset-0 z-[100] overflow-hidden"
      initial={false}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.2 : 0.7, ease: "easeInOut" }}
    >
      <img
        src="/intro/rainbow-nyc.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,10,30,0.35) 0%, rgba(20,10,30,0.55) 55%, rgba(10,5,20,0.8) 100%)",
        }}
      />

      <ConfettiCanvas fire={!reduced} />

      <div className="relative z-20 flex min-h-full flex-col items-center justify-center px-6 text-center">
        <motion.h1
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: reduced ? 0.3 : 0.9, ease: [0.16, 1, 0.3, 1], delay: reduced ? 0 : 0.15 }}
          className="font-display max-w-3xl text-[clamp(1.9rem,6vw,3.75rem)] italic leading-[1.1] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.55)]"
        >
          Our best friend Taylor Swift is married 🥳
        </motion.h1>

        <motion.button
          type="button"
          onClick={onCelebrate}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduced ? 0.3 : 0.7, ease: "easeOut", delay: reduced ? 0.1 : 0.55 }}
          className="mt-10 rounded-full px-8 py-3 text-base font-semibold text-white shadow-[0_14px_40px_rgba(0,0,0,0.35)] transition hover:scale-105 hover:brightness-110 active:scale-95"
          style={{
            background: "linear-gradient(100deg, #e75c9d 5%, #9d7bdd 50%, #d9a441 95%)",
          }}
        >
          let&apos;s celebrate 🎉
        </motion.button>
      </div>
    </motion.div>
  );
}
