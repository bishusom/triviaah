// components/home/HomePageContent.tsx
'use client';

import { useEffect } from 'react';
import Ads from '@/components/common/Ads';
import NavBar from '@/components/home/NavBar';
import CategoryGrid from '@/components/home/CategoryGrid';
import HorizontalScrollSection from '@/components/home/sections/HorizontalScrollSection';
import Footer from '@/components/home/Footer';
import CollapsibleSection from '@/components/home/CollapsibleSection';
import DailyTriviaFact from '@/components/home/DailyTriviaFact';
import { DAILY_QUIZZES, ADDITIONAL_SECTIONS, BRAIN_WAVES, IQ_PERSONALITY_TESTS } from '@/config/homeContent';

// Import new section components
import HeaderSection from '@/components/home/sections/HeaderSection';
import HeroSection from '@/components/home/sections/HeroSection';
import SeoContentSection from '@/components/home/sections/SeoContentSection';
import HowItWorksSection from '@/components/home/sections/HowItWorksSection';
import SectionContainer from '@/components/home/sections/SectionContainer';

export default function HomePageContent() {
  useEffect(() => {
    const sections = document.querySelectorAll('.horizontal-scroll-section, .category-section');
    sections.forEach(section => {
      section.setAttribute('data-no-ads', 'true');
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <HeaderSection />
      <NavBar />
     
      <Ads format="fluid" style={{ width: '100%', height: '90px' }} />
      
      <main className="container mx-auto px-4 py-6 flex-grow">
        <HeroSection />

        <SectionContainer className="horizontal-scroll-section">
          <HorizontalScrollSection 
            title="Daily Quiz Challenges" 
            items={DAILY_QUIZZES} 
            isQuizSection={true}
          />
        </SectionContainer>

        <SectionContainer className="horizontal-scroll-section">
          <DailyTriviaFact />
        </SectionContainer>

        <SectionContainer className="horizontal-scroll-section">
          <HorizontalScrollSection 
            title="Brain Waves - Daily Puzzle Games" 
            items={BRAIN_WAVES} 
          />
        </SectionContainer>
        
        <div className="bg-gray-50 py-6">
          <div className="container mx-auto px-4">
            <Ads format="fluid" style={{ width: '100%', height: '90px' }} />
          </div>
        </div>

        <SectionContainer className="horizontal-scroll-section">
          <HorizontalScrollSection 
            title="IQ & Personality Tests" 
            items={IQ_PERSONALITY_TESTS} 
          />
        </SectionContainer>
        

        <SectionContainer className="horizontal-scroll-section">
          <HorizontalScrollSection 
            title="More Free Online Brain Games & Word Puzzles" 
            items={ADDITIONAL_SECTIONS} 
          />
        </SectionContainer>

        <SectionContainer className="category-section">
          <div className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Popular Quiz Categories
            </h2>
            <CategoryGrid />
          </div>
        </SectionContainer>

        <CollapsibleSection title="Free Daily Quiz with Answers & Explanations">
          <SeoContentSection />
        </CollapsibleSection>

        <CollapsibleSection title="How Our Daily Quiz with Answers Works">
          <HowItWorksSection />
        </CollapsibleSection>
      </main>

      <Ads format="fluid" style={{ width: '100%', height: '90px' }} />
      <Footer />
    </div>
  );
}