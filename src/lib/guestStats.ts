// lib/guestStats.ts

export interface RecentQuiz {
  title: string;
  score: number;
  date: string;
  href: string;
}

// Added 'export' here to fix the first error
export interface GuestStats {
  gamesPlayed: number;
  totalScore: number;
  streak: number;
  lastPlayed: string;
  recentQuizzes: RecentQuiz[];
}

const STATS_KEY = 'triviaah_guest_v1';
const HISTORY_KEY = 'playedQuizzes';

const defaultStats: Omit<GuestStats, 'recentQuizzes'> = {
  gamesPlayed: 0,
  totalScore: 0,
  streak: 0,
  lastPlayed: '',
};

export const getGuestStats = (): GuestStats => {
  if (typeof window === 'undefined') return { ...defaultStats, recentQuizzes: [] };
  
  const savedStats = localStorage.getItem(STATS_KEY);
  const savedHistory = localStorage.getItem(HISTORY_KEY);
  
  const stats = savedStats ? JSON.parse(savedStats) : defaultStats;
  const history = savedHistory ? JSON.parse(savedHistory) : [];

  return { 
    ...stats, 
    recentQuizzes: history 
  };
};

export const updateGuestStats = (points: number, quizData?: RecentQuiz) => {
  const stats = getGuestStats();
  const today = new Date().toISOString().split('T')[0];
  
  let currentHistory: RecentQuiz[] = stats.recentQuizzes || [];
  if (quizData) {
    currentHistory = [
      quizData, 
      ...currentHistory.filter(q => q.title !== quizData.title)
    ].slice(0, 5);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(currentHistory));
  }

  const updatedStats = {
    gamesPlayed: (stats.gamesPlayed || 0) + 1,
    totalScore: (stats.totalScore || 0) + points,
    lastPlayed: today,
    streak: stats.lastPlayed === today ? stats.streak : (stats.streak || 0) + 1
  };

  localStorage.setItem(STATS_KEY, JSON.stringify(updatedStats));
  
  return { ...updatedStats, recentQuizzes: currentHistory };
};