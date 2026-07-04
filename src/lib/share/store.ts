import "server-only";
import { customAlphabet } from "nanoid";
import { createClient } from "@supabase/supabase-js";
import { promises as fs } from "fs";
import path from "path";
import type { SharePayload, ShareRecord } from "@/lib/media/types";
import { getTrack } from "@/lib/discography";

/**
 * Durable share storage. Supabase/Postgres in production; a local JSON
 * file store when Supabase env vars are absent (dev convenience only —
 * see supabase/schema.sql for the production table).
 */

const shortId = customAlphabet("abcdefghjkmnpqrstuvwxyz23456789", 8);

const MAX_TRACKS = 300;
const MAX_TITLE = 120;
const MAX_MESSAGE = 2000;
const MAX_FROM = 80;

export function validatePayload(input: unknown): SharePayload | { error: string } {
  if (typeof input !== "object" || input === null) return { error: "invalid payload" };
  const p = input as Record<string, unknown>;
  const title = typeof p.title === "string" ? p.title.trim().slice(0, MAX_TITLE) : "";
  const message = typeof p.message === "string" ? p.message.trim().slice(0, MAX_MESSAGE) : "";
  const from =
    typeof p.from === "string" && p.from.trim() ? p.from.trim().slice(0, MAX_FROM) : undefined;
  const trackIds = Array.isArray(p.trackIds)
    ? p.trackIds.filter((t): t is string => typeof t === "string" && Boolean(getTrack(t)))
    : [];
  if (trackIds.length === 0) return { error: "playlist is empty" };
  if (trackIds.length > MAX_TRACKS) return { error: "too many tracks" };
  return { title: title || "a playlist for you", message, from, trackIds };
}

function supabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

const FILE_STORE = path.join(process.cwd(), ".data", "shares.json");

async function readFileStore(): Promise<Record<string, ShareRecord>> {
  try {
    return JSON.parse(await fs.readFile(FILE_STORE, "utf8"));
  } catch {
    return {};
  }
}

async function writeFileStore(data: Record<string, ShareRecord>) {
  await fs.mkdir(path.dirname(FILE_STORE), { recursive: true });
  await fs.writeFile(FILE_STORE, JSON.stringify(data, null, 2));
}

export async function createShare(payload: SharePayload): Promise<ShareRecord> {
  const record: ShareRecord = {
    ...payload,
    shortId: shortId(),
    createdAt: new Date().toISOString(),
  };

  const sb = supabase();
  if (sb) {
    const { error } = await sb.from("shares").insert({
      short_id: record.shortId,
      title: record.title,
      message: record.message,
      sender: record.from ?? null,
      track_ids: record.trackIds,
      created_at: record.createdAt,
    });
    if (error) throw new Error(`Supabase insert failed: ${error.message}`);
    return record;
  }

  const store = await readFileStore();
  store[record.shortId] = record;
  await writeFileStore(store);
  return record;
}

export async function getShare(id: string): Promise<ShareRecord | null> {
  const sb = supabase();
  if (sb) {
    const { data, error } = await sb
      .from("shares")
      .select("short_id,title,message,sender,track_ids,created_at")
      .eq("short_id", id)
      .maybeSingle();
    if (error || !data) return null;
    return {
      shortId: data.short_id,
      title: data.title,
      message: data.message,
      from: data.sender ?? undefined,
      trackIds: data.track_ids,
      createdAt: data.created_at,
    };
  }

  const store = await readFileStore();
  return store[id] ?? null;
}
