-- Cryptodle puzzles schema
-- Expected usage:
-- - daily_puzzles.category = 'cryptodle'
-- - cryptodle_puzzles stores the source text, hints, and metadata
-- - random_cryptodle_puzzles is a convenience view used by the app helper

create extension if not exists pgcrypto;

create table if not exists public.cryptodle_puzzles (
  id uuid primary key default gen_random_uuid(),
  quote_text text not null,
  author text not null default 'Anonymous',
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  hints text[] not null default '{}'::text[],
  explanation text,
  source text,
  category text not null default 'cryptodle',
  times_used integer not null default 0,
  last_used date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cryptodle_puzzles_difficulty_idx
  on public.cryptodle_puzzles (difficulty);

create index if not exists cryptodle_puzzles_category_idx
  on public.cryptodle_puzzles (category);

create index if not exists cryptodle_puzzles_times_used_idx
  on public.cryptodle_puzzles (times_used);

create or replace function public.set_cryptodle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cryptodle_puzzles_set_updated_at on public.cryptodle_puzzles;

create trigger cryptodle_puzzles_set_updated_at
before update on public.cryptodle_puzzles
for each row
execute function public.set_cryptodle_updated_at();

create or replace view public.random_cryptodle_puzzles as
select
  id,
  quote_text,
  author,
  difficulty,
  hints,
  explanation,
  source,
  category,
  times_used,
  last_used,
  created_at,
  updated_at
from public.cryptodle_puzzles
order by random();

insert into public.cryptodle_puzzles
  (id, quote_text, author, difficulty, hints, explanation, source)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'KNOWLEDGE IS POWER',
    'Francis Bacon',
    'easy',
    array[
      'A short two-word quote.',
      'The second word is a common noun.',
      'Both words are among the most common in English.'
    ],
    'A classic quote about the value of learning.',
    'https://triviaah.com'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'FORTUNE FAVORS THE BOLD',
    'Latin proverb',
    'easy',
    array[
      'This one has four words.',
      'The first and second words share a repeated opening pattern.',
      'The last word is a well-known adjective.'
    ],
    'A proverb about taking action instead of hesitating.',
    'https://triviaah.com'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'THE ONLY WAY OUT IS THROUGH',
    'Robert Frost',
    'medium',
    array[
      'A famous six-word quote.',
      'The first word is one of the most common English words.',
      'The last word is a strong clue that points to persistence.'
    ],
    'A quote about facing difficulty directly.',
    'https://triviaah.com'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'ALL THAT GLITTERS IS NOT GOLD',
    'William Shakespeare',
    'medium',
    array[
      'This one has six words.',
      'The final word is a classic noun.',
      'The structure is familiar from a well-known proverb.'
    ],
    'A warning that appearances can be misleading.',
    'https://triviaah.com'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'I THINK THEREFORE I AM',
    'René Descartes',
    'medium',
    array[
      'A short philosophical quote.',
      'There are two one-letter words.',
      'The middle word is the key to the solve.'
    ],
    'A foundational statement in philosophy.',
    'https://triviaah.com'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'AN INVESTMENT IN KNOWLEDGE PAYS THE BEST INTEREST',
    'Benjamin Franklin',
    'hard',
    array[
      'This is the longest quote in the starter set.',
      'Look for the long noun in the second word.',
      'The final two words form a common phrase.'
    ],
    'A quote about the value of learning and planning.',
    'https://triviaah.com'
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'THE UNEXAMINED LIFE IS NOT WORTH LIVING',
    'Socrates',
    'hard',
    array[
      'A classic philosophical sentence.',
      'The structure is balanced and easy to anchor.',
      'The final word is a gerund.'
    ],
    'A quote about reflection and meaning.',
    'https://triviaah.com'
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    'SUCCESS IS NOT FINAL FAILURE IS NOT FATAL',
    'Winston Churchill',
    'hard',
    array[
      'This one repeats the same short pattern twice.',
      'The structure is symmetrical.',
      'A repeated clause helps break the code.'
    ],
    'A quote about resilience and persistence.',
    'https://triviaah.com'
  )
on conflict (id) do nothing;

-- Optional daily mapping examples. Replace the dates with the days you want
-- to pin as the daily cryptodle puzzle.
-- insert into public.daily_puzzles (date, category, puzzle_id)
-- values
--   ('2026-04-18', 'cryptodle', '11111111-1111-1111-1111-111111111111'),
--   ('2026-04-19', 'cryptodle', '22222222-2222-2222-2222-222222222222')
-- on conflict (date, category) do update
-- set puzzle_id = excluded.puzzle_id;
