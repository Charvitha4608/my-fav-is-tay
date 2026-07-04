"use client";

import { create } from "zustand";
import { DEFAULT_ERA, eraFor } from "@/lib/eras";

/**
 * The currently focused era WORLD. Setting it repaints the entire page:
 * every text color, glass surface, glow and gradient reads from the CSS
 * variables written here, while EraWorld / ParticleField / TaylorHero
 * subscribe to `eraId` for the cinematic scene transition.
 *
 * `direction` records which way the user travelled (-1 left, +1 right) so
 * the world can pan like a camera move during the crossfade.
 */
interface EraState {
  eraId: string;
  direction: 1 | -1;
  setEra: (eraId: string, direction?: 1 | -1) => void;
}

export const useEraStore = create<EraState>((set, get) => ({
  eraId: DEFAULT_ERA.id,
  direction: 1,
  setEra: (eraId, direction) => {
    if (eraId === get().eraId) return;
    const w = eraFor(eraId);
    if (typeof document !== "undefined") {
      const s = document.documentElement.style;
      s.setProperty("--era-accent", w.accent);
      s.setProperty("--era-accent-rgb", w.accentRgb);
      s.setProperty("--era-accent-soft", w.accentSoft);
      s.setProperty("--era-ink", w.ink);
      s.setProperty("--era-ink-rgb", w.inkRgb);
      s.setProperty("--era-ink-soft", w.inkSoft);
      s.setProperty("--era-glass-bg", w.glassBg);
      s.setProperty("--era-glass-border", w.glassBorder);
      s.setProperty("--era-bg", w.bg);
      s.setProperty("--era-title-gradient", w.titleGradient);
      s.setProperty("--era-title-glow", w.titleGlow);
      document.documentElement.dataset.eraDark = w.dark ? "true" : "false";
    }
    set({ eraId: w.id, direction: direction ?? get().direction });
  },
}));
