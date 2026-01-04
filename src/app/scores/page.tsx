// app/scores/page.tsx - updated with real data
'use client';
import { useAuth } from '@/context/AuthContext';
import { getUserQuizHistory, getUserStats } from '@/lib/scores';
import { Trophy, Star, Target, Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

interface QuizHistory {
  id: string;
  category: string;
  score: number;
  correct_answers: number;
  total_questions: number;
  time_used: number;
  created_at: string;
}

export default function ScoresPage() {
  const { user, profile } = useAuth();
  const [quizHistory, setQuizHistory] = useState<QuizHistory[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;
      
      try {
        const [history, userStats] = await Promise.all([
          getUserQuizHistory(user.id),
          getUserStats(user.id)
        ]);
        
        setQuizHistory(history || []);
        setStats(userStats);
      } catch (error) {
        console.error('Error loading scores:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (!user || !profile || loading) {
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
          <h1 className="text-3xl font-bold text-white mb-2">My Scores</h1>
          <p className="text-gray-400">Track your quiz performance and progress</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
            <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats?.totalQuizzes || 0}</div>
            <div className="text-gray-400 text-sm">Quizzes Taken</div>
          </div>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
            <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats?.averageScore || 0}</div>
            <div className="text-gray-400 text-sm">Average Score</div>
          </div>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
            <Star className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{stats?.bestScore || 0}</div>
            <div className="text-gray-400 text-sm">Best Score</div>
          </div>
          <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 text-center">
            <div className="w-8 h-8 text-purple-400 mx-auto mb-2 flex items-center justify-center font-bold">%</div>
            <div className="text-2xl font-bold text-white">{stats?.accuracy || 0}%</div>
            <div className="text-gray-400 text-sm">Accuracy</div>
          </div>
        </div>

        {/* Quiz History */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Recent Quizzes</h2>
          {quizHistory.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">No quiz history yet</div>
              <div className="text-sm text-gray-500">Complete some quizzes to see your scores here!</div>
            </div>
          ) : (
            <div className="space-y-3">
              {quizHistory.map((quiz) => (
                <div key={quiz.id} className="flex items-center justify-between p-4 bg-gray-750 rounded-lg border border-gray-600">
                  <div className="flex-1">
                    <div className="text-white font-medium">{quiz.category}</div>
                    <div className="text-gray-400 text-sm flex items-center gap-2">
                      <Calendar size={14} />
                      {new Date(quiz.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{quiz.score} pts</div>
                    <div className="text-gray-400 text-sm">
                      {quiz.correct_answers}/{quiz.total_questions} correct
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}