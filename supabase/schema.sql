-- my fav is tay — durable shares table
-- Run this in the Supabase SQL editor (or via supabase db push).

create table if not exists public.shares (
  short_id   text primary key,
  title      text not null default 'a playlist for you',
  message    text not null default '',
  sender     text,
  track_ids  jsonb not null,
  created_at timestamptz not null default now()
);

-- Shares are written only by the server (service-role key) and read only
-- by shortId through the server as well, so lock the table down entirely.
alter table public.shares enable row level security;
