import "server-only";
import type { Track } from "@/lib/media/types";
import { searchTrack, spotifyConfigured } from "./server";

/**
 * Enriches seeded tracks with real Spotify URIs (for embeds/deep links on
 * the gift page). Results are cached in memory per track; failures leave
 * the track unresolved and the UI falls back to search deep-links.
 */

const cache = new Map<string, string | null>();
const MAX_RESOLVE = 60; // keep gift-page render bounded

export async function enrichTracks(tracks: Track[]): Promise<Track[]> {
  if (!spotifyConfigured()) return tracks;

  const targets = tracks.slice(0, MAX_RESOLVE);
  await Promise.all(
    targets.map(async (t) => {
      if (cache.has(t.id)) return;
      try {
        const hit = await searchTrack(t.title, "");
        cache.set(t.id, hit?.uri ?? null);
      } catch {
        cache.set(t.id, null);
      }
    }),
  );

  return tracks.map((t) => {
    const uri = cache.get(t.id);
    return uri ? { ...t, spotifyUri: uri } : t;
  });
}
