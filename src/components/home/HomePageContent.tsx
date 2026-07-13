import { Suspense } from 'react';
import Ads from '@/components/common/Ads';
import CategoryShowcase from '@/components/home/sections/collapsible/CategoryShowcase';
import HorizontalScrollSection from '@/components/home/sections/collapsible/HorizontalScrollSection';
import Footer from '@/components/home/Footer'
import { DAILY_QUIZZES, BRAIN_WAVES, WORD_GAMES, NUMBER_PUZZLES, RETRO_GAMES } from '@/config/homeContent';

// Import new section components
import HeroSection from '@/components/home/sections/collapsible/HeroSection';
//import { HolidaySpecial } from '@/components/home/sections/HolidaySpecial';
import SeoContentSection from '@/components/home/sections/collapsible/SeoContentSection';
import KeyFeatures from '@/components/home/sections/collapsible/KeyFeatures';
import DailyTriviaFact from '@/components/home/sections/DailyTriviaFact';
import SectionContainer from '@/components/home/sections/collapsible/SectionContainer';
import { getTriviaExplorerCards } from '@/lib/trivia-categories';

async function FeaturedTriviaCategories() {
  const featuredTriviaCategories = await getTriviaExplorerCards('trivias');
  return <CategoryShowcase featuredTriviaCategories={featuredTriviaCategories} />;
}

export default function HomePageContent() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      <div className="bg-gray-800/50 py-6">
        <div className="container mx-auto px-4">
          <Ads format="fluid" style={{ width: '100%', height: '90px' }} />
        </div>
      </div>
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <HeroSection />
        <SectionContainer className="horizontal-scroll-section">
          <HorizontalScrollSection 
            title="Daily Quiz Challenges" 
            items={DAILY_QUIZZES} 
            isQuizSection={true}
            link="/daily-trivias"
          />
        </SectionContainer>

        <SectionContainer className="horizontal-scroll-section">
          <HorizontalScrollSection 
            title="Brain Waves - Daily Puzzle Games" 
            items={BRAIN_WAVES} 
            link="/brainwave"
          />
        </SectionContainer>
        
        <div className="bg-gray-800/50 py-6 rounded-xl my-6">
          <div className="container mx-auto px-4">
            <Ads format="fluid" style={{ width: '100%', height: '90px' }} />
          </div>
        </div>

        <SectionContainer className="horizontal-scroll-section">
          <HorizontalScrollSection 
            title="Word Games Collection" 
            items={WORD_GAMES} 
            link="/word-games"
          />
        </SectionContainer>

        <SectionContainer className="horizontal-scroll-section">
          <HorizontalScrollSection 
            title="Number Puzzles Collection" 
            items={NUMBER_PUZZLES} 
            link="/number-puzzles"
          />
        </SectionContainer>

        <SectionContainer className="horizontal-scroll-section">
          <HorizontalScrollSection 
            title="Retro Games Collection" 
            items={RETRO_GAMES} 
            link="/retro-games"
          />
        </SectionContainer>

        <SectionContainer className="horizontal-scroll-section">
          <DailyTriviaFact />
        </SectionContainer>

        <Suspense fallback={<div className="mb-8 min-h-48 rounded-2xl border border-white/10 bg-slate-900" aria-hidden="true" />}>
          <FeaturedTriviaCategories />
        </Suspense>

        {/*<SectionContainer className="horizontal-scroll-section">
          <HorizontalScrollSection 
            title="IQ & Personality Tests" 
            items={IQ_PERSONALITY_TESTS} 
            link="/iq-and-personality-tests"
          />
        </SectionContainer>
        */}  

        <SectionContainer className="horizontal-scroll-section">
          <SeoContentSection />
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
