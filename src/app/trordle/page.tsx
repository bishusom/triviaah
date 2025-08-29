'use client';

import TrordleComponent from '@/components/trordle/TrordleComponent';
import { getDailyTrordle } from '@/lib/trordle-fb';
import MuteButton from '@/components/MuteButton';
import { useState, useEffect } from 'react';

export default function TrordlePage() {
  const [trordleData, setTrordleData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDailyTrordle = async () => {
      try {
        setIsLoading(true);
        // This will now use the client's date
        const data = await getDailyTrordle();
        setTrordleData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyTrordle();
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Daily Trordle</h1>
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error || !trordleData) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Daily Trordle</h1>
        <p className="text-gray-600">No puzzle available for today. Please check back tomorrow!</p>
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
        
        <TrordleComponent initialData={trordleData} />
      </div>
    </div>
  );
}