// lib/leaderboard.ts - Updated with proper TypeScript types
import { supabase } from './supabase';

export interface LeaderboardEntry {
  rank: number;
  username: string;
  displayName: string;
  score: number;
  avatar: string;
  isGuest: boolean;
}

// Define types for database records
interface TriviaScoreRecord {
  id?: string;
  name: string | null;
  score: number | null;
  category: string | null;
  correct_answers?: number | null;
  total_questions?: number | null;
  time_used?: number | null;
  created_at: string;
}

interface AggregatedUser {
  username: string;
  displayName: string;
  avatar: string;
  totalScore: number;
  isGuest: boolean;
}

export async function getLeaderboard(
  timeframe: 'weekly' | 'monthly' | 'all-time' = 'weekly'
): Promise<LeaderboardEntry[]> {
  try {
    const dateFilter = getDateFilter(timeframe);

    console.log('Fetching leaderboard for timeframe:', timeframe, 'since:', dateFilter);

    // Fetch all scores for the timeframe
    const { data: scoresData, error: scoresError } = await supabase
      .from('trivia_scores')
      .select('*')
      .gte('created_at', dateFilter.toISOString());

    if (scoresError) {
      console.error('Error fetching trivia_scores:', scoresError);
      return [];
    }

    if (!scoresData || scoresData.length === 0) {
      console.log('No scores found for timeframe');
      return [];
    }

    console.log('Raw scores data:', scoresData.length, 'records');

    // Aggregate scores by guest name
    const userScores = aggregateGuestScores(scoresData);

    // Convert to leaderboard entries and sort
    const leaderboardData = Array.from(userScores.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((user, index) => ({
        rank: index + 1,
        username: user.username,
        displayName: user.displayName,
        score: user.totalScore,
        avatar: user.avatar,
        isGuest: true
      }));

    console.log('Processed leaderboard data:', leaderboardData.length, 'unique guests');
    return leaderboardData;

  } catch (error) {
    console.error('Unexpected error in getLeaderboard:', error);
    return [];
  }
}

// Helper function to calculate date filter
function getDateFilter(timeframe: 'weekly' | 'monthly' | 'all-time'): Date {
  const date = new Date();
  
  switch (timeframe) {
    case 'weekly':
      date.setDate(date.getDate() - 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() - 1);
      break;
    case 'all-time':
      return new Date(0); // Beginning of time
  }
  
  return date;
}

// Helper function to aggregate scores for guests only
function aggregateGuestScores(
  scoresData: TriviaScoreRecord[]
): Map<string, AggregatedUser> {
  const userScores = new Map<string, AggregatedUser>();

  scoresData.forEach(entry => {
    // Use guest name from trivia_scores
    const guestName = entry.name || 'Guest';
    const scoreValue = entry.score || 0;
    
    // Create unique key for each guest (case-insensitive, trimmed)
    const key = guestName.toLowerCase().trim();

    if (!userScores.has(key)) {
      userScores.set(key, {
        username: guestName.toLowerCase().replace(/\s+/g, '_'),
        displayName: guestName,
        avatar: getInitials(guestName),
        totalScore: 0,
        isGuest: true
      });
    }
    
    // Add score to guest's total
    const userEntry = userScores.get(key);
    if (userEntry) {
      userEntry.totalScore += scoreValue;
    }
  });

  return userScores;
}

// Helper function to get initials for avatar
function getInitials(name: string | null | undefined): string {
  if (!name) return 'G';
  
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name[0]?.toUpperCase() || 'G';
}

// Get guest's rank in leaderboard
export async function getUserRank(
  guestName: string,
  timeframe: 'weekly' | 'monthly' | 'all-time' = 'weekly'
): Promise<number> {
  try {
    const dateFilter = getDateFilter(timeframe);

    // Get all scores for the timeframe
    const { data: allScores, error } = await supabase
      .from('trivia_scores')
      .select('score, name')
      .gte('created_at', dateFilter.toISOString());

    if (error || !allScores) {
      console.error('Error fetching scores for rank:', error);
      return 0;
    }

    // Aggregate scores by guest name (case-insensitive)
    const userTotals = new Map<string, number>();
    allScores.forEach(record => {
      const key = (record.name || 'Guest').toLowerCase().trim();
      const current = userTotals.get(key) || 0;
      userTotals.set(key, current + (record.score || 0));
    });

    // Sort by total score descending
    const sortedTotals = Array.from(userTotals.entries())
      .sort((a, b) => b[1] - a[1]);

    // Find guest's rank (using case-insensitive comparison)
    const guestKey = guestName.toLowerCase().trim();
    const userIndex = sortedTotals.findIndex(([key]) => key === guestKey);
    return userIndex >= 0 ? userIndex + 1 : 0;

  } catch (error) {
    console.error('Error getting guest rank:', error);
    return 0;
  }
}

interface UserStats {
  totalGames: number;
  totalScore: number;
  averageScore: number;
  accuracy: number;
  averageTimePerGame: number;
  bestScore: number;
  favoriteCategory: string;
  lastPlayed: string;
}

// Get guest statistics
export async function getUserStats(
  guestName: string,
  timeframe: 'weekly' | 'monthly' | 'all-time' = 'all-time'
): Promise<UserStats | null> {
  try {
    const dateFilter = getDateFilter(timeframe);

    // Get scores for this guest (case-insensitive)
    const { data, error } = await supabase
      .from('trivia_scores')
      .select('*')
      .ilike('name', guestName) // Case-insensitive match
      .gte('created_at', dateFilter.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching guest stats:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return null;
    }

    const totalGames = data.length;
    const totalScore = data.reduce((sum, game) => sum + (game.score || 0), 0);
    const totalCorrect = data.reduce((sum, game) => sum + (game.correct_answers || 0), 0);
    const totalQuestions = data.reduce((sum, game) => sum + (game.total_questions || 0), 0);
    const totalTimeUsed = data.reduce((sum, game) => sum + (game.time_used || 0), 0);

    return {
      totalGames,
      totalScore,
      averageScore: Math.round(totalScore / totalGames),
      accuracy: totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0,
      averageTimePerGame: Math.round(totalTimeUsed / totalGames),
      bestScore: Math.max(...data.map(game => game.score || 0)),
      favoriteCategory: getMostFrequentCategory(data),
      lastPlayed: data[0]?.created_at || new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in getUserStats:', error);
    return null;
  }
}

function getMostFrequentCategory(games: TriviaScoreRecord[]): string {
  const categoryCount = games.reduce((acc: Record<string, number>, game) => {
    const category = game.category || 'Unknown';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1]);

  return sortedCategories[0]?.[0] || 'Unknown';
}

// Get today's top scores for a specific game/category
export async function getDailyTopScores(
  category: string,
  limit: number = 10
): Promise<LeaderboardEntry[]> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('trivia_scores')
      .select('*')
      .eq('category', category)
      .gte('created_at', today.toISOString())
      .order('score', { ascending: false })
      .limit(limit);

    if (error || !data) {
      console.error('Error fetching daily top scores:', error);
      return [];
    }

    // Aggregate by guest name for today's scores
    const userScores = aggregateGuestScores(data);
    
    return Array.from(userScores.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((user, index) => ({
        rank: index + 1,
        username: user.username,
        displayName: user.displayName,
        score: user.totalScore,
        avatar: user.avatar,
        isGuest: true
      }));

  } catch (error) {
    console.error('Error in getDailyTopScores:', error);
    return [];
  }
}

// Submit a new score for a guest
interface SubmitScoreData {
  name: string;
  score: number;
  category: string;
  correct_answers?: number;
  total_questions?: number;
  time_used?: number;
}

export async function submitGuestScore(data: SubmitScoreData): Promise<{ success: boolean; error?: unknown }> {
  try {
    const { error } = await supabase
      .from('trivia_scores')
      .insert([{
        name: data.name,
        score: data.score,
        category: data.category,
        correct_answers: data.correct_answers || 0,
        total_questions: data.total_questions || 0,
        time_used: data.time_used || 0,
        created_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Error submitting guest score:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error in submitGuestScore:', error);
    return { success: false, error };
  }
}