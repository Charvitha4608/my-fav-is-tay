"use client";

import { useState } from "react";

/**
 * The era's photographic backdrop — a static full-bleed image served from
 * /public/backgrounds/<eraId>.jpg. Static files need no runtime probing or
 * segmentation, so they show reliably in production; if a file is missing
 * this renders nothing and the gradient world carries the scene alone.
 */
export function EraBackdrop({
  eraId,
  className = "",
}: {
  eraId: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/backgrounds/${eraId}.jpg`}
      alt=""
      aria-hidden
      draggable={false}
      onError={() => setFailed(true)}
      className={`h-full w-full select-none object-cover ${className}`}
    />
  );
}
