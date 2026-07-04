"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import type { ShareRecord, Track } from "@/lib/media/types";
import { getAlbum, formatDuration, totalRuntime } from "@/lib/discography";
import { eraFor } from "@/lib/eras";
import { useEraStore } from "@/store/era";
import { CoverArt } from "@/components/carousel/AlbumCard";
import { PlayerEmbed } from "./PlayerEmbed";
import { FloatingHearts } from "./FloatingHearts";
import { TypedMessage } from "./TypedMessage";
import { SparkleBurst } from "./SparkleBurst";

/**
 * The recipient's experience:
 *   sealed envelope  →  (tap to open)  →  sparkle burst  →  typed letter
 *   →  staggered song cards with lazy embedded players.
 * Extra-soft wedding gradients + floating hearts + Fraunces italics.
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
  const [opened, setOpened] = useState(false);
  const [messageDone, setMessageDone] = useState(false);
  const setEra = useEraStore((s) => s.setEra);

  // Tint the accent from the first song's era.
  useEffect(() => {
    const first = tracks[0];
    const album = first ? getAlbum(first.albumId) : undefined;
    if (album) setEra(album.eraId);
  }, [tracks, setEra]);

  const spotifyPlaylistUrl = buildSpotifySearchSet(tracks);

  return (
    <main className="relative min-h-screen">
      {/* extra-soft wedding gradient veil over the base sky */}
      <div
        className="pointer-events-none fixed inset-0 -z-[2]"
        aria-hidden
        style={{
          background:
            "radial-gradient(120% 90% at 50% 0%, rgba(255,255,255,0.5), rgba(255,255,255,0) 60%)",
        }}
      />
      <FloatingHearts />
      <SparkleBurst fire={opened} />

      <AnimatePresence mode="wait">
        {!opened ? (
          <Envelope key="env" share={share} onOpen={() => setOpened(true)} />
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto max-w-2xl px-5 pb-32 pt-16"
          >
            {/* the letter */}
            <motion.section
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
              className="glass rounded-3xl p-7 sm:p-9"
            >
              {share.from && (
                <p className="mb-4 text-sm tracking-[0.2em] text-ink-soft uppercase">
                  a gift from {share.from}
                </p>
              )}
              <h1 className="text-dreamy font-display text-4xl italic sm:text-5xl">
                {share.title}
              </h1>
              {share.message && (
                <div className="mt-5">
                  <TypedMessage
                    text={share.message}
                    start={opened}
                    onDone={() => setMessageDone(true)}
                  />
                </div>
              )}
              <p className="mt-6 text-xs text-ink-soft">
                {tracks.length} {tracks.length === 1 ? "song" : "songs"} ·{" "}
                {totalRuntime(tracks.map((t) => t.id))}
              </p>
            </motion.section>

            {/* full-set deep links */}
            <div className="mt-6 flex flex-wrap gap-2">
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

            {/* song cards — staggered in after the message finishes typing */}
            <motion.ul
              initial="hidden"
              animate={messageDone ? "show" : "hidden"}
              variants={{ show: { transition: { staggerChildren: 0.08 } } }}
              className="mt-6 space-y-3"
            >
              {tracks.map((track) => {
                const album = getAlbum(track.albumId);
                const albumWithArt = album ? { ...album, coverUrl: art[album.id] } : undefined;
                const era = album ? eraFor(album.eraId) : undefined;
                return (
                  <motion.li
                    key={track.id}
                    variants={{
                      hidden: { opacity: 0, y: 24 },
                      show: { opacity: 1, y: 0 },
                    }}
                    className="glass rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg shadow">
                        {albumWithArt && (
                          <CoverArt album={albumWithArt} coverUrl={albumWithArt.coverUrl} />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-ink">{track.title}</p>
                        <p className="truncate text-xs text-ink-soft">
                          {album?.title} · {formatDuration(track.durationMs)}
                        </p>
                      </div>
                      {era && (
                        <span
                          className="hidden shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium text-white sm:inline"
                          style={{ background: era.accent }}
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

            <div className="mt-10 text-center">
              <Link
                href="/"
                className="text-sm text-ink-soft underline decoration-dotted underline-offset-2 hover:text-ink"
              >
                make your own gift at my fav is tay 💌
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function Envelope({
  share,
  onOpen,
}: {
  share: ShareRecord;
  onOpen: () => void;
}) {
  return (
    <motion.div
      key="env"
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.4 } }}
      className="grid min-h-screen place-items-center px-6"
    >
      <button
        onClick={onOpen}
        className="group flex flex-col items-center focus:outline-none"
        aria-label={`Open your gift${share.from ? ` from ${share.from}` : ""}`}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="relative"
        >
          {/* envelope */}
          <div className="relative h-44 w-64 sm:h-52 sm:w-80">
            <div className="glass absolute inset-0 rounded-2xl" />
            {/* flap */}
            <motion.div
              className="absolute inset-x-0 top-0 origin-top"
              animate={{ rotateX: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <svg viewBox="0 0 320 120" className="w-full drop-shadow">
                <path
                  d="M0 0 L320 0 L160 110 Z"
                  fill="rgba(255,255,255,0.55)"
                  stroke="rgba(var(--era-accent-rgb),0.5)"
                  strokeWidth="1.5"
                />
              </svg>
            </motion.div>
            {/* wax seal */}
            <motion.div
              className="absolute left-1/2 top-1/2 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-2xl shadow-lg"
              style={{ background: "var(--era-accent)" }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              💌
            </motion.div>
          </div>
        </motion.div>
        <p className="font-display mt-8 text-2xl italic text-ink">
          {share.from ? `${share.from} made you something` : "you have a gift"}
        </p>
        <span
          className="mt-4 rounded-full px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition group-hover:scale-105"
          style={{ background: "var(--era-accent)" }}
        >
          tap to open ✨
        </span>
      </button>
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
