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

-- RLS alone doesn't grant access: Postgres checks table-level privileges
-- before RLS policies are evaluated, and this project's public schema
-- doesn't auto-grant them to service_role. Without this, every query from
-- the server (which uses service_role) fails with "permission denied for
-- table shares", even though service_role bypasses the RLS policy itself.
grant all on public.shares to service_role;
