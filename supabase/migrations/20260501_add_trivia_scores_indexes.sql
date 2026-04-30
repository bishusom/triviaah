create index if not exists trivia_scores_category_score_idx
  on public.trivia_scores (category, score desc);

create index if not exists trivia_scores_name_created_idx
  on public.trivia_scores (name, created_at desc);

create index if not exists trivia_scores_user_created_idx
  on public.trivia_scores (user_id, created_at desc)
  where user_id is not null;
