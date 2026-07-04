import "server-only";

/**
 * Spotify Client Credentials flow — server-side only.
 * Public catalog data only (album art, track links). The client never
 * sees the token; all access goes through /api/* routes.
 */

const TOKEN_URL = "https://accounts.spotify.com/api/token";
const API = "https://api.spotify.com/v1";

interface CachedToken {
  accessToken: string;
  /** epoch ms after which the token is considered stale */
  expiresAt: number;
}

let cached: CachedToken | null = null;

export function spotifyConfigured(): boolean {
  return Boolean(process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET);
}

async function getToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt) return cached.accessToken;

  const id = process.env.SPOTIFY_CLIENT_ID;
  const secret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!id || !secret) throw new Error("Spotify credentials not configured");

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Spotify token request failed: ${res.status}`);

  const json = (await res.json()) as { access_token: string; expires_in: number };
  // Refresh 60s early so in-flight requests never hit an expired token.
  cached = {
    accessToken: json.access_token,
    expiresAt: Date.now() + (json.expires_in - 60) * 1000,
  };
  return cached.accessToken;
}

async function spotifyGet<T>(path: string): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${token}` },
    // Cache catalog responses at the API layer (not the images).
    next: { revalidate: 60 * 60 * 24 },
  });
  if (!res.ok) throw new Error(`Spotify API ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

interface SpotifyImage {
  url: string;
  width: number;
  height: number;
}

interface SpotifyAlbumResult {
  albums: {
    items: {
      id: string;
      name: string;
      images: SpotifyImage[];
      artists: { name: string }[];
    }[];
  };
}

interface SpotifyTrackResult {
  tracks: {
    items: {
      id: string;
      uri: string;
      name: string;
      artists: { name: string }[];
      external_urls: { spotify: string };
    }[];
  };
}

export async function searchAlbumArt(query: string): Promise<string | null> {
  const data = await spotifyGet<SpotifyAlbumResult>(
    `/search?type=album&limit=5&q=${encodeURIComponent(query)}`,
  );
  const items = data.albums?.items ?? [];
  const best =
    items.find((a) => a.artists.some((ar) => /taylor swift/i.test(ar.name))) ?? items[0];
  return best?.images?.[0]?.url ?? null;
}

export async function searchTrack(
  title: string,
  albumTitle: string,
): Promise<{ uri: string; id: string; url: string } | null> {
  const q = `track:${title} artist:Taylor Swift`;
  const data = await spotifyGet<SpotifyTrackResult>(
    `/search?type=track&limit=5&q=${encodeURIComponent(q)}`,
  );
  const items = data.tracks?.items ?? [];
  const best =
    items.find((t) => t.artists.some((ar) => /taylor swift/i.test(ar.name))) ?? items[0];
  if (!best) return null;
  return { uri: best.uri, id: best.id, url: best.external_urls.spotify };
}
