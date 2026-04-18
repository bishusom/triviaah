-- Cryptogram puzzles schema
-- Generic layout:
-- - unencrypted_text: the source text the player decodes
-- - person: attribution or related person
-- - person_role: author, lead_star, attributed_to
-- Daily lookup uses daily_puzzles.category = 'cryptogram'

create extension if not exists pgcrypto;

create table if not exists public.cryptogram_puzzles (
  id uuid primary key default gen_random_uuid(),
  puzzle_type text not null default 'quote' check (puzzle_type in ('quote', 'book', 'movie')),
  unencrypted_text text not null,
  person text,
  person_role text not null default 'attributed_to' check (person_role in ('author', 'lead_star', 'attributed_to')),
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  hints text[] not null default '{}'::text[],
  explanation text,
  category text not null default 'cryptogram',
  times_used integer not null default 0,
  last_used date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cryptogram_puzzles_puzzle_type_idx
  on public.cryptogram_puzzles (puzzle_type);

create index if not exists cryptogram_puzzles_category_idx
  on public.cryptogram_puzzles (category);

create index if not exists cryptogram_puzzles_difficulty_idx
  on public.cryptogram_puzzles (difficulty);

create index if not exists cryptogram_puzzles_times_used_idx
  on public.cryptogram_puzzles (times_used);

create or replace function public.set_cryptogram_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists cryptogram_puzzles_set_updated_at on public.cryptogram_puzzles;

create trigger cryptogram_puzzles_set_updated_at
before update on public.cryptogram_puzzles
for each row
execute function public.set_cryptogram_updated_at();

create or replace view public.random_cryptogram_puzzles as
select
  id,
  puzzle_type,
  unencrypted_text,
  person,
  person_role,
  difficulty,
  hints,
  explanation,
  category,
  times_used,
  last_used,
  created_at,
  updated_at
from public.cryptogram_puzzles
order by random();

-- Example seed rows. Adjust or replace as needed.
insert into public.cryptogram_puzzles
  (id, puzzle_type, unencrypted_text, person, person_role, difficulty, hints, explanation, category)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'quote',
    'THE ONLY THING WE HAVE TO FEAR IS FEAR ITSELF',
    'Franklin D. Roosevelt',
    'attributed_to',
    'easy',
    array[
      'A famous presidential line.',
      'The same word appears twice.',
      'The final word is a noun that mirrors the theme.'
    ],
    'A famous quote about courage and fear.',
    'cryptogram'
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'quote',
    'I THINK THEREFORE I AM',
    'René Descartes',
    'attributed_to',
    'easy',
    array[
      'A short philosophical statement.',
      'It contains two one-letter words.',
      'The middle word is the key idea.'
    ],
    'A foundational philosophical quote.',
    'cryptogram'
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'quote',
    'NOTHING IN LIFE IS TO BE FEARED IT IS ONLY TO BE UNDERSTOOD',
    'Marie Curie',
    'attributed_to',
    'medium',
    array[
      'A longer inspirational quote.',
      'The first word is very short.',
      'The final word is closely related to learning.'
    ],
    'A quote about curiosity and understanding.',
    'cryptogram'
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'book',
    'THE GREAT GATSBY',
    'F. Scott Fitzgerald',
    'author',
    'easy',
    array[
      'A classic novel title.',
      'The middle word is very common.',
      'It starts with an article.'
    ],
    'A novel title by F. Scott Fitzgerald.',
    'cryptogram'
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'book',
    'TO KILL A MOCKINGBIRD',
    'Harper Lee',
    'author',
    'medium',
    array[
      'A Pulitzer Prize-winning novel.',
      'There is a single-letter word in the title.',
      'The final word is an animal name.'
    ],
    'A classic novel title by Harper Lee.',
    'cryptogram'
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'book',
    'PRIDE AND PREJUDICE',
    'Jane Austen',
    'author',
    'easy',
    array[
      'A famous two-word novel title.',
      'The middle word is a conjunction.',
      'The title pairs an emotion with a flaw.'
    ],
    'A well-known novel by Jane Austen.',
    'cryptogram'
  ),
  (
    '77777777-7777-7777-7777-777777777777',
    'movie',
    'THE GODFATHER',
    'Marlon Brando',
    'lead_star',
    'easy',
    array[
      'A landmark crime film title.',
      'Two words only.',
      'The second word refers to a family head.'
    ],
    'A classic movie title with an iconic lead performance.',
    'cryptogram'
  ),
  (
    '88888888-8888-8888-8888-888888888888',
    'movie',
    'BACK TO THE FUTURE',
    'Michael J. Fox',
    'lead_star',
    'medium',
    array[
      'A time-travel adventure film.',
      'It has four words.',
      'The title contains a directional word and a time reference.'
    ],
    'A popular sci-fi adventure film.',
    'cryptogram'
  ),
  (
    '99999999-9999-9999-9999-999999999999',
    'movie',
    'THE WIZARD OF OZ',
    'Judy Garland',
    'lead_star',
    'easy',
    array[
      'A classic fantasy film title.',
      'The title includes a possessive structure.',
      'It starts with an article.'
    ],
    'A beloved classic movie title.',
    'cryptogram'
  )
on conflict (id) do nothing;

-- Optional daily mapping examples:
-- insert into public.daily_puzzles (date, category, puzzle_id)
-- values
--   ('2026-04-18', 'cryptogram', '11111111-1111-1111-1111-111111111111'),
--   ('2026-04-19', 'cryptogram', '22222222-2222-2222-2222-222222222222')
-- on conflict (date, category) do update
-- set puzzle_id = excluded.puzzle_id;
