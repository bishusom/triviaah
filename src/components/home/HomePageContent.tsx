'use client';

import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import Header from './Header';
import EngagementHero from './EngagementHero';
import { HolidaySpecial } from './HolidaySpecial';
import DailyTriviaCards from './DailyTriviaCards';
import MoreGames from './MoreGames';
import KeyFeatures from './KeyFeatures';
import CategoryShowcase from './CategoryShowcase';
import BrainTeaserRow from './BrainTeaserRow';
import IQTestCards from './IQTestCards';
import DailyTriviaFact  from './DailyTriviaFact';

import Footer from './Footer';

export default function HomePageContent() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse text-white text-xl">Triviaah</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">   
      <Header />

      {/* Top Banner Ad */}
      <div className="bg-gray-900">
        <div className="container mx-auto px-4 py-3">
          <Ads 
            format="fluid" 
            className="rounded-xl shadow-smooth"
            style={{ width: '100%', height: '90px' }} 
          />
        </div>
      </div>

      <main>
        {/* 1. Enhanced Hero Section */}
        <EngagementHero />

        {/* Holiday Special Banner */}
        <HolidaySpecial />
        
        {/* 2. Featured Quizzes Carousel - IMMEDIATELY after hero */}
        <DailyTriviaCards />
        
        {/* 4. Key Features with Value Proposition */}
        <DailyTriviaFact />

        {/* 3. Key Features with Value Proposition */}
        <BrainTeaserRow />

        {/* Mid-page Ad */}
        <div className="bg-gray-900 dark:bg-gray-800">
          <div className="container mx-auto px-4 py-3">
            <Ads 
              format="fluid" 
              className="rounded-xl shadow-smooth"
              style={{ width: '100%', height: '90px' }} 
            />
          </div>
        </div>

        {/* 4. IQ Tests Section 
        <IQTestCards />
        */}
          
        {/* 5. More Games Section */}
        <MoreGames />

        {/* 6. Key Features with Value Proposition */}
        <CategoryShowcase />

        {/* Footer Ad */}
        <div className="bg-gray-900 dark:bg-gray-800 py-6">
          <div className="container mx-auto px-4">
            <Ads 
              format="fluid" 
              className="rounded-xl shadow-smooth"
              style={{ width: '100%', height: '90px' }} 
            />
          </div>
        </div>
     

        {/* 7. Clean Category Showcase */}
        <KeyFeatures />
        
        {/* 7. Social Proof & Final CTA 
        <SocialProof />*/}
      </main>
      <Footer />
    </div>
  );
}