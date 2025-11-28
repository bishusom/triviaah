// lib/leaderboard.ts - Enhanced version
import { supabase } from './supabase';

export interface LeaderboardEntry {
  rank: number;
  username: string;
  displayName: string;
  score: number;
  avatar: string;
  userId?: string;
  isGuest: boolean;
  badge?: 'verified' | 'guest';
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

    // Get unique authenticated user IDs
    const authenticatedUserIds = [
      ...new Set(
        scoresData
          .filter(score => score.user_id)
          .map(score => score.user_id)
      )
    ] as string[];

    // Fetch profiles for authenticated users
    const profilesMap = await fetchProfilesMap(authenticatedUserIds);

    // Aggregate scores by user
    const userScores = aggregateScores(scoresData, profilesMap);

    // Convert to leaderboard entries and sort
    const leaderboardData = Array.from(userScores.values())
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((user, index) => ({
        rank: index + 1,
        username: user.username,
        displayName: user.displayName,
        score: user.totalScore,
        avatar: user.avatar,
        userId: user.userId,
        isGuest: user.isGuest,
        badge: user.isGuest ? 'guest' as const : 'verified' as const
      }));

    console.log('Processed leaderboard data:', leaderboardData.length, 'unique users');
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

// Helper function to fetch profiles
async function fetchProfilesMap(userIds: string[]): Promise<Map<string, any>> {
  const profilesMap = new Map();
  
  if (userIds.length === 0) {
    return profilesMap;
  }

  const { data: profilesData, error: profilesError } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url')
    .in('id', userIds);

  if (profilesError) {
    console.error('Error fetching profiles:', profilesError);
    return profilesMap;
  }

  profilesData?.forEach(profile => {
    profilesMap.set(profile.id, profile);
  });

  console.log('Fetched', profilesMap.size, 'profiles out of', userIds.length, 'requested');
  return profilesMap;
}

// Helper function to aggregate scores
function aggregateScores(
  scoresData: any[],
  profilesMap: Map<string, any>
): Map<string, {
  username: string;
  displayName: string;
  avatar: string;
  totalScore: number;
  userId?: string;
  isGuest: boolean;
}> {
  const userScores = new Map();

  scoresData.forEach(entry => {
    const userId = entry.user_id;
    const isGuest = !userId;
    
    // Create unique key for each user
    // For authenticated users: use user_id
    // For guests: use "guest_" + name (case-insensitive)
    const key = userId || `guest_${entry.name.toLowerCase().trim()}`;

    if (!userScores.has(key)) {
      if (userId) {
        // Authenticated user - get from profiles
        const profile = profilesMap.get(userId);
        
        if (profile) {
          // Profile exists
          userScores.set(key, {
            username: profile.username || `user_${userId.slice(0, 8)}`,
            displayName: profile.display_name || profile.username || 'User',
            avatar: profile.avatar_url || getInitials(profile.display_name || profile.username),
            totalScore: 0,
            userId: userId,
            isGuest: false
          });
        } else {
          // User ID exists but no profile (edge case)
          // This handles the transition period where user_id is set but profile isn't created yet
          console.warn('User ID without profile:', userId);
          userScores.set(key, {
            username: entry.name?.toLowerCase().replace(/\s+/g, '_') || `user_${userId.slice(0, 8)}`,
            displayName: entry.name || 'User',
            avatar: getInitials(entry.name || 'User'),
            totalScore: 0,
            userId: userId,
            isGuest: false
          });
        }
      } else {
        // Guest user - use name from trivia_scores
        const guestName = entry.name || 'Guest';
        userScores.set(key, {
          username: guestName.toLowerCase().replace(/\s+/g, '_'),
          displayName: guestName,
          avatar: getInitials(guestName),
          totalScore: 0,
          isGuest: true
        });
      }
    }
    
    // Add score to user's total
    const userEntry = userScores.get(key);
    if (userEntry) {
      userEntry.totalScore += entry.score || 0;
    }
  });

  return userScores;
}

// Helper function to get initials for avatar
function getInitials(name: string | null | undefined): string {
  if (!name) return 'U';
  
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return name[0]?.toUpperCase() || 'U';
}

// Get user's rank in leaderboard
export async function getUserRank(
  userId: string,
  timeframe: 'weekly' | 'monthly' | 'all-time' = 'weekly'
): Promise<number> {
  try {
    const dateFilter = getDateFilter(timeframe);

    // Get all scores for the timeframe
    const { data: allScores, error } = await supabase
      .from('trivia_scores')
      .select('score, user_id, name')
      .gte('created_at', dateFilter.toISOString());

    if (error || !allScores) {
      console.error('Error fetching scores for rank:', error);
      return 0;
    }

    // Aggregate scores by user
    const userTotals = new Map<string, number>();
    allScores.forEach(record => {
      const key = record.user_id || `guest_${record.name.toLowerCase().trim()}`;
      const current = userTotals.get(key) || 0;
      userTotals.set(key, current + (record.score || 0));
    });

    // Sort by total score descending
    const sortedTotals = Array.from(userTotals.entries())
      .sort((a, b) => b[1] - a[1]);

    // Find user's rank
    const userIndex = sortedTotals.findIndex(([key]) => key === userId);
    return userIndex >= 0 ? userIndex + 1 : 0;

  } catch (error) {
    console.error('Error getting user rank:', error);
    return 0;
  }
}

// Get user statistics
export async function getUserStats(
  userId: string,
  timeframe: 'weekly' | 'monthly' | 'all-time' = 'all-time'
) {
  try {
    const dateFilter = getDateFilter(timeframe);

    const { data, error } = await supabase
      .from('trivia_scores')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', dateFilter.toISOString())
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user stats:', error);
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
      lastPlayed: data[0]?.created_at
    };
  } catch (error) {
    console.error('Error in getUserStats:', error);
    return null;
  }
}

function getMostFrequentCategory(games: any[]): string {
  const categoryCount = games.reduce((acc: Record<string, number>, game) => {
    const category = game.category || 'Unknown';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const sortedCategories = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1]);

  return sortedCategories[0]?.[0] || 'Unknown';
}

// Migration function for when guests create accounts
export async function migrateGuestScores(
  guestName: string,
  userId: string
): Promise<boolean> {
  try {
    // Normalize the guest name (case-insensitive match)
    const normalizedName = guestName.toLowerCase().trim();

    // Find all guest scores with matching name (case-insensitive)
    const { data: guestScores, error: fetchError } = await supabase
      .from('trivia_scores')
      .select('id, name')
      .is('user_id', null);

    if (fetchError) {
      console.error('Error fetching guest scores:', fetchError);
      return false;
    }

    // Filter scores that match the normalized name
    const matchingScoreIds = guestScores
      ?.filter(score => score.name.toLowerCase().trim() === normalizedName)
      .map(score => score.id) || [];

    if (matchingScoreIds.length === 0) {
      console.log('No guest scores found to migrate');
      return true; // Not an error, just nothing to migrate
    }

    // Update the matching scores
    const { error: updateError } = await supabase
      .from('trivia_scores')
      .update({ user_id: userId })
      .in('id', matchingScoreIds);

    if (updateError) {
      console.error('Error migrating guest scores:', updateError);
      return false;
    }

    console.log(`Successfully migrated ${matchingScoreIds.length} guest scores to user ${userId}`);
    return true;
  } catch (error) {
    console.error('Error in migrateGuestScores:', error);
    return false;
  }
}