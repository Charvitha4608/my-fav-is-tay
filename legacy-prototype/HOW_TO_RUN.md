# my fav is tay 💌 — How to Run on Your PC

A Taylor Swift playlist-gift web app. Single file, no install, no build step.

---

## Quickest way (10 seconds)

1. Unzip this folder anywhere (Desktop is fine).
2. Open the folder `my-fav-is-tay`.
3. Double-click **index.html** — it opens in your browser. That's it.

Real album artwork loads from the iTunes API, so it looks best **with
internet on**. Offline, the designed gradient covers show instead.

---

## Better way (local server — recommended)

Opening via double-click works, but a tiny local server behaves more like
a real website (and avoids any browser file:// quirks).

**If you have Python (Fedora has it by default):**
```bash
cd my-fav-is-tay
python3 -m http.server 8000
```
Then open http://localhost:8000 in your browser.

**If you prefer Node:**
```bash
cd my-fav-is-tay
npx serve .
```
Then open the URL it prints (usually http://localhost:3000).

**VS Code:** install the "Live Server" extension → right-click
index.html → "Open with Live Server".

---

## How to use the app

| Action | How |
|---|---|
| Browse eras | Swipe left/right (touch) · move cursor to screen edges or use ← → keys (desktop) |
| Open an album | Tap/click the centered album (or press Enter) |
| Add a song | Tap a song card — it hearts and flies into the dock |
| Play a song | Tap "Spotify" or "YT" on any card |
| Build the gift | Tap the dock (bottom bar) → "Create gift" → name it + write a message |
| Preview the gift | "Wrap it up 🎀" → tap the envelope to unwrap (sparkles + typed message) |

Your selections auto-save in the browser, so refreshing keeps your playlist.

---

## What's inside

```
my-fav-is-tay/
├── index.html              ← THE app (Lavender Haze final version)
├── HOW_TO_RUN.md           ← this file
└── alternates/
    ├── v3-dark-space.html      (earlier dark cinematic version)
    └── v2-light-lavender.html  (earlier light pastel version)
```

Everything is one self-contained HTML file — all CSS and JavaScript inline.
Fonts load from Google Fonts and artwork from Apple's iTunes API at runtime;
nothing copyrighted is stored in the files.

---

## Notes & troubleshooting

- **Album covers not showing?** Check your internet connection — artwork is
  fetched live from itunes.apple.com. The app still works fully without it.
- **Animations feel heavy?** The particle river caps itself based on screen
  size, and fully respects your OS "reduce motion" setting.
- **Want to edit songs/colors?** Open index.html in VS Code — the `ALBUMS`
  array near the top of the `<script>` holds every era: colors (`g`, `glow`),
  and tracklists (`s`). Durations are approximate; the future Next.js version
  pulls exact data from the Spotify API.

---

## Legal note (important since you may publish this)

This is an unofficial, non-commercial fan project. It never hosts audio,
video, or images — playback is via official Spotify/YouTube links and
artwork is loaded live from Apple's public iTunes API. If you publish it,
keep it ad-free and keep the footer disclaimer intact.

Made with 🤍 — now go make someone's day.
