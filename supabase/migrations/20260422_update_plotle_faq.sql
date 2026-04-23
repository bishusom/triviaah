update public.game_pages
set faq_items = '[
  {"question":"What is Plotle?","answer":"Plotle is a daily movie puzzle where you guess the film from a short plot summary and progressive feedback."},
  {"question":"How many attempts do I get?","answer":"You have six attempts to solve the daily movie puzzle."},
  {"question":"How does feedback work?","answer":"Each guess gives you feedback that helps narrow down the movie title."},
  {"question":"Are hints provided?","answer":"Yes. Progressive hints unlock as you make guesses so you can keep refining your answer."},
  {"question":"Can I play a previous puzzle?","answer":"Yes. The page supports previous daily dates so you can revisit older Plotle puzzles."},
  {"question":"Is Plotle free to play?","answer":"Yes. Plotle is free to play and a new movie puzzle is available every day."}
]'::jsonb
where route_path = '/brainwave/plotle';
