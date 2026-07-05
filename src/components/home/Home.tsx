"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import type { Album } from "@/lib/media/types";
import { ALBUMS } from "@/lib/discography";
import { eraFor } from "@/lib/eras";
import { useArt } from "@/lib/hooks/useArt";
import { usePrefersReducedMotion } from "@/lib/hooks/usePrefersReducedMotion";
import { Coverflow } from "@/components/carousel/Coverflow";
import { AlbumView } from "@/components/album/AlbumView";
import { PlaylistDock } from "@/components/dock/PlaylistDock";
import { FlightLayer } from "@/components/album/FlightLayer";
import { EraWorld } from "@/components/world/EraWorld";
import { TaylorHero } from "@/components/world/TaylorHero";
import { CelebrationIntro } from "@/components/intro/CelebrationIntro";

/**
 * The home experience: one fullscreen scene. The era world fills the
 * viewport (painted by <EraWorld/> in the root layout), giant Taylor
 * rises behind everything, and the Cover Flow floats in front of her —
 * covers are only the doors into each era.
 */
export function Home({ initialArt }: { initialArt: Record<string, string> }) {
  const clientArt = useArt(Object.keys(initialArt).length > 0);
  const art = useMemo(() => ({ ...clientArt, ...initialArt }), [clientArt, initialArt]);
  const [openAlbum, setOpenAlbum] = useState<Album | null>(null);
  const [current, setCurrent] = useState(0);
  const [showIntro, setShowIntro] = useState(true);
  const reduced = usePrefersReducedMotion();

  const album = ALBUMS[current];
  const world = eraFor(album.eraId);

  return (
    <main className="fixed inset-0 overflow-hidden">
      <AnimatePresence>
        {showIntro && <CelebrationIntro onCelebrate={() => setShowIntro(false)} />}
      </AnimatePresence>

      <EraWorld />
      <LayoutGroup>
        {/* Taylor — the heart of the scene, behind everything interactive */}
        <TaylorHero albumId={album.id} />

        {/* brand — fades away while an album is open */}
        <motion.header
          animate={{ opacity: openAlbum ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="pointer-events-none absolute left-6 top-5 z-30"
        >
          <p className="font-display text-xl italic text-ink drop-shadow-[0_1px_10px_rgba(0,0,0,0.15)]">
            my fav is tay
          </p>
          <p className="mt-0.5 text-[10px] tracking-[0.3em] text-ink-soft uppercase">
            a love letter in twelve worlds
          </p>
        </motion.header>

        {/* legal microline */}
        <motion.p
          animate={{ opacity: openAlbum ? 0 : 1 }}
          transition={{ duration: 0.5 }}
          className="absolute right-6 top-5 z-30 max-w-[46vw] text-right text-[9px] leading-snug text-ink-soft opacity-70"
        >
          unofficial, non-commercial fan project
        </motion.p>

        {/* the stage: era title + cover flow pinned to the lower third */}
        <motion.div
          animate={
            openAlbum
              ? { opacity: 0, y: 60, scale: 0.97 }
              : { opacity: 1, y: 0, scale: 1 }
          }
          transition={
            reduced ? { duration: 0 } : { type: "spring", stiffness: 140, damping: 22 }
          }
          className="absolute inset-x-0 bottom-0 z-20 pb-5 sm:pb-7"
        >
          <div
            className="relative z-10 h-[clamp(5.5rem,16vh,9rem)] px-4"
            style={{
              // The floating center cover can grow taller than the coverflow's
              // own box on short viewports (its size is width/vw-bound, the
              // box is height/vh-bound) — reserve enough clearance below the
              // title so it can never rise up into it.
              marginBottom:
                "max(0.75rem, calc((min(46vw,250px) * 1.16 - min(42vh,360px)) / 2 + 22px))",
            }}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={world.id}
                initial={
                  reduced ? { opacity: 0 } : { opacity: 0, y: 26, filter: "blur(8px)" }
                }
                animate={
                  reduced
                    ? { opacity: 1 }
                    : { opacity: 1, y: 0, filter: "blur(0px)" }
                }
                exit={
                  reduced ? { opacity: 0 } : { opacity: 0, y: -22, filter: "blur(10px)" }
                }
                transition={{ duration: reduced ? 0 : 0.8, ease: [0.3, 0.1, 0.2, 1] }}
                className="absolute inset-x-0 bottom-0 text-center"
              >
                {/* scrim so the title stays legible over bright or busy world backgrounds */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -inset-y-3 inset-x-[8%] -z-10 rounded-[32px]"
                  style={{
                    background:
                      "radial-gradient(ellipse 60% 100% at 50% 58%, rgba(0,0,0,0.34), transparent 75%)",
                  }}
                />
                <h1 className="era-title font-display relative mx-auto max-w-[94vw] truncate text-[clamp(2.4rem,min(6.5vw,8vh),4.8rem)] italic leading-[1.05]">
                  {world.label}
                </h1>
                <p className="relative mt-1.5 text-[11px] tracking-[0.35em] text-ink-soft uppercase [text-shadow:0_1px_8px_rgba(0,0,0,0.6)]">
                  {album.year} · {world.caption}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          <Coverflow
            albums={ALBUMS}
            art={art}
            active={!openAlbum}
            onSelect={setOpenAlbum}
            onCenterChange={setCurrent}
          />

          <p className="mt-3 hidden text-center text-[10px] tracking-[0.25em] text-ink-soft uppercase opacity-70 sm:block">
            drag · scroll · arrows — tap the cover to step inside
          </p>
        </motion.div>

        <AnimatePresence>
          {openAlbum && (
            <AlbumView
              album={openAlbum}
              coverUrl={art[openAlbum.id]}
              onClose={() => setOpenAlbum(null)}
            />
          )}
        </AnimatePresence>
      </LayoutGroup>

      <PlaylistDock />
      <FlightLayer />
    </main>
  );
}
