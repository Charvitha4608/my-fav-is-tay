# my fav is tay 💌

A dreamy, pastel Taylor Swift playlist builder. Browse the discography, hand-pick songs, and share them as a beautiful link that opens like an animated gift.

**Live:** [my-fav-is-tay.vercel.app](https://my-fav-is-tay.vercel.app/)

> An unofficial, non-commercial fan project. Not affiliated with, endorsed by, or sponsored by Taylor Swift, her management, or her labels. All music, artwork, and trademarks belong to their respective owners.

## Features

- 🎠 Era carousel with a cutout reveal and per-era accent colors
- 🎵 Pick songs from any album into a draggable playlist dock
- 💌 Share your picks as a durable link that opens as an animated gift
- 🎧 Spotify embeds and deep links for every track
- ♿ Reduced-motion support throughout

## Stack

- **Next.js (App Router)** + **TypeScript**
- **Tailwind CSS v4** — pastel-sky design system
- **Framer Motion** — cutout reveals, shared-layout transitions, gift animations
- **Zustand** + **dnd-kit** — playlist state and drag-to-reorder
- **Supabase / Postgres** — durable share links
- Deployed on **Vercel**

## Running locally

```bash
npm install
npm run dev   # http://localhost:3000
```

Works with zero configuration — album art falls back to the iTunes Search API and shares are stored in a local file. Optional environment variables:

| Variable | What it enables |
|---|---|
| `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` | Official Spotify album art + track embeds |
| `NEXT_PUBLIC_SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` | Durable shares in Postgres (run `supabase/schema.sql`) |
| `NEXT_PUBLIC_SITE_URL` | Absolute share links |
