'use client';

import EnneagramTestComponent from '@/components/personality-tests/EnneagramTestComponent';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { useState } from 'react';

export default function EnneagramPage() {
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Free Enneagram Personality Test | Elite Trivias",
    "description": "Take our comprehensive Enneagram test to discover your type, wing, triad center, and growth path. Free, detailed analysis with downloadable reports.",
    "url": "https://elitetrivias.com/personality/enneagram",
    "mainEntity": {
      "@type": "PsychologicalTest",
      "name": "Enneagram Personality Test",
      "description": "Free Enneagram type assessment with detailed analysis of your primary type, wing influence, triad center, and personal growth path.",
      "assesses": "Personality patterns based on the Enneagram system"
    }
  };

  return (
    <div className="page-with-ads">
      {/* Structured Data */}
      <Script
        id="enneagram-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Desktop Side Ads */}
      {showDesktopAds && (
        <>
          <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} />
          </div>
          <div className="fixed right-4 top-1/2 transform -translate-y-1/2 z-40 hidden lg:block">
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} />
          </div>
        </>
      )}
      
      {/* Mobile Bottom Ad */}
      {showMobileAd && (
        <Ads format="horizontal" isMobileFooter={true} className="lg:hidden" />
      )}
      
      {/* Ad Controls */}
      {showAds && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setShowDesktopAds(!showDesktopAds)}
            className="bg-gray-600 hover:bg-gray-800 text-white text-xs px-2 py-1 rounded hidden lg:block transition-colors"
          >
            {showDesktopAds ? 'Hide Side Ads' : 'Show Side Ads'}
          </button>
          <button
            onClick={() => setShowMobileAd(!showMobileAd)}
            className="bg-gray-600 hover:bg-gray-800 text-white text-xs px-2 py-1 rounded lg:hidden transition-colors"
          >
            {showMobileAd ? 'Hide Bottom Ad' : 'Show Bottom Ad'}
          </button>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            🎭 Enneagram Personality Test
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Discover your Enneagram type, wing, and personal growth path
          </p>
          <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-2">
            🌟 Ancient Wisdom • Modern Psychology • Personal Growth
          </div>
          <p className="text-gray-500">
            27 questions • 9 Personality Types • Wing Analysis • Growth Paths
          </p>
        </div>
        
        <EnneagramTestComponent />

        {/* FAQ Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🎭 What is the Enneagram?</h3>
              <p className="text-gray-600">The Enneagram is an ancient personality system that describes 9 distinct patterns of thinking, feeling, and behaving. Unlike other systems, it includes growth paths showing how each type can develop.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🔄 What are wings and triads?</h3>
              <p className="text-gray-600"><strong>Wings:</strong> The types adjacent to your primary type that influence your personality. <strong>Triads:</strong> Groups of three types that share common centers: Head (thinking), Heart (feeling), and Body (instinct).</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📈 How can I use my results?</h3>
              <p className="text-gray-600">Enneagram results are powerful for personal growth, improving relationships, career development, and understanding your motivations. The growth paths provide specific directions for development.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🤔 Can my type change?</h3>
              <p className="text-gray-600">Your core type doesn&apos;t change, but you can develop healthier expressions of it. The Enneagram shows directions of integration (growth) and disintegration (stress) for each type.</p>
            </div>
          </div>
        </div>

        {/* The 9 Types Overview */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-bold text-2xl text-gray-800 mb-6 text-center">The 9 Enneagram Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">⚖️</span>
                <h4 className="font-semibold text-blue-800">Type 1: The Reformer</h4>
              </div>
              <p className="text-sm text-gray-600">Principled, purposeful, perfectionistic. Motivated by integrity and improvement.</p>
            </div>
            
            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">💝</span>
                <h4 className="font-semibold text-pink-800">Type 2: The Helper</h4>
              </div>
              <p className="text-sm text-gray-600">Caring, generous, people-pleasing. Motivated by being loved and needed.</p>
            </div>
            
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">🏆</span>
                <h4 className="font-semibold text-yellow-800">Type 3: The Achiever</h4>
              </div>
              <p className="text-sm text-gray-600">Adaptable, excelling, driven. Motivated by success and admiration.</p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">🎨</span>
                <h4 className="font-semibold text-purple-800">Type 4: The Individualist</h4>
              </div>
              <p className="text-sm text-gray-600">Expressive, dramatic, self-absorbed. Motivated by authenticity and significance.</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">🔍</span>
                <h4 className="font-semibold text-gray-800">Type 5: The Investigator</h4>
              </div>
              <p className="text-sm text-gray-600">Perceptive, innovative, secretive. Motivated by knowledge and understanding.</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">🛡️</span>
                <h4 className="font-semibold text-green-800">Type 6: The Loyalist</h4>
              </div>
              <p className="text-sm text-gray-600">Engaging, responsible, anxious. Motivated by security and support.</p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">🎉</span>
                <h4 className="font-semibold text-orange-800">Type 7: The Enthusiast</h4>
              </div>
              <p className="text-sm text-gray-600">Spontaneous, versatile, distractible. Motivated by happiness and freedom.</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">⚡</span>
                <h4 className="font-semibold text-red-800">Type 8: The Challenger</h4>
              </div>
              <p className="text-sm text-gray-600">Self-confident, decisive, willful. Motivated by control and protection.</p>
            </div>
            
            <div className="bg-teal-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">🕊️</span>
                <h4 className="font-semibold text-teal-800">Type 9: The Peacemaker</h4>
              </div>
              <p className="text-sm text-gray-600">Receptive, reassuring, complacent. Motivated by peace and stability.</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4">🌟 Why the Enneagram is Powerful:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                <span>🔄</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Dynamic System</h4>
                <p className="text-sm text-gray-600">Shows growth and stress directions, not just static traits</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3">
                <span>🎯</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Growth Oriented</h4>
                <p className="text-sm text-gray-600">Provides specific paths for personal development</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-pink-100 text-pink-600 p-2 rounded-lg mr-3">
                <span>🤝</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Relationship Insights</h4>
                <p className="text-sm text-gray-600">Helps understand communication patterns with others</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="bg-teal-100 text-teal-600 p-2 rounded-lg mr-3">
                <span>💼</span>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Career Guidance</h4>
                <p className="text-sm text-gray-600">Reveals work styles and ideal career paths</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}