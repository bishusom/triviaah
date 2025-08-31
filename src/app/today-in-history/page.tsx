'use client'
import { useState, useEffect } from 'react';
import QuizGame from '@/components/trivias/QuizGame';
import { getTodaysHistoryQuestions } from '@/lib/firebase';
import MuteButton from '@/components/MuteButton';
import Script from 'next/script';
import type { Question } from '@/lib/firebase';

export default function TodayInHistoryPage() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');
  const [userTimezone, setUserTimezone] = useState<string>('');

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        // Get user's timezone and local date
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setUserTimezone(timezone);
        
        // Create date in user's timezone
        const today = new Date();
        const localFormattedDate = today.toLocaleDateString('en-US', {
          month: 'long',
          day: 'numeric',
          year: 'numeric'
        });
        
        setFormattedDate(localFormattedDate);
        
        // Fetch questions based on user's local date
        const fetchedQuestions = await getTodaysHistoryQuestions(10, today);
        
        if (!fetchedQuestions || fetchedQuestions.length === 0) {
          setError(true);
        } else {
          setQuestions(fetchedQuestions);
        }
      } catch (err) {
        console.error('Error loading questions:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col justify-center items-center min-h-64">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Loading Today&apos;s History Quiz
          </h2>
          <p className="text-gray-600 text-center">
            Getting questions for your local date...
          </p>
          <div className="mt-4 text-sm text-gray-500">
            🌍 Detecting your timezone...
          </div>
        </div>
      </div>
    );
  }

  if (error || !questions) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center bg-white rounded-lg shadow-md p-8">
          <div className="text-6xl mb-4">📅</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            No Quiz Available
          </h2>
          <p className="text-gray-600 mb-4">
            We couldn&apos;t load today&apos;s history quiz for your date. This might be because:
          </p>
          <ul className="text-sm text-gray-500 mb-6 space-y-1">
            <li>• No historical events are available for today&apos;s date</li>
            <li>• There was a network issue loading the questions</li>
            <li>• The quiz data is being updated</li>
          </ul>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Quiz",
    "name": `On This Day in History - ${formattedDate}`,
    "description": `Historical events quiz for ${formattedDate} - Localized for your timezone`,
    "about": "History, Historical Events, Famous Dates",
    "educationalAlignment": {
      "@type": "AlignmentObject",
      "alignmentType": "educationalSubject",
      "targetName": "History"
    },
    "hasPart": questions.map((q, index) => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.correct
      },
      "position": index + 1
    }))
  };

  return (
    <>
      <Script
        id="today-in-history-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="no-ads-page">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-center mb-2">
            On This Day in History
          </h1>
          <p className="text-center text-gray-600 mb-2">
            {formattedDate} • Daily Historical Events Quiz
          </p>
          {/* Show user's timezone for transparency */}
          <p className="text-center text-xs text-gray-500 mb-8">
            🌍 Showing events for your local date ({userTimezone})
          </p>
          <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
            <MuteButton />
          </div>
          
          <QuizGame 
            initialQuestions={questions} 
            category="today-in-history" 
          />
        </div>
      </div>
    </>
  );
}