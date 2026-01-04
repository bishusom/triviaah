// app/profile/page.tsx
'use client';
import { useAuth } from '@/context/AuthContext';
import { useState, useEffect } from 'react';
import { User, Mail, Crown, Calendar, Trophy, BarChart3, Target, Clock } from 'lucide-react';
import { getUserStats, getUserQuizHistory } from '@/lib/scores';

interface UserStats {
  totalQuizzes: number;
  averageScore: number;
  bestScore: number;
  totalCorrect: number;
  totalQuestions: number;
  accuracy: number;
  recentQuizzes: any[];
  favoriteCategory: string;
}

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    display_name: profile?.display_name || '',
    username: profile?.username || '',
  });
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [recentGames, setRecentGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user?.id]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [stats, history] = await Promise.all([
        getUserStats(user!.id),
        getUserQuizHistory(user!.id, 5)
      ]);
      
      setUserStats(stats);
      setRecentGames(history);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!user || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account information and track your progress</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              {/* Avatar & Basic Info */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {profile.display_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">
                    {profile.display_name || 'Quizzer'}
                  </h2>
                  <p className="text-cyan-400">@{profile.username}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Crown size={16} className="text-yellow-400" />
                    <span className="text-yellow-400 text-sm">Premium Member</span>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={formData.display_name}
                      onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                      placeholder="Enter display name"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500"
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleSave}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors flex-1"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail size={18} />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar size={18} />
                    <span>Joined {formatDate(profile.created_at)}</span>
                  </div>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg transition-colors w-full"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>

            {/* Quick Stats */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <BarChart3 size={20} />
                Quick Stats
              </h3>
              
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading stats...</p>
                </div>
              ) : userStats ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center bg-gray-750 rounded-lg p-3 border border-gray-600">
                    <div className="text-2xl font-bold text-cyan-400">
                      {userStats.totalQuizzes}
                    </div>
                    <div className="text-gray-400 text-sm">Quizzes Taken</div>
                  </div>
                  <div className="text-center bg-gray-750 rounded-lg p-3 border border-gray-600">
                    <div className="text-2xl font-bold text-yellow-400">
                      {userStats.bestScore}
                    </div>
                    <div className="text-gray-400 text-sm">High Score</div>
                  </div>
                  <div className="text-center bg-gray-750 rounded-lg p-3 border border-gray-600">
                    <div className="text-2xl font-bold text-green-400">
                      {userStats.accuracy}%
                    </div>
                    <div className="text-gray-400 text-sm">Accuracy</div>
                  </div>
                  <div className="text-center bg-gray-750 rounded-lg p-3 border border-gray-600">
                    <div className="text-2xl font-bold text-purple-400">
                      {userStats.averageScore}
                    </div>
                    <div className="text-gray-400 text-sm">Avg Score</div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400">No quiz data yet</p>
                  <p className="text-gray-500 text-sm mt-1">Play some quizzes to see your stats!</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Detailed Stats & Recent Games */}
          <div className="lg:col-span-2 space-y-6">
            {/* Detailed Statistics */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Trophy size={20} />
                Performance Overview
              </h3>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading performance data...</p>
                </div>
              ) : userStats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Total Performance */}
                  <div className="space-y-4">
                    <h4 className="text-cyan-400 font-semibold">Overall Performance</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Total Correct Answers</span>
                        <span className="text-white font-semibold">
                          {userStats.totalCorrect}/{userStats.totalQuestions}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Accuracy Rate</span>
                        <span className="text-green-400 font-semibold">{userStats.accuracy}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Favorite Category</span>
                        <span className="text-purple-400 font-semibold capitalize">
                          {userStats.favoriteCategory.replace(/-/g, ' ')}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Score Statistics */}
                  <div className="space-y-4">
                    <h4 className="text-cyan-400 font-semibold">Score Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Best Score</span>
                        <span className="text-yellow-400 font-semibold">{userStats.bestScore}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Average Score</span>
                        <span className="text-white font-semibold">{userStats.averageScore}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Total Quizzes</span>
                        <span className="text-cyan-400 font-semibold">{userStats.totalQuizzes}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Trophy size={48} className="text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No performance data available</p>
                  <p className="text-gray-500 text-sm mt-1">Complete your first quiz to see statistics</p>
                </div>
              )}
            </div>

            {/* Recent Games */}
            <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Clock size={20} />
                Recent Games
              </h3>
              
              {loading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Loading recent games...</p>
                </div>
              ) : recentGames.length > 0 ? (
                <div className="space-y-3">
                  {recentGames.map((game, index) => (
                    <div
                      key={game.id}
                      className="flex items-center justify-between p-3 bg-gray-750 rounded-lg border border-gray-600 hover:border-cyan-500/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold capitalize">
                            {game.category.replace(/-/g, ' ')}
                          </span>
                          {game.subcategory && (
                            <span className="text-gray-400 text-sm capitalize">
                              • {game.subcategory.replace(/-/g, ' ')}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{formatDate(game.created_at)}</span>
                          <span>•</span>
                          <span>{game.correct_answers}/{game.total_questions} correct</span>
                          {game.time_used > 0 && (
                            <>
                              <span>•</span>
                              <span>{formatTime(game.time_used)}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-cyan-400">
                          {game.score}
                        </div>
                        <div className="text-green-400 text-sm">
                          {Math.round((game.correct_answers / game.total_questions) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="text-gray-400 mb-2">No recent games</div>
                  <p className="text-gray-500 text-sm">Your quiz history will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}