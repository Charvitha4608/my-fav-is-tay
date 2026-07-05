# my fav is tay 💌 — how to run

A personal, non-commercial Taylor Swift fan gift. Twelve eras, each with Taylor
floating behind a 3D album coverflow, her own backdrop, and her own particle
effect. Pick songs from any album, add a note, and share a link that opens as a
little gift.

## ▶️ The easy way (recommended — full experience)

The background-removal (the figure cutouts) and the live album art need the page
to be served over `http://`, not opened straight off the disk. It's one command.

1. Make sure you have Python (most computers do).
2. Open a terminal **in this folder** and run:

   ```
   python3 -m http.server 8000
   ```

   (On Windows, if that doesn't work, try `py -m http.server 8000`.)

3. Open your browser to:  **http://localhost:8000**

That's it. Leave the terminal open while you use it.

### First load takes ~30–60 seconds
The very first time, the app "peels the stickers" — it removes the backgrounds
from all twelve photos right in your browser and caches them. After that, every
load is instant. You'll see a little progress bar while it works.

> Needs an internet connection on first run (to fetch the cutout tool and the
> official album covers). Everything is cached afterward.

## 🖱️ The lazy way (quick peek)

You can also just double-click `index.html`. It will open and mostly work —
backdrops, carousel, album views, playlist, and sharing all run — but some
browsers block the in-browser cutout tool on double-clicked files, so Taylor may
appear as a soft-edged photo instead of a clean cutout. Use the server method
above for the real thing.

## 💾 Want picture-perfect cutouts?

The in-browser removal is good, but if you want flawless edges (the star-crown on
Showgirl, the seated Midnights shot, etc.), you can drop in your own:

1. Run any of the twelve `assets/figures-raw/<name>.jpg` photos through a remover
   like **remove.bg** (or Photoshop).
2. Save each result as a transparent **PNG** into the `assets/figures/` folder,
   using the exact same name: `debut.png`, `fearless.png`, `speaknow.png`,
   `red.png`, `1989.png`, `reputation.png`, `lover.png`, `folklore.png`,
   `evermore.png`, `midnights.png`, `ttpd.png`, `showgirl.png`.

The app automatically prefers those over its own removal. No code changes needed.

## A few honest notes

- **Play links**: each song's Spotify and YouTube buttons open a *search* for that
  song, so nothing ever breaks or points to the wrong thing. (The full Next.js
  version can embed exact Spotify tracks with real previews once it's wired to a
  Spotify account.)
- **Track times** are approximate placeholders. Exact durations also come from the
  Spotify version.
- **Tracklists** are the standard editions of each album — not every vault track.
  You can add more inside the `ERAS` list near the top of `index.html`.
- **Sharing**: in this self-contained version the whole gift travels *inside the
  link* (no server or database needed), so a shared link works for anyone, forever.

## Legal
Unofficial, non-commercial fan project. Not affiliated with, endorsed by, or
sponsored by Taylor Swift, her team, or her labels. All music, artwork, images,
and trademarks belong to their respective owners. Album covers are fetched live
from the iTunes Search API and are not redistributed in this package.
