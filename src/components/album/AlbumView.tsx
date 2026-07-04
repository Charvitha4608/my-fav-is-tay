"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Album } from "@/lib/media/types";
import { getAlbumTracks } from "@/lib/discography";
import { eraFor } from "@/lib/eras";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { TrackCard } from "./TrackCard";
import { CoverArt } from "@/components/carousel/AlbumCard";

/**
 * Opening an album is opening a storybook — never a popup. The cover
 * glides from the carousel into the top-left corner (shared layout), the
 * world behind softens under a light blur while Taylor stays fullscreen,
 * and the tracklist rises from the bottom like a page turning up.
 */
export function AlbumView({
  album,
  coverUrl,
  onClose,
}: {
  album: Album;
  coverUrl?: string;
  onClose: () => void;
}) {
  const tracks = getAlbumTracks(album.id);
  const world = eraFor(album.eraId);
  const reduced = usePrefersReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const albumWithArt = { ...album, coverUrl };
  const spring = reduced
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 150, damping: 24, mass: 1 };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={`${album.title} tracklist`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0 : 0.5 }}
      className="fixed inset-0 z-40"
    >
      {/* the world softens but never disappears — Taylor stays with us */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(7px) brightness(0.92)",
          WebkitBackdropFilter: "blur(7px) brightness(0.92)",
          background: world.dark ? "rgba(0,0,0,0.22)" : "rgba(255,255,255,0.14)",
        }}
      />

      {/* the cover, landed in the corner (flies here via shared layout) */}
      <motion.div
        layoutId={`cover-${album.id}`}
        className="absolute left-4 top-4 z-10 h-20 w-20 overflow-hidden rounded-lg sm:left-6 sm:top-6 sm:h-28 sm:w-28"
        style={{
          boxShadow:
            "0 14px 40px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.25), 0 0 34px rgba(var(--era-accent-rgb),0.45)",
        }}
      >
        <CoverArt album={album} coverUrl={coverUrl} />
      </motion.div>

      {/* era word next to the cover */}
      <motion.div
        initial={reduced ? { opacity: 0 } : { opacity: 0, x: -16 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0 }}
        transition={{ delay: reduced ? 0 : 0.28, duration: 0.6 }}
        className="absolute left-28 top-5 z-10 sm:left-40 sm:top-8"
      >
        <h2 className="era-title font-display text-2xl italic leading-tight sm:text-4xl">
          {album.title}
        </h2>
        <p className="mt-1 text-[11px] tracking-[0.3em] text-ink-soft uppercase">
          {album.year} · {tracks.length} songs
        </p>
      </motion.div>

      <button
        ref={closeRef}
        onClick={onClose}
        aria-label="Back to the eras"
        className="glass absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full text-lg text-ink transition hover:scale-105 sm:right-6 sm:top-6"
      >
        ✕
      </button>

      {/* the page of songs, rising up */}
      <motion.div
        initial={reduced ? { opacity: 0 } : { y: "62vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={reduced ? { opacity: 0 } : { y: "50vh", opacity: 0 }}
        transition={spring}
        className="absolute inset-x-0 bottom-0 top-[15vh] sm:top-[17vh]"
      >
        <div className="scroll-soft h-full overflow-y-auto overscroll-contain px-4 pb-40 pt-4 sm:px-8">
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{
              show: {
                transition: { staggerChildren: 0.045, delayChildren: reduced ? 0 : 0.25 },
              },
            }}
            className="mx-auto grid max-w-3xl gap-3 sm:grid-cols-2"
          >
            {tracks.map((t) => (
              <TrackCard key={t.id} track={t} album={albumWithArt} />
            ))}
          </motion.ul>
        </div>
      </motion.div>
    </motion.div>
  );
}
