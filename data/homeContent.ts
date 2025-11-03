// data/homeContent.ts
import { ReadonlyQuizItems, ReadonlySectionItems } from '@/types/home';

export const DAILY_QUIZZES: ReadonlyQuizItems = [
   {
    category: 'quick-fire',
    name: 'Quick Fire',
    path: '/quick-fire',
    image: '/imgs/quick-fire-160x160.webp',
    tagline: 'Test your reaction time and knowledge with our 60-second challenge!',
    keywords: 'rapid fire trivia, quick fire triva, general knowledge quiz, daily trivia, daily quiz with answers',
  },
  {
    category: 'general-knowledge',
    name: 'General Knowledge',
    path: '/daily-trivias/general-knowledge',
    image: '/imgs/general-knowledge-160x160.webp',
    tagline: 'Test your worldly wisdom with diverse daily trivia challenges',
    keywords: 'general knowledge quiz, daily trivia facts, world trivia questions, daily quiz with answers',
  },
  {
    category: 'today-in-history',
    name: 'Today in History',
    path: '/today-in-history',
    image: '/imgs/today-history-160x160.webp',
    tagline: 'Discover historical events from this date in free online trivia',
    keywords: 'historical trivia quiz, on this day trivia, history facts game, history quiz with answers',
  },
  {
    category: 'entertainment',
    name: 'Entertainment',
    path: '/daily-trivias/entertainment',
    image: '/imgs/entertainment-160x160.webp',
    tagline: 'Pop culture trivia quizzes featuring movies, music & celebrities',
    keywords: 'pop culture trivia quizzes, movie trivia game, celebrity quiz, entertainment quiz answers',
  },
  {
    category: 'geography',
    name: 'Geography',
    path: '/daily-trivias/geography',
    image: '/imgs/geography-160x160.webp',
    tagline: 'Explore world geography through interactive trivia challenges',
    keywords: 'geography trivia quiz, world capitals game, countries trivia, geography quiz with answers',
  },
  {
    category: 'science',
    name: 'Science & Nature',
    path: '/daily-trivias/science',
    image: '/imgs/science-160x160.webp',
    tagline: 'Discover science & animal kingdom wonders in our free online trivia',
    keywords: 'science trivia quiz, biology quiz game, physics trivia questions, science quiz with answers',
  },
  {
    category: "arts-literature",
    name: "Arts & Literature",
    path: "/daily-trivias/arts-literature",
    image: "/imgs/arts-n-literature-160x160.webp",
    tagline: "Explore the world of great authors, artists, and literary masterpieces",
    keywords: "literature trivia quiz, famous authors quiz, art history questions, classic books quiz, painting trivia, poetry quiz questions"
  },
  {
    category: 'sports',
    name: 'Sports',
    path: '/daily-trivias/sports',
    image: '/imgs/sports-160x160.webp',
    tagline: 'Test your knowledge of sports history, athletes, and events',
    keywords: 'sports trivia quiz, athlete trivia, sports history game, sports quiz with answers',
  },
] as const;

export const BRAIN_WAVES: ReadonlySectionItems = [
  {
    category: 'capitale',
    name: 'Capitale',
    path: '/brainwave/capitale',
    image: '/imgs/capitale-160x160.webp',
    tagline: 'Guess world capitals in this challenging geography puzzle',
    keywords: 'capital cities game, geography puzzle, world capitals quiz'
  },
  {
    category: 'plotle',
    name: 'Plotle',
    path: '/brainwave/plotle',
    image: '/imgs/plotle-160x160.webp',
    tagline: 'Guess the movie from its plot description in emojis',
    keywords: 'movie plot game, film trivia, movie guessing game'
  },
  {
    category: 'celebrile',
    name: 'Celebrile',
    path: '/brainwave/celebrile',
    image: '/imgs/celebrile-160x160.webp',
    tagline: 'Guess the celebrity from fun facts in this star-studded quiz',
    keywords: 'celebrity trivia game, famous people quiz, celebrity guessing game'    
  },
  {
    category: 'songle',
    name: 'Songle',
    path: '/brainwave/songle',
    image: '/imgs/songle-160x160.webp',
    tagline: 'Identify songs from lyrics snippets in this music challenge',
    keywords: 'music lyrics game, song trivia, music guessing challenge'
  },
  {
    category: 'historidle',
    name: 'Historidle',
    path: '/brainwave/historidle',
    image: '/imgs/historidle-160x160.webp',
    tagline: 'Guess the historical event from dates and other intriguing clues',
    keywords: 'history trivia game, historical events quiz, history guessing game'
  },
  {
    category: 'creaturedle',
    name: 'Creaturedle',
    path: '/brainwave/creaturedle',
    image: '/imgs/creaturedle-160x160.webp',
    tagline: 'Guess the animal from its unique characteristics in this wildlife puzzle',
    keywords: 'animal trivia game, wildlife quiz, animal guessing puzzle'
  },
  {
    category: 'foodle',
    name: 'Foodle',
    path: '/brainwave/foodle',
    image: '/imgs/foodle-160x160.webp',
    tagline: 'Guess the dish from its ingredients in this culinary puzzle',
    keywords: 'food trivia game, dish guessing quiz, culinary puzzle'
  },
  {
    category: 'literale',
    name: 'Literale',
    path: '/brainwave/literale',
    image: '/imgs/literale-160x160.webp',
    tagline: 'Guess the book from its opening line in this literary puzzle',
    keywords: 'book opening game, literature trivia, book guessing puzzle'
  },
  {
    category: 'landmarkdle',
    name: 'Landmarkdle',
    path: '/brainwave/landmarkdle',
    image: '/imgs/landmarkdle-160x160.webp',
    tagline: 'Guess the famous landmark from intriguing clues in this geography puzzle',
    keywords: 'landmark trivia game, famous places quiz, landmark guessing puzzle'
  },
  {
    category: 'inventionle',
    name: 'Inventionle',
    path: '/brainwave/inventionle',
    image: '/imgs/inventionle-160x160.webp',
    tagline: 'Guess the invention from its 6 attributes in this technology puzzle',
    keywords: 'invention trivia game, technology quiz, invention guessing puzzle'
  },
  {
    category: 'synonymle',
    name: 'Synonymle',
    path: '/brainwave/synonymle',
    image: '/imgs/synonymle-160x160.webp',
    tagline: 'Guess the word based on semantic similarity and synonyms',
    keywords: 'synonymle, word puzzle, daily word, wordle vocabulary, synonym game, semantic game'
  },
  {
    category: 'trordle',
    name: 'Trordle',
    path: '/brainwave/trordle',
    image: '/imgs/trordle-160x160.webp',
    tagline: 'Wordle-inspired trivia challenges for curious minds',
    keywords: 'trivia wordle, daily trivia game, quiz puzzle, general knowledge quiz, movie trivia, book trivia, geography quiz, history trivia, sports trivia'
  },
] as const;

export const ADDITIONAL_SECTIONS: ReadonlySectionItems = [
  {
    category: 'word-games',
    name: 'Word Games',
    image: '/imgs/word-games-160x160.webp',
    tagline: 'Challenge your vocabulary with free online word puzzle games',
    keywords: 'word puzzle games, vocabulary quiz, word trivia challenge',
  },
  {
    category: 'number-puzzles',
    name: 'Number Puzzles',
    image: '/imgs/number-puzzles-160x160.webp',
    tagline: 'Exercise your brain with mathematical trivia and logic puzzles',
    keywords: 'math trivia games, number puzzle quiz, logic brain games',
  },
  {
    category: 'blog',
    name: 'Trivia Blog',
    image: '/imgs/blog-160x160.webp',
    tagline: 'Learn fascinating trivia facts and quiz strategies',
    keywords: 'trivia facts blog, quiz tips, interesting trivia articles, quiz answers explained',
  },
  {
    category: 'trivia-bank',
    name: 'Trivia Bank',
    image: '/imgs/tbank-160x160.webp',
    tagline: 'Access our complete collection of free trivia questions',
    keywords: 'trivia question database, quiz question bank, trivia archive, quiz with answers',
  },
] as const;