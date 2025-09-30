'use client';

import QuizGame from '@/components/trivias/QuizGame';
import { getDailyQuizQuestions } from '@/lib/supabase';
import { useState, useEffect } from 'react';
import { type Question } from '@/lib/supabase';

export default function DailyQuizPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  // Get the category from params
  useEffect(() => {
    const getCategory = async () => {
      try {
        const resolvedParams = await params;
        setCategory(resolvedParams.category);
      } catch (error) {
        console.error('Error getting category:', error);
        setError('Invalid category');
      }
    };
    getCategory();
  }, [params]);

  // Set the current date on the client side
  useEffect(() => {
    setCurrentDate(new Date());
  }, []);

  // Fetch questions when we have both category and date
  useEffect(() => {
    const fetchDailyQuizQuestions = async () => {
      if (!category || !currentDate) return;

      try {
        setIsLoading(true);
        setError(null);
        
        // Pass the client-side date to the function
        const data = await getDailyQuizQuestions(category, currentDate);
        
        if (!data || data.length === 0) {
          setError(`No daily quiz available for ${category.replace(/-/g, ' ')} today`);
          return;
        }
        
        setQuestions(data);
      } catch (err) {
        console.error('Error fetching daily quiz questions:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the quiz');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyQuizQuestions();
  }, [category, currentDate]);

  // Generate metadata values for display (since we can't export generateMetadata in client components)
  const formattedCategory = category
    ? category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    : '';

  // Show loading while waiting for category, date, or data
  if (isLoading || !category || !currentDate) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Daily Quiz</h1>
          <p className="text-gray-600 mb-6">Loading today&apos;s quiz...</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          {category && currentDate && (
            <div className="mt-4 text-sm text-gray-500">
              <p>Category: {formattedCategory}</p>
              <p>Date: {currentDate.toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !questions) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">{formattedCategory} Daily Quiz</h1>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 max-w-lg mx-auto">
            <p className="mb-2">No daily quiz available for {formattedCategory.toLowerCase()} today.</p>
            <p className="text-sm">Please check back tomorrow or try a different category!</p>
            {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
          </div>
          
          <div className="text-sm text-gray-500 mb-4">
            <p>Looking for quiz on: {currentDate.toLocaleDateString()}</p>
          </div>
          
          <div className="space-x-2">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Refresh Page
            </button>
            <button 
              onClick={() => window.history.back()} 
              className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show the quiz game
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Debug info for development */}
      <div className="text-center mb-4 text-sm text-gray-500">
        <p>{formattedCategory} Daily Quiz for {currentDate.toLocaleDateString()}</p>
      </div>
      
      <QuizGame initialQuestions={questions} category={category} />
    </div>
  );
}