/**
 * Provider-agnostic media model. Every track can live on Spotify,
 * YouTube, or both; the UI never talks to a provider directly — it goes
 * through a MediaProvider implementation.
 */

export type ProviderId = "spotify" | "youtube";

export interface Album {
  /** Stable slug, e.g. "red-tv" — used in routes, share payloads, cutout filenames. */
  id: string;
  title: string;
  year: number;
  /** Resolved at runtime from Spotify (never rehosted). */
  coverUrl?: string;
  /** Search query used to resolve the album against provider catalogs. */
  searchQuery: string;
  eraId: string;
}

export interface Track {
  /** Stable ID: `${albumId}.${trackNumber}` */
  id: string;
  title: string;
  albumId: string;
  trackNumber: number;
  durationMs: number;
  /** Official Spotify URI/ID when resolved, e.g. "spotify:track:xyz". */
  spotifyUri?: string;
  /** Official YouTube video ID when resolved. */
  youtubeVideoId?: string;
  preferredProvider: ProviderId;
}

export interface MediaProvider {
  id: ProviderId;
  label: string;
  /** Deep link that opens the track on the provider (search-based until resolved). */
  trackUrl(track: Track, album?: Album): string;
  /** Embed URL for an inline player, or null if this track can't be embedded yet. */
  embedUrl(track: Track): string | null;
  available(track: Track): boolean;
}

export interface SharePayload {
  title: string;
  message: string;
  from?: string;
  trackIds: string[];
}

export interface ShareRecord extends SharePayload {
  shortId: string;
  createdAt: string;
}
