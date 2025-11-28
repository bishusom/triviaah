'use client';

import { useState, useEffect } from 'react';
import Ads from '@/components/common/Ads';
import EngagementHero from './EngagementHero';
//import FeaturedQuizzesCarousel from './NetflixCarousel';
import DailyTriviaCards from './DailyTriviaCards';
import MoreGames from './MoreGames';
import KeyFeatures from './KeyFeatures';
import CategoryShowcase from './CategoryShowcase';
import BrainTeaserRow from './BrainTeaserRow';
import DailyTriviaFact  from './DailyTriviaFact';
import SocialProof from './SocialProof';
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
      <main>
        {/* 1. Enhanced Hero Section */}
        <EngagementHero />

        {/* Top Banner Ad */}
        <div className="bg-gray-900 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-3">
            <Ads 
              format="fluid" 
              className="rounded-xl shadow-smooth"
              style={{ width: '100%', height: '90px' }} 
            />
          </div>
        </div>
        
        {/* 2. Featured Quizzes Carousel - IMMEDIATELY after hero */}
        <DailyTriviaCards />
        
        {/* 4. Key Features with Value Proposition */}
        <DailyTriviaFact />

        {/* 3. Key Features with Value Proposition */}
        <BrainTeaserRow />

        {/* Mid-page Ad */}
        <div className="my-8 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <Ads 
            format="rectangle" 
            className="rounded-2xl shadow-smooth-lg"
            style={{ width: '100%', height: '250px' }}
          />
        </div>

        {/* 5. Key Features with Value Proposition */}
        <CategoryShowcase />

        {/* Footer Ad */}
        <div className="bg-gray-900 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-6">
          <div className="container mx-auto px-4">
            <Ads 
              format="fluid" 
              className="rounded-xl shadow-smooth"
              style={{ width: '100%', height: '90px' }} 
            />
          </div>
        </div>
        
        <MoreGames />

        {/* 6. Clean Category Showcase */}
        <KeyFeatures />
        
        {/* 7. Social Proof & Final CTA */}
        <SocialProof />
      </main>
      <Footer />
    </div>
  );
}