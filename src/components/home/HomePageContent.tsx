// components/home/HomePageContent.tsx (simplified)
'use client';

import { AdBanner } from '@/components/Ads';
import StreakBadge from '@/components/StreakBadge';
import CategoryGrid from '@/components/home/CategoryGrid';
import HorizontalScrollSection from '@/components/home/HorizontalScrollSection';
import Footer from '@/components/home/Footer';
//import Image from 'next/image';
import Logo from '@/components/home/logo';
import { DAILY_QUIZZES, ADDITIONAL_SECTIONS } from '@/../data/homeContent';

export default function HomePageContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-700 text-white py-4 px-4">
        <div className="container mx-auto">
          <div className="logo-container">
            <Logo />
          </div>
        </div>
      </header>
      <AdBanner position="header" />

      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Free Daily Quiz with Answers & Explanations
          </h1>
          <p className="text-gray-600 mb-4">
            New free online trivia games with answers every 24 hours. Test your knowledge and learn instantly!
          </p>
        </div>

        <StreakBadge />

        {/* Daily Quizzes with horizontal scroll on mobile */}
        <HorizontalScrollSection 
          title="Daily Quiz Challenges" 
          items={DAILY_QUIZZES} 
          isQuizSection={true}
        />

        {/* More Brain Puzzles Section with horizontal scroll on mobile */}
        <HorizontalScrollSection 
          title="More Free Online Brain Games & Word Puzzles" 
          items={ADDITIONAL_SECTIONS} 
        />

        {/* Simple Categories Section */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
            Popular Quiz Categories
          </h2>
          <CategoryGrid />
        </div>

        {/* Simple How It Works Section */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold mb-2">Choose a Category</h4>
              <p className="text-sm text-gray-600">Select from various trivia categories</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="font-semibold mb-2">Answer Questions</h4>
              <p className="text-sm text-gray-600">Test your knowledge with fun questions</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="font-semibold mb-2">Learn & Improve</h4>
              <p className="text-sm text-gray-600">Get explanations and track your progress</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Banner Ad */}
      <AdBanner position="footer" />    
        
      {/* Footer */}
      <Footer />
    </div>
  );
}