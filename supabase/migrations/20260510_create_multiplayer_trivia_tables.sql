create table if not exists public.multiplayer_rooms (
  id uuid primary key default gen_random_uuid(),
  room_code text not null unique,
  host_guest_id text not null,
  category text not null,
  subcategory text,
  status text not null default 'lobby' check (status in ('lobby', 'playing', 'finished')),
  current_question_index integer not null default 0,
  question_started_at timestamptz,
  time_per_question integer not null default 30,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  expires_at timestamptz not null default now() + interval '6 hours'
);

create table if not exists public.multiplayer_room_questions (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.multiplayer_rooms(id) on delete cascade,
  question_index integer not null,
  question_id text not null,
  question text not null,
  correct_answer text not null,
  options text[] not null,
  difficulty text,
  titbits text,
  image_url text,
  created_at timestamptz not null default now(),
  unique (room_id, question_index)
);

create table if not exists public.multiplayer_players (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.multiplayer_rooms(id) on delete cascade,
  guest_id text not null,
  display_name text not null,
  is_host boolean not null default false,
  score integer not null default 0,
  correct_count integer not null default 0,
  joined_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),
  unique (room_id, guest_id)
);

create table if not exists public.multiplayer_answers (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.multiplayer_rooms(id) on delete cascade,
  player_id uuid not null references public.multiplayer_players(id) on delete cascade,
  question_index integer not null,
  selected_option text not null,
  is_correct boolean not null,
  response_ms integer not null default 0,
  points integer not null default 0,
  answered_at timestamptz not null default now(),
  unique (room_id, player_id, question_index)
);

create index if not exists multiplayer_rooms_room_code_idx on public.multiplayer_rooms (room_code);
create index if not exists multiplayer_players_room_id_idx on public.multiplayer_players (room_id);
create index if not exists multiplayer_answers_room_question_idx on public.multiplayer_answers (room_id, question_index);

alter table public.multiplayer_rooms enable row level security;
alter table public.multiplayer_room_questions enable row level security;
alter table public.multiplayer_players enable row level security;
alter table public.multiplayer_answers enable row level security;

drop policy if exists "Anyone can read active multiplayer rooms" on public.multiplayer_rooms;
create policy "Anyone can read active multiplayer rooms"
  on public.multiplayer_rooms
  for select
  using (expires_at > now());

drop policy if exists "Anyone can create multiplayer rooms" on public.multiplayer_rooms;
create policy "Anyone can create multiplayer rooms"
  on public.multiplayer_rooms
  for insert
  with check (expires_at > now());

drop policy if exists "Anyone can update active multiplayer rooms" on public.multiplayer_rooms;
create policy "Anyone can update active multiplayer rooms"
  on public.multiplayer_rooms
  for update
  using (expires_at > now())
  with check (expires_at > now());

drop policy if exists "Anyone can delete multiplayer rooms" on public.multiplayer_rooms;
create policy "Anyone can delete multiplayer rooms"
  on public.multiplayer_rooms
  for delete
  using (true);

drop policy if exists "Anyone can read active room questions" on public.multiplayer_room_questions;
create policy "Anyone can read active room questions"
  on public.multiplayer_room_questions
  for select
  using (
    exists (
      select 1
      from public.multiplayer_rooms room
      where room.id = multiplayer_room_questions.room_id
        and room.expires_at > now()
    )
  );

drop policy if exists "Anyone can create questions for active rooms" on public.multiplayer_room_questions;
create policy "Anyone can create questions for active rooms"
  on public.multiplayer_room_questions
  for insert
  with check (
    exists (
      select 1
      from public.multiplayer_rooms room
      where room.id = multiplayer_room_questions.room_id
        and room.expires_at > now()
    )
  );

drop policy if exists "Anyone can delete room questions" on public.multiplayer_room_questions;
create policy "Anyone can delete room questions"
  on public.multiplayer_room_questions
  for delete
  using (true);

drop policy if exists "Anyone can read players in active rooms" on public.multiplayer_players;
create policy "Anyone can read players in active rooms"
  on public.multiplayer_players
  for select
  using (
    exists (
      select 1
      from public.multiplayer_rooms room
      where room.id = multiplayer_players.room_id
        and room.expires_at > now()
    )
  );

drop policy if exists "Anyone can join active rooms" on public.multiplayer_players;
create policy "Anyone can join active rooms"
  on public.multiplayer_players
  for insert
  with check (
    exists (
      select 1
      from public.multiplayer_rooms room
      where room.id = multiplayer_players.room_id
        and room.expires_at > now()
    )
  );

drop policy if exists "Anyone can update players in active rooms" on public.multiplayer_players;
create policy "Anyone can update players in active rooms"
  on public.multiplayer_players
  for update
  using (
    exists (
      select 1
      from public.multiplayer_rooms room
      where room.id = multiplayer_players.room_id
        and room.expires_at > now()
    )
  )
  with check (
    exists (
      select 1
      from public.multiplayer_rooms room
      where room.id = multiplayer_players.room_id
        and room.expires_at > now()
    )
  );

drop policy if exists "Anyone can delete players" on public.multiplayer_players;
create policy "Anyone can delete players"
  on public.multiplayer_players
  for delete
  using (true);

drop policy if exists "Anyone can read answers in active rooms" on public.multiplayer_answers;
create policy "Anyone can read answers in active rooms"
  on public.multiplayer_answers
  for select
  using (
    exists (
      select 1
      from public.multiplayer_rooms room
      where room.id = multiplayer_answers.room_id
        and room.expires_at > now()
    )
  );

drop policy if exists "Anyone can submit answers in active rooms" on public.multiplayer_answers;
create policy "Anyone can submit answers in active rooms"
  on public.multiplayer_answers
  for insert
  with check (
    exists (
      select 1
      from public.multiplayer_rooms room
      where room.id = multiplayer_answers.room_id
        and room.expires_at > now()
    )
  );

drop policy if exists "Anyone can delete answers" on public.multiplayer_answers;
create policy "Anyone can delete answers"
  on public.multiplayer_answers
  for delete
  using (true);

do $$
begin
  alter publication supabase_realtime add table public.multiplayer_rooms;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.multiplayer_players;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.multiplayer_answers;
exception
  when duplicate_object then null;
end $$;
