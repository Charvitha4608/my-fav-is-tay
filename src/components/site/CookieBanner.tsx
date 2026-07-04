"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const KEY = "mfit-consent-v1";

/**
 * Minimal GDPR / EU User Consent notice. The site itself sets no tracking
 * cookies; embedded players (Spotify/YouTube) may set their own once a
 * visitor interacts with them, which is what this banner discloses.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setVisible(true);
    } catch {
      /* storage unavailable — stay quiet */
    }
  }, []);

  function acknowledge() {
    try {
      localStorage.setItem(KEY, new Date().toISOString());
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="glass fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-2xl p-4 text-sm sm:inset-x-auto sm:right-4"
          role="region"
          aria-label="Cookie notice"
        >
          <p className="text-ink">
            This site sets no tracking cookies of its own. Embedded Spotify and YouTube
            players may set cookies from those services when you play a song.
          </p>
          <div className="mt-3 flex justify-end">
            <button
              onClick={acknowledge}
              className="rounded-full bg-[var(--era-accent)] px-4 py-1.5 text-sm font-medium text-white shadow-md transition hover:brightness-105"
            >
              Okay, got it
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
