"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { ShareRecord, Track } from "@/lib/media/types";
import { getAlbum, totalRuntime } from "@/lib/discography";
import { eraFor } from "@/lib/eras";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { CoverArt } from "@/components/carousel/AlbumCard";
import { PlayerEmbed } from "./PlayerEmbed";
import { TypedMessage } from "./TypedMessage";
import { SparkleBurst } from "./SparkleBurst";
import { KissMark } from "./KissMark";
import { KissPrints } from "./KissPrints";

/**
 * The recipient's experience — an envelope-letter love note:
 *   sealed envelope, lips as the wax seal  →  (kiss to open)  →
 *   flap swings open in 3D, a letter rises out and expands  →
 *   the full letter: songs up top, personal note + signature bottom-left,
 *   scattered kiss prints drifting behind it all.
 * Fixed blush / lipstick-red / ivory palette (see .envelope-scene in
 * globals.css) — deliberately independent of the era-world theming used
 * elsewhere on the site, so the reveal always reads the same.
 */
export function GiftView({
  share,
  tracks,
  art,
}: {
  share: ShareRecord;
  tracks: Track[];
  art: Record<string, string>;
}) {
  const [stage, setStage] = useState<"closed" | "opening" | "open">("closed");
  const reduced = usePrefersReducedMotion();

  const open = () => {
    if (stage !== "closed") return;
    setStage("opening");
    // the letter rises just before the flap finishes settling open
    window.setTimeout(() => setStage("open"), reduced ? 0 : 420);
  };

  const spotifyPlaylistUrl = buildSpotifySearchSet(tracks);

  return (
    <main className="envelope-scene relative min-h-screen">
      <SparkleBurst fire={stage !== "closed"} />

      <AnimatePresence>
        {stage !== "open" ? (
          <SealedEnvelope
            key="envelope"
            share={share}
            opening={stage === "opening"}
            reduced={reduced}
            onOpen={open}
          />
        ) : (
          <OpenLetter
            key="letter"
            share={share}
            tracks={tracks}
            art={art}
            reduced={reduced}
            spotifyPlaylistUrl={spotifyPlaylistUrl}
          />
        )}
      </AnimatePresence>
    </main>
  );
}

function SealedEnvelope({
  share,
  opening,
  reduced,
  onOpen,
}: {
  share: ShareRecord;
  opening: boolean;
  reduced: boolean;
  onOpen: () => void;
}) {
  return (
    <motion.div
      key="envelope"
      exit={{ opacity: 0, scale: 0.92, transition: { duration: reduced ? 0 : 0.35, ease: "easeIn" } }}
      className="grid min-h-screen place-items-center px-6"
    >
      <div className="flex flex-col items-center">
        <div style={{ perspective: 1600 }}>
          <div className="relative h-[210px] w-[290px] sm:h-[264px] sm:w-[380px]">
            {/* envelope body */}
            <div
              className="paper-grain absolute inset-0 overflow-hidden rounded-[18px] border border-black/5"
              style={{
                background: "linear-gradient(180deg, var(--ivory) 0%, var(--ivory-deep) 100%)",
                boxShadow:
                  "0 30px 60px -20px rgba(124,15,44,0.35), 0 10px 24px rgba(0,0,0,0.14)",
              }}
            />
            {/* hint of the open mouth beneath the flap */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-3 top-2 h-1/2 rounded-t-[14px]"
              style={{ background: "linear-gradient(180deg, rgba(124,15,44,0.14), transparent 75%)" }}
            />

            {/* flap — rotates up/back in 3D to open */}
            <motion.div
              className="absolute inset-x-0 top-0 origin-top"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateX: opening ? -168 : 0 }}
              transition={{ duration: reduced ? 0 : 0.55, ease: [0.65, 0, 0.35, 1] }}
            >
              <svg viewBox="0 0 300 175" className="w-full drop-shadow-[0_10px_18px_rgba(124,15,44,0.28)]">
                <defs>
                  <linearGradient id="flap-fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--ivory)" />
                    <stop offset="100%" stopColor="var(--ivory-deep)" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 0 L300 0 L150 164 Z"
                  fill="url(#flap-fill)"
                  stroke="rgba(124,15,44,0.3)"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>

            {/* the kiss mark — the ONLY interactive trigger */}
            <button
              type="button"
              onClick={onOpen}
              aria-label={`Open your gift${share.from ? ` from ${share.from}` : ""}`}
              className="group absolute left-1/2 top-[56%] z-10 grid h-[74px] w-[74px] -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full focus:outline-none"
            >
              <span
                aria-hidden
                className="kiss-halo absolute inset-0 rounded-full"
                style={{ background: "var(--kiss-glow)", filter: "blur(10px)" }}
              />
              <motion.span
                className="relative block h-full w-full drop-shadow-[0_6px_14px_rgba(124,15,44,0.45)] transition-transform duration-300 ease-out group-hover:scale-110 group-hover:drop-shadow-[0_0_22px_var(--kiss-glow)]"
                animate={opening ? { scale: 1.25, opacity: 0 } : { scale: 1, opacity: 1 }}
                transition={{ duration: reduced ? 0 : 0.4, ease: "easeOut" }}
              >
                <KissMark className="h-full w-full" />
              </motion.span>
            </button>
          </div>
        </div>

        <p className="font-display mt-9 text-2xl italic text-[var(--ink-plum)]">
          {share.from ? `${share.from} made you something` : "you have a gift"}
        </p>
        <p className="kiss-hint mt-2 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--kiss-red)]">
          kiss to open
        </p>
      </div>
    </motion.div>
  );
}

function OpenLetter({
  share,
  tracks,
  art,
  reduced,
  spotifyPlaylistUrl,
}: {
  share: ShareRecord;
  tracks: Track[];
  art: Record<string, string>;
  reduced: boolean;
  spotifyPlaylistUrl: string;
}) {
  return (
    <motion.div
      key="letter"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: 140, scale: 0.55 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: reduced ? 0.3 : 0.65, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto max-w-2xl px-5 pb-28 pt-16 sm:pt-24"
    >
      <div
        className="paper-grain relative isolate overflow-hidden rounded-[28px] border border-black/5"
        style={{
          background: "linear-gradient(175deg, var(--ivory) 0%, var(--ivory-deep) 100%)",
          boxShadow: "0 40px 90px -30px rgba(124,15,44,0.4), 0 12px 30px rgba(0,0,0,0.14)",
        }}
      >
        {/* scattered kiss prints behind the letter's content */}
        <KissPrints />

        <div className="relative z-10 p-7 sm:p-10">
          {share.from && (
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-[var(--kiss-red)]">
              a gift from {share.from}
            </p>
          )}
          <h1 className="font-display text-4xl italic text-[var(--ink-plum)] sm:text-5xl">
            {share.title}
          </h1>
          <p className="mt-3 text-xs text-[var(--ink-soft-plum)]">
            {tracks.length} {tracks.length === 1 ? "song" : "songs"} ·{" "}
            {totalRuntime(tracks.map((t) => t.id))}
          </p>

          {/* full-set deep links */}
          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href={spotifyPlaylistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#1DB954] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
            >
              Open in Spotify ↗
            </a>
            <a
              href={buildYouTubeSet(tracks)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#FF0033] px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:brightness-110"
            >
              Open in YouTube ↗
            </a>
          </div>

          {/* HERO: the full list of favourite songs */}
          <motion.ul
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: reduced ? 0 : 0.07, delayChildren: reduced ? 0 : 0.15 } } }}
            className="mt-7 space-y-3"
          >
            {tracks.map((track) => {
              const album = getAlbum(track.albumId);
              const albumWithArt = album ? { ...album, coverUrl: art[album.id] } : undefined;
              const era = album ? eraFor(album.eraId) : undefined;
              return (
                <motion.li
                  key={track.id}
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  className="rounded-2xl border border-black/5 bg-white/55 p-4 shadow-sm backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg shadow">
                      {albumWithArt && (
                        <CoverArt album={albumWithArt} coverUrl={albumWithArt.coverUrl} />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[var(--ink-plum)]">{track.title}</p>
                      <p className="truncate text-xs text-[var(--ink-soft-plum)]">
                        {album?.title}
                        {era ? ` · ${era.label}` : ""}
                      </p>
                    </div>
                    {era && (
                      <span
                        className="hidden shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium text-white sm:inline"
                        style={{ background: "var(--kiss-red)" }}
                      >
                        {era.label}
                      </span>
                    )}
                  </div>
                  <PlayerEmbed track={track} />
                </motion.li>
              );
            })}
          </motion.ul>

          {/* BOTTOM-LEFT: the personal note, signed underneath */}
          {share.message && (
            <div className="mt-12 max-w-md">
              <TypedMessage
                text={share.message}
                start
                className="font-script whitespace-pre-wrap text-3xl leading-snug text-[var(--ink-plum)] sm:text-4xl"
              />
              {share.from && (
                <p className="font-script mt-3 -rotate-2 text-3xl text-[var(--kiss-red-deep)] sm:text-4xl">
                  {share.from}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link
          href="/"
          className="text-sm text-[var(--ink-soft-plum)] underline decoration-dotted underline-offset-2 hover:text-[var(--ink-plum)]"
        >
          make your own gift at my fav is tay 💌
        </Link>
      </div>
    </motion.div>
  );
}

/** Best-effort "play the whole set" links (search-based; always official). */
function buildSpotifySearchSet(tracks: Track[]): string {
  const first = tracks[0];
  if (first?.spotifyUri) {
    const id = first.spotifyUri.split(":").pop();
    return `https://open.spotify.com/track/${id}`;
  }
  return `https://open.spotify.com/search/${encodeURIComponent(
    (first?.title ?? "Taylor Swift") + " Taylor Swift",
  )}`;
}

function buildYouTubeSet(tracks: Track[]): string {
  const first = tracks[0];
  if (first?.youtubeVideoId) {
    return `https://www.youtube.com/watch?v=${first.youtubeVideoId}`;
  }
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(
    (first?.title ?? "Taylor Swift") + " Taylor Swift",
  )}`;
}
