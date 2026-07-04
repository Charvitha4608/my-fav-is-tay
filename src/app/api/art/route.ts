import { NextResponse } from "next/server";
import { resolveAllArt } from "@/lib/art";

export const runtime = "nodejs";

/** GET /api/art → { [albumId]: officialCoverUrl } */
export async function GET() {
  const art = await resolveAllArt();
  return NextResponse.json(art, {
    headers: { "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800" },
  });
}
