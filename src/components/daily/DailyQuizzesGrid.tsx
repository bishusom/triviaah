// components/daily/DailyQuizzesGrid.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';

interface Quiz {
  category: string;
  name: string;
  path: string;
  image: string;
  tagline: string;
  keywords: string;
}

interface PlayedQuizState {
  played: boolean;
  timestamp: number;
}

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {quizzes.map((quiz) => {
        const wasPlayed = playedQuizzes[quiz.category]?.played || false;
        const shouldReset = shouldResetQuiz(quiz.category);
        const showAsPlayed = wasPlayed && !shouldReset;

        return (
          <div
            key={quiz.category}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow hover:border-blue-400"
          >
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                  <Image
                    src={quiz.image}
                    alt={quiz.name}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>

              <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-gray-800 mb-1">{quiz.name}</h2>
                <p className="text-sm text-gray-600 italic mb-2">{quiz.tagline}</p>
              </div>

              <div className="mt-auto">
                {showAsPlayed ? (
                  <div className="text-center">
                    <div className="inline-flex items-center bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full">
                      <FaCheckCircle className="mr-2 text-green-500" />
                      <span>Played</span>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={quiz.path} 
                    onClick={() => handleQuizPlay(quiz.category)}
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors"
                  >
                    Play Now
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}