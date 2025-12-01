// app/leaderboard/page.tsx
'use client';
import { getPersistentGuestId, rerollGuestId } from '@/lib/guestId';
import { Crown, Trophy, Star, Medal, Clock, Target, Award, BarChart3, UserCircle, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getLeaderboard, getUserRank, getUserStats, type LeaderboardEntry } from '@/lib/leaderboard';

type Timeframe = 'weekly' | 'monthly' | 'all-time';

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

export default function LeaderboardPage() {
  const [guestId, setGuestId] = useState<string>('Guest');
  const [timeframe, setTimeframe] = useState<Timeframe>('weekly');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number>(0);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'stats'>('leaderboard');

  useEffect(() => {
    // Get guest ID on component mount
    const id = getPersistentGuestId();
    setGuestId(id);
    loadLeaderboardData(id);
  }, [timeframe]);

  const loadLeaderboardData = async (currentGuestId: string) => {
    try {
      setLoading(true);
      
      console.log('Loading leaderboard data...');
      console.log('Guest ID:', currentGuestId);
      console.log('Timeframe:', timeframe);
      
      const leaderboard = await getLeaderboard(timeframe);
      console.log('Leaderboard loaded:', leaderboard);
      
      const rank = await getUserRank(currentGuestId, timeframe);
      console.log('User rank:', rank);
      
      const stats = await getUserStats(currentGuestId, timeframe);
      console.log('User stats:', stats);
      
      setLeaderboardData(leaderboard);
      setUserRank(rank);
      setUserStats(stats);
    } catch (error) {
      console.error('Error loading leaderboard data:', error);
      // Set empty data on error so UI still renders
      setLeaderboardData([]);
      setUserRank(0);
      setUserStats(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRerollGuestId = () => {
    const newId = rerollGuestId();
    setGuestId(newId);
    loadLeaderboardData(newId);
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Medal className="w-5 h-5 text-amber-600" />;
      default: return <div className="w-5 h-5 text-center text-gray-600 font-bold">{rank}</div>;
    }
  };

  const getTimeframeText = (timeframe: Timeframe) => {
    switch (timeframe) {
      case 'weekly': return 'This Week';
      case 'monthly': return 'This Month';
      case 'all-time': return 'All Time';
    }
  };

  // Helper function to determine if avatar is a URL or initials
  const isAvatarUrl = (avatar: string): boolean => {
    return avatar.startsWith('http://') || avatar.startsWith('https://') || avatar.startsWith('/');
  };

  // Render avatar - either image or initials
  const renderAvatar = (player: LeaderboardEntry) => {
    if (isAvatarUrl(player.avatar)) {
      return (
        <img 
          src={player.avatar} 
          alt={player.displayName}
          className="w-10 h-10 rounded-full object-cover border border-gray-200"
          onError={(e) => {
            // Fallback to initials if image fails to load
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            if (target.nextElementSibling) {
              (target.nextElementSibling as HTMLElement).style.display = 'flex';
            }
          }}
        />
      );
    } else {
      return (
        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm border border-gray-200">
          {player.avatar}
        </div>
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Leaderboard</h1>
            <p className="text-gray-600">Loading leaderboard data...</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-gray-100 h-16"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Leaderboard</h1>
          <p className="text-gray-600">Compete with quiz enthusiasts worldwide</p>
          
          {/* Guest ID Display */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div className="text-sm text-gray-500">
              Playing as: <span className="font-semibold text-gray-700">{guestId}</span>
            </div>
            <button
              onClick={handleRerollGuestId}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
              title="Change your guest name"
            >
              <RefreshCw size={14} />
              Change
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 border border-gray-200">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'leaderboard'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Leaderboard
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'stats'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Your Stats
            </button>
          </div>
        </div>

        {/* Timeframe Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 border border-gray-200">
            {(['weekly', 'monthly', 'all-time'] as const).map((time) => (
              <button
                key={time}
                onClick={() => setTimeframe(time)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeframe === time
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {time.charAt(0).toUpperCase() + time.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'leaderboard' ? (
          <>
            {/* Leaderboard */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">{getTimeframeText(timeframe)}</h2>
                <div className="text-gray-500 text-sm">
                  {leaderboardData.length} players
                </div>
              </div>

              {leaderboardData.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <Trophy className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-lg mb-2">No scores yet</p>
                  <p className="text-sm">Be the first to play and appear on the leaderboard!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {leaderboardData.map((player) => (
                    <div
                        key={`${player.username}-${player.rank}`} // Changed from userId to username
                        className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
                          player.displayName === guestId
                            ? 'bg-blue-50 border-blue-200 shadow-sm'
                            : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                      {/* Rank */}
                      <div className="flex items-center justify-center w-8">
                        {getRankIcon(player.rank)}
                      </div>

                      {/* Avatar */}
                      <div className="relative">
                        {renderAvatar(player)}
                        {/* Fallback initials div (hidden by default, shown if image fails) */}
                        {isAvatarUrl(player.avatar) && (
                          <div 
                            className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm absolute top-0 left-0 border border-gray-200"
                            style={{ display: 'none' }}
                          >
                            {player.displayName.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      {/* User Info */}
                      <div className="flex-1">
                        <div className="text-gray-800 font-medium flex items-center gap-2">
                          {player.displayName}
                          {player.rank === 1 && <Crown size={16} className="text-yellow-500" />}
                          {player.displayName === guestId && (
                            <span className="text-blue-600 text-sm font-normal">(You)</span>
                          )}
                        </div>
                        <div className="text-gray-500 text-sm">@{player.username}</div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <div className="text-gray-800 font-bold text-lg">{player.score.toLocaleString()}</div>
                        <div className="text-gray-500 text-sm">points</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Your Position */}
            {userRank > 0 && (
              <div className="mt-6 text-center bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="text-gray-700">
                  Your current rank: <span className="text-blue-600 font-semibold">#{userRank}</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  Keep playing to climb the leaderboard!
                </div>
              </div>
            )}
          </>
        ) : (
          /* Stats Tab */
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Your Statistics - {getTimeframeText(timeframe)}</h2>
            
            {!userStats ? (
              <div className="text-center text-gray-500 py-12">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-2">No games played yet</p>
                <p className="text-sm">Play some trivia games to see your statistics!</p>
                <div className="mt-4 text-sm text-gray-600">
                  Playing as: <span className="font-semibold text-gray-700">{guestId}</span>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Playing as</div>
                      <div className="text-lg font-semibold text-gray-800">{guestId}</div>
                    </div>
                    <button
                      onClick={handleRerollGuestId}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <RefreshCw size={14} />
                      Change Name
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Award className="w-5 h-5 text-blue-600" />
                      <h3 className="text-gray-800 font-semibold">Total Score</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{userStats.totalScore.toLocaleString()}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-green-600" />
                      <h3 className="text-gray-800 font-semibold">Accuracy</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{userStats.accuracy}%</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <h3 className="text-gray-800 font-semibold">Best Score</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{userStats.bestScore.toLocaleString()}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                      <h3 className="text-gray-800 font-semibold">Games Played</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{userStats.totalGames}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Star className="w-5 h-5 text-orange-500" />
                      <h3 className="text-gray-800 font-semibold">Average Score</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{userStats.averageScore}</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-red-500" />
                      <h3 className="text-gray-800 font-semibold">Avg. Time/Game</h3>
                    </div>
                    <p className="text-2xl font-bold text-gray-800">{userStats.averageTimePerGame}s</p>
                  </div>
                </div>

                {/* Additional Stats */}
                {userStats.favoriteCategory && (
                  <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Most Played Category</h3>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {userStats.favoriteCategory}
                      </div>
                      <div className="text-gray-600 text-sm">
                        Last played: {new Date(userStats.lastPlayed).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}