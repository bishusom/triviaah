// components/daily/DailyQuizzesGrid.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { CircleCheck, Play, Clock } from 'lucide-react';

interface Quiz {
  category: string;
  name: string;
  path: string;
  image: string;
  tagline: string;
  keywords: string;
  color?: string;
  icon?: string;
  questions?: number;
  time?: string;
  players?: string;
}

interface PlayedQuizState {
  played: boolean;
  timestamp: number;
}

// Color configurations for different categories
const categoryConfigs = {
  'quick-fire': {
    color: 'from-orange-500 to-red-500',
    icon: '⚡',
    gradient: 'from-orange-500/10 to-red-500/10',
    border: 'border-orange-500/30'
  },
  'general-knowledge': {
    color: 'from-blue-500 to-cyan-500',
    icon: '🌎',
    gradient: 'from-blue-500/10 to-cyan-500/10',
    border: 'border-blue-500/30'
  },
  'today-in-history': {
    color: 'from-amber-500 to-orange-500',
    icon: '📅',
    gradient: 'from-amber-500/10 to-orange-500/10',
    border: 'border-amber-500/30'
  },
  'entertainment': {
    color: 'from-purple-500 to-pink-500',
    icon: '🎬',
    gradient: 'from-purple-500/10 to-pink-500/10',
    border: 'border-purple-500/30'
  },
  'geography': {
    color: 'from-green-500 to-emerald-500',
    icon: '🗺️',
    gradient: 'from-green-500/10 to-emerald-500/10',
    border: 'border-green-500/30'
  },
  'science': {
    color: 'from-cyan-500 to-blue-500',
    icon: '🔬',
    gradient: 'from-cyan-500/10 to-blue-500/10',
    border: 'border-cyan-500/30'
  },
  'arts-literature': {
    color: 'from-pink-500 to-rose-500',
    icon: '🎨',
    gradient: 'from-pink-500/10 to-rose-500/10',
    border: 'border-pink-500/30'
  },
  'sports': {
    color: 'from-red-500 to-orange-500',
    icon: '⚽',
    gradient: 'from-red-500/10 to-orange-500/10',
    border: 'border-red-500/30'
  }
};

export default function DailyQuizzesGrid({ quizzes }: { quizzes: Quiz[] }) {
  const [playedQuizzes, setPlayedQuizzes] = useState<Record<string, PlayedQuizState>>({});

  useEffect(() => {
    const stored = localStorage.getItem('playedQuizzes');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const updated: Record<string, PlayedQuizState> = {};
        for (const key in parsed) {
          if (typeof parsed[key] === 'boolean') {
            updated[key] = { played: parsed[key], timestamp: 0 };
          } else {
            updated[key] = parsed[key];
          }
        }
        setPlayedQuizzes(updated);
      } catch (e) {
        console.error('Error parsing playedQuizzes', e);
      }
    }
  }, []);

  const handleQuizPlay = useCallback((category: string) => {
    const updated = { 
      ...playedQuizzes, 
      [category]: { 
        played: true, 
        timestamp: Date.now() 
      } 
    };
    setPlayedQuizzes(updated);
    localStorage.setItem('playedQuizzes', JSON.stringify(updated));
  }, [playedQuizzes]);

  const shouldResetQuiz = (category: string) => {
    if (!playedQuizzes[category]) return true;
    
    const lastPlayed = new Date(playedQuizzes[category].timestamp);
    const now = new Date();
    
    return (
      lastPlayed.getDate() !== now.getDate() ||
      lastPlayed.getMonth() !== now.getMonth() ||
      lastPlayed.getFullYear() !== now.getFullYear()
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
      {quizzes.map((quiz) => {
        const config = categoryConfigs[quiz.category as keyof typeof categoryConfigs] || {
          color: 'from-cyan-500 to-blue-500',
          icon: '❓',
          gradient: 'from-cyan-500/10 to-blue-500/10',
          border: 'border-cyan-500/30'
        };

        const wasPlayed = playedQuizzes[quiz.category]?.played || false;
        const shouldReset = shouldResetQuiz(quiz.category);
        const showAsPlayed = wasPlayed && !shouldReset;
        const isNewDay = wasPlayed && shouldReset;

        return (
          <div
            key={quiz.category}
            className="group cursor-pointer"
          >
            <div className={`bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-500 hover:shadow-2xl overflow-hidden h-full flex flex-col ${
              showAsPlayed ? 'opacity-80' : 'opacity-100'
            }`}>
              {/* Header with icon and status */}
              <div className={`p-6 bg-gradient-to-r ${config.gradient} border-b ${config.border}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${config.color} rounded-xl flex items-center justify-center shadow-lg`}>
                    <span className="text-2xl">{config.icon}</span>
                  </div>
                  
                  {/* Status Badge */}
                  {showAsPlayed && (
                    <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 text-xs font-semibold flex items-center gap-1">
                      <CircleCheck className="text-sm" />
                      Played
                    </div>
                  )}
                  {isNewDay && (
                    <div className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full border border-cyan-500/30 text-xs font-semibold">
                      New Today!
                    </div>
                  )}
                </div>

                {/* Quiz Title */}
                <h3 className="font-bold text-white text-xl mb-2 leading-tight group-hover:text-cyan-400 transition-colors">
                  {quiz.name}
                </h3>
                
                {/* Quiz Description */}
                <p className="text-gray-300 text-sm leading-relaxed">
                  {quiz.tagline}
                </p>
              </div>

              {/* Stats Section */}
              <div className="p-4 bg-gray-750 border-b border-gray-700">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  {quiz.questions && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>{quiz.questions} questions</span>
                    </div>
                  )}
                  {quiz.time && (
                    <div className="flex items-center gap-1">
                      <Clock className="text-yellow-400 text-xs" />
                      <span>{quiz.time}</span>
                    </div>
                  )}
                  {quiz.players && (
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span>{quiz.players}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Section */}
              <div className="p-4 mt-auto">
                {showAsPlayed ? (
                  <div className="text-center">
                    <div className="inline-flex items-center bg-gray-700 text-gray-400 text-sm px-4 py-3 rounded-xl border border-gray-600 w-full justify-center">
                      <CircleCheck className="mr-2 text-green-500" />
                      <span>Completed Today</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-2">
                      New questions in <span className="text-cyan-400 font-semibold">24h</span>
                    </p>
                  </div>
                ) : (
                  <Link
                    href={quiz.path} 
                    onClick={() => handleQuizPlay(quiz.category)}
                    className="group/btn flex items-center justify-center gap-2 w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                  >
                    <Play className="text-sm" />
                    <span>Play Now</span>
                    <span className="group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                )}
              </div>

              {/* Hover accent line */}
              <div className="w-0 group-hover:w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}