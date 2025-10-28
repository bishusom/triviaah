// components/home/HomePageContent.tsx (with floating CTA addition)
'use client';
import { useEffect } from 'react';
import Ads from '@/components/common/Ads';
import CategoryGrid from '@/components/home/CategoryGrid';
import HorizontalScrollSection from '@/components/home/HorizontalScrollSection';
import Footer from '@/components/home/Footer';
import Image from 'next/image';
import { DAILY_QUIZZES, ADDITIONAL_SECTIONS, BRAIN_WAVES } from '@/../data/homeContent';
import CollapsibleSection from '@/components/home/CollapsibleSection';

export default function HomePageContent() {
  // Add this effect to prevent auto ad injection in specific sections
  useEffect(() => {
    // This prevents auto ads from being injected into these sections
    const sections = document.querySelectorAll('.horizontal-scroll-section, .category-section');
    sections.forEach(section => {
      section.setAttribute('data-no-ads', 'true');
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
       {/* Header */}
      <header className="bg-blue-700 text-white py-4 px-4">
        <div className="container mx-auto flex items-center justify-center gap-4">
            <Image
                src="/logo-new.webp"
                alt="Triviaah - Free Daily Trivia Games"
                width={200}
                height={36}
                priority
                quality={85}
                sizes="(max-width: 768px) 200px, 280px"
                className="object-contain lcp-priority"
            />
        </div>
        <div className="text-center mb-8">
          <h1 
            className="text-2xl font-bold text-gray-800 mb-2"
            style={{
              fontSize: '1.5rem',
              lineHeight: '2rem',
              fontWeight: 700,
              color: 'white',
              marginBottom: '0.5rem'
            }}
          >
            Triviaah: Free Daily Trivia Quiz with Answers & Explanations
          </h1>
          <p className="text-white mb-4">
            <strong>Triviaah</strong> offers new free online trivia games with answers every 24 hours. 
            Test your knowledge with our daily quiz challenges and learn instantly!
          </p>
        </div>  
      </header>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Triviaah",
            "url": "https://triviaah.com",
            "description": "Free daily trivia games with answers and explanations across multiple categories",
            "potentialAction": {
              "@type": "SearchAction",
              "target": "https://triviaah.com/search?q={search_term_string}",
              "query-input": "required name=search_term_string"
            }
          })
        }}
      />
     
      {/* Top banner Ads Section */}
      <Ads format="fluid" style={{ width: '100%', height: '90px' }} />
      
      {/* Main Content Area */}
      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Daily Quizzes with horizontal scroll on mobile - Add data attribute to prevent ads */}
        <div className="border-2 border-blue-600 rounded-lg p-4 mb-8">
          <div className="horizontal-scroll-section" data-no-ads="true">
            <HorizontalScrollSection 
              title="Daily Quiz Challenges" 
              items={DAILY_QUIZZES} 
              isQuizSection={true}
            />
          </div>
        </div>

        {/* Brain Waves Section with horizontal scroll on mobile - Add data attribute */}
        <div className="border-2 border-blue-600 rounded-lg p-4 mb-8">
          <div className="horizontal-scroll-section" data-no-ads="true">
            <HorizontalScrollSection 
              title="Brain Waves - Daily Puzzle Games" 
              items={BRAIN_WAVES} 
            />
          </div>
        </div>

        {/* More Brain Puzzles Section with horizontal scroll on mobile - Add data attribute */}
        <div className="border-2 border-blue-600 rounded-lg p-4 mb-8">
          <div className="horizontal-scroll-section" data-no-ads="true">
            <HorizontalScrollSection 
              title="More Free Online Brain Games & Word Puzzles" 
              items={ADDITIONAL_SECTIONS} 
            />
          </div>
        </div>

        {/* Simple Categories Section - Add data attribute */}
        <div className="border-2 border-blue-600 rounded-lg p-4 mb-8">
          <div className="category-section" data-no-ads="true">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
                Popular Quiz Categories
              </h2>
              <CategoryGrid />
            </div>
          </div>
        </div>

        {/* Enhanced SEO Content Section - Now Collapsible */}
        <CollapsibleSection title="Triviaah: Free Daily Quiz with Answers & Explanations">
          <div className="prose text-gray-600">
            <p className="mb-4">
              <strong>Triviaah</strong> offers the best collection of <strong>free daily quiz with answers</strong> and detailed explanations 
              across multiple categories. Our <strong>Triviaah daily quiz with answers</strong> format helps you learn while you play, 
              with instant feedback on every question. Enjoy our <strong>Triviaah free trivia games online</strong> 
              including <strong>trivia games to play with friends online</strong> and <strong>virtual trivia games for work</strong>. 
            </p>
            <p className="mb-4">
              Looking for <strong>daily quiz with answers free</strong> resources? <strong>Triviaah</strong> provides 
              <strong> quiz with answers and explanations</strong> that make learning engaging and effective. 
              Whether you`&apos;re preparing for a test, hosting a <strong>virtual trivia night with answers</strong>, 
              or just expanding your knowledge, our <strong>Triviaah daily trivia with answers</strong> format is perfect for all learners.
            </p>
            
            <h3 className="font-bold text-lg mt-6 mb-3">Why Choose Triviaah for Daily Trivia?</h3>
            <ul className="list-disc ml-6 mb-4">
              <li><strong>Triviaah daily quiz with answers</strong> updated every 24 hours</li>
              <li>Detailed explanations for every question in our <strong>Triviaah quiz with answers</strong></li>
              <li>Instant feedback on your <strong>Triviaah daily trivia challenges</strong></li>
              <li>Educational <strong>Triviaah trivia with answers</strong> across all categories</li>
            </ul>
            
            <p>
              As a leading <strong>free quiz website with answers</strong>, <strong>Triviaah</strong> provides comprehensive 
              <strong> daily quizzes with explanations</strong> that help you understand why answers are correct. 
              Our <strong>Triviaah trivia with answers and facts</strong> approach ensures you not only test your knowledge 
              but also expand it with every game. Join thousands of players who enjoy <strong>Triviaah educational quiz with answers</strong> daily!
            </p>
          </div>
        </CollapsibleSection>

        {/* New Section: How Our Daily Quiz with Answers Works - Now Collapsible */}
        <CollapsibleSection title="How Our Daily Quiz with Answers Works">
          <div className="bg-blue-50 grid grid-cols-1 md:grid-cols-3 gap-6">
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
        </CollapsibleSection>

        {/* Hidden brand reinforcement for SEO */}
        <div className="sr-only" aria-hidden="true">
          <h2>Triviaah Brand</h2>
          <p>Triviaah is your daily destination for free trivia games and quiz challenges with answers.</p>
          <p>Search &ldquo;Triviaah&rdquo; for daily trivia updates, quiz answers, and brain games.</p>
          <ul>
            <li>Triviaah daily trivia</li>
            <li>Triviaah quiz answers</li>
            <li>Triviaah brain games</li>
            <li>Triviaah online trivia</li>
            <li>Triviaah free quizzes</li>
          </ul>
        </div>      

      </main>

      {/* Footer Banner Ad */}
      <Ads format="fluid" style={{ width: '100%', height: '90px' }} /> 
      {/* Footer */}
      <Footer />
    </div>
  );
}