const TAKEDOWN_EMAIL =
  process.env.NEXT_PUBLIC_TAKEDOWN_EMAIL ?? "kyra18710@gmail.com";

export function Footer() {
  return (
    <footer className="relative z-10 mx-auto w-full max-w-3xl px-6 pb-6 pt-10 text-center text-[11px] leading-relaxed text-ink-soft">
      <p>
        An unofficial, non-commercial fan project. Not affiliated with, endorsed by, or
        sponsored by Taylor Swift, her management, or her labels. All music, artwork,
        imagery, and trademarks belong to their respective owners.
      </p>
      <p className="mt-2">
        Artwork served from official catalogs · playback via official Spotify &amp; YouTube ·{" "}
        <a
          className="underline decoration-dotted underline-offset-2 hover:text-ink"
          href={`mailto:${TAKEDOWN_EMAIL}?subject=my%20fav%20is%20tay%20—%20takedown%20request`}
        >
          takedown requests honored: {TAKEDOWN_EMAIL}
        </a>
      </p>
    </footer>
  );
}
