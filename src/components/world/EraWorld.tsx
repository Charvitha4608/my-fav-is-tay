"use client";

import { AnimatePresence, motion, useTransform } from "framer-motion";
import { useEraStore } from "@/store/era";
import { eraFor } from "@/lib/eras";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { useMouseParallax } from "@/lib/hooks/useMouseParallax";
import { ParticleField } from "./ParticleField";
import { EraBackdrop } from "./EraBackdrop";

/**
 * The fullscreen era WORLD behind everything. Layers, bottom to top:
 *
 *   1. sky gradient           — crossfades + camera-pans between eras
 *   2. aurora glow blobs      — the era's lighting, drifting slowly
 *   3. god rays / stage light — when the era calls for them
 *   4. particle canvas        — persistent, morphs between systems
 *   5. color grading wash     — cinematic per-era grade
 *   6. vignette + film grain  — depth and texture
 *
 * The whole scene leans gently against the pointer (clouds slowest).
 */

const GRAIN =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.6'/></svg>`,
  );

const CLOUD_CLASSES = ["cloud-a", "cloud-b", "cloud-c"];

function Rays({ color, opacity }: { color: string; opacity: number }) {
  // A fan of five soft beams falling from the top of the frame.
  return (
    <div className="absolute inset-x-0 -top-[10%] h-[130%] overflow-hidden">
      {[-26, -13, 0, 13, 26].map((angle, i) => (
        <div
          key={angle}
          className="light-ray absolute left-1/2 top-0 h-full w-[16vw] min-w-[140px]"
          style={
            {
              "--ray-angle": `${angle}deg`,
              "--ray-dur": `${8 + i * 1.7}s`,
              marginLeft: "-8vw",
              background: `linear-gradient(180deg, rgba(${color},${opacity}) 0%, rgba(${color},0) 72%)`,
              filter: "blur(18px)",
              mixBlendMode: "screen",
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function EraWorld() {
  const eraId = useEraStore((s) => s.eraId);
  const direction = useEraStore((s) => s.direction);
  const world = eraFor(eraId);
  const reduced = usePrefersReducedMotion();
  const { px, py } = useMouseParallax();

  // clouds/aurora barely move; rays even less
  const cloudX = useTransform(px, (v) => v * -18);
  const cloudY = useTransform(py, (v) => v * -10);
  const rayX = useTransform(px, (v) => v * -7);

  const enter = reduced
    ? { opacity: 1, x: 0, scale: 1 }
    : { opacity: 1, x: 0, scale: 1 };
  const initial = reduced
    ? { opacity: 0 }
    : { opacity: 0, x: direction * 70, scale: 1.07 };
  const exit = reduced
    ? { opacity: 0 }
    : { opacity: 0, x: direction * -50, scale: 1.02 };

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {/* 1–3: sky + lighting, crossfading between worlds like a camera move */}
      <AnimatePresence initial={false}>
        <motion.div
          key={world.id}
          className="absolute inset-[-4%]"
          initial={initial}
          animate={enter}
          exit={exit}
          transition={{ duration: reduced ? 0 : 1.15, ease: [0.32, 0.08, 0.18, 1] }}
          style={{ background: world.sky, willChange: "transform, opacity" }}
        >
          {/* the era's photographic backdrop, dissolved into the sky.
              It blur-fills internally (whole photo over its own glow), so
              here it only needs to sit translucent under the grade. */}
          <div className="absolute inset-0 overflow-hidden">
            <EraBackdrop eraId={world.id} className="opacity-65" />
            {/* seat the lower third so the coverflow + title sit on calm ground */}
            <div
              className="absolute inset-0"
              style={{
                background: world.dark
                  ? "linear-gradient(to top, rgba(0,0,0,0.42), transparent 48%)"
                  : "linear-gradient(to top, rgba(255,255,255,0.38), transparent 48%)",
              }}
            />
          </div>

          {/* aurora lighting */}
          <motion.div className="absolute inset-0" style={{ x: cloudX, y: cloudY }}>
            {world.aurora.map((b, i) => (
              <div
                key={i}
                className={`absolute ${CLOUD_CLASSES[i % CLOUD_CLASSES.length]}`}
                style={{
                  left: b.x,
                  top: b.y,
                  width: b.size,
                  height: b.size,
                  marginLeft: `calc(${b.size} / -2)`,
                  marginTop: `calc(${b.size} / -2)`,
                  background: `radial-gradient(circle, ${b.color} 0%, transparent 68%)`,
                  filter: `blur(${b.blur ?? 30}px)`,
                  mixBlendMode: "screen",
                }}
              />
            ))}
          </motion.div>

          {world.rays && (
            <motion.div className="absolute inset-0" style={{ x: rayX }}>
              <Rays color={world.rays.color} opacity={world.rays.opacity} />
            </motion.div>
          )}

          {/* 5: cinematic grade, tied to this world's layer so it crossfades too */}
          <div
            className="absolute inset-0"
            style={{
              background: world.grade.background,
              mixBlendMode: world.grade.blend as React.CSSProperties["mixBlendMode"],
              opacity: world.grade.opacity,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* 4: the era's atmosphere — persistent canvas, morphs between systems */}
      <ParticleField />

      {/* 6: vignette + grain */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: world.vignette }}
        transition={{ duration: 1.1 }}
        style={{
          background:
            "radial-gradient(ellipse 72% 62% at 50% 46%, transparent 55%, rgba(0,0,0,0.85) 130%)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundImage: `url("${GRAIN}")`, opacity: 0.05 }}
      />
    </div>
  );
}
