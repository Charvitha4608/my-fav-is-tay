import type { MediaProvider, Track } from "./types";

/**
 * Client-safe provider implementations. Until a track is resolved against
 * a provider's catalog (spotifyUri / youtubeVideoId), deep links fall back
 * to an exact-match search on the provider — always official, never rehosted.
 */

function searchTerm(track: Track): string {
  return `${track.title} Taylor Swift`;
}

export const spotifyProvider: MediaProvider = {
  id: "spotify",
  label: "Spotify",
  trackUrl(track) {
    if (track.spotifyUri) {
      const id = track.spotifyUri.split(":").pop();
      return `https://open.spotify.com/track/${id}`;
    }
    return `https://open.spotify.com/search/${encodeURIComponent(searchTerm(track))}`;
  },
  embedUrl(track) {
    if (!track.spotifyUri) return null;
    const id = track.spotifyUri.split(":").pop();
    return `https://open.spotify.com/embed/track/${id}?utm_source=oembed`;
  },
  available: () => true,
};

export const youtubeProvider: MediaProvider = {
  id: "youtube",
  label: "YouTube",
  trackUrl(track) {
    if (track.youtubeVideoId) {
      return `https://www.youtube.com/watch?v=${track.youtubeVideoId}`;
    }
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm(track))}`;
  },
  embedUrl(track) {
    if (!track.youtubeVideoId) return null;
    // Official IFrame embed — branding/attribution kept intact.
    return `https://www.youtube-nocookie.com/embed/${track.youtubeVideoId}?rel=0`;
  },
  available: () => true,
};

export const PROVIDERS: MediaProvider[] = [spotifyProvider, youtubeProvider];

export function providerFor(id: string): MediaProvider {
  return PROVIDERS.find((p) => p.id === id) ?? spotifyProvider;
}
