// data/homeContent.ts
import { ReadonlyQuizItems, ReadonlySectionItems } from '@/types/home';

export const DAILY_QUIZZES: ReadonlyQuizItems = [
  {
    category: 'general-knowledge',
    name: 'General Knowledge',
    path: '/daily/general-knowledge',
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
    path: '/daily/entertainment',
    image: '/imgs/entertainment-160x160.webp',
    tagline: 'Pop culture trivia quizzes featuring movies, music & celebrities',
    keywords: 'pop culture trivia quizzes, movie trivia game, celebrity quiz, entertainment quiz answers',
  },
  {
    category: 'geography',
    name: 'Geography',
    path: '/daily/geography',
    image: '/imgs/geography-160x160.webp',
    tagline: 'Explore world geography through interactive trivia challenges',
    keywords: 'geography trivia quiz, world capitals game, countries trivia, geography quiz with answers',
  },
  {
    category: 'science',
    name: 'Science',
    path: '/daily/science',
    image: '/imgs/science-160x160.webp',
    tagline: 'Discover scientific wonders in our free online science trivia',
    keywords: 'science trivia quiz, biology quiz game, physics trivia questions, science quiz with answers',
  },
  {
    category: 'trordle',
    name: 'Trordle',
    path: '/trordle',
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