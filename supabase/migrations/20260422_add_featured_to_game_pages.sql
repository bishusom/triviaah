alter table public.game_pages
add column if not exists featured boolean not null default false;

update public.game_pages
set featured = case route_path
  when '/brainwave' then true
  when '/brainwave/plotle' then true
  when '/brainwave/capitale' then true
  when '/brainwave/cryptodle' then true
  when '/brainwave/songle' then true
  else false
end
where section = 'brainwave';
