"use client";

import { AnimatePresence, motion, useTransform } from "framer-motion";
import { useCutout } from "@/lib/hooks/useCutout";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useMouseParallax } from "@/lib/hooks/useMouseParallax";

/**
 * Taylor herself — the emotional center of every era. A giant transparent
 * cutout (~70% of the viewport) rising out of the era's atmosphere:
 * bottom-masked so she dissolves into the fog instead of ending in an
 * edge, glowing in the era's accent, breathing slowly, leaning gently
 * toward the pointer. Changing era dissolves her into the clouds while
 * the next era's Taylor emerges.
 *
 * Cutouts live at /public/cutouts/<albumId>.png (see the README there);
 * eras without one simply let the world carry the scene.
 */
export function TaylorHero({ albumId }: { albumId: string }) {
  const cutout = useCutout(albumId);
  const reduced = usePrefersReducedMotion();
  const { px, py } = useMouseParallax();

  // she sways a little more than the clouds, far less than the albums
  const heroX = useTransform(px, (v) => v * -16);
  const heroY = useTransform(py, (v) => v * -8);

  return (
    <div className="pointer-events-none fixed inset-0 z-[5] overflow-hidden" aria-hidden>
      <motion.div className="absolute inset-0" style={{ x: heroX, y: heroY }}>
        <AnimatePresence initial={false}>
          {cutout && (
            <motion.div
              key={albumId}
              className="absolute bottom-[-2vh] left-1/2 w-[min(92vw,60vh)] -translate-x-1/2 sm:w-[min(58vw,72vh)]"
              initial={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: 90, scale: 0.96, filter: "blur(18px)" }
              }
              animate={
                reduced
                  ? { opacity: 1 }
                  : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
              }
              exit={
                reduced
                  ? { opacity: 0 }
                  : { opacity: 0, y: 60, scale: 0.98, filter: "blur(20px)" }
              }
              transition={{ duration: reduced ? 0 : 1.15, ease: [0.3, 0.1, 0.18, 1] }}
              style={{ willChange: "transform, opacity, filter" }}
            >
              <div className={reduced ? "" : "hero-sway"}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cutout}
                  alt=""
                  draggable={false}
                  className="w-full select-none"
                  style={{
                    // she melts into the fog — never a hard bottom edge
                    maskImage:
                      "linear-gradient(to bottom, black 0%, black 74%, transparent 97%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 0%, black 74%, transparent 97%)",
                    filter:
                      "drop-shadow(0 0 60px rgba(var(--era-accent-rgb),0.38)) drop-shadow(0 30px 50px rgba(0,0,0,0.35))",
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* foreground haze her feet disappear into */}
      <div
        className="absolute inset-x-0 bottom-0 h-[34vh]"
        style={{
          background:
            "linear-gradient(to top, rgba(var(--era-accent-rgb),0.10) 0%, transparent 60%)",
        }}
      />
    </div>
  );
}
