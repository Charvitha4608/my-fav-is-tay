"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * The playlist being built. Persisted to localStorage so a refresh never
 * loses a half-made gift.
 */
interface PlaylistState {
  trackIds: string[];
  name: string;
  message: string;
  from: string;
  dockOpen: boolean;
  add: (trackId: string) => void;
  remove: (trackId: string) => void;
  reorder: (from: number, to: number) => void;
  has: (trackId: string) => boolean;
  setName: (name: string) => void;
  setMessage: (message: string) => void;
  setFrom: (from: string) => void;
  setDockOpen: (open: boolean) => void;
  clear: () => void;
}

export const usePlaylistStore = create<PlaylistState>()(
  persist(
    (set, get) => ({
      trackIds: [],
      name: "",
      message: "",
      from: "",
      dockOpen: false,
      add: (trackId) =>
        set((s) =>
          s.trackIds.includes(trackId) ? s : { trackIds: [...s.trackIds, trackId] },
        ),
      remove: (trackId) =>
        set((s) => ({ trackIds: s.trackIds.filter((t) => t !== trackId) })),
      reorder: (from, to) =>
        set((s) => {
          const next = [...s.trackIds];
          const [moved] = next.splice(from, 1);
          next.splice(to, 0, moved);
          return { trackIds: next };
        }),
      has: (trackId) => get().trackIds.includes(trackId),
      setName: (name) => set({ name }),
      setMessage: (message) => set({ message }),
      setFrom: (from) => set({ from }),
      setDockOpen: (dockOpen) => set({ dockOpen }),
      clear: () => set({ trackIds: [], name: "", message: "", from: "" }),
    }),
    {
      name: "mfit-playlist-v1",
      partialize: (s) => ({
        trackIds: s.trackIds,
        name: s.name,
        message: s.message,
        from: s.from,
      }),
    },
  ),
);
