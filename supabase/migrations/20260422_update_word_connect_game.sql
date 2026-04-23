update public.game_pages
set
  title = 'Word Connect - Letter Bank Puzzle',
  meta_description = 'Connect the letters to build valid words and clear the target list.',
  intro_text = 'Word Connect is a classic letter-bank game where you swipe or tap letters to discover words hidden in the bank.',
  supporting_copy = 'Each round mixes target words and bonus finds, keeping the game fast, replayable, and easy to learn.',
  highlights = '["Letter bank", "Bonus words", "Dictionary validation"]'::jsonb,
  faq_items = '[
    {"question":"What is Word Connect?","answer":"Word Connect is a letter-bank word game where you connect letters to build valid dictionary words."},
    {"question":"How do I play Word Connect?","answer":"Tap or swipe letters to build words, submit them, and fill the target list for the round."},
    {"question":"Are bonus words allowed?","answer":"Yes. Valid extra words can score points even if they are not part of the target list."},
    {"question":"Is Word Connect free to play?","answer":"Yes. Word Connect is free to play and uses lightweight dictionary validation."}
  ]'::jsonb,
  keywords = '["word connect", "letter bank game", "word building puzzle", "word connection game"]'::jsonb,
  cta_label = 'Play Word Connect',
  hero_label = 'Letter Bank'
where route_path = '/word-games/word-connect';
