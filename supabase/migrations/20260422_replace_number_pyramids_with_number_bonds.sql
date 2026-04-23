delete from public.game_pages
where route_path = '/number-puzzles/number-pyramids';

insert into public.game_pages (
  route_path,
  section,
  page_kind,
  title,
  meta_description,
  intro_text,
  supporting_copy,
  highlights,
  faq_items,
  keywords,
  cta_label,
  cta_href,
  hero_label,
  is_daily_refresh,
  sort_order,
  is_active
) values (
  '/number-puzzles/number-bonds',
  'number-puzzles',
  'game',
  'Number Bonds - Pair Sum Puzzle',
  'Match pairs that add up to the target sum and clear the board.',
  'Number Bonds is a quick arithmetic puzzle built on one simple rule.',
  'Find every pair that makes the target number before moving to the next round.',
  '["Addition puzzle", "Quick thinking", "Easy to learn"]'::jsonb,
  '[{"question":"What is Number Bonds?","answer":"Number Bonds is a pair-matching puzzle where each pair adds up to the target sum."},{"question":"How do I solve it?","answer":"Pick two numbers that make the target and clear all the pairs on the board."},{"question":"Is it a daily puzzle?","answer":"This is an evergreen logic puzzle with a few rotating puzzle layouts."},{"question":"Is Number Bonds free to play?","answer":"Yes. It is free to play and does not require any external services."}]'::jsonb,
  '["number bonds", "pair sum puzzle", "addition game", "math puzzle"]'::jsonb,
  'Play Bonds',
  '/number-puzzles/number-bonds',
  'Bond Match',
  false,
  8,
  true
) on conflict (route_path) do update
set
  section = excluded.section,
  page_kind = excluded.page_kind,
  title = excluded.title,
  meta_description = excluded.meta_description,
  intro_text = excluded.intro_text,
  supporting_copy = excluded.supporting_copy,
  highlights = excluded.highlights,
  faq_items = excluded.faq_items,
  keywords = excluded.keywords,
  cta_label = excluded.cta_label,
  cta_href = excluded.cta_href,
  hero_label = excluded.hero_label,
  is_daily_refresh = excluded.is_daily_refresh,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;
