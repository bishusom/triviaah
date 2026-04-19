// data/homeContent.ts
import { ReadonlyQuizItems, ReadonlySectionItems } from '@/types/home';

export const DAILY_QUIZZES: ReadonlyQuizItems = [
  {
    category: 'quick-fire',
    name: 'Quick Fire',
    path: '/daily-trivias/quick-fire',
    image: '/imgs/thumbnails/quick-fire-160x160.webp',
    tagline: 'Test your reaction time and knowledge with our 60-second challenge!',
    keywords: 'rapid fire trivia, quick fire triva, general knowledge quiz, daily trivia',
    playCount: 18234,
    isNew: true,
    duration: '60s',
    difficulty: 'Hard'
  },
  {
    category: 'general-knowledge',
    name: 'General Knowledge',
    path: '/daily-trivias/general-knowledge',
    image: '/imgs/thumbnails/general-knowledge-160x160.webp',
    tagline: 'Test your worldly wisdom with diverse daily trivia challenges',
    keywords: 'general knowledge quiz, daily trivia facts, world trivia questions',
    playCount: 35234,
    isNew: false,
    duration: '5m',
    difficulty: 'Medium'
  },
  {
    category: 'today-in-history',
    name: 'Today in History',
    path: '/daily-trivias/today-in-history',
    image: '/imgs/thumbnails/today-in-history-160x160.webp',
    tagline: 'Discover historical events from this date in free online trivia',
    keywords: 'historical trivia quiz, on this day trivia, history facts game',
    playCount: 25234,
    isNew: false,
    duration: '4m',
    difficulty: 'Medium'
  },
  {
    category: 'entertainment',
    name: 'Entertainment',
    path: '/daily-trivias/entertainment',
    image: '/imgs/thumbnails/entertainment-160x160.webp',
    tagline: 'Pop culture trivia quizzes featuring movies, music & celebrities',
    keywords: 'pop culture trivia quizzes, movie trivia game, celebrity quiz',
    playCount: 5234,
    isNew: true,
    duration: '3m',
    difficulty: 'Easy'
  },
  {
    category: 'geography',
    name: 'Geography',
    path: '/daily-trivias/geography',
    image: '/imgs/thumbnails/geography-160x160.webp',
    tagline: 'Explore world geography through interactive trivia challenges',
    keywords: 'geography trivia quiz, world capitals game, countries trivia',
    playCount: 14234,
    isNew: false,
    duration: '6m',
    difficulty: 'Hard'
  },
  {
    category: 'science',
    name: 'Science & Nature',
    path: '/daily-trivias/science',
    image: '/imgs/thumbnails/science-160x160.webp',
    tagline: 'Discover science & animal kingdom wonders in our free online trivia',
    keywords: 'science trivia quiz, biology quiz game, physics trivia questions',
    playCount: 9400,
    isNew: false,
    duration: '5m',
    difficulty: 'Medium'
  },
  {
    category: "arts-literature",
    name: "Arts & Literature",
    path: "/daily-trivias/arts-literature",
    image: "/imgs/thumbnails/arts-n-literature-160x160.webp",
    tagline: "Explore the world of great authors, artists, and literary masterpieces",
    keywords: "literature trivia quiz, famous authors quiz, art history questions",
    playCount: 9100,
    isNew: true,
    duration: '7m',
    difficulty: 'Hard'
  },
  {
    category: 'sports',
    name: 'Sports',
    path: '/daily-trivias/sports',
    image: '/imgs/thumbnails/sports-160x160.webp',
    tagline: 'Test your knowledge of sports history, athletes, and events',
    keywords: 'sports trivia quiz, athlete trivia, sports history game',
    playCount: 9700,
    isNew: false,
    duration: '4m',
    difficulty: 'Medium'
  },
] as const;

export const BRAIN_WAVES: ReadonlySectionItems = [
  {
    category: 'plotle',
    name: 'Plotle',
    path: '/brainwave/plotle',
    image: '/imgs/brainwave/plotle-rect.webp',
    tagline: 'Guess the movie from its plot description in emojis',
    keywords: 'movie emoji quiz, plot guessing game, film trivia',
    playCount: 12000,
    isNew: true,
    duration: 'Daily',
    difficulty: 'Fun'
  },
  {
    category: 'capitale',
    name: 'Capitale',
    path: '/brainwave/capitale',
    image: '/imgs/brainwave/capitale-rect.webp',
    tagline: 'Guess world capitals in this challenging geography puzzle',
    keywords: 'capital cities quiz, world geography game, capitals trivia',
    playCount: 11234,
    isNew: false,
    duration: 'Daily',
    difficulty: 'Medium'
  },
  {
    category: 'celebrile',
    name: 'Celebrile',
    path: '/brainwave/celebrile',
    image: '/imgs/brainwave/celebrile-rect.webp',
    tagline: 'Guess the celebrity from fun facts in this star-studded quiz',
    keywords: 'celebrity quiz, famous person game, entertainment trivia',
    playCount: 9100,
    isNew: false,
    duration: 'Daily',
    difficulty: 'Easy'
  },
  {
    category: 'songle',
    name: 'Songle',
    path: '/brainwave/songle',
    image: '/imgs/brainwave/songle-rect.webp',
    tagline: 'Identify songs from lyrics snippets in this music challenge',
    keywords: 'song lyrics game, music trivia quiz, identify songs',
    playCount: 8000,
    isNew: true,
    duration: 'Daily',
    difficulty: 'Medium'
  },
  {
    category: 'historidle',
    name: 'Historidle',
    path: '/brainwave/historidle',
    image: '/imgs/brainwave/historidle-rect.webp',
    tagline: 'Guess the historical event from dates and other intriguing clues',
    keywords: 'history trivia game, historical events quiz',
    playCount: 11234,
    isNew: false,
    duration: 'Daily',
    difficulty: 'Logic'
  },
  {
    category: 'creaturedle',
    name: 'Creaturedle',
    path: '/brainwave/creaturedle',
    image: '/imgs/brainwave/creaturedle-rect.webp',
    tagline: 'Guess the animal from its unique characteristics',
    keywords: 'animal trivia, wildlife quiz, animal guessing',
    playCount: 5000,
    isNew: false,
    duration: 'Daily',
    difficulty: 'Nature'
  },
  {
    category: 'foodle',
    name: 'Foodle',
    path: '/brainwave/foodle',
    image: '/imgs/brainwave/foodle-rect.webp',
    tagline: 'Guess the dish from its ingredients in this culinary puzzle',
    keywords: 'food trivia, dish guessing, culinary quiz',
    playCount: 4900,
    isNew: true,
    duration: 'Daily',
    difficulty: 'Easy'
  },
  {
    category: 'literale',
    name: 'Literale',
    path: '/brainwave/literale',
    image: '/imgs/brainwave/literale-rect.webp',
    tagline: 'Guess the book from its opening line in this literary puzzle',
    keywords: 'book trivia, literature quiz, book guessing',
    playCount: 8900,
    isNew: false,
    duration: 'Daily',
    difficulty: 'Hard'
  },
  {
    category: 'cryptodle',
    name: 'Cryptodle',
    path: '/brainwave/cryptodle',
    image: '/imgs/brainwave/cryptodle-rect.webp',
    tagline: 'Decode encrypted quotes with logic and pattern recognition',
    keywords: 'cryptodle game, substitution cipher, logic puzzle, brain teaser',
    playCount: 960,
    isNew: true,
    duration: 'Daily',
    difficulty: 'Casual'
  },
  {
    category: 'landmarkdle',
    name: 'Landmarkdle',
    path: '/brainwave/landmarkdle',
    image: '/imgs/brainwave/landmarkdle-rect.webp',
    tagline: 'Guess the famous landmark from intriguing clues',
    keywords: 'landmark trivia, famous places, travel quiz',
    playCount: 9400,
    isNew: false,
    duration: 'Daily',
    difficulty: 'Medium'
  },
  {
    category: 'inventionle',
    name: 'Inventionle',
    path: '/brainwave/inventionle',
    image: '/imgs/brainwave/inventionle-rect.webp',
    tagline: 'Guess the invention from its 6 attributes',
    keywords: 'invention trivia, tech quiz, science history',
    playCount: 8700,
    isNew: false,
    duration: 'Daily',
    difficulty: 'Logic'
  },
  {
    category: 'synonymle',
    name: 'Synonymle',
    path: '/brainwave/synonymle',
    image: '/imgs/brainwave/synonymle-rect.webp',
    tagline: 'Guess the word based on semantic similarity and synonyms',
    keywords: 'word game, synonym puzzle, vocabulary challenge',
    playCount: 9800,
    isNew: true,
    duration: 'Daily',
    difficulty: 'Hard'
  },
] as const;

export const WORD_GAMES: ReadonlySectionItems = [
  {
    category: 'cryptogram',
    name: 'Cryptogram',
    path: '/word-games/cryptogram',
    image: '/imgs/word-games/cryptogram.webp',
    tagline: 'Decode encrypted texts in this classic puzzle',
    keywords: 'cryptogram, substitution cipher, decode quotes, word puzzle',
    playCount: 90000,
    isNew: true,
    duration: 'Daily',
    difficulty: 'Medium'
  },
  {
    category: 'spelling-bee',
    name: 'Spelling Bee',
    path: '/word-games/spelling-bee',
    image: '/imgs/word-games/spelling-bee.webp',
    tagline: 'Test your spelling skills with daily challenges',
    keywords: 'spelling game, vocabulary challenge, word puzzle',
    playCount: 88000,
    isNew: false,
    duration: 'Daily',
    difficulty: 'Medium'
  },
  {
    category: 'boggle',
    name: 'Boggle',
    path: '/word-games/boggle',
    image: '/imgs/word-games/boggle.webp',
    tagline: 'Find words in a grid of letters to score points',
    keywords: 'word game, puzzle, vocabulary challenge',
    playCount: 9200,
    isNew: false,
    duration: 'Daily',
    difficulty: 'Medium'
  },
  {
    category: 'word-search',
    name: 'Word Search',
    path: '/word-games/word-search',
    image: '/imgs/word-games/word-search.webp',
    tagline: 'Find hidden words in a grid of letters',
    keywords: 'word game, puzzle, vocabulary challenge',
    playCount: 18000,
    isNew: false,
    duration: 'Daily',
    difficulty: 'Medium'
  },
  {
    category: 'word-ladder',
    name: 'Word Ladder',
    path: '/word-games/word-ladder',
    image: '/imgs/word-games/word-ladder.webp',
    tagline: 'Transform one word into another by changing one letter at a time',
    keywords: 'word game, puzzle, vocabulary challenge',
    playCount: 9400,
    isNew: false,
    duration: 'Daily',
    difficulty: 'Medium'
  },
  {
    category: 'crossgrid',
    name: 'Crossgrid',
    path: '/word-games/crossgrid',
    image: '/imgs/word-games/word-crossgrid.webp',
    tagline: 'Solve clue-based word squares where rows and columns both have to work',
    keywords: 'crossgrid puzzle, mini crossword game, word square challenge',
    playCount: 8700,
    isNew: true,
    duration: 'Daily',
    difficulty: 'Medium'
  }
] as const;

export const NUMBER_PUZZLES: ReadonlySectionItems = [
  {
    category: '2048',
    name: '2048',
    path: '/number-puzzles/2048',
    image: '/imgs/number-puzzles/2048.webp',
    tagline: 'Slide and merge tiles to reach 2048',
    keywords: '2048 game, tile merging, number puzzle, math challenge',
    playCount: 9000,
    isNew: false,
    duration: 'Daily',
    difficulty: 'Medium'
  },
  {
    category: 'prime-hunter',
    name: 'Prime Hunter',
    path: '/number-puzzles/prime-hunter',
    image: '/imgs/number-puzzles/prime-hunter.webp',
    tagline: 'Find prime numbers in a grid of digits',
    keywords: 'number game, puzzle, math challenge',
    playCount: 8800,
    isNew: false,
    duration: 'Daily',
    difficulty: 'Medium'
  },
  {
    category: 'number-sequence',
    name: 'Number Sequence',
    path: '/number-puzzles/number-sequence',
    image: '/imgs/number-puzzles/number-sequence.webp',
    tagline: 'Identify and continue number patterns',
    keywords: 'number game, puzzle, math challenge',
    playCount: 9200,
    isNew: false,
    duration: 'Daily',
    difficulty: 'Medium'
  },
  {
    category: 'number-tower',
    name: 'Number Tower',
    path: '/number-puzzles/number-tower',
    image: '/imgs/number-puzzles/number-tower.webp',
    tagline: 'Build towers by solving number-based challenges',
    keywords: 'number game, puzzle, math challenge',
    playCount: 9400,
    isNew: false,
    duration: 'Daily',
    difficulty: 'Medium'
  },
  {
    category: 'sudoku',
    name: 'Sudoku Challenge',
    path: '/number-puzzles/sudoku',
    image: '/imgs/number-puzzles/sudoku.webp',
    tagline: 'Solve classic Sudoku puzzles with varying difficulty levels',
    keywords: 'number game, puzzle, math challenge',
    playCount: 11600,
    isNew: false,
    duration: 'Daily',
    difficulty: 'Medium'
  },
  {
    category: 'kakuro',
    name: 'Kakuro',
    path: '/number-puzzles/kakuro',
    image: '/imgs/number-puzzles/kakuro.webp',
    tagline: 'Use clue totals and logic to complete each run without repeating digits',
    keywords: 'kakuro puzzle, cross sums game, number crossword, arithmetic logic puzzle',
    playCount: 8400,
    isNew: true,
    duration: 'Daily',
    difficulty: 'Medium'
  }
] as const;


export const IQ_PERSONALITY_TESTS: ReadonlySectionItems = [
 {
    category: 'capa',
    name: 'CAPA Test',
    path: '/iq-and-personality-tests/capa',
    image: '/imgs/iq-personality-tests/capa-rect.webp',
    tagline: 'Comprehensive assessment of your cognitive strengths',
    keywords: 'cognitive ability test, IQ test, personality assessment',
    isNew: true,
    duration: '15m',
    difficulty: 'Deep'
  },
  {
    category: 'matrixiq',
    name: 'MatrixIQ Test',
    path: '/iq-and-personality-tests/matrixiq',
    image: '/imgs/iq-personality-tests/matrixiq-rect.webp',
    tagline: 'Measure your fluid intelligence with pattern recognition',
    keywords: 'IQ test, pattern recognition, fluid intelligence test',
    isNew: false,
    duration: '12m',
    difficulty: 'High'
  },
  {
    category: 'mbti',
    name: 'MBTI Personality Test',
    path: '/iq-and-personality-tests/mbti',
    image: '/imgs/iq-personality-tests/mbti-rect.webp',
    tagline: 'Discover your Myers-Briggs Type with detailed career matches',
    keywords: 'MBTI test, Myers-Briggs personality, personality type quiz',
    isNew: false,
    duration: '10m',
    difficulty: 'Personal'
  },
  {
    category: 'big-five',
    name: 'Big Five (OCEAN) Test',
    path: '/iq-and-personality-tests/big-five',
    image: '/imgs/iq-personality-tests/big-five-rect.webp',
    tagline: 'Scientifically-validated trait analysis for 5 major dimensions',
    keywords: 'Big Five personality test, OCEAN model, trait analysis',
    isNew: false,
    duration: '8m',
    difficulty: 'Insight'
  },
  {
    category: 'enneagram',
    name: 'Enneagram Test',
    path: '/iq-and-personality-tests/enneagram',
    image: '/imgs/iq-personality-tests/enneagram-rect.webp',
    tagline: 'Discover your Enneagram type with core motivations and fears',
    keywords: 'Enneagram test, personality type, motivations',
    isNew: true,
    duration: '12m',
    difficulty: 'Self'
  },
  {
    category: 'disc',
    name: 'DISC Assessment',
    path: '/iq-and-personality-tests/disc',
    image: '/imgs/iq-personality-tests/disc-rect.webp',
    tagline: 'Understand your communication style in the workplace',
    keywords: 'DISC assessment, communication style, behavioral test',
    isNew: false,
    duration: '10m',
    difficulty: 'Pro'
  },
  {
    category: 'love-languages',
    name: 'Love Languages Test',
    path: '/iq-and-personality-tests/love-languages',
    image: '/imgs/iq-personality-tests/love-languages-rect.webp',
    tagline: 'Discover how you give and receive love in relationships',
    keywords: 'love languages, relationship assessment',
    isNew: false,
    duration: '5m',
    difficulty: 'Heart'
  },
  {
    category: 'holland-code',
    name: 'Holland Career Test',
    path: '/iq-and-personality-tests/holland-code',
    image: '/imgs/iq-personality-tests/holland-code-rect.webp',
    tagline: 'Find your ideal career path based on your personality',
    keywords: 'career test, RIASEC, vocational assessment',
    isNew: true,
    duration: '10m',
    difficulty: 'Career'
  }
] as const;

export const RETRO_GAMES: ReadonlySectionItems = [
  {    
    category: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    path: '/retro-games/tic-tac-toe',
    image: '/imgs/thumbnails/tictactoe-160x160.webp',
    tagline: 'Classic two-player game of Xs and Os on a 3x3 grid',
    keywords: 'tic tac toe, classic arcade, two-player',
    playCount: 9200,
    isNew: false,
    duration: '1m',
    difficulty: 'Easy'
  },
  {    
    category: 'snake',
    name: 'Snake',
    path: '/retro-games/snake',
    image: '/imgs/thumbnails/snake-160x160.webp',
    tagline: 'Classic arcade game where you control a snake to eat food',
    keywords: 'snake game, arcade game, vintage game',
    playCount: 9300,
    isNew: false,
    duration: 'Infinite',
    difficulty: 'Retro'
  },
  {
    category: 'pong',
    name: 'Pong',
    path: '/retro-games/pong',
    image: '/imgs/thumbnails/pong-160x160.webp',
    tagline: 'Classic arcade table tennis game',
    keywords: 'pong, retro sports, arcade classic',
    playCount: 9100,
    isNew: false,
    duration: 'Infinite',
    difficulty: 'Classic'
  },
  {
    category: 'tetris',
    name: 'Tetris',
    path: '/retro-games/tetris',
    image: '/imgs/thumbnails/tetris-160x160.webp',
    tagline: 'Classic puzzle game where you stack falling blocks',
    keywords: 'tetris game, block puzzle, classic game',
    playCount: 19800,
    isNew: false,
    duration: 'Infinite',
    difficulty: 'Classic'
  },
  {
    category: 'space-invaders',
    name: 'Space Invaders',
    path: '/retro-games/space-invaders',
    image: '/imgs/thumbnails/space-invaders-160x160.webp',
    tagline: 'Iconic shooter game where you defend Earth from invaders',
    keywords: 'space invaders, retro shooter, alien game',
    playCount: 16000,
    isNew: false,
    duration: 'Infinite',
    difficulty: 'Hard'
  },
  {
    category: 'pacman',
    name: 'PacMan',
    path: '/retro-games/pacman',
    image: '/imgs/thumbnails/pacman-160x160.webp',
    tagline: 'Navigate the maze and eat pellets while avoiding ghosts',
    keywords: 'pacman game, maze game, arcade classic',
    playCount: 9600,
    isNew: false,
    duration: 'Infinite',
    difficulty: 'Classic'
  },
  {
    category: 'minesweeper',
    name: 'Minesweeper',
    path: '/retro-games/minesweeper',
    image: '/imgs/thumbnails/minesweeper-160x160.webp',
    tagline: 'Uncover safe tiles while avoiding hidden mines',
    keywords: 'minesweeper game, logic puzzle, classic game',
    playCount: 10010,
    isNew: false,
    duration: 'Variable',
    difficulty: 'Logic'
  },
  {
    category: 'breakout',
    name: 'Breakout',
    path: '/retro-games/breakout',
    image: '/imgs/thumbnails/breakout-160x160.webp',
    tagline: 'Classic arcade game where you bounce a ball to break bricks',
    keywords: 'breakout, brick breaker, retro arcade',
    playCount: 94,
    isNew: false,
    duration: 'Infinite',
    difficulty: 'Medium'
  },
] as const;

export const ADDITIONAL_SECTIONS: ReadonlySectionItems = [
  {
    category: 'word-games',
    name: 'Word Games',
    image: '/imgs/thumbnails/word-games-160x160.webp',
    tagline: 'Challenge your vocabulary with free online word puzzle games',
    keywords: 'word games, word puzzle, vocabulary game',
    playCount: 94,
    isNew: false,
    duration: 'Varies',
    difficulty: 'Casual'
  },
  {
    category: 'number-puzzles',
    name: 'Number Puzzles',
    image: '/imgs/thumbnails/number-puzzles-160x160.webp',
    tagline: 'Exercise your brain with mathematical trivia and logic puzzles',
    keywords: 'number puzzle, math trivia, logic puzzle',
    playCount: 92,
    isNew: false,
    duration: 'Varies',
    difficulty: 'Logic'
  },
  {
    category: 'blog',
    name: 'Trivia Blog',
    image: '/imgs/thumbnails/blog-160x160.webp',
    tagline: 'Learn fascinating trivia facts and quiz strategies',
    keywords: 'trivia facts blog, quiz tips, trivia articles',
    playCount: 90,
    isNew: false,
    duration: 'Varies',
    difficulty: 'Read'
  },
  {
    category: 'trivia-bank',
    name: 'Trivia Bank',
    image: '/imgs/thumbnails/tbank-160x160.webp',
    tagline: 'Access our complete collection of free trivia questions',
    keywords: 'trivia database, quiz bank, trivia archive',
    playCount: 93,
    isNew: false,
    duration: 'Infinite',
    difficulty: 'Casual'
  },
] as const;
