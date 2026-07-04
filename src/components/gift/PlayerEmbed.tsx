"use client";

import { useState } from "react";
import type { Track } from "@/lib/media/types";
import { spotifyProvider, youtubeProvider } from "@/lib/media/providers";

/**
 * Lazy, provider-agnostic inline player. Nothing is embedded until the
 * listener presses play (only one heavy iframe mounts at a time per card),
 * keeping the gift page light. If both providers exist the listener picks;
 * if an embed is unavailable we degrade to an official "watch/listen on…"
 * deep link. YouTube uses the official IFrame embed with branding intact.
 */
export function PlayerEmbed({ track }: { track: Track }) {
  const hasSpotify = Boolean(track.spotifyUri);
  const hasYouTube = Boolean(track.youtubeVideoId);
  const [active, setActive] = useState<null | "spotify" | "youtube">(null);

  const spotifyEmbed = spotifyProvider.embedUrl(track);
  const youtubeEmbed = youtubeProvider.embedUrl(track);

  return (
    <div className="mt-2">
      {active === "spotify" && spotifyEmbed ? (
        <iframe
          title={`${track.title} — Spotify player`}
          src={spotifyEmbed}
          loading="lazy"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          className="h-[80px] w-full rounded-xl border-0"
        />
      ) : active === "youtube" && youtubeEmbed ? (
        <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: "16 / 9" }}>
          <iframe
            title={`${track.title} — YouTube player`}
            src={`${youtubeEmbed}&autoplay=1`}
            loading="lazy"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {hasSpotify && spotifyEmbed ? (
            <button
              onClick={() => setActive("spotify")}
              className="rounded-full bg-[#1DB954] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
            >
              ▶ Play on Spotify
            </button>
          ) : (
            <a
              href={spotifyProvider.trackUrl(track)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#1DB954] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
            >
              Listen on Spotify ↗
            </a>
          )}
          {hasYouTube && youtubeEmbed ? (
            <button
              onClick={() => setActive("youtube")}
              className="rounded-full bg-[#FF0033] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
            >
              ▶ Play on YouTube
            </button>
          ) : (
            <a
              href={youtubeProvider.trackUrl(track)}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-[#FF0033] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:brightness-110"
            >
              Watch on YouTube ↗
            </a>
          )}
          {active && (
            <button
              onClick={() => setActive(null)}
              className="rounded-full bg-white/60 px-3 py-1.5 text-xs text-ink"
            >
              stop
            </button>
          )}
        </div>
      )}
    </div>
  );
}
