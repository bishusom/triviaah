// config/special-quizzes.ts

export type SpecialQuiz = {
  month: number; // 1-12
  name: string;
  theme: string;
  category: string;
  emojis: string[];
  bgColor: string;
  enabled: boolean;
  description: string;
  seoKeywords: string[];
  availableDate?: string; // Optional specific date (YYYY-MM-DD)
  endDate?: string; // Optional end date
}

export const SPECIAL_QUIZZES: SpecialQuiz[] = [
  {
    month: 1,
    name: "New Year's Lookback",
    theme: "2025 Lookback",
    category: "2025-lookback-trivias",
    emojis: ["🥂", "🍾", "🎆", "🧨", "🎁", "✨", "2025", "🎉"],
    bgColor: "bg-gradient-to-r from-blue-900 via-purple-900 to-red-900",
    enabled: true,
    description: "Reflect on the major events, trends, and pop culture moments of 2025 with our special year-in-review quiz!",
    seoKeywords: ["new year trivia", "year in review quiz", "2025 lookback trivia", "January special quiz"]
  },
  {
    month: 2,
    name: "Valentine's Day Special",
    theme: "Love & Romance Trivia",
    category: "valentines-day",
    emojis: ["❤️", "💘", "💌", "🌹", "🍫", "💝", "💑", "😍"],
    bgColor: "bg-gradient-to-r from-red-800 via-pink-700 to-rose-600",
    enabled: true,
    description: "Test your knowledge of love stories, romantic movies, famous couples, and Valentine's Day traditions!",
    seoKeywords: ["valentine trivia", "romance quiz", "famous couples trivia", "love movie quiz"]
  },
  {
    month: 3,
    name: "March Madness Trivia",
    theme: "Sports & Brackets",
    category: "march-madness",
    emojis: ["🏀", "🥇", "🎯", "📊", "🏆", "🔥", "💪", "👑"],
    bgColor: "bg-gradient-to-r from-orange-700 via-amber-700 to-yellow-600",
    enabled: true,
    description: "Dive into basketball history, tournament facts, and sports legends with our March Madness special!",
    seoKeywords: ["march madness trivia", "basketball quiz", "sports tournament trivia", "NCAA quiz"]
  },
  {
    month: 4,
    name: "April Fools' Challenge",
    theme: "Jokes & Pranks Through History",
    category: "april-fools",
    emojis: ["🤡", "🎭", "🃏", "😂", "🤪", "😜", "🎪", "🎰"],
    bgColor: "bg-gradient-to-r from-green-800 via-emerald-700 to-teal-600",
    enabled: true,
    description: "Explore the funniest hoaxes, classic pranks, and hilarious moments in history with our April Fools' quiz!",
    seoKeywords: ["april fools trivia", "prank quiz", "historical hoaxes", "funny facts quiz"]
  },
  {
    month: 5,
    name: "Cinco de Mayo Fiesta",
    theme: "Mexican Culture & History",
    category: "cinco-de-mayo",
    emojis: ["🇲🇽", "🎉", "🌮", "🥑", "💃", "🎺", "🌵", "🍋"],
    bgColor: "bg-gradient-to-r from-green-600 via-white to-red-600",
    enabled: true,
    description: "Celebrate Mexican heritage with trivia about history, food, music, and cultural traditions!",
    seoKeywords: ["cinco de mayo trivia", "mexican culture quiz", "history of mexico", "mexican food trivia"]
  },
  {
    month: 6,
    name: "Summer Kickoff",
    theme: "Sun, Fun & Vacation Trivia",
    category: "summer-kickoff",
    emojis: ["☀️", "🏖️", "🍦", "🌊", "🕶️", "⛱️", "🎣", "🏄"],
    bgColor: "bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500",
    enabled: true,
    description: "Get ready for summer with trivia about beaches, vacations, summer activities, and warm-weather fun!",
    seoKeywords: ["summer trivia", "vacation quiz", "beach facts", "summer activities trivia"]
  },
  {
    month: 7,
    name: "Independence Day Quiz",
    theme: "Patriotic History & Facts",
    category: "independence-day",
    emojis: ["🇺🇸", "🎇", "🦅", "🎆", "🗽", "🔔", "🎖️", "🎺"],
    bgColor: "bg-gradient-to-r from-red-700 via-white to-blue-700",
    enabled: true,
    description: "Test your knowledge of American history, founding fathers, and Independence Day traditions!",
    seoKeywords: ["4th of july trivia", "independence day quiz", "american history", "patriotic trivia"]
  },
  {
    month: 8,
    name: "Back to School Challenge",
    theme: "Academic Knowledge Refresher",
    category: "back-to-school",
    emojis: ["📚", "✏️", "🎒", "📝", "🧮", "🔬", "📖", "🎓"],
    bgColor: "bg-gradient-to-r from-blue-800 via-indigo-700 to-purple-700",
    enabled: true,
    description: "Brush up on your academic knowledge with trivia covering math, science, literature, and history!",
    seoKeywords: ["back to school trivia", "academic quiz", "knowledge refresher", "school subjects trivia"]
  },
  {
    month: 9,
    name: "Fall Harvest Festival",
    theme: "Autumn Traditions & Harvest",
    category: "fall-harvest",
    emojis: ["🍁", "🎃", "🍂", "🌽", "🍎", "🦃", "🧣", "☕"],
    bgColor: "bg-gradient-to-r from-orange-800 via-amber-700 to-brown-600",
    enabled: true,
    description: "Celebrate the fall season with trivia about harvest festivals, autumn traditions, and seasonal facts!",
    seoKeywords: ["fall trivia", "autumn quiz", "harvest festival", "seasonal traditions"]
  },
  {
    month: 10,
    name: "Spooky Halloween Challenge",
    theme: "Halloween Facts & Frights",
    category: "halloween-special",
    emojis: ["🎃", "👻", "💀", "🕸️", "🕷️", "😱", "🧙", "🦇"],
    bgColor: "bg-gradient-to-r from-purple-900 via-black to-orange-900",
    enabled: true,
    description: "Get spooky with trivia about Halloween history, horror movies, costumes, and supernatural facts!",
    seoKeywords: ["halloween trivia", "spooky quiz", "horror movie trivia", "october special quiz"]
  },
  {
    month: 11,
    name: "Thanksgiving Feast Trivia",
    theme: "Gratitude & Harvest Traditions",
    category: "thanksgiving-special",
    emojis: ["🦃", "🍁", "🥧", "🌽", "🍽️", "🙏", "🍂", "🕯️"],
    bgColor: "bg-gradient-to-r from-brown-800 via-orange-700 to-yellow-600",
    enabled: true,
    description: "Test your knowledge of Thanksgiving history, food traditions, and gratitude-themed facts!",
    seoKeywords: ["thanksgiving trivia", "turday quiz", "fall harvest trivia", "november special quiz"]
  },
  {
    month: 12,
    name: "Christmas Holiday Special",
    theme: "Christmas Traditions Worldwide",
    category: "christmas-specials",
    emojis: ["🎄", "🎅", "🤶", "🦌", "🎁", "🔔", "⛄", "🎶"],
    bgColor: "bg-gradient-to-r from-green-900 via-red-800 to-white",
    enabled: true,
    description: "Celebrate the holiday season with trivia about Christmas traditions, songs, movies, and global celebrations!",
    seoKeywords: ["christmas trivia", "holiday quiz", "december special", "christmas traditions quiz"]
  }
];

// Helper function to get current month's quiz
export function getCurrentMonthQuiz(): SpecialQuiz | null {
  const today = new Date();
  const currentMonth = today.getMonth() + 1; // 1-12
  
  return SPECIAL_QUIZZES.find(quiz => quiz.month === currentMonth) || null;
}

// Helper function to get quiz by month
export function getQuizByMonth(month: number): SpecialQuiz | undefined {
  return SPECIAL_QUIZZES.find(quiz => quiz.month === month);
}

// Helper function to check if a quiz is currently available
export function isQuizAvailable(quiz: SpecialQuiz): boolean {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  
  // If quiz has specific date range, check it
  if (quiz.availableDate && quiz.endDate) {
    const available = new Date(quiz.availableDate);
    const end = new Date(quiz.endDate);
    return today >= available && today <= end;
  }
  
  // Otherwise, check by month
  return quiz.month === currentMonth;
}