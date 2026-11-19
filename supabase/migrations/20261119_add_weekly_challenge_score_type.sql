begin;

alter table public.trivia_scores
  drop constraint if exists trivia_scores_quiz_type_check;

alter table public.trivia_scores
  add constraint trivia_scores_quiz_type_check
  check (
    quiz_type is null
    or quiz_type in ('trivias', 'daily-trivias', 'weekly_challenge')
  );

create index if not exists trivia_scores_weekly_challenge_idx
  on public.trivia_scores (category, score desc, created_at desc)
  where quiz_type = 'weekly_challenge';

commit;
