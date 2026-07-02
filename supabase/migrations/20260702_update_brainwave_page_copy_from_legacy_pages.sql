-- Bring Brainwave game page copy in line with the legacy per-route pages.
-- The live app reads these fields from public.game_pages.

with brainwave_updates (
  route_path,
  title,
  meta_description,
  intro_text,
  supporting_copy,
  highlights,
  faq_items,
  keywords,
  cta_label,
  hero_label,
  og_image
) as (
  values
    (
      '/brainwave',
      'Brainwave Trivia Games - Creative Puzzle Challenges',
      'Enjoy our collection of creative brainwave trivia games including word puzzles, movie guessing, music challenges and geography quizzes.',
      'Challenge your mind with creative Brainwave trivia games including Capitale, Plotle, Songle and more.',
      'Explore daily and evergreen puzzle challenges built around movies, music, geography, books, vocabulary, food, science, history, celebrities, animals, plants, cities, countries, inventions, landmarks, and trivia.',
      '["Creative challenges", "Progressive difficulty", "Shareable results", "Mobile-friendly play"]'::jsonb,
      '[
        {"question":"What are Brainwave games?","answer":"Brainwave games are creative trivia and deduction puzzles where each page focuses on a specific theme such as movies, music, geography, vocabulary, books, plants, animals, or history."},
        {"question":"Are these games free to play?","answer":"Yes. Brainwave games are free to play on Triviaah."},
        {"question":"How often are new puzzles available?","answer":"Most Brainwave games refresh daily, giving you a new themed challenge to solve."},
        {"question":"Can I play on mobile devices?","answer":"Yes. Brainwave games are designed to work on desktop, tablet, and mobile screens."},
        {"question":"What if I cannot solve a puzzle?","answer":"Use the progressive clues and feedback to narrow the answer. Some games reveal stronger hints after wrong guesses."},
        {"question":"Can I share my results?","answer":"Yes. Many Brainwave puzzles support shareable results so you can compare with friends."}
      ]'::jsonb,
      '["brainwave trivia games", "creative puzzle challenges", "daily puzzle games", "word puzzles", "movie guessing game", "music challenge", "geography quiz", "trivia games"]'::jsonb,
      'Explore Brainwave',
      'Creative Puzzle Challenges',
      '/imgs/brainwave/brainwave-trivia.webp'
    ),
    (
      '/brainwave/plotle',
      'Plotle - Daily Movie Plot Puzzle',
      'Guess the movie from its 6-word plot summary with limited attempts, Wordle-style feedback on plot words. Daily movie guessing game for film lovers.',
      'Six-word plot summary puzzle. Guess the movie in 6 tries.',
      'Test your film knowledge with a daily movie puzzle where a compact plot clue, progressive hints, and Wordle-style feedback help you identify the title.',
      '["Movie trivia", "Six-word plot clues", "Wordle-style feedback", "Daily film puzzle"]'::jsonb,
      '[
        {"question":"What is Plotle?","answer":"Plotle is a daily movie guessing game where you identify a film from a short plot summary and feedback."},
        {"question":"How do I play Plotle?","answer":"Guess the movie in six attempts. Use the plot clue, feedback, and unlocked hints to narrow the answer."},
        {"question":"What makes Plotle popular?","answer":"It combines quick Wordle-style play with movie trivia, so film fans can test memory, genre knowledge, and plot recognition."},
        {"question":"Is Plotle educational?","answer":"Yes. Plotle helps players think about storytelling, genre, and cinema history while solving a short puzzle."},
        {"question":"What types of movies are included?","answer":"Plotle can include popular films across decades, genres, and countries."},
        {"question":"Is Plotle free to play?","answer":"Yes. Plotle is free to play on Triviaah."}
      ]'::jsonb,
      '["plotle", "movie puzzle", "daily movie guessing game", "film trivia", "movie plot game", "wordle movie", "cinema puzzle"]'::jsonb,
      'Play Plotle',
      'Daily Movie Plot Puzzle',
      '/imgs/brainwave/plotle.webp'
    ),
    (
      '/brainwave/capitale',
      'Capitale - Daily Capital City Guessing Game',
      'Guess the world capital city in 6 tries! Daily geography puzzle game similar to Wordle but with capital cities. Free, educational, and fun!',
      'Guess the world capital in 6 tries. Daily geography puzzle.',
      'Capitale is a daily capital city guessing game for geography fans, students, travelers, and puzzle players who want a fast educational challenge.',
      '["Capital cities", "Geography puzzle", "Six attempts", "Daily challenge"]'::jsonb,
      '[
        {"question":"What is Capitale?","answer":"Capitale is a daily capital city guessing game where you try to identify the target world capital in six tries."},
        {"question":"How do I play Capitale?","answer":"Enter capital city guesses and use the feedback to move closer to the correct answer."},
        {"question":"Are hints provided in Capitale?","answer":"Yes. Feedback and clues help you narrow down the world capital."},
        {"question":"Is Capitale free to play?","answer":"Yes. Capitale is free to play on Triviaah."},
        {"question":"What happens if I do not guess correctly in 6 tries?","answer":"The answer is revealed and you can come back for the next daily puzzle."}
      ]'::jsonb,
      '["capitale", "capital city game", "geography puzzle", "daily geography game", "world capitals quiz", "wordle geography", "capital guessing game", "educational games", "free trivia", "online geography games", "daily puzzle", "world capitals", "geography trivia"]'::jsonb,
      'Play Capitale',
      'Daily Capital City Game',
      '/imgs/brainwave/capitale.webp'
    ),
    (
      '/brainwave/historidle',
      'Historidle - Daily Historical Puzzle',
      'Guess the historical figure or event from emojis and progressive clues with limited attempts, Wordle-style feedback. Unlock more historical hints with each wrong guess!',
      'Guess the historical figure or event from dates and progressive clues.',
      'Historidle blends history trivia with deduction. Use dates, clue reveals, and limited attempts to solve the daily historical figure or event.',
      '["History trivia", "Dates and clues", "Limited attempts", "Daily historical puzzle"]'::jsonb,
      '[
        {"question":"What is Historidle?","answer":"Historidle is a daily history puzzle where you guess a historical figure or event from dates and progressive clues."},
        {"question":"How do I play Historidle?","answer":"Use the historical clues, dates, and feedback to identify the answer within the allowed attempts."},
        {"question":"What kinds of history are included?","answer":"Historidle can include major figures, events, eras, discoveries, conflicts, and cultural milestones."},
        {"question":"Is Historidle educational?","answer":"Yes. The clues are designed to reinforce historical knowledge while keeping the puzzle quick to play."},
        {"question":"Is Historidle free to play?","answer":"Yes. Historidle is free to play on Triviaah."}
      ]'::jsonb,
      '["historidle", "daily historical puzzle", "history puzzle", "historical figure game", "historical event game", "history trivia", "wordle history", "daily puzzle"]'::jsonb,
      'Play Historidle',
      'Daily Historical Puzzle',
      '/imgs/brainwave/historidle.webp'
    ),
    (
      '/brainwave/celebrile',
      'Celebrile - Daily Celebrity Guessing Game',
      'Guess the celebrity from progressive clues in 6 tries! Wordle-style letter feedback. Unlock more hints with each wrong guess. Free daily entertainment puzzle.',
      'Guess the celebrity from progressive clues in 6 tries.',
      'Celebrile is a daily entertainment puzzle where pop culture knowledge, name feedback, and clue reveals help you identify the celebrity.',
      '["Celebrity clues", "Pop culture", "Six attempts", "Daily entertainment puzzle"]'::jsonb,
      '[
        {"question":"What is Celebrile?","answer":"Celebrile is a daily celebrity guessing game where you identify a famous person from progressive clues."},
        {"question":"How do I play Celebrile?","answer":"Guess the celebrity in six tries and use clue reveals plus name feedback to narrow the answer."},
        {"question":"What types of clues are provided?","answer":"Clues may point to the celebrity''s work, achievements, field, nationality, era, or public identity."},
        {"question":"How does the letter feedback work?","answer":"Feedback helps show which letters are useful so you can refine later guesses."},
        {"question":"Is Celebrile free to play?","answer":"Yes. Celebrile is free to play on Triviaah."},
        {"question":"What happens if I do not guess correctly in 6 tries?","answer":"The answer is revealed and a new challenge is available on the next refresh."}
      ]'::jsonb,
      '["celebrile", "celebrity guessing game", "daily celebrity puzzle", "celebrity trivia", "pop culture puzzle", "entertainment puzzle", "wordle celebrity"]'::jsonb,
      'Play Celebrile',
      'Daily Celebrity Guessing Game',
      '/imgs/brainwave/celebrile.webp'
    ),
    (
      '/brainwave/songle',
      'Songle - Daily Song Guessing Puzzle',
      'Guess the song from clues like lyrics, artist, and genre. A daily Wordle-style music puzzle game that tests your knowledge of music across decades and genres.',
      'Guess the song from clues like lyrics, artist, and genre.',
      'Songle is a daily music puzzle for players who recognize lyrics, artists, genres, decades, and musical clues.',
      '["Music trivia", "Lyrics and artist clues", "Genre clues", "Daily song puzzle"]'::jsonb,
      '[
        {"question":"What is Songle?","answer":"Songle is a daily song guessing game where you identify a track from music clues such as lyrics, artist, and genre."},
        {"question":"How do I play Songle?","answer":"Use each clue to guess the song. More information helps you narrow the answer across attempts."},
        {"question":"What types of clues does Songle provide?","answer":"Songle can use lyric hints, artist information, genre, era, and other music-related clues."},
        {"question":"Is Songle educational?","answer":"Yes. Songle builds music knowledge across artists, decades, genres, and song history."},
        {"question":"What types of music are included?","answer":"Songle can include songs from different decades, styles, genres, and levels of popularity."},
        {"question":"Is Songle free to play?","answer":"Yes. Songle is free to play on Triviaah."}
      ]'::jsonb,
      '["songle", "daily song guessing puzzle", "music puzzle", "song guessing game", "lyrics game", "artist clues", "genre clues", "wordle music"]'::jsonb,
      'Play Songle',
      'Daily Song Guessing Puzzle',
      '/imgs/brainwave/songle.webp'
    ),
    (
      '/brainwave/literale',
      'Literale - Daily Literature Puzzle',
      'Guess the book title from opening lines and progressive clues with limited attempts, Wordle-style feedback on title letters. Unlock more hints with each wrong guess!',
      'Guess the book from opening lines and clues in 6 tries.',
      'Literale is a daily book guessing game where opening lines, literary clues, and title feedback help readers identify the correct book.',
      '["Book trivia", "Opening lines", "Literary clues", "Daily literature puzzle"]'::jsonb,
      '[
        {"question":"What is Literale?","answer":"Literale is a daily literature puzzle where you guess the book title using opening lines and progressive literary clues."},
        {"question":"How do I play Literale?","answer":"You have six attempts to guess the daily book title. Use opening lines, unlocked hints, and title feedback to solve it."},
        {"question":"What types of clues does Literale provide?","answer":"Clues can include opening lines, author context, genre, publication era, and other book details."},
        {"question":"Is Literale educational?","answer":"Yes. Literale helps players discover books, authors, genres, and literary history."},
        {"question":"What types of books are included?","answer":"Literale can include classics, modern fiction, popular books, and well-known literary works."},
        {"question":"Is Literale free to play?","answer":"Yes. Literale is free to play on Triviaah."}
      ]'::jsonb,
      '["literale", "daily literature puzzle", "book guessing game", "opening lines game", "literature trivia", "book title puzzle", "wordle books"]'::jsonb,
      'Play Literale',
      'Daily Literature Puzzle',
      '/imgs/brainwave/literale.webp'
    ),
    (
      '/brainwave/creaturedle',
      'Creaturedle - Daily Animal Guessing Game',
      'Guess the animal from its 6 attributes: class, habitat, diet, size, activity, and body covering. Educational Wordle-style animal puzzle for nature lovers.',
      'Guess the animal from its 6 attributes: class, habitat, diet, size, activity, and body covering.',
      'Creaturedle is a daily animal puzzle for nature lovers. Use structured wildlife attributes and feedback to identify the creature.',
      '["Animal trivia", "Six attributes", "Nature puzzle", "Educational wildlife game"]'::jsonb,
      '[
        {"question":"What is Creaturedle?","answer":"Creaturedle is a daily animal guessing game where you identify a creature from attributes such as class, habitat, diet, size, activity, and body covering."},
        {"question":"How do I play Creaturedle?","answer":"Guess an animal and compare its attributes with the target until you narrow down the answer."},
        {"question":"What types of animals are included?","answer":"Creaturedle can include mammals, birds, reptiles, amphibians, fish, insects, and other creatures."},
        {"question":"Is Creaturedle educational?","answer":"Yes. It teaches biology, habitat, diet, and animal classification through play."},
        {"question":"Is Creaturedle free to play?","answer":"Yes. Creaturedle is free to play on Triviaah."}
      ]'::jsonb,
      '["creaturedle", "animal guessing game", "daily animal puzzle", "wildlife game", "biology puzzle", "nature trivia", "educational animal game"]'::jsonb,
      'Play Creaturedle',
      'Daily Animal Guessing Game',
      '/imgs/brainwave/creaturedle.webp'
    ),
    (
      '/brainwave/foodle',
      'Foodle - Daily Food Puzzle',
      'Guess the food from its 6 attributes: cuisine, course, main ingredients, cooking method, flavor profile, and temperature. Wordle-style food guessing game.',
      'Guess the food from its 6 attributes: cuisine, course, main ingredients, cooking method, flavor profile, and temperature.',
      'Foodle is a daily food guessing game for players who enjoy cuisines, ingredients, cooking methods, and culinary trivia.',
      '["Food trivia", "Cuisine clues", "Ingredient clues", "Daily food puzzle"]'::jsonb,
      '[
        {"question":"What is Foodle?","answer":"Foodle is a daily food puzzle where you identify a dish from cuisine, course, ingredients, cooking method, flavor profile, and temperature."},
        {"question":"How do I play Foodle?","answer":"Guess a food and use the attribute feedback to move closer to the target dish."},
        {"question":"What kinds of foods are included?","answer":"Foodle can include dishes, snacks, desserts, drinks, and foods from many cuisines."},
        {"question":"Is Foodle educational?","answer":"Yes. Foodle helps players learn about cuisines, ingredients, and cooking traditions."},
        {"question":"Is Foodle free to play?","answer":"Yes. Foodle is free to play on Triviaah."}
      ]'::jsonb,
      '["foodle", "daily food puzzle", "food guessing game", "cuisine game", "cooking trivia", "ingredient clues", "wordle food"]'::jsonb,
      'Play Foodle',
      'Daily Food Puzzle',
      '/imgs/brainwave/foodle.webp'
    ),
    (
      '/brainwave/landmarkdle',
      'Landmarkdle - Daily Landmark Puzzle',
      'Guess the landmark from its 6 attributes: type, location, architect, built year, height, and material. Wordle-style landmark guessing game.',
      'Guess the landmark from its 6 attributes: type, location, architect, built year, height, and material.',
      'Landmarkdle is a daily travel and architecture puzzle where famous places are solved through structured landmark clues.',
      '["Landmark trivia", "Architecture clues", "Travel puzzle", "Daily landmark game"]'::jsonb,
      '[
        {"question":"What is Landmarkdle?","answer":"Landmarkdle is a daily landmark guessing game where you identify a famous place from attributes such as type, location, architect, built year, height, and material."},
        {"question":"How do I play Landmarkdle?","answer":"Guess the landmark and use the attribute feedback to narrow the answer."},
        {"question":"What landmarks are included?","answer":"Landmarkdle can include monuments, buildings, bridges, towers, temples, and other famous places."},
        {"question":"Is Landmarkdle educational?","answer":"Yes. Landmarkdle builds knowledge of geography, architecture, design, and travel."},
        {"question":"Is Landmarkdle free to play?","answer":"Yes. Landmarkdle is free to play on Triviaah."}
      ]'::jsonb,
      '["landmarkdle", "daily landmark puzzle", "landmark guessing game", "architecture game", "travel trivia", "famous landmarks", "wordle landmark"]'::jsonb,
      'Play Landmarkdle',
      'Daily Landmark Puzzle',
      '/imgs/brainwave/landmarkdle.webp'
    ),
    (
      '/brainwave/inventionle',
      'Inventionle - Daily Invention Puzzle',
      'Guess the invention from its 6 attributes: inventor, year, category, country, purpose, and impact. Wordle-style invention guessing game.',
      'Guess the invention from its 6 attributes: inventor, year, category, country, purpose, and impact.',
      'Inventionle is a daily invention puzzle for players who enjoy history, science, technology, inventors, and world-changing ideas.',
      '["Invention trivia", "Inventor clues", "Science and technology", "Daily invention puzzle"]'::jsonb,
      '[
        {"question":"What is Inventionle?","answer":"Inventionle is a daily invention guessing game where you identify an invention from attributes such as inventor, year, category, country, purpose, and impact."},
        {"question":"How do I play Inventionle?","answer":"Guess an invention and use the clue feedback to narrow down the correct answer."},
        {"question":"What inventions are included?","answer":"Inventionle can include tools, machines, technologies, scientific breakthroughs, and everyday objects."},
        {"question":"Is Inventionle educational?","answer":"Yes. Inventionle teaches invention history, innovation, inventors, and technological impact."},
        {"question":"Is Inventionle free to play?","answer":"Yes. Inventionle is free to play on Triviaah."}
      ]'::jsonb,
      '["inventionle", "daily invention puzzle", "invention guessing game", "inventor trivia", "technology game", "science trivia", "wordle invention"]'::jsonb,
      'Play Inventionle',
      'Daily Invention Puzzle',
      '/imgs/brainwave/inventionle.webp'
    ),
    (
      '/brainwave/synonymle',
      'Synonymle - Daily Word Guessing Puzzle',
      'Guess the word based on semantic similarity and synonyms. Wordle-style vocabulary puzzle game that tests your understanding of word meanings.',
      'Guess the word based on semantic similarity and synonyms.',
      'Synonymle is a daily vocabulary puzzle where similarity scores, synonyms, and word meaning guide each guess.',
      '["Vocabulary puzzle", "Semantic similarity", "Synonym clues", "Daily word game"]'::jsonb,
      '[
        {"question":"What is Synonymle?","answer":"Synonymle is a daily word guessing game where you use semantic similarity and synonyms to find the target word."},
        {"question":"How do I play Synonymle?","answer":"Enter words and use the similarity feedback to move closer to the hidden answer."},
        {"question":"What does the similarity percentage mean?","answer":"The percentage shows how close your guess is in meaning to the target word."},
        {"question":"Is there a new puzzle every day?","answer":"Yes. Synonymle is designed as a daily vocabulary puzzle."},
        {"question":"Is Synonymle free to play?","answer":"Yes. Synonymle is free to play on Triviaah."}
      ]'::jsonb,
      '["synonymle", "word puzzle", "daily word", "wordle vocabulary", "synonym game", "semantic game", "word guessing", "vocabulary builder", "english words", "free word games", "online word puzzles", "daily puzzle", "brain game"]'::jsonb,
      'Play Synonymle',
      'Daily Word Guessing Puzzle',
      '/imgs/brainwave/synonymle.webp'
    ),
    (
      '/brainwave/automoble',
      'Automobile - Daily Vehicle Guessing Game',
      'Guess the vehicle from progressive clues in 6 tries! Wordle-style letter feedback. Unlock more hints with each wrong guess. Free daily automotive puzzle.',
      'Guess the vehicle from progressive clues in 6 tries.',
      'Automobile is a daily vehicle guessing game for car enthusiasts, engineering students, automotive fans, and trivia players.',
      '["Vehicle clues", "Automotive trivia", "Six attempts", "Daily car puzzle"]'::jsonb,
      '[
        {"question":"What is Automobile?","answer":"Automobile is a daily vehicle guessing game where you identify a car or vehicle from progressive clues."},
        {"question":"How do I play Automobile?","answer":"Guess the vehicle in six tries and use each clue reveal plus letter feedback to narrow the answer."},
        {"question":"What types of clues are provided?","answer":"Clues may include manufacturer, era, body style, category, performance, country, or notable vehicle facts."},
        {"question":"How does the letter feedback work?","answer":"Letter feedback helps you work out the vehicle name across attempts."},
        {"question":"What types of vehicles are included?","answer":"Automobile can include cars, trucks, sports cars, classic vehicles, and notable models."},
        {"question":"Is Automobile free to play?","answer":"Yes. Automobile is free to play on Triviaah."}
      ]'::jsonb,
      '["automobile", "automoble", "vehicle guessing game", "daily vehicle puzzle", "car guessing game", "automotive trivia", "car brands", "wordle car game"]'::jsonb,
      'Play Automobile',
      'Daily Vehicle Guessing Game',
      '/imgs/brainwave/automoble.webp'
    ),
    (
      '/brainwave/botanle',
      'Botanle - Daily Plant Guessing Game',
      'Guess the plant from progressive botanical clues in 6 tries! Wordle-style letter feedback. Unlock more hints with each wrong guess. Free daily plant puzzle.',
      'Guess the plant from progressive botanical clues in 6 tries.',
      'Botanle is a daily plant identification puzzle for gardeners, botany students, nature lovers, and players who enjoy botanical clues.',
      '["Plant identification", "Botanical clues", "Six attempts", "Daily plant puzzle"]'::jsonb,
      '[
        {"question":"What is Botanle?","answer":"Botanle is a daily plant guessing game where you identify a plant from progressive botanical clues."},
        {"question":"How do I play Botanle?","answer":"Guess the plant in six tries and use the clue reveals plus feedback to narrow the answer."},
        {"question":"What types of clues are provided?","answer":"Clues may cover plant type, habitat, appearance, common use, family, region, or botanical traits."},
        {"question":"Can I use scientific names?","answer":"The game is designed around recognizable plant answers, and clues may include common or botanical context."},
        {"question":"What types of plants are included?","answer":"Botanle can include flowers, trees, herbs, crops, shrubs, and other notable plants."},
        {"question":"Is Botanle educational?","answer":"Yes. Botanle helps players learn plant identification, botany, gardening, and nature facts."},
        {"question":"Is Botanle free to play?","answer":"Yes. Botanle is free to play on Triviaah."}
      ]'::jsonb,
      '["botanle", "plant guessing game", "daily plant puzzle", "botany game", "plant identification", "gardening puzzle", "flower guessing game", "botanical clues"]'::jsonb,
      'Play Botanle',
      'Daily Plant Guessing Game',
      '/imgs/brainwave/botanle.webp'
    ),
    (
      '/brainwave/citadle',
      'Citadle - Daily City Guessing Game with Landmarks & Skylines',
      'Guess the world city in 6 tries! Daily geography puzzle game with landmarks, city skylines, and urban hints. Free, educational, and fun!',
      'Guess the city in 6 tries with landmarks and skylines.',
      'Citadle is a daily city guessing game that uses landmarks, skylines, and urban geography clues to test your knowledge of world cities.',
      '["City geography", "Landmark clues", "Skyline hints", "Daily city puzzle"]'::jsonb,
      '[
        {"question":"What is Citadle?","answer":"Citadle is a daily city guessing game where you identify a world city using landmarks, skylines, and urban clues."},
        {"question":"How do I play Citadle?","answer":"Guess the city in six attempts and use the geographic feedback and clues to narrow the answer."},
        {"question":"What cities are included?","answer":"Citadle can include major world cities, culturally important cities, capitals, and cities known for landmarks or skylines."},
        {"question":"Is Citadle free to play?","answer":"Yes. Citadle is free to play on Triviaah."},
        {"question":"What makes Citadle different from other geography games?","answer":"Citadle focuses on cities rather than countries or capitals, using urban identity, landmarks, and skyline clues."},
        {"question":"Can I play Citadle on mobile?","answer":"Yes. Citadle works on mobile, tablet, and desktop screens."}
      ]'::jsonb,
      '["citadle", "city guessing game", "daily city puzzle", "world city game", "landmark game", "skyline puzzle", "geography game", "urban hints"]'::jsonb,
      'Play Citadle',
      'Daily City Game',
      '/imgs/brainwave/citadle.webp'
    ),
    (
      '/brainwave/countridle',
      'Countridle - Daily Country Guessing Game with Flags & Maps',
      'Guess the world country in 6 tries! Daily geography puzzle game with flags, country outlines, and geographical hints. Free, educational, and fun!',
      'Guess the country in 6 tries. Daily geography puzzle with flags and maps.',
      'Countridle is a daily country guessing game where flags, maps, outlines, and geographic hints help you identify the target country.',
      '["Country geography", "Flags and maps", "Six attempts", "Daily country puzzle"]'::jsonb,
      '[
        {"question":"What is Countridle?","answer":"Countridle is a daily country guessing game where you identify a country using flags, maps, outlines, and geographic hints."},
        {"question":"How do I play Countridle?","answer":"Guess the country in six attempts and use the feedback plus clues to move closer to the answer."},
        {"question":"What countries are included?","answer":"Countridle can include countries from around the world, with clues based on geography, flags, maps, and national facts."},
        {"question":"Is Countridle free to play?","answer":"Yes. Countridle is free to play on Triviaah."},
        {"question":"What makes Countridle educational?","answer":"Countridle helps players learn countries, flags, map shapes, regions, and geographical relationships."},
        {"question":"Can I play Countridle on mobile?","answer":"Yes. Countridle works on mobile, tablet, and desktop screens."}
      ]'::jsonb,
      '["countridle", "country guessing game", "daily country puzzle", "flags game", "maps game", "country outlines", "geography puzzle", "world countries"]'::jsonb,
      'Play Countridle',
      'Daily Country Game',
      '/imgs/brainwave/countridle.webp'
    ),
    (
      '/brainwave/trordle',
      'Trordle - Daily Trivia Puzzle',
      'Guess the answer to today''s trivia puzzle with limited attempts, similar to Wordle but with trivia questions.',
      'The trivia version of Wordle. Guess the answer in 6 tries.',
      'Trordle combines trivia questions with Wordle-style limited attempts, giving players a daily general-knowledge puzzle to solve.',
      '["Trivia puzzle", "Wordle-style attempts", "Daily question", "General knowledge"]'::jsonb,
      '[
        {"question":"What is Trordle?","answer":"Trordle is a daily trivia puzzle where you guess the answer to a trivia question in limited attempts."},
        {"question":"How do I play Trordle?","answer":"Read the trivia clue and guess the answer. Use feedback and additional attempts to narrow it down."},
        {"question":"What types of trivia questions are included?","answer":"Trordle can include general knowledge, history, science, entertainment, geography, sports, and culture questions."},
        {"question":"Is there a new puzzle every day?","answer":"Yes. Trordle is designed as a daily trivia challenge."},
        {"question":"What if I cannot guess the answer in 6 tries?","answer":"The answer is revealed and you can return for the next daily puzzle."},
        {"question":"Is Trordle free to play?","answer":"Yes. Trordle is free to play on Triviaah."}
      ]'::jsonb,
      '["trordle", "trivia puzzle", "daily trivia", "wordle trivia", "trivia game", "word guessing game", "educational games", "free trivia", "online trivia games", "daily puzzle"]'::jsonb,
      'Play Trordle',
      'Daily Trivia Puzzle',
      '/imgs/brainwave/trordle.webp'
    )
)
update public.game_pages gp
set
  title = bu.title,
  meta_description = bu.meta_description,
  intro_text = bu.intro_text,
  supporting_copy = bu.supporting_copy,
  highlights = bu.highlights,
  faq_items = bu.faq_items,
  keywords = bu.keywords,
  cta_label = bu.cta_label,
  hero_label = bu.hero_label,
  og_image = bu.og_image,
  cta_href = bu.route_path,
  is_daily_refresh = true,
  is_active = true
from brainwave_updates bu
where gp.route_path = bu.route_path;
