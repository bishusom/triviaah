create table if not exists public.challenge_collections (
  slug text primary key,
  title text not null,
  subtitle text,
  description text not null,
  hero_image text,
  theme text,
  cadence text not null default 'weekly' check (cadence in ('weekly', 'seasonal', 'evergreen')),
  difficulty text not null default 'medium' check (difficulty in ('easy', 'medium', 'hard')),
  estimated_minutes integer not null default 15 check (estimated_minutes > 0),
  source_categories jsonb not null default '[]'::jsonb,
  auto_item_limit integer not null default 6 check (auto_item_limit >= 0),
  starts_at timestamptz,
  ends_at timestamptz,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.challenge_items (
  id uuid primary key default gen_random_uuid(),
  collection_slug text not null references public.challenge_collections(slug) on delete cascade,
  title text not null,
  description text not null,
  href text not null,
  quiz_type text not null check (quiz_type in ('daily-trivias', 'brainwave', 'trivias', 'trivia-bank', 'blog')),
  category text,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists challenge_collections_active_sort_idx
  on public.challenge_collections (is_active, sort_order, title);

create index if not exists challenge_items_collection_active_sort_idx
  on public.challenge_items (collection_slug, is_active, sort_order);

create unique index if not exists challenge_items_collection_href_idx
  on public.challenge_items (collection_slug, href);

with challenge_seed (
  slug,
  title,
  subtitle,
  description,
  hero_image,
  theme,
  cadence,
  difficulty,
  estimated_minutes,
  source_categories,
  auto_item_limit,
  is_featured,
  sort_order,
  seo_title,
  seo_description
) as (
  values
    (
      'nature-explorer',
      'Nature Explorer',
      'Geography, animals, and plant science in one weekly route.',
      'A focused challenge for players who like maps, wildlife, habitats, ecosystems, and the science behind the natural world.',
      '/imgs/daily-trivias/nature.webp',
      'Nature',
      'weekly',
      'medium',
      18,
      '["geography", "animals", "science"]'::jsonb,
      6,
      true,
      10,
      'Nature Explorer Weekly Trivia Challenge | Triviaah',
      'Play a curated weekly nature trivia challenge across geography, animals, ecosystems, and plant science.'
    ),
    (
      'movie-night',
      'Movie Night',
      'A compact entertainment route for film and pop-culture players.',
      'Move from broad entertainment trivia into clue-led movie deduction and celebrity recall.',
      '/imgs/daily-trivias/entertainment.webp',
      'Entertainment',
      'weekly',
      'easy',
      15,
      '["movies", "music", "tv", "celebrities"]'::jsonb,
      6,
      false,
      20,
      'Movie Night Trivia Challenge | Triviaah',
      'Play a curated movie and entertainment trivia challenge with daily entertainment questions, Plotle, and Celebrile.'
    ),
    (
      'history-sprint',
      'History Sprint',
      'Daily history questions followed by clue-based historical deduction.',
      'A short weekly route for people who remember dates, events, eras, leaders, and turning points.',
      '/imgs/daily-trivias/today-in-history.webp',
      'History',
      'weekly',
      'medium',
      12,
      '["history"]'::jsonb,
      5,
      false,
      30,
      'History Sprint Weekly Trivia Challenge | Triviaah',
      'Play a curated weekly history trivia challenge with Today in History and Historidle.'
    ),
    (
      'sports-weekend',
      'Sports Weekend',
      'A weekly sports trivia run for quick competition.',
      'A focused sports route for players who follow athletes, teams, championships, rules, records, and iconic moments.',
      '/imgs/daily-trivias/sports.webp',
      'Sports',
      'weekly',
      'medium',
      10,
      '["sports"]'::jsonb,
      5,
      false,
      40,
      'Sports Weekend Trivia Challenge | Triviaah',
      'Play a curated weekly sports trivia challenge with daily sports questions and leaderboard competition.'
    ),
    (
      'book-and-music-clues',
      'Book & Music Clues',
      'A culture challenge built around literature and music deduction.',
      'A slower clue-led challenge for readers and music fans who enjoy recognizing works from small details.',
      '/imgs/daily-trivias/arts-literature.webp',
      'Culture',
      'evergreen',
      'hard',
      16,
      '["literature", "music", "arts"]'::jsonb,
      6,
      false,
      50,
      'Book and Music Trivia Challenge | Triviaah',
      'Play a curated book and music challenge with Literale, Songle, and culture trivia.'
    )
)
insert into public.challenge_collections (
  slug,
  title,
  subtitle,
  description,
  hero_image,
  theme,
  cadence,
  difficulty,
  estimated_minutes,
  source_categories,
  auto_item_limit,
  is_featured,
  sort_order,
  seo_title,
  seo_description
)
select
  slug,
  title,
  subtitle,
  description,
  hero_image,
  theme,
  cadence,
  difficulty,
  estimated_minutes,
  source_categories,
  auto_item_limit,
  is_featured,
  sort_order,
  seo_title,
  seo_description
from challenge_seed
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  description = excluded.description,
  hero_image = excluded.hero_image,
  theme = excluded.theme,
  cadence = excluded.cadence,
  difficulty = excluded.difficulty,
  estimated_minutes = excluded.estimated_minutes,
  source_categories = excluded.source_categories,
  auto_item_limit = excluded.auto_item_limit,
  is_featured = excluded.is_featured,
  is_active = true,
  sort_order = excluded.sort_order,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  updated_at = now();

with item_seed (
  collection_slug,
  title,
  description,
  href,
  quiz_type,
  category,
  sort_order
) as (
  values
    ('nature-explorer', 'Start with Nature Trivia', 'Warm up with questions across geography, animals, ecosystems, and botany.', '/daily-trivias/nature', 'daily-trivias', 'nature', 10),
    ('nature-explorer', 'World Tour Geography', 'Test countries, places, maps, landscapes, and regional knowledge.', '/daily-trivias/geography', 'daily-trivias', 'geography', 20),
    ('nature-explorer', 'Capitale', 'Guess the capital city using deduction and geography feedback.', '/brainwave/capitale', 'brainwave', 'capitale', 30),
    ('movie-night', 'Entertainment Trivia', 'Start with movies, music, TV, and pop-culture questions.', '/daily-trivias/entertainment', 'daily-trivias', 'entertainment', 10),
    ('movie-night', 'Plotle', 'Guess the movie from a compact plot clue.', '/brainwave/plotle', 'brainwave', 'plotle', 20),
    ('movie-night', 'Celebrile', 'Use progressive clues to identify the celebrity.', '/brainwave/celebrile', 'brainwave', 'celebrile', 30),
    ('history-sprint', 'Today in History', 'Answer questions tied to real historical events and milestones.', '/daily-trivias/today-in-history', 'daily-trivias', 'today-in-history', 10),
    ('history-sprint', 'Historidle', 'Solve a historical figure or event from progressive clues.', '/brainwave/historidle', 'brainwave', 'historidle', 20),
    ('sports-weekend', 'Sports Trivia', 'Play daily sports questions across athletes, teams, events, and records.', '/daily-trivias/sports', 'daily-trivias', 'sports', 10),
    ('sports-weekend', 'Leaderboard Chase', 'Compare your score after the quiz and try to climb the daily board.', '/leaderboard', 'daily-trivias', null, 20),
    ('book-and-music-clues', 'Literale', 'Guess the book from opening lines and literary clues.', '/brainwave/literale', 'brainwave', 'literale', 10),
    ('book-and-music-clues', 'Songle', 'Guess the song from clues like lyrics, artist, genre, and era.', '/brainwave/songle', 'brainwave', 'songle', 20)
)
insert into public.challenge_items (
  collection_slug,
  title,
  description,
  href,
  quiz_type,
  category,
  sort_order
)
select
  collection_slug,
  title,
  description,
  href,
  quiz_type,
  category,
  sort_order
from item_seed
on conflict (collection_slug, href) do update set
  title = excluded.title,
  description = excluded.description,
  quiz_type = excluded.quiz_type,
  category = excluded.category,
  is_active = true,
  sort_order = excluded.sort_order,
  updated_at = now();
