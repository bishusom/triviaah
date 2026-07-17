create table if not exists public.trivia_question_reports (
  id uuid primary key default gen_random_uuid(),
  question_id text not null,
  report_type text not null check (
    report_type in (
      'wrong_answer',
      'wrong_question',
      'ambiguous',
      'wrong_titbit',
      'outdated',
      'broken_image',
      'other'
    )
  ),
  details text check (char_length(details) <= 1000),
  suggested_correction text check (char_length(suggested_correction) <= 1000),
  source_url text check (char_length(source_url) <= 2000),
  content_snapshot jsonb not null,
  reporter_user_id uuid references auth.users(id) on delete set null,
  reporter_key_hash text not null,
  abuse_key_hash text not null,
  status text not null default 'open' check (
    status in ('open', 'reviewing', 'accepted', 'rejected', 'duplicate')
  ),
  moderator_notes text,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists trivia_question_reports_open_idx
  on public.trivia_question_reports (status, created_at desc);

create index if not exists trivia_question_reports_question_idx
  on public.trivia_question_reports (question_id, created_at desc);

create index if not exists trivia_question_reports_rate_limit_idx
  on public.trivia_question_reports (abuse_key_hash, created_at desc);

create unique index if not exists trivia_question_reports_active_unique_idx
  on public.trivia_question_reports (question_id, reporter_key_hash, report_type)
  where status in ('open', 'reviewing');

alter table public.trivia_question_reports enable row level security;

-- Reports contain abuse-prevention identifiers and moderator notes, so there
-- are deliberately no public table policies. Public submissions go through
-- the narrow function below; moderators can use the Supabase dashboard or a
-- service-role client.
revoke all on public.trivia_question_reports from anon, authenticated;

create or replace function public.submit_trivia_question_report(
  p_question_id text,
  p_report_type text,
  p_details text,
  p_suggested_correction text,
  p_source_url text,
  p_reporter_key_hash text,
  p_abuse_key_hash text
)
returns table (report_id uuid, was_duplicate boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  question_snapshot jsonb;
  existing_report_id uuid;
  recent_report_count integer;
  inserted_report_id uuid;
begin
  if p_question_id is null or char_length(trim(p_question_id)) = 0 then
    raise exception using errcode = '22023', message = 'A question ID is required.';
  end if;

  if p_report_type not in (
    'wrong_answer',
    'wrong_question',
    'ambiguous',
    'wrong_titbit',
    'outdated',
    'broken_image',
    'other'
  ) then
    raise exception using errcode = '22023', message = 'Invalid report type.';
  end if;

  if char_length(coalesce(p_details, '')) > 1000
    or char_length(coalesce(p_suggested_correction, '')) > 1000
    or char_length(coalesce(p_source_url, '')) > 2000 then
    raise exception using errcode = '22023', message = 'Report content is too long.';
  end if;

  if p_reporter_key_hash !~ '^[a-f0-9]{64}$'
    or p_abuse_key_hash !~ '^[a-f0-9]{64}$' then
    raise exception using errcode = '22023', message = 'Invalid reporter identifier.';
  end if;

  select jsonb_build_object(
    'question', question,
    'correctAnswer', correct_answer,
    'incorrectAnswers', incorrect_answers,
    'titbits', titbits,
    'imageUrl', image_url,
    'category', category,
    'subcategory', subcategory
  )
  into question_snapshot
  from public.trivia_questions
  where id::text = p_question_id
  limit 1;

  if question_snapshot is null then
    raise exception using errcode = 'P0002', message = 'Question not found.';
  end if;

  select id
  into existing_report_id
  from public.trivia_question_reports
  where question_id = p_question_id
    and reporter_key_hash = p_reporter_key_hash
    and report_type = p_report_type
    and status in ('open', 'reviewing')
  limit 1;

  if existing_report_id is not null then
    return query select existing_report_id, true;
    return;
  end if;

  select count(*)
  into recent_report_count
  from public.trivia_question_reports
  where abuse_key_hash = p_abuse_key_hash
    and created_at >= now() - interval '1 hour';

  if recent_report_count >= 10 then
    raise exception using errcode = 'P0001', message = 'Report rate limit exceeded.';
  end if;

  insert into public.trivia_question_reports (
    question_id,
    report_type,
    details,
    suggested_correction,
    source_url,
    content_snapshot,
    reporter_user_id,
    reporter_key_hash,
    abuse_key_hash
  )
  values (
    p_question_id,
    p_report_type,
    nullif(trim(coalesce(p_details, '')), ''),
    nullif(trim(coalesce(p_suggested_correction, '')), ''),
    nullif(trim(coalesce(p_source_url, '')), ''),
    question_snapshot,
    auth.uid(),
    p_reporter_key_hash,
    p_abuse_key_hash
  )
  returning id into inserted_report_id;

  return query select inserted_report_id, false;
exception
  when unique_violation then
    select id
    into existing_report_id
    from public.trivia_question_reports
    where question_id = p_question_id
      and reporter_key_hash = p_reporter_key_hash
      and report_type = p_report_type
      and status in ('open', 'reviewing')
    limit 1;

    return query select existing_report_id, true;
end;
$$;

revoke all on function public.submit_trivia_question_report(
  text, text, text, text, text, text, text
) from public;

grant execute on function public.submit_trivia_question_report(
  text, text, text, text, text, text, text
) to anon, authenticated;
