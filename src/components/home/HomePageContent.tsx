// components/home/HomePageContent.tsx (with floating CTA addition)
'use client';
import { useEffect, useState } from 'react';
import Ads from '@/components/Ads';
import CategoryGrid from '@/components/home/CategoryGrid';
import HorizontalScrollSection from '@/components/home/HorizontalScrollSection';
import Footer from '@/components/home/Footer';
import Image from 'next/image';
import Link from 'next/link';
import { DAILY_QUIZZES, ADDITIONAL_SECTIONS, BRAIN_WAVES } from '@/../data/homeContent';
import CollapsibleSection from '@/components/home/CollapsibleSection';

export default function HomePageContent() {
  const [isAboveTheFoldLoaded, setIsAboveTheFoldLoaded] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  useEffect(() => {
    // Mark above-the-fold content as loaded after a short delay
    const timer = setTimeout(() => {
      setIsAboveTheFoldLoaded(true);
    }, 1000);
  
    return () => clearTimeout(timer);
  }, []); 

  useEffect(() => {
    // Show floating CTA after user scrolls past first screen
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight * 0.8) {
        setShowFloatingCTA(true);
      } else {
        setShowFloatingCTA(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      </header>
     
      {/* Top banner Ads Section */}
        <Ads />

      <main className="container mx-auto px-4 py-6 flex-grow">
        {/* Critical heading with inline styles to prevent render delay */}
        <div className="text-center mb-8">
          <h1 
            className="text-2xl font-bold text-gray-800 mb-2"
            style={{
              fontSize: '1.5rem',
              lineHeight: '2rem',
              fontWeight: 700,
              color: 'rgb(31 41 55)',
              marginBottom: '0.5rem'
            }}
          >
            Free Daily Quiz with Answers & Explanations
          </h1>
          <p className="text-gray-600 mb-4">
            New free online trivia games with answers every 24 hours. Test your knowledge and learn instantly!
          </p>
        </div>

        {/* Daily Quizzes with horizontal scroll on mobile - Add data attribute to prevent ads */}
        <div className="horizontal-scroll-section" data-no-ads="true">
          <HorizontalScrollSection 
            title="Daily Quiz Challenges" 
            items={DAILY_QUIZZES} 
            isQuizSection={true}
          />
        </div>

        {/* Brain Waves Section with horizontal scroll on mobile - Add data attribute */}
        <div className="horizontal-scroll-section" data-no-ads="true">
          <HorizontalScrollSection 
            title="Brain Waves - Daily Puzzle Games" 
            items={BRAIN_WAVES} 
          />
        </div>

        {/* More Brain Puzzles Section with horizontal scroll on mobile - Add data attribute */}
        <div className="horizontal-scroll-section" data-no-ads="true">
          <HorizontalScrollSection 
            title="More Free Online Brain Games & Word Puzzles" 
            items={ADDITIONAL_SECTIONS} 
          />
        </div>

        {/* Simple Categories Section - Add data attribute */}
        <div className="category-section" data-no-ads="true">
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
              Popular Quiz Categories
            </h2>
            <CategoryGrid />
          </div>
        </div>

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
      </main>

      {/* Footer Banner Ad */}
        <Ads />
        
      {/* Footer */}
      <Footer />
    </div>
  );
}