"use client";

import { useState } from "react";

/**
 * The era's photographic backdrop — a static image served from
 * /public/backgrounds/<eraId>.jpg, blur-filled to full bleed.
 *
 * The source photos are small and every shape (portrait, square, wide),
 * so stretching one across the screen would pixelate it and crop her
 * face. Instead the photo is shown whole (object-contain) on top of a
 * heavily blurred cover copy of itself: the blur fills whatever the
 * photo's aspect ratio leaves empty and hides the low resolution. A
 * radial mask sized to the photo's contained box (computed from its
 * natural aspect ratio once it loads) melts the sharp layer into its
 * own glow, so there is never a hard rectangular edge no matter how the
 * image's shape differs from the screen's.
 *
 * If the file is missing this renders nothing and the gradient world
 * carries the scene alone.
 */
export function EraBackdrop({
  eraId,
  className = "",
}: {
  eraId: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [ratio, setRatio] = useState<number | null>(null);
  if (failed) return null;
  const src = `/backgrounds/${eraId}.jpg`;

  // rectangular feather over the photo's true edges: sides + a lighter
  // top fade (her face lives up there) + a deeper bottom fade into fog
  const feather =
    "linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%), " +
    "linear-gradient(to bottom, transparent 0%, black 9%, black 80%, transparent 100%)";
  // the contained photo's on-screen box: limited by width or by height,
  // whichever binds (the backdrop always spans ~the viewport)
  const maskW = ratio ? `min(100%, calc(100vh * ${ratio}))` : "100%";
  const maskH = ratio ? `min(100%, calc(100vw / ${ratio}))` : "100%";

  return (
    <div className={`relative h-full w-full overflow-hidden ${className}`} aria-hidden>
      {/* blurred fill — the photo's own colors washed across the screen */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        onError={() => setFailed(true)}
        className="absolute inset-0 h-full w-full scale-110 select-none object-cover blur-[42px] brightness-[0.96] saturate-[1.3]"
      />
      {/* the photo itself, whole and uncropped, feathered into the wash */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt=""
        draggable={false}
        onLoad={(e) => {
          const el = e.currentTarget;
          if (el.naturalWidth && el.naturalHeight) {
            setRatio(el.naturalWidth / el.naturalHeight);
          }
        }}
        className="absolute inset-0 h-full w-full select-none object-contain"
        style={
          ratio
            ? {
                maskImage: feather,
                maskSize: `${maskW} ${maskH}`,
                maskPosition: "center",
                maskRepeat: "no-repeat",
                maskComposite: "intersect",
                WebkitMaskImage: feather,
                WebkitMaskSize: `${maskW} ${maskH}`,
                WebkitMaskPosition: "center",
                WebkitMaskRepeat: "no-repeat",
                WebkitMaskComposite: "source-in",
              }
            : { opacity: 0 } // no unfeathered flash before the ratio is known
        }
      />
    </div>
  );
}
