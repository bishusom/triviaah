// components/home/HomePageContent.tsx
'use client';

import { AdBanner } from '@/components/Ads';
import ScrollButtons from '@/components/ScrollButtons';
import StreakBadge from '@/components/StreakBadge';
import HeroSection from '@/components/home/HeroSection';
import HorizontalScrollSection from '@/components/home/HorizontalScrollSection';
import CollapsibleSection from '@/components/home/CollapsibleSection';
import CategoryGrid from '@/components/home/CategoryGrid';
import Footer from '@/components/home/Footer';
import Image from 'next/image';
import { DAILY_QUIZZES, ADDITIONAL_SECTIONS } from '@/../data/homeContent';

export default function HomePageContent() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header Banner Ad - placed after header */}
      <header className="bg-blue-700 text-white py-4 px-4">
        <div className="container mx-auto flex items-center justify-center gap-4">
          <Image
            src="/logo-280x80.webp"
            alt="Triviaah - Free Daily Trivia Games"
            width={140}
            height={40}
            priority
            quality={75}
            className="object-contain lcp-priority"
          />
        </div>
      </header>
      <AdBanner position="header" />

      {/* Add the HeroSection here */}
      <HeroSection />

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
          
        {/* SEO-Enhanced Categories Section */}
        <CategoryGrid />
        
        {/* Enhanced SEO Content Section - Now Collapsible */}
        <CollapsibleSection title="Free Daily Quiz with Answers & Explanations">
          <div className="prose text-gray-600">
            <p className="mb-4">
              Triviaah offers the best collection of <strong>free daily quiz with answers</strong> and detailed explanations 
              across multiple categories. Our <strong>daily quiz with answers</strong> format helps you learn while you play, 
              with instant feedback on every question. Enjoy our <strong>free trivia games online</strong> 
              including <strong>trivia games to play with friends online</strong> and <strong>virtual trivia games for work</strong>. 
            </p>
            <p className="mb-4">
              Looking for <strong>daily quiz with answers free</strong> resources? Our platform provides 
              <strong> quiz with answers and explanations</strong> that make learning engaging and effective. 
              Whether you&apos;re preparing for a test, hosting a <strong>virtual trivia night with answers</strong>, 
              or just expanding your knowledge, our <strong>daily trivia with answers</strong> format is perfect for all learners.
            </p>
            <ul className="list-disc ml-6 mb-4">
              <li><strong>Daily quiz with answers</strong> updated every 24 hours</li>
              <li>Detailed explanations for every question in our <strong>quiz with answers</strong></li>
              <li>Instant feedback on your <strong>daily trivia challenges</strong></li>
              <li>Educational <strong>trivia with answers</strong> across all categories</li>
              <li>Perfect for <strong>team building quizzes with answers</strong></li>
              <li>Learn while you play with our <strong>quiz games with answers</strong></li>
              <li>Track your progress with our <strong>daily quiz challenge with answers</strong></li>
              <li>Share your scores on <strong>social media trivia with answers</strong></li>
            </ul>
            <p>
              As a leading <strong>free quiz website with answers</strong>, we provide comprehensive 
              <strong> daily quizzes with explanations</strong> that help you understand why answers are correct. 
              Our <strong>trivia with answers and facts</strong> approach ensures you not only test your knowledge 
              but also expand it with every game. Join thousands of players who enjoy our 
              <strong> educational quiz with answers</strong> platform daily!
            </p>
          </div>
        </CollapsibleSection>

        {/* New Section: How Our Daily Quiz with Answers Works - Now Collapsible */}
        <CollapsibleSection title="How Our Daily Quiz with Answers Works">
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h5 className="font-semibold mb-2">Play Daily Quiz</h5>
                <p className="text-sm text-gray-600">Choose from multiple categories and test your knowledge with our daily updated quizzes</p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h5 className="font-semibold mb-2">Get Instant Answers</h5>
                <p className="text-sm text-gray-600">Receive immediate feedback with detailed explanations for each question</p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-md">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h5 className="font-semibold mb-2">Learn & Improve</h5>
                <p className="text-sm text-gray-600">Track your progress, learn new facts, and improve your scores over time</p>
              </div>
            </div>
          </div>
        </CollapsibleSection>

        <ScrollButtons />  
      </main>

      {/* Footer Banner Ad */}
      <AdBanner position="footer" />    
        
      {/* Enhanced Footer */}
      <Footer />
    </div>
  );
}