// data/homeContent.ts
import { ReadonlyQuizItems, ReadonlySectionItems } from '@/types/home';

export const DAILY_QUIZZES: ReadonlyQuizItems = [
   {
    category: 'quick-fire',
    name: 'Quick Fire',
    path: '/daily-trivias/quick-fire',
    image: '/imgs/thumbnails/quick-fire-160x160.webp',
    tagline: 'Test your reaction time and knowledge with our 60-second challenge!',
    keywords: 'rapid fire trivia, quick fire triva, general knowledge quiz, daily trivia, daily quiz with answers',
    playCount: 0,
    isNew: false,
    duration: '60',
    difficulty: 'medium',
  },
  {
    category: 'general-knowledge',
    name: 'General Knowledge',
    path: '/daily-trivias/general-knowledge',
    image: '/imgs/thumbnails/general-knowledge-160x160.webp',
    tagline: 'Test your worldly wisdom with diverse daily trivia challenges',
    keywords: 'general knowledge quiz, daily trivia facts, world trivia questions, daily quiz with answers',
    playCount: 0,
    isNew: false,
    duration: '300',
    difficulty: 'easy',
  },
  {
    category: 'today-in-history',
    name: 'Today in History',
    path: '/daily-trivias/today-in-history',
    image: '/imgs/thumbnails/today-in-history-160x160.webp',
    tagline: 'Discover historical events from this date in free online trivia',
    keywords: 'historical trivia quiz, on this day trivia, history facts game, history quiz with answers',
    playCount: 0,
    isNew: false,
    duration: '300',
    difficulty: 'medium',
  },
  {
    category: 'entertainment',
    name: 'Entertainment',
    path: '/daily-trivias/entertainment',
    image: '/imgs/thumbnails/entertainment-160x160.webp',
    tagline: 'Pop culture trivia quizzes featuring movies, music & celebrities',
    keywords: 'pop culture trivia quizzes, movie trivia game, celebrity quiz, entertainment quiz answers',
    playCount: 0,
    isNew: false,
    duration: '300',
    difficulty: 'easy',
  },
  {
    category: 'geography',
    name: 'Geography',
    path: '/daily-trivias/geography',
    image: '/imgs/thumbnails/geography-160x160.webp',
    tagline: 'Explore world geography through interactive trivia challenges',
    keywords: 'geography trivia quiz, world capitals game, countries trivia, geography quiz with answers',
    playCount: 0,
    isNew: false,
    duration: '300',
    difficulty: 'medium',
  },
  {
    category: 'science',
    name: 'Science & Nature',
    path: '/daily-trivias/science',
    image: '/imgs/thumbnails/science-160x160.webp',
    tagline: 'Discover science & animal kingdom wonders in our free online trivia',
    keywords: 'science trivia quiz, biology quiz game, physics trivia questions, science quiz with answers',
    playCount: 0,
    isNew: false,
    duration: '300',
    difficulty: 'medium',
  },
  {
    category: "arts-literature",
    name: "Arts & Literature",
    path: "/daily-trivias/arts-literature",
    image: "/imgs/thumbnails/arts-n-literature-160x160.webp",
    tagline: "Explore the world of great authors, artists, and literary masterpieces",
    keywords: "literature trivia quiz, famous authors quiz, art history questions, classic books quiz, painting trivia, poetry quiz questions",
    playCount: 0,
    isNew: false,
    duration: '300',
    difficulty: 'hard',
  },
  {
    category: 'sports',
    name: 'Sports',
    path: '/daily-trivias/sports',
    image: '/imgs/thumbnails/sports-160x160.webp',
    tagline: 'Test your knowledge of sports history, athletes, and events',
    keywords: 'sports trivia quiz, athlete trivia, sports history game, sports quiz with answers',
    playCount: 0,
    isNew: false,
    duration: '300',
    difficulty: 'medium',
  },
] as const;

export const BRAIN_WAVES: ReadonlySectionItems = [
  {
    category: 'plotle',
    name: 'Plotle',
    path: '/brainwave/plotle',
    image: '/imgs/thumbnails/plotle-160x160.webp',
    tagline: 'Guess the movie from its plot description in emojis',
    keywords: 'movie plot game, film trivia, movie guessing game'
  },
  {
    category: 'capitale',
    name: 'Capitale',
    path: '/brainwave/capitale',
    image: '/imgs/thumbnails/capitale-160x160.webp',
    tagline: 'Guess world capitals in this challenging geography puzzle',
    keywords: 'capital cities game, geography puzzle, world capitals quiz'
  },
  {
    category: 'celebrile',
    name: 'Celebrile',
    path: '/brainwave/celebrile',
    image: '/imgs/thumbnails/celebrile-160x160.webp',
    tagline: 'Guess the celebrity from fun facts in this star-studded quiz',
    keywords: 'celebrity trivia game, famous people quiz, celebrity guessing game'    
  },
  {
    category: 'songle',
    name: 'Songle',
    path: '/brainwave/songle',
    image: '/imgs/thumbnails/songle-160x160.webp',
    tagline: 'Identify songs from lyrics snippets in this music challenge',
    keywords: 'music lyrics game, song trivia, music guessing challenge'
  },
  {
    category: 'historidle',
    name: 'Historidle',
    path: '/brainwave/historidle',
    image: '/imgs/thumbnails/historidle-160x160.webp',
    tagline: 'Guess the historical event from dates and other intriguing clues',
    keywords: 'history trivia game, historical events quiz, history guessing game'
  },
  {
    category: 'creaturedle',
    name: 'Creaturedle',
    path: '/brainwave/creaturedle',
    image: '/imgs/thumbnails/creaturedle-160x160.webp',
    tagline: 'Guess the animal from its unique characteristics in this wildlife puzzle',
    keywords: 'animal trivia game, wildlife quiz, animal guessing puzzle'
  },
  {
    category: 'foodle',
    name: 'Foodle',
    path: '/brainwave/foodle',
    image: '/imgs/thumbnails/foodle-160x160.webp',
    tagline: 'Guess the dish from its ingredients in this culinary puzzle',
    keywords: 'food trivia game, dish guessing quiz, culinary puzzle'
  },
  {
    category: 'literale',
    name: 'Literale',
    path: '/brainwave/literale',
    image: '/imgs/thumbnails/literale-160x160.webp',
    tagline: 'Guess the book from its opening line in this literary puzzle',
    keywords: 'book opening game, literature trivia, book guessing puzzle'
  },
  {
    category: 'landmarkdle',
    name: 'Landmarkdle',
    path: '/brainwave/landmarkdle',
    image: '/imgs/thumbnails/landmarkdle-160x160.webp',
    tagline: 'Guess the famous landmark from intriguing clues in this geography puzzle',
    keywords: 'landmark trivia game, famous places quiz, landmark guessing puzzle'
  },
  {
    category: 'inventionle',
    name: 'Inventionle',
    path: '/brainwave/inventionle',
    image: '/imgs/thumbnails/inventionle-160x160.webp',
    tagline: 'Guess the invention from its 6 attributes in this technology puzzle',
    keywords: 'invention trivia game, technology quiz, invention guessing puzzle'
  },
  {
    category: 'automoble',
    name: 'Automoble',
    path: '/brainwave/automoble',
    image: '/imgs/brainwave/automoble.webp',
    tagline: 'Guess the car from its unique characteristics in this automotive puzzle',
    keywords: 'car trivia game, automotive quiz, car guessing puzzle'
  },
  {
    category: 'botanle',
    name: 'Botanle',
    path: '/brainwave/botanle',
    image: '/imgs/brainwave/botanle.webp',
    tagline: 'Guess the plant from its unique characteristics in this botanical puzzle',
    keywords: 'plant trivia game, botanical quiz, plant guessing puzzle'
  },
  {
    category: 'citadle',
    name: 'Citadle',
    path: '/brainwave/citadle',
    image: '/imgs/brainwave/citadle.webp',
    tagline: 'Guess the city from its unique characteristics in this urban geography puzzle',
    keywords: 'city trivia game, urban geography quiz, city guessing puzzle'
  },
  {
    category: 'countridle',
    name: 'Countridle',
    path: '/brainwave/countridle',
    image: '/imgs/brainwave/countridle.webp',
    tagline: 'Guess the country from its unique characteristics in this global geography puzzle',
    keywords: 'country trivia game, world geography quiz, country guessing puzzle'
  },
  {
    category: 'synonymle',
    name: 'Synonymle',
    path: '/brainwave/synonymle',
    image: '/imgs/thumbnails/synonymle-160x160.webp',
    tagline: 'Guess the word based on semantic similarity and synonyms',
    keywords: 'synonymle, word puzzle, daily word, wordle vocabulary, synonym game, semantic game'
  },
  {
    category: 'trordle',
    name: 'Trordle',
    path: '/brainwave/trordle',
    image: '/imgs/thumbnails/trordle-160x160.webp',
    tagline: 'Wordle-inspired trivia challenges for curious minds',
    keywords: 'trivia wordle, daily trivia game, quiz puzzle, general knowledge quiz, movie trivia, book trivia, geography quiz, history trivia, sports trivia'
  },
] as const;

export const WORD_GAMES: ReadonlySectionItems = [
  {
    category: 'cryptogram',
    name: 'Cryptogram',
    path: '/word-games/cryptogram',
    image: '/imgs/word-games/cryptogram.webp',
    tagline: 'Decode encrypted quotes in this classic substitution cipher puzzle',
    keywords: 'cryptogram game, substitution cipher, decode quotes, word puzzle, free cryptogram'
  },
  {
    category: 'spelling-bee',
    name: 'Spelling Bee',
    path: '/word-games/spelling-bee',
    image: '/imgs/word-games/spelling-bee.webp',
    tagline: 'Create words from a letter honeycomb using the required center letter',
    keywords: 'spelling bee game, word formation puzzle, vocabulary challenge, spelling practice'
  },
  {
    category: 'boggle',
    name: 'Boggle',
    path: '/word-games/boggle',
    image: '/imgs/word-games/boggle.webp',
    tagline: 'Find as many words as you can by connecting adjacent letters on a grid',
    keywords: 'boggle game, word grid puzzle, vocabulary game, timed word challenge'
  },
  {
    category: 'word-search',
    name: 'Word Search',
    path: '/word-games/word-search',
    image: '/imgs/word-games/word-search.webp',
    tagline: 'Find hidden words across rows, columns, diagonals, and reverse paths',
    keywords: 'word search game, hidden words puzzle, vocabulary puzzle, free word search'
  },
  {
    category: 'word-ladder',
    name: 'Word Ladder',
    path: '/word-games/word-ladder',
    image: '/imgs/word-games/word-ladder.webp',
    tagline: 'Transform one word into another by changing one letter at a time',
    keywords: 'word ladder game, word transformation puzzle, vocabulary challenge, logic word game'
  },
  {
    category: 'crossgrid',
    name: 'Crossgrid',
    path: '/word-games/crossgrid',
    image: '/imgs/word-games/word-crossgrid.webp',
    tagline: 'Solve clue-based word squares where rows and columns both have to work',
    keywords: 'crossgrid puzzle, mini crossword game, word square challenge, clue word puzzle'
  },
  {
    category: 'word-connect',
    name: 'Word Connect',
    path: '/word-games/word-connect',
    image: '/imgs/word-games/word-connect.webp',
    tagline: 'Connect letters from a letter bank to build valid words',
    keywords: 'word connect game, letter bank puzzle, word building game, vocabulary puzzle'
  },
  {
    category: 'anagram-scramble',
    name: 'Anagram Scramble',
    path: '/word-games/anagram-scramble',
    image: '/imgs/word-games/anagram-scramble.webp',
    tagline: 'Unscramble letters and discover every hidden word',
    keywords: 'anagram game, word scramble, letter scramble puzzle, vocabulary challenge'
  },
] as const;

export const NUMBER_PUZZLES: ReadonlySectionItems = [
  {
    category: '2048',
    name: '2048',
    path: '/number-puzzles/2048',
    image: '/imgs/number-puzzles/2048.webp',
    tagline: 'Swipe and merge matching number tiles until you reach 2048',
    keywords: '2048 game, tile merging puzzle, number puzzle, math game'
  },
  {
    category: 'number-tower',
    name: 'Number Tower',
    path: '/number-puzzles/number-tower',
    image: '/imgs/number-puzzles/number-tower.webp',
    tagline: 'Build number towers by solving arithmetic and logic challenges',
    keywords: 'number tower puzzle, math logic game, arithmetic puzzle, number challenge'
  },
  {
    category: 'prime-hunter',
    name: 'Prime Hunter',
    path: '/number-puzzles/prime-hunter',
    image: '/imgs/number-puzzles/prime-hunter.webp',
    tagline: 'Hunt for prime numbers in challenging grid configurations',
    keywords: 'prime number game, prime hunter, math puzzle, number grid challenge'
  },
  {
    category: 'number-sequence',
    name: 'Number Sequence',
    path: '/number-puzzles/number-sequence',
    image: '/imgs/number-puzzles/number-sequence.webp',
    tagline: 'Spot the pattern and complete each mathematical sequence',
    keywords: 'number sequence puzzle, pattern recognition game, math sequence, logic puzzle'
  },
  {
    category: 'sudoku',
    name: 'Sudoku',
    path: '/number-puzzles/sudoku',
    image: '/imgs/number-puzzles/sudoku.webp',
    tagline: 'Solve classic Sudoku grids with logic and careful deduction',
    keywords: 'sudoku puzzle, number logic game, classic sudoku, free sudoku'
  },
  {
    category: 'kakuro',
    name: 'Kakuro',
    path: '/number-puzzles/kakuro',
    image: '/imgs/number-puzzles/kakuro.webp',
    tagline: 'Fill crossword-style number grids using clue totals and arithmetic logic',
    keywords: 'kakuro puzzle, cross sums game, number crossword, arithmetic logic puzzle'
  },
  {
    category: 'kenken',
    name: 'KenKen',
    path: '/number-puzzles/kenken',
    image: '/imgs/number-puzzles/kenken.webp',
    tagline: 'Fill rows, columns, and cages using arithmetic operations',
    keywords: 'kenken puzzle, arithmetic logic game, math grid puzzle, number puzzle'
  },
  {
    category: 'number-pyramid',
    name: 'Number Pyramid',
    path: '/number-puzzles/number-pyramid',
    image: '/imgs/number-puzzles/number-pyramid.webp',
    tagline: 'Solve pyramid-style number puzzles using sums, differences, and logic',
    keywords: 'number pyramid puzzle, math pyramid game, arithmetic puzzle, logic number game'
  },
] as const;

export const IQ_PERSONALITY_TESTS: ReadonlySectionItems = [
 {
    category: 'capa',
    name: 'Cognitive Abilities Profile Assessment (CAPA) Test',
    path: '/iq-and-personality-tests/capa',
    image: '/imgs/thumbnails/capa-160x160.webp',
    tagline: 'Comprehensive assessment of your cognitive strengths across multiple intelligence domains',
    keywords: 'cognitive assessment, multiple intelligences test, cognitive strengths analysis, learning style assessment, cognitive profile, memory test, reasoning test'
  },
  {
    category: 'matrixiq',
    name: 'MatrixIQ Test',
    path: '/iq-and-personality-tests/matrixiq',
    image: '/imgs/thumbnails/matrixiq-160x160.webp',
    tagline: 'Measure your fluid intelligence with advanced pattern recognition and abstract reasoning challenges',
    keywords: 'matrix reasoning test, fluid intelligence test, pattern recognition, abstract reasoning, Raven\'s matrices, non-verbal IQ test, visual-spatial reasoning'
  },
  {
    category: 'mbti',
    name: 'MBTI Personality Test',
    path: '/iq-and-personality-tests/mbti',
    image: '/imgs/thumbnails/mbti-160x160.webp',
    tagline: 'Discover your Myers-Briggs Type (INFP, ESTJ, etc.) with detailed career matches and strengths analysis',
    keywords: 'MBTI test, Myers-Briggs personality test, personality type assessment, career matching, INFP, ESTJ, personality traits'
  },
  {
    category: 'big-five',
    name: 'Big Five (OCEAN) Test',
    path: '/iq-and-personality-tests/big-five',
    image: '/imgs/thumbnails/big-five-160x160.webp',
    tagline: 'Scientifically-validated trait analysis with percentile scores for all 5 major personality dimensions',
    keywords: 'Big Five personality test, OCEAN model, personality traits assessment, openness, conscientiousness, extraversion, agreeableness, neuroticism'
  },
  {
    category: 'enneagram',
    name: 'Enneagram Test',
    path: '/iq-and-personality-tests/enneagram',
    image: '/imgs/thumbnails/enneagram-160x160.webp',
    tagline: 'Discover your Enneagram type with core motivations, fears, and growth paths',
    keywords: 'Enneagram personality test, Enneagram types, personality assessment, self-discovery, type 1-9 Enneagram, personal growth'
  },
  {
    category: 'disc',
    name: 'DISC Assessment',
    path: '/iq-and-personality-tests/disc',
    image: '/imgs/thumbnails/disc-160x160.webp',
    tagline: 'Understand your communication style (Dominance, Influence, Steadiness, Conscientiousness)',
    keywords: 'DISC assessment, communication style test, personality assessment, workplace communication, DISC profile, behavioral assessment'
  },
  {
    category: 'love-languages',
    name: 'Love Languages Test',
    path: '/iq-and-personality-tests/love-languages',
    image: '/imgs/thumbnails/love-languages-160x160.webp',
    tagline: 'Discover how you give and receive love in relationships',
    keywords: 'love languages test, relationship assessment, 5 love languages, Gary Chapman, relationship advice, emotional connection'
  },
  {
    category: 'holland-code',
    name: 'Holland Career Test',
    path: '/iq-and-personality-tests/holland-code',
    image: '/imgs/thumbnails/holland-code-160x160.webp',
    tagline: 'Find your ideal career path based on your personality (RIASEC model)',
    keywords: 'Holland Code test, RIASEC career assessment, career personality test, vocational test, job matching, career guidance'
  }
] as const;

export const RETRO_GAMES: ReadonlySectionItems = [
  {    
    category: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    path: '/retro-games/tic-tac-toe',
    image: '/imgs/thumbnails/tictactoe-160x160.webp',
    tagline: 'Classic two-player game of Xs and Os on a 3x3 grid',
    keywords: 'tic tac toe game, noughts and crosses, classic arcade game, two-player game'
  },{
    category: 'snake',
    name: 'Snake',
    path: '/retro-games/snake',
    image: '/imgs/thumbnails/snake-160x160.webp',
    tagline: 'Classic arcade game where you control a snake to eat food and avoid collisions',
    keywords: 'snake game, classic arcade game, retro gaming, mobile snake game, snake puzzle'
  },
  {
    category: 'pong',
    name: 'Pong',
    path: '/retro-games/pong',
    image: '/imgs/thumbnails/pong-160x160.webp',
    tagline: 'Classic arcade game where players control paddles to hit a ball back and forth',
    keywords: 'pong game, table tennis arcade, retro gaming, classic pong, competitive game'
  },
  {
    category: 'minesweeper',
    name: 'Minesweeper',
    path: '/retro-games/minesweeper',
    image: '/imgs/thumbnails/minesweeper-160x160.webp',
    tagline: 'Classic puzzle game where you uncover safe tiles while avoiding hidden mines',
    keywords: 'minesweeper game, classic puzzle game, retro gaming, mine detection, strategy game' 
  },
  {
    category: 'tetris',
    name: 'Tetris',
    path: '/retro-games/tetris',
    image: '/imgs/thumbnails/tetris-160x160.webp',
    tagline: 'Classic puzzle game where you stack falling blocks to complete lines',
    keywords: 'tetris game, classic puzzle game, retro gaming, block stacking, strategy game'
  },
  {
    category: 'space-invaders',
    name: 'Space Invaders',
    path: '/retro-games/space-invaders',
    image: '/imgs/thumbnails/space-invaders-160x160.webp',
    tagline: 'Iconic 1978 shooter game where you defend Earth from waves of alien invaders',
    keywords: 'space invaders game, classic arcade game, retro gaming, alien shooter, galactic defense'
  },
   {
    category: 'pacman',
    name: 'PacMan',
    path: '/retro-games/pacman',
    image: '/imgs/thumbnails/pacman-160x160.webp',
    tagline: 'Classic puzzle game where you uncover safe tiles while avoiding hidden mines',
    keywords: 'minesweeper game, classic puzzle game, retro gaming, mine detection, strategy game'
  },
  {
    category: 'breakout',
    name: 'Breakout',
    path: '/retro-games/breakout',
    image: '/imgs/thumbnails/breakout-160x160.webp',
    tagline: 'Classic arcade game where you bounce a ball to break bricks and clear levels',
    keywords: 'breakout game, brick breaker, classic arcade game, retro gaming, paddle ball game'
  },
] as const;

export const ADDITIONAL_SECTIONS: ReadonlySectionItems = [
  {
    category: 'word-games',
    name: 'Word Games',
    image: '/imgs/thumbnails/word-games-160x160.webp',
    tagline: 'Challenge your vocabulary with free online word puzzle games',
    keywords: 'word puzzle games, vocabulary quiz, word trivia challenge',
  },
  {
    category: 'number-puzzles',
    name: 'Number Puzzles',
    image: '/imgs/thumbnails/number-puzzles-160x160.webp',
    tagline: 'Exercise your brain with mathematical trivia and logic puzzles',
    keywords: 'math trivia games, number puzzle quiz, logic brain games',
  },
  {
    category: 'blog',
    name: 'Trivia Blog',
    image: '/imgs/thumbnails/blog-160x160.webp',
    tagline: 'Learn fascinating trivia facts and quiz strategies',
    keywords: 'trivia facts blog, quiz tips, interesting trivia articles, quiz answers explained',
  },
  {
    category: 'trivia-bank',
    name: 'Trivia Bank',
    image: '/imgs/thumbnails/tbank-160x160.webp',
    tagline: 'Access our complete collection of free trivia questions',
    keywords: 'trivia question database, quiz question bank, trivia archive, quiz with answers',
  },
] as const;
