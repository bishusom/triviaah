// src/app/landmarkdle/page.tsx
'use client';

import LandmarkdleComponent from '@/components/brainwave/LandmarkdleComponent';
import { getDailyLandmark, LandmarkPuzzle } from '@/lib/brainwave/landmarkdle/landmarkdle-sb';
import MuteButton from '@/components/common/MuteButton';
import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';

export default function LandmarkdlePage() {
  const [landmarkData, setLandmarkData] = useState<{puzzle: LandmarkPuzzle | null} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<Date | null>(null);
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);

  useEffect(() => {
    // Set the current date on the client side to ensure it's using client timezone
    setCurrentDate(new Date());
  }, []);

  useEffect(() => {
    const fetchDailyLandmark = async () => {
      if (!currentDate) return; // Wait for client date to be set
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Explicitly pass the client-side date
        const data = await getDailyLandmark(currentDate);
        
        if (!data || !data.puzzle) {
          setError('No puzzle available for today');
          return;
        }
        
        setLandmarkData(data);
      } catch (err) {
        console.error('Error fetching daily landmark:', err);
        setError(err instanceof Error ? err.message : 'An error occurred while loading the puzzle');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDailyLandmark();
  }, [currentDate]); // Depend on currentDate instead of empty array

  // Show loading while waiting for client date or data
  if (isLoading || !currentDate) {
    return (
      <div className="page-with-ads">
        {/* Desktop Side Ads */}
        {showDesktopAds && (
          <>
            <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-right"/>
            </div>
            <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-left"/>
            </div>
          </>
        )}
        
        {/* Mobile Bottom Ad */}
        {showMobileAd && (
          <Ads format="horizontal" isMobileFooter={true} className="lg:hidden" />
        )}
        
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Landmarkdle</h1>
          <p className="text-gray-600 mb-6">Landmark guessing puzzle. Guess the landmark in 6 tries using 6 attributes!</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-gray-500 text-sm mt-2">Loading today&apos;s puzzle...</p>
        </div>
      </div>
    );
  }

  if (error || !landmarkData) {
    return (
      <div className="page-with-ads">
        {/* Desktop Side Ads */}
        {showDesktopAds && (
          <>
            <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-right"/>
            </div>
            <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
              <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-left"/>
            </div>
          </>
        )}
        
        {/* Mobile Bottom Ad */}
        {showMobileAd && (
           <Ads format="horizontal" isMobileFooter={true} className="lg:hidden" />
        )}
        
        <div className="max-w-2xl mx-auto p-6 text-center">
          <h1 className="text-3xl font-bold mb-2">Landmarkdle</h1>
          <p className="text-gray-600 mb-4">Landmark guessing puzzle. Guess the landmark in 6 tries using 6 attributes!</p>
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
    <div className="page-with-ads">
      {/* Desktop Side Ads */}
      {showDesktopAds && (
        <>
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-right"/>
          </div>
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-left"/>
          </div>
        </>
      )}
      
      {/* Mobile Bottom Ad */}
      {showMobileAd && (
         <Ads format="horizontal" isMobileFooter={true} className="lg:hidden" />
      )}
      
      {/* Ad Controls */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setShowDesktopAds(!showDesktopAds)}
          className="bg-gray-600 hover:bg-gray-800 text-white text-xs px-2 py-1 rounded hidden lg:block"
        >
          {showDesktopAds ? 'Hide Side Ads' : 'Show Side Ads'}
        </button>
        <button
          onClick={() => setShowMobileAd(!showMobileAd)}
          className="bg-gray-600 hover:bg-gray-800 text-white text-xs px-2 py-1 rounded lg:hidden"
        >
          {showMobileAd ? 'Hide Bottom Ad' : 'Show Bottom Ad'}
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-2">🏛️ Landmarkdle</h1>
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        <p className="text-gray-600 text-center mb-6">Landmark guessing puzzle. Guess the landmark in 6 tries using 6 attributes!</p>
        
        {landmarkData.puzzle && <LandmarkdleComponent initialData={landmarkData as { puzzle: LandmarkPuzzle }} />}
      </div>
    </div>
  );
}