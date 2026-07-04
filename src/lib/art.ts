import "server-only";
import { ALBUMS } from "./discography";
import { searchAlbumArt, spotifyConfigured } from "./spotify/server";

/**
 * Resolves official album artwork URLs at runtime. Primary source is the
 * Spotify API (Client Credentials); if no Spotify keys are configured the
 * iTunes Search API is used so the app still works out of the box.
 * Only the CDN *URLs* are cached — images are always served fresh from
 * the official CDN, never downloaded or rehosted.
 */

const TTL_MS = 1000 * 60 * 60 * 24; // 24h URL cache

interface CacheEntry {
  url: string | null;
  at: number;
}

const cache = new Map<string, CacheEntry>();

async function itunesAlbumArt(query: string): Promise<string | null> {
  const res = await fetch(
    `https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=album&limit=6&country=US`,
    { next: { revalidate: 60 * 60 * 24 } },
  );
  if (!res.ok) return null;
  const json = (await res.json()) as {
    results?: { artistName: string; artworkUrl100: string }[];
  };
  const items = json.results ?? [];
  const best = items.find((r) => /taylor swift/i.test(r.artistName)) ?? items[0];
  return best ? best.artworkUrl100.replace("100x100", "600x600") : null;
}

async function resolveOne(albumId: string, query: string): Promise<string | null> {
  const hit = cache.get(albumId);
  if (hit && Date.now() - hit.at < TTL_MS && hit.url) return hit.url;

  let url: string | null = null;
  try {
    url = spotifyConfigured() ? await searchAlbumArt(query) : await itunesAlbumArt(query);
    if (!url && spotifyConfigured()) url = await itunesAlbumArt(query);
  } catch {
    try {
      url = await itunesAlbumArt(query);
    } catch {
      url = null;
    }
  }
  cache.set(albumId, { url, at: Date.now() });
  return url;
}

export async function resolveAllArt(): Promise<Record<string, string>> {
  const entries = await Promise.all(
    ALBUMS.map(async (a) => [a.id, await resolveOne(a.id, a.searchQuery)] as const),
  );
  const map: Record<string, string> = {};
  for (const [id, url] of entries) if (url) map[id] = url;
  return map;
}
