import { NextRequest, NextResponse } from "next/server";
import { getAlbum, getTrack } from "@/lib/discography";
import { searchTrack, spotifyConfigured } from "@/lib/spotify/server";

export const runtime = "nodejs";

/**
 * GET /api/spotify/track?id=<trackId>
 * Resolves a seeded track against the official Spotify catalog so the UI
 * can upgrade its search-link to a real deep link / embed.
 */
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const track = id ? getTrack(id) : undefined;
  if (!track) return NextResponse.json({ error: "unknown track" }, { status: 404 });
  if (!spotifyConfigured()) {
    return NextResponse.json({ resolved: false }, { status: 200 });
  }
  try {
    const album = getAlbum(track.albumId);
    const hit = await searchTrack(track.title, album?.title ?? "");
    if (!hit) return NextResponse.json({ resolved: false });
    return NextResponse.json(
      { resolved: true, spotifyUri: hit.uri, spotifyUrl: hit.url },
      { headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" } },
    );
  } catch {
    return NextResponse.json({ resolved: false }, { status: 200 });
  }
}
