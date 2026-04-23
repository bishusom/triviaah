-- Add OG image support to shared game pages content.

alter table if exists public.game_pages
  add column if not exists og_image text;
