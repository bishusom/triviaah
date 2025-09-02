'use client';

import TrordleComponent from '@/components/trordle/TrordleComponent';
import { getDailyTrordle } from '@/lib/trordle-fb';
import MuteButton from '@/components/MuteButton';
import { useState, useEffect } from 'react';
import { TrordleData } from '@/lib/trordle-logic'; // Import the correct type

export default function TrordlePage() {
  const [trordleData, setTrordleData] = useState<TrordleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    // Set the current date on the client side to ensure it's using client timezone
    setCurrentDate(new Date());
  }, []);

  useEffect(() => {
    const fetchDailyTrordle = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyTrordle(currentDate);
        
        if (!data) {
          setError('No puzzle available for today');
          return;
        }
        
        setTrordleData(data);
      } catch (err) {
        console.error('Error fetching daily trordle:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyTrordle();
  }, [currentDate]); // Depend on currentDate instead of empty array

  // Show loading while waiting for client date or data
  if (isLoading || !currentDate) {
    return (
      <div className="no-ads-page">
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Trordle</h1>
          <p className="text-gray-600 mb-6">The trivia version of Wordle. Guess the answer in 6 tries!</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s puzzle...</p>
        </div>
      </div>
    );
  }

  if (error || !trordleData) {
    return (
      <div className="no-ads-page">
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Trordle</h1>
          <p className="text-gray-600 mb-4">The trivia version of Wordle. Guess the answer in 6 tries!</p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="mb-2">No puzzle available for today.</p>
            <p className="text-sm">Please check back tomorrow or try refreshing the page!</p>
            {error && <p className="text-red-500 text-sm mt-2">Error: {error}</p>}
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="no-ads-page">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-2">Trordle</h1>
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        <p className="text-gray-600 text-center mb-6">The trivia version of Wordle. Guess the answer in 6 tries!</p>
        
        {/* Show current date for debugging */}
        <div className="text-center mb-4 text-sm text-gray-500">
          Playing puzzle for: {currentDate.toLocaleDateString()}
        </div>
        
        <TrordleComponent initialData={trordleData} />
      </div>
    </div>
  );
}