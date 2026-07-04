"use client";

import { useEffect, useState } from "react";

/**
 * Resolves the transparent-PNG Taylor cutout for an era, if the owner has
 * provided one at /public/cutouts/<albumId>.png. Missing cutouts resolve
 * to null and the UI gracefully shows only the album cover — never a
 * broken image.
 */

const status = new Map<string, string | null>();
const listeners = new Map<string, Set<(url: string | null) => void>>();

function probe(albumId: string) {
  const url = `/cutouts/${albumId}.png`;
  const img = new Image();
  img.onload = () => settle(albumId, url);
  img.onerror = () => settle(albumId, null);
  img.src = url;
}

function settle(albumId: string, url: string | null) {
  status.set(albumId, url);
  listeners.get(albumId)?.forEach((fn) => fn(url));
  listeners.delete(albumId);
}

export function useCutout(albumId: string): string | null {
  const [url, setUrl] = useState<string | null>(status.get(albumId) ?? null);

  useEffect(() => {
    if (status.has(albumId)) {
      setUrl(status.get(albumId) ?? null);
      return;
    }
    let set = listeners.get(albumId);
    if (!set) {
      set = new Set();
      listeners.set(albumId, set);
      probe(albumId);
    }
    set.add(setUrl);
    return () => {
      listeners.get(albumId)?.delete(setUrl);
    };
  }, [albumId]);

  return url;
}
