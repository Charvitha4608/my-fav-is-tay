import Link from "next/link";
import { EraWorld } from "@/components/world/EraWorld";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-6 text-center">
      <EraWorld />
      <div>
        <p className="text-5xl" aria-hidden>
          🕊️
        </p>
        <h1 className="font-display mt-4 text-3xl italic text-ink">
          this letter drifted away with the clouds
        </h1>
        <p className="mt-2 text-sm text-ink-soft">
          the link may be mistyped, or the gift was never sealed.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-full px-5 py-2 text-sm font-semibold text-white shadow-lg"
          style={{ background: "var(--era-accent)" }}
        >
          make someone a playlist 💌
        </Link>
      </div>
    </main>
  );
}
