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

const TAKEDOWN_EMAIL =
  process.env.NEXT_PUBLIC_TAKEDOWN_EMAIL ?? "kyra18710@gmail.com";

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
  const reduced = usePrefersReducedMotion();

  const album = ALBUMS[current];
  const world = eraFor(album.eraId);

  return (
    <main className="fixed inset-0 overflow-hidden">
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
          unofficial, non-commercial fan project ·{" "}
          <a
            className="pointer-events-auto underline decoration-dotted underline-offset-2"
            href={`mailto:${TAKEDOWN_EMAIL}?subject=my%20fav%20is%20tay%20—%20takedown%20request`}
          >
            takedown requests honored
          </a>
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
          <div className="relative mb-1 h-[clamp(5.5rem,16vh,9rem)] px-4">
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
                <h1 className="era-title font-display mx-auto max-w-[94vw] truncate text-[clamp(2.4rem,6.5vw,4.8rem)] italic leading-[1.05]">
                  {world.label}
                </h1>
                <p className="mt-1 text-[11px] tracking-[0.35em] text-ink-soft uppercase">
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
