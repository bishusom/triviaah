-- Browser membership secrets are separate from public guest aliases and invite codes.
begin;

create table public.trivia_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 60),
  invite_code uuid not null unique default gen_random_uuid(),
  owner_hash text not null,
  created_at timestamptz not null default now()
);

create table public.trivia_group_members (
  group_id uuid not null references public.trivia_groups(id) on delete cascade,
  member_hash text not null,
  guest_alias text not null check (char_length(guest_alias) between 1 and 40),
  joined_at timestamptz not null default now(),
  primary key (group_id, member_hash),
  unique (group_id, guest_alias)
);
create index trivia_group_members_hash_idx on public.trivia_group_members(member_hash);
create index if not exists trivia_scores_group_lookup_idx
  on public.trivia_scores (name, created_at) where platform = 'web';

alter table public.trivia_groups enable row level security;
alter table public.trivia_group_members enable row level security;
revoke all on public.trivia_groups, public.trivia_group_members from anon, authenticated;

-- Only this capability-checked function exposes group data. Never return hashes.
create function public.private_group_action(
  p_action text,
  p_secret text,
  p_group_id uuid default null,
  p_name text default null,
  p_alias text default null,
  p_invite uuid default null,
  p_timeframe text default 'weekly'
) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  v_hash text;
  v_group public.trivia_groups%rowtype;
  v_since timestamptz;
  v_result jsonb;
begin
  if p_secret is null or p_secret !~ '^[a-f0-9]{64}$' then
    raise exception 'Invalid membership secret';
  end if;
  v_hash := encode(sha256(convert_to(p_secret, 'UTF8')), 'hex');
  -- Serialize changes from one browser, including membership limits.
  perform pg_advisory_xact_lock(hashtextextended(v_hash, 0));

  if p_action = 'list' then
    select coalesce(jsonb_agg(jsonb_build_object('id', g.id, 'name', g.name,
      'alias', m.guest_alias, 'isOwner', g.owner_hash = v_hash) order by g.created_at), '[]'::jsonb)
    into v_result from public.trivia_groups g
    join public.trivia_group_members m on m.group_id = g.id where m.member_hash = v_hash;
    return v_result;
  end if;

  if p_action in ('create', 'join') then
    if p_alias is null or p_alias !~ '^[A-Za-z0-9_-]{1,40}$' then
      raise exception 'A valid guest alias is required';
    end if;
    if p_action = 'create' then
      if p_name is null or char_length(trim(p_name)) not between 1 and 60 then
        raise exception 'Enter a group name of 1 to 60 characters';
      end if;
      insert into public.trivia_groups(name, owner_hash) values (trim(p_name), v_hash) returning * into v_group;
    else
      select * into v_group from public.trivia_groups where invite_code = p_invite for update;
      if not found then raise exception 'Invite code is invalid or has been reset'; end if;
      if exists (select 1 from public.trivia_group_members where group_id = v_group.id and member_hash = v_hash) then
        return jsonb_build_object('id', v_group.id);
      end if;
      if (select count(*) from public.trivia_group_members where group_id = v_group.id) >= 100 then
        raise exception 'This group has reached its 100 member limit';
      end if;
    end if;
    if (select count(*) from public.trivia_group_members where member_hash = v_hash) >= 20 then
      raise exception 'You can belong to at most 20 groups';
    end if;
    if exists (select 1 from public.trivia_group_members where group_id = v_group.id and guest_alias = p_alias) then
      raise exception 'This guest alias is already a member of the group';
    end if;
    insert into public.trivia_group_members(group_id, member_hash, guest_alias) values (v_group.id, v_hash, p_alias);
    return jsonb_build_object('id', v_group.id);
  end if;

  select g.* into v_group from public.trivia_groups g
    join public.trivia_group_members m on m.group_id = g.id
    where g.id = p_group_id and m.member_hash = v_hash for update of g;
  if not found then raise exception 'Group not found or membership required'; end if;

  if p_action = 'leave' then
    if v_group.owner_hash = v_hash then raise exception 'The owner must delete the group instead of leaving'; end if;
    delete from public.trivia_group_members where group_id = p_group_id and member_hash = v_hash;
    return '{}'::jsonb;
  elsif p_action in ('rotate', 'delete') then
    if v_group.owner_hash <> v_hash then raise exception 'Only the group owner can do that'; end if;
    if p_action = 'delete' then
      delete from public.trivia_groups where id = p_group_id;
    else
      update public.trivia_groups set invite_code = gen_random_uuid() where id = p_group_id;
    end if;
    return '{}'::jsonb;
  elsif p_action <> 'board' then
    raise exception 'Unknown group action';
  end if;

  -- Calendar periods use UTC for identical rankings in every timezone.
  if p_timeframe = 'weekly' then
    v_since := date_trunc('week', now() at time zone 'UTC') at time zone 'UTC';
  elsif p_timeframe = 'monthly' then
    v_since := date_trunc('month', now() at time zone 'UTC') at time zone 'UTC';
  elsif p_timeframe = 'all-time' then
    v_since := '-infinity'::timestamptz;
  else raise exception 'Invalid timeframe';
  end if;

  select coalesce(jsonb_agg(to_jsonb(r) order by r.score desc, r.name), '[]'::jsonb) into v_result
  from (
    select rank() over (order by coalesce(sum(s.score), 0) desc) as rank,
      m.guest_alias as name, m.member_hash = v_hash as "isYou",
      coalesce(sum(s.score), 0) as score, count(s.name) as games
    from public.trivia_group_members m
    left join public.trivia_scores s on s.name = m.guest_alias and s.platform = 'web'
      and s.created_at >= greatest(m.joined_at, v_since)
    where m.group_id = p_group_id
    group by m.guest_alias, m.member_hash
  ) r;
  return jsonb_build_object('id', v_group.id, 'name', v_group.name,
    'inviteCode', v_group.invite_code, 'isOwner', v_group.owner_hash = v_hash,
    'members', v_result);
end;
$$;
revoke all on function public.private_group_action(text, text, uuid, text, text, uuid, text) from public;
grant execute on function public.private_group_action(text, text, uuid, text, text, uuid, text) to anon, authenticated;

commit;
