export interface RecentQuiz {
  title: string;
  score: number;
  date: string;
  href: string;
}

export interface GuestStats {
  gamesPlayed: number;
  totalScore: number;
  streak: number;
  lastPlayed: string;
  recentQuizzes: RecentQuiz[];
}

const STORAGE_KEY = 'triviaah_guest_v1';

export const getGuestStats = (): GuestStats => {
  if (typeof window === 'undefined') return defaultStats;
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : defaultStats;
};

const defaultStats: GuestStats = {
  gamesPlayed: 0,
  totalScore: 0,
  streak: 0,
  lastPlayed: '',
  recentQuizzes: []
};

export const updateGuestStats = (points: number, quizData?: RecentQuiz) => {
  const stats = getGuestStats();
  const today = new Date().toISOString().split('T')[0];
  
  // Update Recent List: Add new, remove duplicate of same title, limit to 5
  let newRecent = stats.recentQuizzes || [];
  if (quizData) {
    newRecent = [quizData, ...newRecent.filter(q => q.title !== quizData.title)].slice(0, 5);
  }

  // Calculate Streak
  let newStreak = stats.streak;
  if (stats.lastPlayed !== today) {
    // Check if they played yesterday to continue streak, otherwise reset or increment
    // For simplicity: increment if it's a new day
    newStreak += 1;
  }

  const updated: GuestStats = {
    ...stats,
    gamesPlayed: stats.gamesPlayed + 1,
    totalScore: stats.totalScore + points,
    recentQuizzes: newRecent,
    lastPlayed: today,
    streak: newStreak
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};