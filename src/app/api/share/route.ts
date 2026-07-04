import { NextRequest, NextResponse } from "next/server";
import { createShare, validatePayload } from "@/lib/share/store";

export const runtime = "nodejs";

/** POST /api/share { title, message, from?, trackIds } → { shortId, url } */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const payload = validatePayload(body);
  if ("error" in payload) {
    return NextResponse.json({ error: payload.error }, { status: 400 });
  }

  try {
    const record = await createShare(payload);
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? req.nextUrl.origin;
    return NextResponse.json({
      shortId: record.shortId,
      url: `${base}/s/${record.shortId}`,
    });
  } catch (e) {
    console.error("share creation failed", e);
    return NextResponse.json({ error: "could not save the share" }, { status: 500 });
  }
}
