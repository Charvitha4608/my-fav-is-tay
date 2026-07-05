"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Album } from "@/lib/media/types";
import { AlbumCard } from "./AlbumCard";
import { useEraStore } from "@/store/era";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";

/**
 * Classic Apple Cover Flow, floating in front of the era world:
 *  - the centered cover faces the viewer, larger, glowing, hovering
 *  - side covers rotate hard in 3D, overlap, dim with depth, reflect
 *  - drag anywhere (mouse or touch) with momentum, wheel with inertia,
 *    edge-of-screen glide, arrow keys, click a side cover to travel
 * Transforms are written straight to the DOM from a rAF loop; React only
 * re-renders when the *rounded* center index changes — that re-render is
 * what transforms the entire world.
 */

const EDGE_ZONE = 0.11;
const GLIDE_SPEED = 1.7;
const CLAMP = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

interface CoverflowProps {
  albums: Album[];
  art: Record<string, string>;
  onSelect: (album: Album) => void;
  /** false while an album is open — input freezes */
  active: boolean;
  /** notified whenever the centered index changes */
  onCenterChange?: (index: number) => void;
}

export function Coverflow({ albums, art, onSelect, active, onCenterChange }: CoverflowProps) {
  const [current, setCurrent] = useState(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const setEra = useEraStore((s) => s.setEra);
  const reduced = usePrefersReducedMotion();

  const pos = useRef(0);
  const target = useRef(0);
  const edgeDir = useRef(0);
  const lastWheel = useRef(0);
  const drag = useRef<{
    startX: number;
    startPos: number;
    velocity: number;
    lastX: number;
    lastT: number;
    dist: number;
  } | null>(null);
  const dragDist = useRef(0); // distance of the most recent drag — gates clicks
  const activeRef = useRef(active);
  activeRef.current = active;
  // -1 so the very first frame syncs the world to the centered album
  const currentRef = useRef(-1);

  const goTo = useCallback(
    (i: number) => {
      target.current = CLAMP(i, 0, albums.length - 1);
    },
    [albums.length],
  );

  // rAF layout loop — classic coverflow geometry
  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const layout = () => {
      const vw = window.innerWidth;
      const centerGap = Math.min(250, vw * 0.24); // first step away from center
      const side = Math.min(105, vw * 0.105); // overlap spacing beyond that

      for (let i = 0; i < albums.length; i++) {
        const el = cardRefs.current[i];
        if (!el) continue;
        const off = i - pos.current;
        const abs = Math.abs(off);
        if (abs > 4.2) {
          el.style.visibility = "hidden";
          continue;
        }
        el.style.visibility = "visible";
        const dir = Math.sign(off);
        const tx = dir * (Math.min(abs, 1) * centerGap + Math.max(abs - 1, 0) * side);
        const rotate = -CLAMP(off, -1, 1) * 52;
        const z = abs < 1 ? -abs * 170 : -170 - (abs - 1) * 55;
        const scale = 1.16 - Math.min(abs * 0.16, 0.34);
        el.style.transform = `translate(-50%, -50%) translateX(${tx}px) translateZ(${z}px) rotateY(${rotate}deg) scale(${scale})`;
        el.style.zIndex = String(200 - Math.round(abs * 10));
        el.style.filter = `brightness(${1 - Math.min(abs * 0.26, 0.6)})`;
        el.style.opacity = String(1 - Math.min(Math.max(abs - 2.4, 0) * 0.55, 0.95));
      }
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (activeRef.current && !drag.current && edgeDir.current !== 0) {
        target.current = CLAMP(
          target.current + edgeDir.current * GLIDE_SPEED * dt,
          0,
          albums.length - 1,
        );
      }

      if (!drag.current) {
        const delta = target.current - pos.current;
        pos.current =
          Math.abs(delta) < 0.0015
            ? target.current
            : pos.current + delta * Math.min(1, dt * (reduced ? 30 : 6.5));
      }

      const rounded = CLAMP(Math.round(pos.current), 0, albums.length - 1);
      if (rounded !== currentRef.current) {
        const dirTravel = rounded >= currentRef.current ? 1 : -1;
        currentRef.current = rounded;
        setCurrent(rounded);
        setEra(albums[rounded].eraId, dirTravel);
        onCenterChange?.(rounded);
      }

      layout();
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [albums, setEra, reduced, onCenterChange]);

  // edge glide for fine pointers
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const onMove = (e: PointerEvent) => {
      if (drag.current) return;
      const x = e.clientX / window.innerWidth;
      if (x < EDGE_ZONE) edgeDir.current = -(1 - x / EDGE_ZONE);
      else if (x > 1 - EDGE_ZONE) edgeDir.current = (x - (1 - EDGE_ZONE)) / EDGE_ZONE;
      else edgeDir.current = 0;
    };
    const onLeave = () => {
      edgeDir.current = 0;
      target.current = CLAMP(Math.round(target.current), 0, albums.length - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [albums.length]);

  // settle to the nearest cover when input goes quiet
  useEffect(() => {
    const id = setInterval(() => {
      if (
        edgeDir.current === 0 &&
        !drag.current &&
        performance.now() - lastWheel.current > 260
      ) {
        target.current = CLAMP(Math.round(target.current), 0, albums.length - 1);
      }
    }, 300);
    return () => clearInterval(id);
  }, [albums.length]);

  // drag with momentum — mouse and touch alike
  const spacingNow = () => Math.min(250, window.innerWidth * 0.24);
  const onPointerDown = (e: React.PointerEvent) => {
    if (!activeRef.current) return;
    drag.current = {
      startX: e.clientX,
      startPos: pos.current,
      velocity: 0,
      lastX: e.clientX,
      lastT: performance.now(),
      dist: 0,
    };
    dragDist.current = 0;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d) return;
    const spacing = spacingNow();
    const now = performance.now();
    const dtMs = Math.max(now - d.lastT, 1);
    const inst = (-(e.clientX - d.lastX) / spacing) * (1000 / dtMs);
    d.velocity = d.velocity * 0.75 + inst * 0.25;
    d.dist += Math.abs(e.clientX - d.lastX);
    dragDist.current = d.dist;
    d.lastX = e.clientX;
    d.lastT = now;
    pos.current = CLAMP(
      d.startPos - (e.clientX - d.startX) / spacing,
      -0.4,
      albums.length - 0.6,
    );
    target.current = pos.current;
  };
  const endDrag = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    target.current = CLAMP(
      Math.round(pos.current + d.velocity * 0.22),
      0,
      albums.length - 1,
    );
  };

  const onWheel = (e: React.WheelEvent) => {
    if (!activeRef.current) return;
    lastWheel.current = performance.now();
    target.current = CLAMP(
      target.current + (e.deltaY + e.deltaX) * 0.0021,
      0,
      albums.length - 1,
    );
  };

  // arrow keys travel between eras from anywhere on the page
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!activeRef.current) return;
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goTo(Math.round(target.current) + 1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(Math.round(target.current) - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo]);

  return (
    <section
      aria-label="Taylor Swift discography"
      aria-roledescription="carousel"
      className="relative select-none"
    >
      <div
        className="relative h-[min(42vh,360px)] cursor-grab touch-pan-y active:cursor-grabbing"
        style={{ perspective: "1300px" }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onPointerLeave={endDrag}
        onWheel={onWheel}
      >
        <div
          className="absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {albums.map((a, i) => (
            <div
              key={a.id}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              className="absolute left-1/2 top-1/2 aspect-square w-[min(46vw,250px)] will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              <AlbumCard
                album={a}
                coverUrl={art[a.id]}
                isCenter={i === current}
                onSelect={() => {
                  if (dragDist.current > 10) return;
                  onSelect(a);
                }}
                onCenterRequest={() => {
                  if (dragDist.current > 10) return;
                  goTo(i);
                }}
              />
            </div>
          ))}
        </div>

        {/* One flat hit target over the centered cover. The 3D-rotated
            neighbours can win browser hit-testing over the cover's edges,
            so this guarantees a tap ANYWHERE on the center cover opens the
            album — mouse and touch alike. Drags still bubble to the
            container and are gated by dragDist like every other click. */}
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          className="absolute left-1/2 top-1/2 z-[300] aspect-square w-[min(46vw,250px)] cursor-pointer"
          style={{ transform: "translate(-50%, -50%) scale(1.16)" }}
          onClick={() => {
            if (!activeRef.current || dragDist.current > 10) return;
            onSelect(albums[currentRef.current === -1 ? 0 : currentRef.current]);
          }}
        />
      </div>

      {/* slim era timeline */}
      <div
        className="mt-3 flex justify-center gap-[7px]"
        role="tablist"
        aria-label="Albums"
      >
        {albums.map((a, i) => (
          <button
            key={a.id}
            role="tab"
            aria-selected={i === current}
            aria-label={a.title}
            onClick={() => goTo(i)}
            className="h-[3px] rounded-full transition-all duration-500"
            style={{
              width: i === current ? 34 : 14,
              background:
                i === current
                  ? "var(--era-accent)"
                  : "rgba(var(--era-ink-rgb),0.28)",
              boxShadow:
                i === current
                  ? "0 0 10px rgba(var(--era-accent-rgb),0.8)"
                  : "none",
            }}
          />
        ))}
      </div>
    </section>
  );
}
