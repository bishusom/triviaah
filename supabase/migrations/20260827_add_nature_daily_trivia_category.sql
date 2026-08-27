-- Add the Nature daily trivia category.
-- Question generation/population is handled separately.

with nature_category as (
  select
    'nature'::text as slug,
    'daily-trivias'::public.trivia_category_type as category_type,
    'Nature'::text as title,
    'Nature'::text as display_name,
    'Daily nature trivia across geography, animals, habitats, ecosystems, and plant science. Fresh questions every day.'::text as description,
    'The Nature daily quiz combines world geography, wildlife, ecosystems, and plant science into one recurring challenge. It is designed for players who enjoy learning how places, animals, habitats, and natural systems connect.'::text as long_description,
    '[
      "Recognize animals, habitats, ecosystems, and natural landmarks.",
      "Connect geography with the living world and environmental patterns.",
      "Build practical knowledge of nature, wildlife, and plant science."
    ]'::jsonb as learning_points,
    '[
      {"icon":"🌿","title":"What is the Nature daily quiz?","answer":"Nature is a daily trivia quiz that combines geography, animals, habitats, ecosystems, and plant science into one focused challenge."},
      {"icon":"🧭","title":"What topics are included?","answer":"Nature can include world geography, wildlife, animal behavior, ecosystems, natural landmarks, botany, and environmental facts."},
      {"icon":"📅","title":"Does the quiz refresh daily?","answer":"Yes. Nature is designed as a daily trivia category with a fresh challenge each day."},
      {"icon":"🎯","title":"Is Nature free to play?","answer":"Yes. The Nature daily quiz is free to play on Triviaah."}
    ]'::jsonb as faq_items,
    '["geography", "animals", "science"]'::jsonb as related,
    '[
      "nature trivia quiz",
      "daily nature quiz",
      "animal trivia",
      "geography quiz",
      "botany trivia",
      "ecosystem quiz",
      "wildlife trivia",
      "environment trivia"
    ]'::jsonb as keywords,
    '/imgs/daily-trivias/nature.webp'::text as og_image,
    '🌿'::text as icon,
    'from-emerald-500 to-cyan-500'::text as color,
    true as show_printable_quiz_cta,
    60 as sort_order,
    true as is_active
),
updated as (
  update public.trivia_categories tc
  set
    title = nc.title,
    display_name = nc.display_name,
    description = nc.description,
    long_description = nc.long_description,
    learning_points = nc.learning_points,
    faq_items = nc.faq_items,
    related = nc.related,
    keywords = nc.keywords,
    og_image = nc.og_image,
    icon = nc.icon,
    color = nc.color,
    show_printable_quiz_cta = nc.show_printable_quiz_cta,
    sort_order = nc.sort_order,
    is_active = nc.is_active,
    updated_at = now()
  from nature_category nc
  where tc.slug = nc.slug
    and tc.category_type = nc.category_type
  returning tc.slug
)
insert into public.trivia_categories (
  slug,
  category_type,
  title,
  display_name,
  description,
  long_description,
  learning_points,
  faq_items,
  related,
  keywords,
  og_image,
  icon,
  color,
  show_printable_quiz_cta,
  sort_order,
  is_active
)
select
  slug,
  category_type,
  title,
  display_name,
  description,
  long_description,
  learning_points,
  faq_items,
  related,
  keywords,
  og_image,
  icon,
  color,
  show_printable_quiz_cta,
  sort_order,
  is_active
from nature_category
where not exists (select 1 from updated);
