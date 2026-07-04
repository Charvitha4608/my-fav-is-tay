"use client";

import { useEffect, useState } from "react";

let cached: Record<string, string> | null = null;
let inflight: Promise<Record<string, string>> | null = null;

async function fetchArt(): Promise<Record<string, string>> {
  if (cached) return cached;
  inflight ??= fetch("/api/art")
    .then((r) => (r.ok ? r.json() : {}))
    .then((map: Record<string, string>) => (cached = map))
    .catch(() => ({}) as Record<string, string>);
  return inflight;
}

/** Official album-art URLs, keyed by album id. Empty until resolved. */
export function useArt(skip = false): Record<string, string> {
  const [art, setArt] = useState<Record<string, string>>(cached ?? {});
  useEffect(() => {
    if (skip) return;
    let alive = true;
    fetchArt().then((map) => alive && setArt(map));
    return () => {
      alive = false;
    };
  }, [skip]);
  return art;
}
