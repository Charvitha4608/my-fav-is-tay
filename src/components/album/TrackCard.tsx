"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Album, Track } from "@/lib/media/types";
import { formatDuration } from "@/lib/discography";
import { spotifyProvider, youtubeProvider } from "@/lib/media/providers";
import { usePlaylistStore } from "@/store/playlist";
import { CoverArt } from "@/components/carousel/AlbumCard";

/** Dispatched when a song is added so the flight layer can fly it to the dock. */
export function flyToDock(fromX: number, fromY: number) {
  window.dispatchEvent(new CustomEvent("mfit:fly", { detail: { x: fromX, y: fromY } }));
}

function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.53 14.43a.62.62 0 0 1-.86.21c-2.36-1.44-5.33-1.77-8.83-.97a.63.63 0 0 1-.28-1.22c3.83-.88 7.12-.5 9.76 1.12.3.18.39.56.21.86Zm1.22-2.72a.78.78 0 0 1-1.07.26c-2.7-1.66-6.82-2.14-10.02-1.17a.78.78 0 1 1-.45-1.5c3.65-1.1 8.19-.56 11.28 1.34.37.22.48.7.26 1.07Zm.1-2.83C14.7 9 9.35 8.82 6.26 9.75a.94.94 0 1 1-.54-1.79c3.55-1.08 9.44-.87 13.16 1.34a.94.94 0 0 1-.96 1.61Z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
      <path d="M23.5 6.19a3.02 3.02 0 0 0-2.12-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.38.5A3.02 3.02 0 0 0 .5 6.19C0 8.07 0 12 0 12s0 3.93.5 5.81a3.02 3.02 0 0 0 2.12 2.14c1.88.5 9.38.5 9.38.5s7.5 0 9.38-.5a3.02 3.02 0 0 0 2.12-2.14C24 15.93 24 12 24 12s0-3.93-.5-5.81ZM9.55 15.57V8.43L15.82 12l-6.27 3.57Z" />
    </svg>
  );
}

export function TrackCard({ track, album }: { track: Track; album: Album }) {
  const inPlaylist = usePlaylistStore((s) => s.trackIds.includes(track.id));
  const add = usePlaylistStore((s) => s.add);
  const remove = usePlaylistStore((s) => s.remove);
  const [burst, setBurst] = useState(0);

  function toggle(e: React.MouseEvent) {
    if (inPlaylist) {
      remove(track.id);
      return;
    }
    add(track.id);
    setBurst((b) => b + 1);
    flyToDock(e.clientX, e.clientY);
  }

  return (
    <motion.li
      layout
      variants={{
        hidden: { opacity: 0, y: 22 },
        show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 250, damping: 26 } },
      }}
      whileHover={{ y: -3, transition: { type: "spring", stiffness: 350, damping: 22 } }}
      className="glass group relative flex items-center gap-3.5 rounded-2xl p-3.5"
      style={
        inPlaylist
          ? {
              boxShadow:
                "0 0 0 1.5px rgba(var(--era-accent-rgb),0.75), 0 10px 36px rgba(0,0,0,0.22), 0 0 26px rgba(var(--era-accent-rgb),0.25)",
            }
          : undefined
      }
    >
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg shadow-[0_6px_18px_rgba(0,0,0,0.3)]">
        <CoverArt album={album} coverUrl={album.coverUrl} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{track.title}</p>
        <p className="mt-0.5 text-xs tracking-wide text-ink-soft">
          {formatDuration(track.durationMs)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <a
          href={spotifyProvider.trackUrl(track, album)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Play ${track.title} on Spotify`}
          className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition-all duration-300 hover:scale-110 hover:bg-[#1DB954] hover:text-white"
          style={{ background: "rgba(var(--era-ink-rgb),0.08)" }}
        >
          <SpotifyIcon />
        </a>
        <a
          href={youtubeProvider.trackUrl(track, album)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Play ${track.title} on YouTube`}
          className="grid h-8 w-8 place-items-center rounded-full text-ink-soft transition-all duration-300 hover:scale-110 hover:bg-[#FF0033] hover:text-white"
          style={{ background: "rgba(var(--era-ink-rgb),0.08)" }}
        >
          <YouTubeIcon />
        </a>

        <button
          type="button"
          onClick={toggle}
          aria-pressed={inPlaylist}
          aria-label={
            inPlaylist
              ? `Remove ${track.title} from playlist`
              : `Add ${track.title} to playlist`
          }
          className="relative grid h-9 w-9 place-items-center rounded-full text-lg transition hover:scale-110"
        >
          <motion.span
            key={burst}
            initial={burst ? { scale: 0.4 } : false}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 14 }}
            aria-hidden
          >
            {inPlaylist ? "💗" : "🤍"}
          </motion.span>
          <AnimatePresence>
            {burst > 0 && (
              <motion.span
                key={`b-${burst}`}
                className="pointer-events-none absolute inset-0"
                initial="hidden"
                animate="show"
                exit="hidden"
                aria-hidden
              >
                {[...Array(7)].map((_, i) => {
                  const angle = (i / 7) * Math.PI * 2;
                  return (
                    <motion.span
                      key={i}
                      className="absolute left-1/2 top-1/2 text-xs"
                      variants={{
                        hidden: { opacity: 0, x: 0, y: 0, scale: 0.4 },
                        show: {
                          opacity: [1, 0],
                          x: Math.cos(angle) * 30,
                          y: Math.sin(angle) * 30,
                          scale: 1.1,
                          transition: { duration: 0.65, delay: 0.02 * i },
                        },
                      }}
                    >
                      💖
                    </motion.span>
                  );
                })}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.li>
  );
}
