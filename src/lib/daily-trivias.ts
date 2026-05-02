import { getDailyQuizQuestions, getTodaysHistoryQuestions, type Question } from '@/lib/supabase';

export type DailyTriviaCategoryConfig = {
  name: string;
  subject: string;
  description: string;
  longDescription: string;
  learningPoints: string[];
  keywords: string;
  color: string;
  icon: string;
  triviaSlugs?: string[];
};

export const CATEGORY_CONFIG: Record<string, DailyTriviaCategoryConfig> = {
  'quick-fire': {
    name: 'Quick Fire',
    subject: 'rapid-fire general knowledge',
    description: 'Race the clock with our Quick Fire daily trivia — 6 questions, 15 seconds each. New challenge every 24 hours.',
    longDescription: 'The Quick Fire challenge is designed for those who think fast under pressure. Featuring a rotating mix of science, history, and pop culture, this high-intensity quiz forces you to rely on your gut instinct. With only 15 seconds per question, it is the ultimate test of cognitive recall and rapid decision-making.',
    learningPoints: [
      'Improve cognitive recall speed and mental agility.',
      'Identify core facts across a diverse range of general knowledge topics.',
      'Master the art of performing accurately under strict time constraints.',
    ],
    keywords: 'rapid fire trivia, quick fire trivia, quick trivia quiz, daily trivia',
    color: 'from-orange-500 to-red-500',
    icon: '⚡',
  },
  'general-knowledge': {
    name: 'General Knowledge',
    subject: 'general knowledge',
    description: 'Test your worldly wisdom with 10 free daily general knowledge trivia questions. Refreshed every day.',
    longDescription: 'Our General Knowledge daily quiz is a curated journey through the most interesting facts on Earth. We cover everything from obscure historical milestones to the latest scientific breakthroughs. This quiz is perfect for lifelong learners who want to broaden their intellectual horizons and stay sharp on a global scale.',
    learningPoints: [
      'Broaden your understanding of global history and current events.',
      'Connect disparate facts between science, culture, and geography.',
      'Build a versatile knowledge base for social and professional settings.',
    ],
    keywords: 'general knowledge quiz, daily trivia facts, world trivia questions',
    color: 'from-blue-500 to-cyan-500',
    icon: '🌎',
  },
  'today-in-history': {
    name: 'Today in History',
    subject: "historical events from today's date",
    description: 'Discover what happened on this day in history — free daily trivia with 10 questions on famous birthdays and milestones.',
    longDescription: 'Every day is an anniversary of something monumental. This daily history quiz dives into the archives to bring you the battles, discoveries, and births that happened on this exact calendar date. It is a unique way to contextualize the modern world by understanding the specific events that shaped it over centuries.',
    learningPoints: [
      "Identify pivotal historical milestones that occurred on today's date.",
      'Understand the chronological connection between past and present.',
      'Learn about influential figures and their contributions to global history.',
    ],
    keywords: 'historical trivia quiz, on this day trivia, history facts game',
    color: 'from-amber-500 to-orange-500',
    icon: '📅',
    triviaSlugs: ['history', 'famous-quotes', 'inventions-everyday-objects'],
  },
  entertainment: {
    name: 'Entertainment',
    subject: 'movies, music, and pop culture',
    description: 'Daily entertainment trivia — movies, music, TV shows, and celebrity questions. 10 free questions refreshed every 24 hours.',
    longDescription: 'Stay updated with the world of glitz and glamour. Our entertainment daily quiz tracks the evolution of cinema, the biggest hits on the music charts, and the legends of the small screen. From Hollywood’s Golden Age to the latest viral streaming sensations, we test your grasp of the arts and media.',
    learningPoints: [
      'Track the evolution of film, television, and musical trends.',
      'Identify award-winning performances and iconic pop culture moments.',
      'Understand the impact of media on modern society and fashion.',
    ],
    keywords: 'pop culture trivia quiz, movie trivia game, celebrity quiz',
    color: 'from-purple-500 to-pink-500',
    icon: '🎬',
    triviaSlugs: ['movies', 'music', 'tv-shows', 'celebrities'],
  },
  geography: {
    name: 'Geography',
    subject: 'world geography, capitals, and landmarks',
    description: 'Free daily geography trivia — countries, capitals, flags, and world landmarks. 10 fresh questions every day.',
    longDescription: 'Explore the world without leaving your home. Our daily geography challenge goes beyond simple capitals to explore tectonic shifts, climatic zones, and cultural landmarks. It is designed to help you visualize the planet and understand the physical and political borders that define our global community.',
    learningPoints: [
      'Master the locations of countries, capitals, and major landmarks.',
      'Identify the physical features and biomes of different continents.',
      'Understand the demographic and political shifts in global geography.',
    ],
    keywords: 'geography trivia quiz, world capitals game, countries trivia',
    color: 'from-green-500 to-emerald-500',
    icon: '🗺️',
    triviaSlugs: ['geography'],
  },
  science: {
    name: 'Science & Nature',
    subject: 'science and nature',
    description: 'Daily science and nature trivia — biology, physics, space exploration, and the animal kingdom.',
    longDescription: 'Unlock the mysteries of the universe with our daily science quiz. Whether we are discussing the microscopic world of cellular biology or the vast expanses of quantum physics and astronomy, these questions are designed to stimulate your curiosity and explain the mechanics of the natural world.',
    learningPoints: [
      'Comprehend fundamental laws of physics and chemical reactions.',
      "Explore the diversity of the animal kingdom and Earth's ecosystems.",
      'Learn about the latest breakthroughs in space exploration and technology.',
    ],
    keywords: 'science trivia quiz, biology quiz game, physics trivia questions',
    color: 'from-cyan-500 to-blue-500',
    icon: '🔬',
    triviaSlugs: ['science', 'animals', 'inventions-everyday-objects'],
  },
  'arts-literature': {
    name: 'Arts & Literature',
    subject: 'arts, literature, and famous works',
    description: 'Free daily arts and literature trivia — great authors, artists, famous paintings, and classic books.',
    longDescription: 'Feed your soul with our daily arts and literature trivia. We explore the brushstrokes of Renaissance masters and the profound prose of Nobel-winning authors. This quiz challenges you to recognize the creative milestones that have defined human expression across centuries and cultures.',
    learningPoints: [
      'Recognize the stylistic differences between major art movements.',
      'Identify the themes and authors of world-renowned literary classics.',
      'Understand the historical context behind iconic works of art and drama.',
    ],
    keywords: 'literature trivia quiz, famous authors quiz, art history questions',
    color: 'from-pink-500 to-rose-500',
    icon: '🎨',
    triviaSlugs: ['literature', 'arts', 'famous-quotes'],
  },
  sports: {
    name: 'Sports',
    subject: 'sports history and athletes',
    description: 'Daily sports trivia — athletes, records, championships, and iconic sporting moments. 10 free questions refreshed every 24 hours.',
    longDescription: 'For the ultimate sports fan, this daily quiz is your playing field. We cover the strategy of the pitch, the stats of the court, and the legends of the Olympic track. Test your knowledge of record-breaking performances and the history of global competitions from football to tennis.',
    learningPoints: [
      'Recall major sports records, championships, and iconic moments.',
      'Identify the career achievements of legendary athletes.',
      'Understand the rules and historical origins of various global sports.',
    ],
    keywords: 'sports trivia quiz, athlete trivia, sports history game',
    color: 'from-red-500 to-orange-500',
    icon: '⚽',
    triviaSlugs: ['sports'],
  },
};

export const DAILY_TRIVIA_CATEGORIES = Object.entries(CATEGORY_CONFIG).map(([slug, cfg]) => ({
  slug,
  name: cfg.name,
  icon: cfg.icon,
}));

export function getDailyTriviaConfig(category: string): DailyTriviaCategoryConfig & { slug: string } {
  const cfg = CATEGORY_CONFIG[category];
  if (cfg) return { ...cfg, slug: category };

  const name = category.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  return {
    slug: category,
    name,
    subject: name.toLowerCase(),
    description: `Free daily ${name.toLowerCase()} trivia — 10 fresh questions every 24 hours. No sign-up required.`,
    longDescription: `The ${name} daily quiz is a curated trivia challenge with fresh questions and a stable daily landing page.`,
    learningPoints: [
      `Learn core facts across ${name.toLowerCase()}.`,
      'Build confidence with a quick daily challenge.',
      'Return for a new quiz every day.',
    ],
    keywords: `${name.toLowerCase()} trivia, daily quiz, knowledge test`,
    color: 'from-cyan-500 to-blue-500',
    icon: '❓',
  };
}

export async function getDailyTriviaQuestions(
  category: string,
  dateKey: string
): Promise<Question[]> {
  if (category === 'today-in-history') {
    return getTodaysHistoryQuestions(10, dateKey);
  }

  return getDailyQuizQuestions(category, dateKey);
}
