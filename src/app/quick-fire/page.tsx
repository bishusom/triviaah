'use client';

import QuizGame from '@/components/trivias/QuizGame';
import { getRandomQuestions } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { type Question } from '@/lib/supabase';

export default function QuickFirePage() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ---------- 1. Fetch random questions ----------
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // 7 questions: mix of all difficulties (mix of 2)
        const data = await getRandomQuestions(7, ['easy', 'medium', 'hard']);
        if (!data || data.length === 0) {
          setError('No questions available right now. Please try again later.');
          return;
        }
        setQuestions(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // ---------- 2. Loading UI ----------
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Quick-Fire Quiz</h1>
        <p className="text-gray-600 mb-6">Loading questions…</p>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        </div>
      </div>
    );
  }

  // ---------- 3. Error UI ----------
  if (error || !questions) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-2">⚡ Quick-Fire Quiz</h1>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 max-w-lg mx-auto">
          <p className="mb-2">{error || 'Unable to load questions.'}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  // ---------- 4. Render Quiz ----------
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      
          <h1 className="text-3xl font-bold mb-2">⚡ Quick-Fire Quiz</h1>
          <QuizGame
            initialQuestions={questions}
            category="quick-fire"          // triggers quick-fire styling & speeds
            quizConfig={{
              isQuickfire: true,          // 6-second timer
              timePerQuestion: 15,
              hasBonusQuestion: true,     // last question = 500 pts bonus
            }}
          />  
    </div>  
  );
}