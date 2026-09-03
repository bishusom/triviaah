alter table public.trivia_scores
  add column if not exists quiz_type text,
  add column if not exists quiz_date date;

alter table public.trivia_scores
  drop constraint if exists trivia_scores_quiz_type_check;

alter table public.trivia_scores
  add constraint trivia_scores_quiz_type_check
  check (quiz_type is null or quiz_type in ('trivias', 'daily-trivias'));

create unique index if not exists trivia_scores_one_daily_attempt_idx
  on public.trivia_scores (lower(trim(name)), category, quiz_date)
  where quiz_type = 'daily-trivias' and quiz_date is not null;

create index if not exists trivia_scores_daily_leaderboard_idx
  on public.trivia_scores (quiz_type, quiz_date, category, score desc)
  where quiz_type = 'daily-trivias';

update public.trivia_categories
set faq_items = (
  select jsonb_agg(
    case
      when lower(item->>'title') in ('can i replay the quiz?', 'can i retake the quiz?')
        then jsonb_build_object(
          'icon', coalesce(item->>'icon', '🔁'),
          'title', 'Can I replay the quiz?',
          'answer', 'You get one ranked attempt at today''s quiz. After finishing, you can replay it in Practice mode, but practice scores do not affect the leaderboard.'
        )
      else item
    end
    order by ordinal
  )
  from jsonb_array_elements(faq_items) with ordinality as entries(item, ordinal)
)
where category_type = 'daily-trivias'
  and jsonb_typeof(faq_items) = 'array';
