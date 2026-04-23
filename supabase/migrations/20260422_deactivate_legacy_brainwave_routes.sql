update public.game_pages
set is_active = false
where route_path in (
  '/brainwave/automoble',
  '/brainwave/botanle',
  '/brainwave/citadle',
  '/brainwave/countridle',
  '/brainwave/trordle'
);
