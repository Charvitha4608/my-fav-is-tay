# my fav is tay 💌

A dreamy, pastel Taylor Swift song-sharing experience and playlist
builder — a heartfelt, **non-commercial fan gift**. Browse the
discography, hand-pick songs, and share them as a beautiful, durable link
that opens as an animated gift.

> An unofficial, non-commercial fan project. Not affiliated with, endorsed
> by, or sponsored by Taylor Swift, her management, or her labels. All
> music, artwork, imagery, and trademarks belong to their respective
> owners.

## Stack

- **Next.js (App Router) + TypeScript**
- **Tailwind CSS v4** for the pastel-sky design system
- **Framer Motion** for the cutout reveal, shared-layout transitions, and gift animations
- **Zustand** for the playlist builder + era accent state
- **dnd-kit** for drag-to-reorder in the dock
- **Supabase / Postgres** for durable share links (falls back to a local file store in dev)
- Deploys to **Vercel**

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in what you have (all optional for dev)
npm run dev                  # http://localhost:3000
```

Everything works with **zero configuration**: album art falls back to the
iTunes Search API and shares are written to a local `.data/shares.json`.
Add credentials to unlock the production behavior:

| Variable | What it enables |
|---|---|
| `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` | Official Spotify album art + real track embeds/deep links (Client Credentials flow, server-side only) |
| `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Durable shares in Postgres (run `supabase/schema.sql` first) |
| `NEXT_PUBLIC_SITE_URL` | Absolute share links |
| `NEXT_PUBLIC_TAKEDOWN_EMAIL` | Footer takedown contact |

## The Taylor cutouts

The signature interaction is a transparent-PNG "sticker" of Taylor that
rises from behind each album cover. Drop licensed/original art into
[`public/cutouts/`](public/cutouts/README.md) — one PNG per era. Missing
cutouts degrade gracefully to the album cover alone.

## Architecture notes

- **Media is provider-agnostic** — Spotify and YouTube sit behind a
  `MediaProvider` interface ([`src/lib/media/`](src/lib/media/)); the UI
  never talks to a provider directly.
- **Album art is never rehosted** — only CDN *URLs* are cached at the API
  layer ([`src/lib/art.ts`](src/lib/art.ts)); images are served fresh.
- **Spotify tokens** are cached in memory (~1h) and refreshed on demand,
  server-side only ([`src/lib/spotify/server.ts`](src/lib/spotify/server.ts)).
- **Reduced motion** is respected everywhere (canvas, cutouts, hearts, typing).

## Legal & respectful publishing

No ads, no sales. Always-visible disclaimer + takedown contact in the
footer; a cookie/consent notice for embedded players. Don't put Taylor's
name in your domain (`myfavistay.com` is fine fan expression). Use Spotify
embeds/API for art and licensed/original illustrations for cutouts.
