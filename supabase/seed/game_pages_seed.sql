-- Seed content for the shared game_pages table.
-- This is starter content for all section hubs and the routes currently linked
-- from the Brainwave, Word Games, Number Puzzles, and Retro Games pages.

insert into public.game_pages (
  route_path,
  section,
  page_kind,
  title,
  meta_description,
  intro_text,
  supporting_copy,
  highlights,
  faq_items,
  keywords,
  cta_label,
  cta_href,
  hero_label,
  is_daily_refresh,
  sort_order,
  is_active
) values
  (
    '/brainwave',
    'brainwave',
    'hub',
    'Brainwave Trivia Games',
    'Browse creative daily puzzle challenges across movies, music, geography, books, animals, and more.',
    'Brainwave is the daily puzzle hub for players who want a fresh challenge every day.',
    'Each game mixes trivia and deduction with a clean, repeatable daily format.',
    '["Daily refresh", "Varied puzzle themes", "Fast replayable challenges"]'::jsonb,
    '[{"question":"What are Brainwave games?","answer":"Brainwave games are daily puzzle challenges built around a specific theme and a fresh target each day."}]'::jsonb,
    '["brainwave", "daily puzzles", "trivia games", "educational games"]'::jsonb,
    'Explore Brainwave',
    '/brainwave',
    'Daily Puzzle Hub',
    true,
    0,
    true
  ),
  (
    '/brainwave/plotle',
    'brainwave',
    'game',
    'Plotle - Daily Movie Puzzle',
    'Guess the movie from its plot summary with Wordle-style feedback and daily clues.',
    'Plotle turns film knowledge into a daily guessing game.',
    'Use plot hints, feedback, and movie memory to solve the title in as few tries as possible.',
    '["Movie trivia", "Daily refresh", "Feedback-driven guessing"]'::jsonb,
    '[
      {"question":"What is Plotle?","answer":"Plotle is a daily movie puzzle where you guess the film from a short plot summary and progressive feedback."},
      {"question":"How many attempts do I get?","answer":"You have six attempts to solve the daily movie puzzle."},
      {"question":"How does feedback work?","answer":"Each guess gives you feedback that helps narrow down the movie title."},
      {"question":"Are hints provided?","answer":"Yes. Progressive hints unlock as you make guesses so you can keep refining your answer."},
      {"question":"Can I play a previous puzzle?","answer":"Yes. The page supports previous daily dates so you can revisit older Plotle puzzles."},
      {"question":"Is Plotle free to play?","answer":"Yes. Plotle is free to play and a new movie puzzle is available every day."}
    ]'::jsonb,
    '["plotle", "movie puzzle", "film trivia", "movie guessing game"]'::jsonb,
    'Play Plotle',
    '/brainwave/plotle',
    'Daily Challenge',
    true,
    1,
    true
  ),
  (
    '/brainwave/capitale',
    'brainwave',
    'game',
    'Capitale - Capital City Puzzle',
    'Guess the world capital city in six tries with geography clues and daily feedback.',
    'Capitale is a geography puzzle built for players who enjoy capital cities and map knowledge.',
    'Distance and direction clues help narrow the target city with each guess.',
    '["Geography focus", "Daily refresh", "Distance clues"]'::jsonb,
    '[{"question":"How does Capitale work?","answer":"You guess a capital city and use feedback to move closer to the target city."}]'::jsonb,
    '["capitale", "capital cities", "geography puzzle", "world capitals"]'::jsonb,
    'Play Capitale',
    '/brainwave/capitale',
    'Daily Challenge',
    true,
    2,
    true
  ),
  (
    '/brainwave/historidle',
    'brainwave',
    'game',
    'Historidle - Daily Historical Puzzle',
    'Identify a historical event or figure from dates, clues, and timeline style feedback.',
    'Historidle blends history knowledge with deduction and timeline reasoning.',
    'Use the dates and progressive clues to work toward the correct answer.',
    '["History trivia", "Timeline clues", "Daily refresh"]'::jsonb,
    '[{"question":"What is Historidle?","answer":"Historidle is a history puzzle where you identify a historical event or figure from dates and clues."}]'::jsonb,
    '["historidle", "history puzzle", "historical events", "history trivia"]'::jsonb,
    'Play Historidle',
    '/brainwave/historidle',
    'Daily Challenge',
    true,
    3,
    true
  ),
  (
    '/brainwave/celebrile',
    'brainwave',
    'game',
    'Celebrile - Celebrity Guessing Game',
    'Guess the celebrity from progressive clues and letter feedback in a daily entertainment puzzle.',
    'Celebrile is the pop culture puzzle for fans of famous people and entertainment trivia.',
    'The clue stack keeps the game approachable while still rewarding strong celebrity memory.',
    '["Pop culture", "Daily refresh", "Clue-based guessing"]'::jsonb,
    '[{"question":"What is Celebrile?","answer":"Celebrile is a celebrity guessing game that reveals clues as you narrow down the answer."}]'::jsonb,
    '["celebrile", "celebrity puzzle", "famous people game", "entertainment trivia"]'::jsonb,
    'Play Celebrile',
    '/brainwave/celebrile',
    'Daily Challenge',
    true,
    4,
    true
  ),
  (
    '/brainwave/songle',
    'brainwave',
    'game',
    'Songle - Daily Song Guessing Puzzle',
    'Guess the song from lyrics, artist, and genre clues in a daily music challenge.',
    'Songle is a music puzzle that rewards recognition of lyrics, artists, and genres.',
    'It is designed for players who enjoy music memory and a short daily challenge.',
    '["Music trivia", "Daily refresh", "Lyrics and artist clues"]'::jsonb,
    '[{"question":"How do I play Songle?","answer":"Use the song clues and feedback to identify the track in a small number of attempts."}]'::jsonb,
    '["songle", "music puzzle", "song guessing game", "lyrics game"]'::jsonb,
    'Play Songle',
    '/brainwave/songle',
    'Daily Challenge',
    true,
    5,
    true
  ),
  (
    '/brainwave/literale',
    'brainwave',
    'game',
    'Literale - Daily Literature Puzzle',
    'Guess the book from opening lines and literary clues in a daily reading challenge.',
    'Literale is a reading-focused puzzle built for book lovers and literature fans.',
    'Opening lines and book clues help players work toward the right title.',
    '["Book trivia", "Daily refresh", "Reading and author clues"]'::jsonb,
    '[{"question":"What is Literale?","answer":"Literale is a book puzzle where you identify the title from opening lines and clues."}]'::jsonb,
    '["literale", "book puzzle", "literature game", "book guessing game"]'::jsonb,
    'Play Literale',
    '/brainwave/literale',
    'Daily Challenge',
    true,
    6,
    true
  ),
  (
    '/brainwave/cryptodle',
    'brainwave',
    'game',
    'Cryptodle - Daily Cipher Puzzle',
    'Decode encrypted quotes and train logic, pattern recognition, and deduction.',
    'Cryptodle is the most logic-heavy Brainwave game and deserves strong page copy.',
    'Players decode a substitution cipher while learning the structure of the hidden text.',
    '["Logic puzzle", "Daily refresh", "Cipher decoding"]'::jsonb,
    '[{"question":"What is Cryptodle?","answer":"Cryptodle is a daily substitution-cipher puzzle where you decode encrypted text."}]'::jsonb,
    '["cryptodle", "cipher puzzle", "logic game", "brain teaser"]'::jsonb,
    'Play Cryptodle',
    '/brainwave/cryptodle',
    'Daily Challenge',
    true,
    7,
    true
  ),
  (
    '/brainwave/creaturedle',
    'brainwave',
    'game',
    'Creaturedle - Daily Animal Guessing Game',
    'Guess the animal from six attributes including habitat, diet, and body covering.',
    'Creaturedle is an animal puzzle built around wildlife knowledge and biology clues.',
    'The six-attribute format gives players a clear path to the answer.',
    '["Animal trivia", "Daily refresh", "Biology and habitat clues"]'::jsonb,
    '[{"question":"How does Creaturedle work?","answer":"You identify the animal using six structured attributes and feedback after each guess."}]'::jsonb,
    '["creaturedle", "animal puzzle", "wildlife game", "biology game"]'::jsonb,
    'Play Creaturedle',
    '/brainwave/creaturedle',
    'Daily Challenge',
    true,
    8,
    true
  ),
  (
    '/brainwave/foodle',
    'brainwave',
    'game',
    'Foodle - Daily Food Puzzle',
    'Guess the dish from cuisine, ingredients, cooking method, flavor, and temperature clues.',
    'Foodle is a culinary deduction game for players who enjoy food and cooking trivia.',
    'The attribute-based format makes the rules easy to understand and quick to play.',
    '["Food trivia", "Daily refresh", "Cuisine and ingredient clues"]'::jsonb,
    '[{"question":"What is Foodle?","answer":"Foodle is a daily food guessing game where you identify a dish from structured clues."}]'::jsonb,
    '["foodle", "food puzzle", "cuisine game", "cooking trivia"]'::jsonb,
    'Play Foodle',
    '/brainwave/foodle',
    'Daily Challenge',
    true,
    9,
    true
  ),
  (
    '/brainwave/landmarkdle',
    'brainwave',
    'game',
    'Landmarkdle - Daily Landmark Puzzle',
    'Guess famous landmarks from structural clues like location, architect, height, and material.',
    'Landmarkdle is a travel and architecture puzzle built around famous places.',
    'Players use location and design clues to solve iconic world landmarks.',
    '["Architecture", "Daily refresh", "Travel and place clues"]'::jsonb,
    '[{"question":"How do I play Landmarkdle?","answer":"Use the landmark attributes and feedback to identify the correct famous place."}]'::jsonb,
    '["landmarkdle", "landmark puzzle", "architecture game", "travel game"]'::jsonb,
    'Play Landmarkdle',
    '/brainwave/landmarkdle',
    'Daily Challenge',
    true,
    10,
    true
  ),
  (
    '/brainwave/inventionle',
    'brainwave',
    'game',
    'Inventionle - Daily Invention Puzzle',
    'Guess the invention from clues about inventor, year, purpose, and impact.',
    'Inventionle is the innovation puzzle for players who enjoy science, history, and technology.',
    'Its clue structure makes the page easy to explain to both casual users and search engines.',
    '["Innovation", "Daily refresh", "Inventor and era clues"]'::jsonb,
    '[{"question":"What is Inventionle?","answer":"Inventionle is a daily puzzle where you identify an invention from structured historical clues."}]'::jsonb,
    '["inventionle", "invention puzzle", "technology game", "science trivia"]'::jsonb,
    'Play Inventionle',
    '/brainwave/inventionle',
    'Daily Challenge',
    true,
    11,
    true
  ),
  (
    '/brainwave/synonymle',
    'brainwave',
    'game',
    'Synonymle - Daily Word Guessing Puzzle',
    'Guess the word using semantic similarity, synonyms, and vocabulary clues.',
    'Synonymle is the language-focused Brainwave game built for word lovers.',
    'It rewards vocabulary, meaning, and an understanding of how words relate to one another.',
    '["Vocabulary", "Daily refresh", "Meaning and synonym clues"]'::jsonb,
    '[{"question":"What is Synonymle?","answer":"Synonymle is a word puzzle where semantic similarity and synonyms guide your guesses."}]'::jsonb,
    '["synonymle", "word puzzle", "vocabulary game", "semantic game"]'::jsonb,
    'Play Synonymle',
    '/brainwave/synonymle',
    'Daily Challenge',
    true,
    12,
    true
  ),
  (
    '/word-games',
    'word-games',
    'hub',
    'Word Games Collection',
    'Play free word games including Cryptogram, Spelling Bee, Boggle, Word Search, Word Ladder, Crossgrid, Word Connect, and Anagram Scramble.',
    'Word Games is the vocabulary hub for players who want classic word challenges and letter-based puzzles.',
    'This section is evergreen, so the copy can stay stable while the games themselves continue to evolve.',
    '["Evergreen hub", "Vocabulary focus", "Classic word puzzles"]'::jsonb,
    '[{"question":"What are word games here?","answer":"They are classic vocabulary and spelling challenges that do not depend on a daily reset."}]'::jsonb,
    '["word games", "vocabulary games", "spelling games", "logic words", "word connect", "anagram scramble"]'::jsonb,
    'Explore Word Games',
    '/word-games',
    'Word Game Hub',
    false,
    0,
    true
  ),
  (
    '/word-games/cryptogram',
    'word-games',
    'game',
    'Cryptogram',
    'Decode encrypted text in a classic word puzzle that tests vocabulary and logic.',
    'Cryptogram is a classic cipher puzzle where the player rebuilds the message letter by letter.',
    'The game is evergreen, so the copy should describe the puzzle instead of a daily target.',
    '["Cipher logic", "Vocabulary", "Evergreen puzzle"]'::jsonb,
    '[{"question":"How does Cryptogram work?","answer":"You decode the substitution cipher and reveal the hidden text."}]'::jsonb,
    '["cryptogram", "cipher puzzle", "decode quotes", "word puzzle"]'::jsonb,
    'Play Cryptogram',
    '/word-games/cryptogram',
    'Classic Puzzle',
    false,
    1,
    true
  ),
  (
    '/word-games/spelling-bee',
    'word-games',
    'game',
    'Spelling Bee',
    'Create words from a honeycomb of letters and chase high-value bonuses.',
    'Spelling Bee is a vocabulary challenge built around letter combinations and word discovery.',
    'It is a perfect evergreen page for players who like structured word formation games.',
    '["Letter grid", "Vocabulary", "Bonus word discovery"]'::jsonb,
    '[{"question":"What is Spelling Bee?","answer":"It is a word formation puzzle where you build words from the given letters."}]'::jsonb,
    '["spelling bee game", "word formation puzzle", "vocabulary challenge"]'::jsonb,
    'Play Spelling Bee',
    '/word-games/spelling-bee',
    'Classic Puzzle',
    false,
    2,
    true
  ),
  (
    '/word-games/boggle',
    'word-games',
    'game',
    'Boggle',
    'Find as many words as possible in a timed letter grid.',
    'Boggle is the classic word hunt where speed and vocabulary work together.',
    'Evergreen copy should focus on how to play and why the game is fun.',
    '["Timed challenge", "Word search", "Vocabulary speed"]'::jsonb,
    '[{"question":"How do I play Boggle?","answer":"Connect letters to form as many valid words as possible before time runs out."}]'::jsonb,
    '["boggle word game", "letter grid puzzle", "word search challenge"]'::jsonb,
    'Play Boggle',
    '/word-games/boggle',
    'Classic Puzzle',
    false,
    3,
    true
  ),
  (
    '/word-games/word-search',
    'word-games',
    'game',
    'Word Search',
    'Find hidden words in a themed letter grid across multiple directions.',
    'Word Search is a timeless puzzle that rewards scanning, pattern recognition, and focus.',
    'The page should explain the directions and puzzle structure clearly.',
    '["Hidden words", "Pattern recognition", "Classic puzzle"]'::jsonb,
    '[{"question":"How do I play Word Search?","answer":"Locate the hidden words in the grid by scanning every direction."}]'::jsonb,
    '["word search puzzle", "hidden word game", "letter matrix challenge"]'::jsonb,
    'Play Word Search',
    '/word-games/word-search',
    'Classic Puzzle',
    false,
    4,
    true
  ),
  (
    '/word-games/word-ladder',
    'word-games',
    'game',
    'Word Ladder',
    'Transform one word into another one letter at a time.',
    'Word Ladder is a logic puzzle about small changes that create a new word at every step.',
    'This page should explain the transformation mechanic in plain language.',
    '["Transformation", "Vocabulary", "Logic puzzle"]'::jsonb,
    '[{"question":"What is Word Ladder?","answer":"You change one letter at a time until the start word becomes the end word."}]'::jsonb,
    '["word ladder game", "word transformation puzzle", "vocabulary builder"]'::jsonb,
    'Play Word Ladder',
    '/word-games/word-ladder',
    'Classic Puzzle',
    false,
    5,
    true
  ),
  (
    '/word-games/crossgrid',
    'word-games',
    'game',
    'Crossgrid',
    'Solve a compact clue-based word square where rows and columns both form words.',
    'Crossgrid combines crossword style clues with word-square logic in a small, fast format.',
    'A short rules block should help users understand the across and down interplay.',
    '["Word square", "Clue solving", "Logic and vocabulary"]'::jsonb,
    '[{"question":"What is Crossgrid?","answer":"It is a compact word-square puzzle where both rows and columns must form valid words."}]'::jsonb,
    '["crossgrid puzzle", "mini crossword game", "word square challenge"]'::jsonb,
    'Play Crossgrid',
    '/word-games/crossgrid',
    'Classic Puzzle',
    false,
    6,
    true
  ),
  (
    '/word-games/word-connect',
    'word-games',
    'game',
    'Word Connect - Letter Bank Puzzle',
    'Connect the letters to build valid words and clear the target list.',
    'Word Connect is a classic letter-bank game where you swipe or tap letters to discover words hidden in the bank.',
    'Each round mixes target words and bonus finds, keeping the game fast, replayable, and easy to learn.',
    '["Letter bank", "Bonus words", "Dictionary validation"]'::jsonb,
    '[{"question":"What is Word Connect?","answer":"Word Connect is a letter-bank word game where you connect letters to build valid dictionary words."},{"question":"How do I play Word Connect?","answer":"Tap or swipe letters to build words, submit them, and fill the target list for the round."},{"question":"Are bonus words allowed?","answer":"Yes. Valid extra words can score points even if they are not part of the target list."},{"question":"Is Word Connect free to play?","answer":"Yes. Word Connect is free to play and uses lightweight dictionary validation."}]'::jsonb,
    '["word connect", "letter bank game", "word building puzzle", "word connection game"]'::jsonb,
    'Play Word Connect',
    '/word-games/word-connect',
    'Letter Bank',
    false,
    7,
    true
  ),
  (
    '/word-games/anagram-scramble',
    'word-games',
    'game',
    'Anagram Scramble - Daily Word Twist',
    'Unscramble letters and build as many valid words as possible from a fixed letter bank.',
    'Anagram Scramble is a lightweight text-twist style game with strict letter-count validation.',
    'Find the main word and bonus words using only the letters on the board.',
    '["Letter bank", "Bonus words", "Rule-based validation"]'::jsonb,
    '[{"question":"What is Anagram Scramble?","answer":"Anagram Scramble is a text-twist style puzzle where you build valid words from a scrambled letter bank."},{"question":"How do I score points?","answer":"Each accepted word counts toward your progress, and longer finds help you clear the full word bank."},{"question":"Can I shuffle the letters?","answer":"Yes. You can reshuffle the displayed letters without changing the underlying letter bank."},{"question":"Is Anagram Scramble free to play?","answer":"Yes. It is an evergreen word puzzle and is free to play."}]'::jsonb,
    '["anagram scramble", "word scramble game", "text twist style puzzle", "letter bank puzzle"]'::jsonb,
    'Play Scramble',
    '/word-games/anagram-scramble',
    'Letter Bank',
    false,
    8,
    true
  ),
  (
    '/number-puzzles',
    'number-puzzles',
    'hub',
    'Number Puzzles Collection',
    'Play free math and logic puzzles including 2048, Prime Hunter, Number Sequence, Number Tower, Sudoku, Kakuro, KenKen, and Number Bonds.',
    'Number Puzzles is the math and logic hub for players who enjoy strategy, deduction, and pattern recognition.',
    'This section is evergreen, so the content can stay stable while the puzzle catalog grows.',
    '["Evergreen hub", "Math and logic", "Strategic puzzles"]'::jsonb,
    '[{"question":"What are number puzzles?","answer":"They are logic and math games that rely on reasoning rather than a daily reset."}]'::jsonb,
    '["number puzzles", "math games", "logic puzzles", "strategy puzzles", "kenken", "number bonds"]'::jsonb,
    'Explore Number Puzzles',
    '/number-puzzles',
    'Number Puzzle Hub',
    false,
    0,
    true
  ),
  (
    '/number-puzzles/2048',
    'number-puzzles',
    'game',
    '2048',
    'Merge matching tiles to reach 2048 and beyond in this classic strategy puzzle.',
    '2048 is the signature number puzzle for players who like planning and spatial reasoning.',
    'Explain the merge mechanic and the objective clearly on the landing page.',
    '["Tile merge", "Strategy", "Evergreen puzzle"]'::jsonb,
    '[{"question":"How do I play 2048?","answer":"Swipe tiles together to merge matching numbers and reach the target tile."}]'::jsonb,
    '["2048 game", "tile merge puzzle", "number puzzle", "strategy game"]'::jsonb,
    'Play 2048',
    '/number-puzzles/2048',
    'Classic Puzzle',
    false,
    1,
    true
  ),
  (
    '/number-puzzles/prime-hunter',
    'number-puzzles',
    'game',
    'Prime Hunter',
    'Identify prime numbers inside a grid and test your number theory instincts.',
    'Prime Hunter is a number theory puzzle built for players who like fast mathematical decisions.',
    'The page should explain what counts as prime and how the hunt works.',
    '["Number theory", "Pattern spotting", "Evergreen puzzle"]'::jsonb,
    '[{"question":"What is Prime Hunter?","answer":"It is a puzzle where you identify prime numbers in the grid."}]'::jsonb,
    '["prime numbers game", "math challenge", "number theory", "prime identification"]'::jsonb,
    'Play Prime Hunter',
    '/number-puzzles/prime-hunter',
    'Classic Puzzle',
    false,
    2,
    true
  ),
  (
    '/number-puzzles/number-sequence',
    'number-puzzles',
    'game',
    'Number Sequence',
    'Find the pattern and complete the number sequence.',
    'Number Sequence is a pattern recognition puzzle that rewards careful reasoning.',
    'Make the rule-set obvious so players know what kind of sequences they are solving.',
    '["Patterns", "Logic", "Evergreen puzzle"]'::jsonb,
    '[{"question":"How does Number Sequence work?","answer":"You identify the pattern and predict the next number in the sequence."}]'::jsonb,
    '["number patterns", "sequence puzzle", "math logic", "pattern recognition"]'::jsonb,
    'Play Number Sequence',
    '/number-puzzles/number-sequence',
    'Classic Puzzle',
    false,
    3,
    true
  ),
  (
    '/number-puzzles/number-tower',
    'number-puzzles',
    'game',
    'Number Tower',
    'Stack numbers to reach target sums in a strategic tower challenge.',
    'Number Tower blends arithmetic with spatial planning and limited moves.',
    'A rules block should explain how stacking and totals interact.',
    '["Arithmetic", "Spatial reasoning", "Evergreen puzzle"]'::jsonb,
    '[{"question":"What is Number Tower?","answer":"It is a number puzzle where you build a tower to match target sums."}]'::jsonb,
    '["addition game", "math towers", "number stacking", "spatial reasoning"]'::jsonb,
    'Play Number Tower',
    '/number-puzzles/number-tower',
    'Classic Puzzle',
    false,
    4,
    true
  ),
  (
    '/number-puzzles/sudoku',
    'number-puzzles',
    'game',
    'Sudoku',
    'Solve the classic 9x9 logic grid by placing numbers 1 through 9 without repeats.',
    'Sudoku is the evergreen logic puzzle for concentration, deduction, and patience.',
    'The landing page should clearly explain row, column, and box rules.',
    '["Logic grid", "Deduction", "Evergreen puzzle"]'::jsonb,
    '[{"question":"How do I play Sudoku?","answer":"Fill the grid so each row, column, and box contains the numbers 1 to 9 exactly once."}]'::jsonb,
    '["sudoku puzzle", "number grid", "logic game", "concentration"]'::jsonb,
    'Play Sudoku',
    '/number-puzzles/sudoku',
    'Classic Puzzle',
    false,
    5,
    true
  ),
  (
    '/number-puzzles/kakuro',
    'number-puzzles',
    'game',
    'Kakuro',
    'Solve cross-sum clues by filling runs with distinct digits that match the total.',
    'Kakuro is a crossword-style arithmetic puzzle that blends numbers and logic.',
    'A short rules section should explain the run sums and no-repeat rule.',
    '["Arithmetic", "Logic", "Evergreen puzzle"]'::jsonb,
    '[{"question":"What is Kakuro?","answer":"It is a cross-sum puzzle where each run must match the clue total with no repeated digits."}]'::jsonb,
    '["kakuro puzzle", "cross sums game", "number crossword", "arithmetic logic puzzle"]'::jsonb,
    'Play Kakuro',
    '/number-puzzles/kakuro',
    'Classic Puzzle',
    false,
    6,
    true
  ),
  (
    '/number-puzzles/kenken',
    'number-puzzles',
    'game',
    'KenKen - Daily Math Puzzle',
    'Fill a 4x4 KenKen grid using row, column, and cage arithmetic rules.',
    'KenKen is a compact cage arithmetic puzzle for players who enjoy logic and math.',
    'Use the target labels on each cage to work out the only valid numbers in every row and column.',
    '["Cage arithmetic", "Row and column logic", "Compact 4x4 grid"]'::jsonb,
    '[{"question":"What is KenKen?","answer":"KenKen is a cage arithmetic puzzle where every row and column uses the numbers 1 through 4 once."},{"question":"How do cages work?","answer":"Each cage must match its arithmetic target using addition or multiplication."},{"question":"Is KenKen daily?","answer":"This version is evergreen and rule-based, with a rotating lightweight puzzle."},{"question":"Is KenKen free to play?","answer":"Yes. KenKen is free to play and works entirely on the client."}]'::jsonb,
    '["kenken", "mathdoku", "cage arithmetic", "logic puzzle"]'::jsonb,
    'Play KenKen',
    '/number-puzzles/kenken',
    'Math Logic',
    false,
    7,
    true
  ),
  (
    '/number-puzzles/number-bonds',
    'number-puzzles',
    'game',
    'Number Bonds - Pair Sum Puzzle',
    'Match pairs that add up to the target sum and clear the board.',
    'Number Bonds is a quick arithmetic puzzle built on one simple rule.',
    'Find every pair that makes the target number before moving to the next round.',
    '["Addition puzzle", "Quick thinking", "Easy to learn"]'::jsonb,
    '[{"question":"What is Number Bonds?","answer":"Number Bonds is a pair-matching puzzle where each pair adds up to the target sum."},{"question":"How do I solve it?","answer":"Pick two numbers that make the target and clear all the pairs on the board."},{"question":"Is it a daily puzzle?","answer":"This is an evergreen logic puzzle with a few rotating puzzle layouts."},{"question":"Is Number Bonds free to play?","answer":"Yes. It is free to play and does not require any external services."}]'::jsonb,
    '["number bonds", "pair sum puzzle", "addition game", "math puzzle"]'::jsonb,
    'Play Bonds',
    '/number-puzzles/number-bonds',
    'Bond Match',
    false,
    8,
    true
  ),
  (
    '/retro-games',
    'retro-games',
    'hub',
    'Retro Games Collection',
    'Play classic arcade games including Snake, Pong, Tetris, Minesweeper, Pacman, Breakout, and Space Invaders.',
    'Retro Games is the arcade hub for classic action, reflex, and strategy games.',
    'This section is evergreen and can stay stable as the game library expands.',
    '["Evergreen hub", "Classic arcade", "Reflex and strategy"]'::jsonb,
    '[{"question":"What are retro games here?","answer":"They are classic arcade-style games that do not depend on a daily refresh."}]'::jsonb,
    '["retro games", "arcade games", "classic games", "old school games"]'::jsonb,
    'Explore Retro Games',
    '/retro-games',
    'Retro Game Hub',
    false,
    0,
    true
  ),
  (
    '/retro-games/tic-tac-toe',
    'retro-games',
    'game',
    'Tic Tac Toe',
    'Play the classic Xs and Os strategy game on a 3x3 grid.',
    'Tic Tac Toe is the simplest retro game and a perfect evergreen landing page.',
    'The page should explain win conditions and the two-player or AI mode.',
    '["Classic strategy", "Two-player fun", "Evergreen game"]'::jsonb,
    '[{"question":"How do I play Tic Tac Toe?","answer":"Place Xs or Os in a 3x3 grid and try to get three in a row."}]'::jsonb,
    '["tic tac toe", "noughts and crosses", "two-player game", "classic strategy game"]'::jsonb,
    'Play Tic Tac Toe',
    '/retro-games/tic-tac-toe',
    'Classic Arcade',
    false,
    1,
    true
  ),
  (
    '/retro-games/snake',
    'retro-games',
    'game',
    'Snake',
    'Guide a growing snake, eat food, and avoid collisions in this arcade classic.',
    'Snake is a reflex game that rewards control, timing, and planning ahead.',
    'The landing page should explain growth, speed, and collision rules.',
    '["Reflexes", "Arcade classic", "Evergreen game"]'::jsonb,
    '[{"question":"How does Snake work?","answer":"Move the snake to eat food and avoid crashing into walls or yourself."}]'::jsonb,
    '["snake", "arcade game", "growing snake", "classic mobile game"]'::jsonb,
    'Play Snake',
    '/retro-games/snake',
    'Classic Arcade',
    false,
    2,
    true
  ),
  (
    '/retro-games/pong',
    'retro-games',
    'game',
    'Pong',
    'Play the original table tennis arcade game that started it all.',
    'Pong is the foundational arcade experience for players who like simple competitive games.',
    'Explain the paddle control and scoring in a short rules block.',
    '["Arcade history", "Two-player competition", "Evergreen game"]'::jsonb,
    '[{"question":"What is Pong?","answer":"It is a simple paddle game where you return the ball and score against your opponent."}]'::jsonb,
    '["pong", "table tennis", "arcade game", "competitive game"]'::jsonb,
    'Play Pong',
    '/retro-games/pong',
    'Classic Arcade',
    false,
    3,
    true
  ),
  (
    '/retro-games/minesweeper',
    'retro-games',
    'game',
    'Minesweeper',
    'Clear the board without detonating hidden mines using logic and deduction.',
    'Minesweeper is the classic logic game that rewards careful thinking and pattern awareness.',
    'A short rules section should explain number clues and flagging.',
    '["Logic puzzle", "Deduction", "Evergreen game"]'::jsonb,
    '[{"question":"How do I play Minesweeper?","answer":"Reveal safe squares, use number clues, and flag tiles you believe contain mines."}]'::jsonb,
    '["minesweeper", "logic puzzle", "mine detection game", "strategy game"]'::jsonb,
    'Play Minesweeper',
    '/retro-games/minesweeper',
    'Classic Arcade',
    false,
    4,
    true
  ),
  (
    '/retro-games/tetris',
    'retro-games',
    'game',
    'Tetris',
    'Arrange falling blocks to clear lines in the iconic puzzle game.',
    'Tetris is one of the most recognizable evergreen puzzle experiences in gaming.',
    'The copy should explain line clearing and increasing speed.',
    '["Block puzzle", "Fast reflexes", "Evergreen game"]'::jsonb,
    '[{"question":"What is Tetris?","answer":"It is a block puzzle where you rotate pieces to clear complete lines."}]'::jsonb,
    '["tetris", "block puzzle", "falling blocks", "line clear game"]'::jsonb,
    'Play Tetris',
    '/retro-games/tetris',
    'Classic Arcade',
    false,
    5,
    true
  ),
  (
    '/retro-games/space-invaders',
    'retro-games',
    'game',
    'Space Invaders',
    'Defend Earth from alien invaders in the original arcade shooter.',
    'Space Invaders is a fast retro shooter with clear survival stakes and arcade history.',
    'A rules block should explain movement, shooting, and wave clearing.',
    '["Arcade shooter", "Retro classic", "Evergreen game"]'::jsonb,
    '[{"question":"How do I play Space Invaders?","answer":"Move your ship, shoot the invaders, and survive each wave."}]'::jsonb,
    '["space invaders", "alien shooter", "classic arcade game", "spaceship defense"]'::jsonb,
    'Play Space Invaders',
    '/retro-games/space-invaders',
    'Classic Arcade',
    false,
    6,
    true
  ),
  (
    '/retro-games/pacman',
    'retro-games',
    'game',
    'PacMan',
    'Navigate a maze, collect dots, and avoid ghosts in the classic arcade maze game.',
    'PacMan is a timeless retro maze game with clear rules and strong nostalgic value.',
    'The page should explain maze movement, ghosts, and power pellets.',
    '["Maze chase", "Arcade classic", "Evergreen game"]'::jsonb,
    '[{"question":"How does PacMan work?","answer":"Collect dots in the maze while avoiding ghosts and using power pellets."}]'::jsonb,
    '["pac-man", "maze game", "ghost avoidance", "classic arcade game"]'::jsonb,
    'Play PacMan',
    '/retro-games/pacman',
    'Classic Arcade',
    false,
    7,
    true
  ),
  (
    '/retro-games/breakout',
    'retro-games',
    'game',
    'Breakout',
    'Bounce the ball to break bricks and clear each level in the classic brick breaker.',
    'Breakout is an evergreen arcade classic built around paddle control and timing.',
    'A short rules block should explain paddle movement and brick clearing.',
    '["Brick breaker", "Arcade classic", "Evergreen game"]'::jsonb,
    '[{"question":"What is Breakout?","answer":"It is a paddle game where you bounce a ball to break the bricks above you."}]'::jsonb,
    '["arkanoid", "breakout", "brick breaker", "paddle game"]'::jsonb,
    'Play Breakout',
    '/retro-games/breakout',
    'Classic Arcade',
    false,
    8,
    true
  )
on conflict (route_path) do update
set
  section = excluded.section,
  page_kind = excluded.page_kind,
  title = excluded.title,
  meta_description = excluded.meta_description,
  intro_text = excluded.intro_text,
  supporting_copy = excluded.supporting_copy,
  highlights = excluded.highlights,
  faq_items = excluded.faq_items,
  keywords = excluded.keywords,
  cta_label = excluded.cta_label,
  cta_href = excluded.cta_href,
  hero_label = excluded.hero_label,
  is_daily_refresh = excluded.is_daily_refresh,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

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

update public.game_pages
set
  hero_label = 'Ready when you are',
  landing_headline = case route_path
    when '/brainwave' then 'Brainwave Trivia Games'
    when '/brainwave/plotle' then 'Start the daily Plotle challenge'
    when '/brainwave/capitale' then 'Start the daily Capitale challenge'
    when '/brainwave/historidle' then 'Start the daily Historidle challenge'
    when '/brainwave/celebrile' then 'Start the daily Celebrile challenge'
    when '/brainwave/songle' then 'Start the daily Songle challenge'
    when '/brainwave/literale' then 'Start the daily Literale challenge'
    when '/brainwave/cryptodle' then 'Start the daily Cryptodle challenge'
    when '/brainwave/creaturedle' then 'Start the daily Creaturedle challenge'
    when '/brainwave/foodle' then 'Start the daily Foodle challenge'
    when '/brainwave/landmarkdle' then 'Start the daily Landmarkdle challenge'
    when '/brainwave/inventionle' then 'Start the daily Inventionle challenge'
    when '/brainwave/synonymle' then 'Start the daily Synonymle challenge'
    else landing_headline
  end,
  play_notes = case route_path
    when '/brainwave' then '["Choose a puzzle that matches your interests.","Read the game rules before you start guessing.","Return daily for a fresh challenge and new leaderboard chances."]'::jsonb
    when '/brainwave/plotle' then '["Guess the movie in 6 attempts.","Use plot hints and feedback to narrow the title.","Click Play to reveal today’s film puzzle below."]'::jsonb
    when '/brainwave/capitale' then '["Guess the capital city in 6 attempts.","Use distance and direction clues to narrow the location.","Click Play to reveal today’s geography puzzle below."]'::jsonb
    when '/brainwave/historidle' then '["Guess the historical figure or event in 6 attempts.","Use dates, timeline clues, and feedback to narrow the answer.","Click Play to reveal today’s historical puzzle below."]'::jsonb
    when '/brainwave/celebrile' then '["Guess the celebrity in 6 attempts.","Use each clue and letter feedback to narrow the name.","Click Play to reveal today’s celebrity puzzle below."]'::jsonb
    when '/brainwave/songle' then '["Guess the song in 6 attempts.","Use lyrics, artist hints, and genre clues to narrow the track.","Click Play to reveal today’s music puzzle below."]'::jsonb
    when '/brainwave/literale' then '["Guess the book title in 6 attempts.","Use opening lines and literary clues to narrow the title.","Click Play to reveal today’s literature puzzle below."]'::jsonb
    when '/brainwave/cryptodle' then '["Decode the cipher in 6 attempts.","Use letter patterns and clues to reveal the hidden text.","Click Play to reveal today’s cipher puzzle below."]'::jsonb
    when '/brainwave/creaturedle' then '["Guess the animal in 6 attempts.","Use habitat, diet, and body clues to narrow the creature.","Click Play to reveal today’s animal puzzle below."]'::jsonb
    when '/brainwave/foodle' then '["Guess the dish in 6 attempts.","Use cuisine, ingredient, and cooking clues to narrow the answer.","Click Play to reveal today’s food puzzle below."]'::jsonb
    when '/brainwave/landmarkdle' then '["Guess the landmark in 6 attempts.","Use location, architect, and design clues to narrow the place.","Click Play to reveal today’s landmark puzzle below."]'::jsonb
    when '/brainwave/inventionle' then '["Guess the invention in 6 attempts.","Use inventor, year, and purpose clues to narrow the answer.","Click Play to reveal today’s invention puzzle below."]'::jsonb
    when '/brainwave/synonymle' then '["Guess the word in 6 attempts.","Use meaning, synonyms, and similarity clues to narrow the answer.","Click Play to reveal today’s word puzzle below."]'::jsonb
    else play_notes
  end
where section = 'brainwave';

update public.game_pages
set is_active = false
where route_path in (
  '/brainwave/automoble',
  '/brainwave/botanle',
  '/brainwave/citadle',
  '/brainwave/countridle',
  '/brainwave/trordle'
);

update public.game_pages
set og_image = case route_path
  when '/brainwave' then '/imgs/brainwave/brainwave-trivia-og.webp'
  when '/brainwave/plotle' then '/imgs/brainwave/plotle-og.webp'
  when '/brainwave/capitale' then '/imgs/brainwave/capitale-og.webp'
  when '/brainwave/historidle' then '/imgs/brainwave/historidle-og.webp'
  when '/brainwave/celebrile' then '/imgs/brainwave/celebrile-og.webp'
  when '/brainwave/songle' then '/imgs/brainwave/songle-og.webp'
  when '/brainwave/literale' then '/imgs/brainwave/literale-og.webp'
  when '/brainwave/cryptodle' then '/imgs/word-games/cryptogram.svg'
  when '/brainwave/creaturedle' then '/imgs/brainwave/creaturedle-og.webp'
  when '/brainwave/foodle' then '/imgs/brainwave/foodle-og.webp'
  when '/brainwave/landmarkdle' then '/imgs/brainwave/landmarkdle-og.webp'
  when '/brainwave/inventionle' then '/imgs/brainwave/inventionle-og.webp'
  when '/brainwave/synonymle' then '/imgs/brainwave/synonymle-og.webp'
  when '/word-games' then '/imgs/word-games/word-games.webp'
  when '/word-games/cryptogram' then '/imgs/word-games/word-cryptogram.webp'
  when '/word-games/spelling-bee' then '/imgs/word-games/spelling-bee.webp'
  when '/word-games/boggle' then '/imgs/word-games/boggle.webp'
  when '/word-games/word-search' then '/imgs/word-games/word-search.webp'
  when '/word-games/word-ladder' then '/imgs/word-games/word-ladder.webp'
  when '/word-games/crossgrid' then '/imgs/word-games/word-crossgrid.webp'
  when '/word-games/word-connect' then '/imgs/word-games/word-games.webp'
  when '/word-games/anagram-scramble' then '/imgs/word-games/word-scramble.webp'
  when '/number-puzzles' then '/imgs/number-puzzles.webp'
  when '/number-puzzles/2048' then '/imgs/number-puzzles/2048.webp'
  when '/number-puzzles/prime-hunter' then '/imgs/number-puzzles/prime-hunter.webp'
  when '/number-puzzles/number-sequence' then '/imgs/number-puzzles/number-sequence.webp'
  when '/number-puzzles/number-tower' then '/imgs/number-puzzles/number-tower.webp'
  when '/number-puzzles/sudoku' then '/imgs/number-puzzles/sudoku.webp'
  when '/number-puzzles/kakuro' then '/imgs/number-puzzles/kakuro.webp'
  when '/number-puzzles/kenken' then '/imgs/number-puzzles/number-puzzles.webp'
  when '/number-puzzles/number-bonds' then '/imgs/number-puzzles/number-puzzles.webp'
  when '/retro-games' then '/imgs/retro-games/retro-games-collection.webp'
  when '/retro-games/tic-tac-toe' then '/imgs/retro-games/tictactoe.webp'
  when '/retro-games/snake' then '/imgs/retro-games/snake.webp'
  when '/retro-games/pong' then '/imgs/retro-games/pong.webp'
  when '/retro-games/minesweeper' then '/imgs/retro-games/minesweeper.webp'
  when '/retro-games/tetris' then '/imgs/retro-games/tetris.webp'
  when '/retro-games/space-invaders' then '/imgs/retro-games/space-invaders.webp'
  when '/retro-games/pacman' then '/imgs/retro-games/pacman.webp'
  when '/retro-games/breakout' then '/imgs/retro-games/breakout.webp'
  else og_image
end
where route_path in (
  '/brainwave',
  '/brainwave/plotle',
  '/brainwave/capitale',
  '/brainwave/historidle',
  '/brainwave/celebrile',
  '/brainwave/songle',
  '/brainwave/literale',
  '/brainwave/cryptodle',
  '/brainwave/creaturedle',
  '/brainwave/foodle',
  '/brainwave/landmarkdle',
  '/brainwave/inventionle',
  '/brainwave/synonymle',
  '/word-games',
  '/word-games/cryptogram',
  '/word-games/spelling-bee',
  '/word-games/boggle',
  '/word-games/word-search',
  '/word-games/word-ladder',
  '/word-games/crossgrid',
  '/number-puzzles',
  '/number-puzzles/2048',
  '/number-puzzles/prime-hunter',
  '/number-puzzles/number-sequence',
  '/number-puzzles/number-tower',
  '/number-puzzles/sudoku',
  '/number-puzzles/kakuro',
  '/number-puzzles/number-bonds',
  '/retro-games',
  '/retro-games/tic-tac-toe',
  '/retro-games/snake',
  '/retro-games/pong',
  '/retro-games/minesweeper',
  '/retro-games/tetris',
  '/retro-games/space-invaders',
  '/retro-games/pacman',
  '/retro-games/breakout'
);
