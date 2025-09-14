// app/capitale/page.tsx
'use client';

import { useState, useEffect } from 'react';
import MuteButton from '@/components/MuteButton';
import CapitaleComponent from '@/components/brainwave/capitale/CapitaleComponent';
import { getDailyCapitale, CapitalePuzzle, CapitalInfo} from '@/lib/brainwave/capitale/capitale-fb';


export default function CapitalePage() {
  const [dailyData, setDailyData] = useState<{ puzzle: CapitalePuzzle | null, allCapitals: CapitalInfo[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);

  useEffect(() => {
    // Set the current date on the client side to ensure it's using client timezone
    setCurrentDate(new Date());
  }, []);

  useEffect(() => {
    const fetchDailyCapitale = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyCapitale(currentDate);
        
        if (!data.puzzle) {
          setError('No puzzle available for today');
          return;
        }
        
        setDailyData(data);
      } catch (err) {
        console.error('Error fetching daily capitale:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyCapitale();
  }, [currentDate]);

  // Show loading while waiting for client date or data
  if (isLoading || !currentDate || !dailyData || !dailyData.puzzle) {
    return (
      <div className="no-ads-page">
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">🌎 Capitale</h1>
          <p className="text-gray-600 mb-6">Guess the world capital in 6 tries!</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s puzzle...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="no-ads-page">
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">🌎 Capitale</h1>
          <p className="text-gray-600 mb-4">Guess the world capital in 6 tries!</p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
            <p className="mb-2">No puzzle available for today.</p>
            <p className="text-sm">Please check back tomorrow or try refreshing the page!</p>
            <p className="text-red-500 text-sm mt-2">Error: {error}</p>
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
        <h1 className="text-3xl font-bold text-center mb-2">🌎 Capitale</h1>
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
              <MuteButton />
        </div>
        <p className="text-gray-600 text-center mb-6">Guess the world capital in 6 tries!</p>
        
        <CapitaleComponent 
          initialData={dailyData.puzzle} 
          allCapitals={dailyData.allCapitals} 
          currentDate={currentDate} 
        />
      </div>
    </div>
  );
}