create table if not exists public.guest_aliases (
  id uuid primary key default gen_random_uuid(),
  alias text not null,
  created_at timestamptz not null default now()
);

create unique index if not exists guest_aliases_alias_unique_idx
  on public.guest_aliases (lower(trim(alias)));

insert into public.guest_aliases (alias)
select distinct trim(name)
from public.trivia_scores
where name is not null
  and trim(name) <> ''
on conflict do nothing;
