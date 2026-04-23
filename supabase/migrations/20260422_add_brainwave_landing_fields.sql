alter table public.game_pages
add column if not exists landing_headline text;

alter table public.game_pages
add column if not exists play_notes jsonb not null default '[]'::jsonb;
