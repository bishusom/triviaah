// components/home/HomePageContent.tsx
'use client';

import { useEffect } from 'react';
import Ads from '@/components/common/Ads';
import NavBar from './NavBar';
import CategoryShowcase from './sections/CategoryShowcase';
import HorizontalScrollSection from './sections/HorizontalScrollSection';
import Footer from './Footer'
import { DAILY_QUIZZES, BRAIN_WAVES, RETRO_GAMES, IQ_PERSONALITY_TESTS } from '@/config/homeContent';

// Import new section components
import HeaderSection from './sections/HeaderSection';
import HeroSection from './sections/HeroSection';
import { HolidaySpecial } from './sections/HolidaySpecial';
//import SeoContentSection from './sections/SeoContentSection';
import KeyFeatures from './sections/KeyFeatures';
import DailyTriviaFact from './sections/DailyTriviaFact';
import SectionContainer from './sections/SectionContainer';
import MoreGames from './sections/MoreGames';

export default function HomePageContent() {
  useEffect(() => {
    const sections = document.querySelectorAll('.horizontal-scroll-section, .category-section');
    sections.forEach(section => {
      section.setAttribute('data-no-ads', 'true');
    });
  }, []);

  // Check if holiday specials should be shown
  const showHolidaySpecial = process.env.NEXT_PUBLIC_SHOW_HOLIDAY_SPECIALS === 'true';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      <HeaderSection />
      <NavBar />
     
      <div className="bg-gray-800/50 py-6">
        <div className="container mx-auto px-4">
          <Ads format="fluid" style={{ width: '100%', height: '90px' }} />
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <HeroSection />

        {/* Conditionally show holiday special based on env variable */}
        {showHolidaySpecial && <HolidaySpecial />}

        <SectionContainer className="horizontal-scroll-section">
          <HorizontalScrollSection 
            title="Daily Quiz Challenges" 
            items={DAILY_QUIZZES} 
            isQuizSection={true}
          />
        </SectionContainer>

        <SectionContainer className="horizontal-scroll-section">
          <HorizontalScrollSection 
            title="Brain Waves - Daily Puzzle Games" 
            items={BRAIN_WAVES} 
          />
        </SectionContainer>
        
        <div className="bg-gray-800/50 py-6 rounded-xl my-6">
          <div className="container mx-auto px-4">
            <Ads format="fluid" style={{ width: '100%', height: '90px' }} />
          </div>
        </div>

        <SectionContainer className="horizontal-scroll-section">
          <HorizontalScrollSection 
            title="Retro Games Collection" 
            items={RETRO_GAMES} 
          />
        </SectionContainer>

        <SectionContainer className="horizontal-scroll-section">
          <DailyTriviaFact />
        </SectionContainer>

        <MoreGames />

        <CategoryShowcase />

        <SectionContainer className="horizontal-scroll-section">
          <HorizontalScrollSection 
            title="IQ & Personality Tests" 
            items={IQ_PERSONALITY_TESTS} 
          />
        </SectionContainer>
 
        <KeyFeatures />

        
      </main>

      <div className="bg-gray-800/50 py-6">
        <div className="container mx-auto px-4">
          <Ads format="fluid" style={{ width: '100%', height: '90px' }} />
        </div>
      </div>
      
      <Footer />
    </div>
  );
}