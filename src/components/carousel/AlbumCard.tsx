"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { Album } from "@/lib/media/types";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/**
 * One cover in the flow. Pure Cover Flow material: the artwork, a soft
 * floor reflection beneath it, and — when centered — the era's glow and a
 * weightless float. Taylor never lives inside this card; she's the giant
 * figure behind the whole carousel.
 */

export function CoverArt({
  album,
  coverUrl,
  className = "",
}: {
  album: Album;
  coverUrl?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (coverUrl && !failed) {
    return (
      // Official artwork hot-linked from the catalog CDN — never rehosted.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={coverUrl}
        alt={`${album.title} album cover`}
        loading="lazy"
        draggable={false}
        onError={() => setFailed(true)}
        className={`h-full w-full select-none object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`flex h-full w-full flex-col items-center justify-center gap-1 bg-gradient-to-br from-[var(--era-accent-soft)] via-white/60 to-[var(--era-accent-soft)] p-4 text-center ${className}`}
    >
      <span className="font-display text-lg italic leading-tight text-[#3a2a4a]">
        {album.title}
      </span>
      <span className="text-xs text-[#6a5580]">{album.year}</span>
    </div>
  );
}

interface AlbumCardProps {
  album: Album;
  coverUrl?: string;
  isCenter: boolean;
  onSelect: () => void;
  onCenterRequest: () => void;
}

export function AlbumCard({
  album,
  coverUrl,
  isCenter,
  onSelect,
  onCenterRequest,
}: AlbumCardProps) {
  const reduced = usePrefersReducedMotion();

  return (
    <button
      type="button"
      aria-label={`${album.title} (${album.year})${isCenter ? " — open tracklist" : ""}`}
      onClick={() => (isCenter ? onSelect() : onCenterRequest())}
      onFocus={onCenterRequest}
      className="group relative block h-full w-full cursor-pointer [transform-style:preserve-3d]"
    >
      <div className={isCenter && !reduced ? "center-float h-full w-full" : "h-full w-full"}>
        {/* the cover */}
        <motion.div
          layoutId={`cover-${album.id}`}
          className="relative h-full w-full overflow-hidden rounded-[10px]"
          style={{
            boxShadow: isCenter
              ? "0 24px 70px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.22), 0 0 60px rgba(var(--era-accent-rgb),0.5)"
              : "0 16px 44px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.1)",
            transition: "box-shadow 700ms ease",
          }}
        >
          <CoverArt album={album} coverUrl={coverUrl} />
          {/* glass sheen sweeping on hover */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/25 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </motion.div>

        {/* floor reflection */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-full h-[52%] w-full overflow-hidden rounded-[10px]"
          style={{
            transform: "scaleY(-1) translateY(-4px)",
            maskImage:
              "linear-gradient(to top, rgba(0,0,0,0.34) 0%, transparent 78%)",
            WebkitMaskImage:
              "linear-gradient(to top, rgba(0,0,0,0.34) 0%, transparent 78%)",
            opacity: isCenter ? 0.6 : 0.4,
            filter: "blur(1px)",
            transition: "opacity 700ms ease",
          }}
        >
          <div className="aspect-square w-full">
            <CoverArt album={album} coverUrl={coverUrl} />
          </div>
        </div>

        {/* pool of era light under the centered cover */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-full h-[36%] w-[130%] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse 50% 42% at 50% 30%, rgba(var(--era-accent-rgb),0.4), transparent 70%)",
            opacity: isCenter ? 1 : 0,
            transition: "opacity 900ms ease",
          }}
        />
      </div>
    </button>
  );
}
