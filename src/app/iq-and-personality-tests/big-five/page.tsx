'use client';

import TraitTestComponent from '@/components/iq-and-personality-tests/TraitTestComponent';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { useState } from 'react';

export default function BigFivePage() {
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Free Big Five Personality Test | Triviaah",
    "description": "Take our scientifically-based Big Five (OCEAN) personality test to discover your personality traits. Free, accurate, and detailed results with downloadable reports.",
    "url": "https://triviaah.com/personality/big-five",
    "mainEntity": {
      "@type": "PsychologicalTest",
      "name": "Big Five Personality Test",
      "description": "Free OCEAN personality test with detailed analysis of your Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism scores.",
      "assesses": "Personality traits based on the Five Factor Model"
    }
  };

  return (
    <div className="page-with-ads">
      {/* Structured Data */}
      <Script
        id="big-five-schema"
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
            🧠 Big Five Personality Test (OCEAN)
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Discover your scientifically-validated personality traits in just 10 minutes
          </p>
          <div className="inline-flex items-center bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-2">
            🔬 Scientifically Validated • Used by psychologists worldwide
          </div>
          <p className="text-gray-500">
            60 questions • Measures OCEAN traits • Percentile-based scoring
          </p>
        </div>
        
        <TraitTestComponent />

        {/* FAQ Section */}
        <div className="mt-12 bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border border-purple-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🔬 What is the Big Five (OCEAN) model?</h3>
              <p className="text-gray-600">The Big Five is a scientifically validated personality model that measures five major dimensions: Openness, Conscientiousness, Extraversion, Agreeableness, and Neuroticism. It&apos;s widely used in psychological research and organizational psychology.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📊 How are scores calculated?</h3>
              <p className="text-gray-600">Scores range from -30 to 30 for each trait, converted to percentiles (0-100%) showing where you stand compared to the general population. Higher scores indicate stronger expression of that trait.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🔄 How does this differ from MBTI?</h3>
              <p className="text-gray-600">While MBTI categorizes people into types, the Big Five measures traits on continuous scales. This provides more nuanced insights and is considered more scientifically robust by psychologists.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">💼 How can I use these results?</h3>
              <p className="text-gray-600">Big Five results are useful for personal development, career planning, improving relationships, and understanding your strengths. Many employers use similar assessments for career counseling.</p>
            </div>
          </div>
        </div>

        {/* Trait Definitions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4">🎯 Understanding the Big Five Traits</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">🧠</span>
                <h4 className="font-semibold text-purple-800">Openness</h4>
              </div>
              <p className="text-sm text-gray-600">Imagination, creativity, curiosity, and willingness to try new things</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">📊</span>
                <h4 className="font-semibold text-blue-800">Conscientiousness</h4>
              </div>
              <p className="text-sm text-gray-600">Organization, responsibility, dependability, and achievement orientation</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">🗣️</span>
                <h4 className="font-semibold text-green-800">Extraversion</h4>
              </div>
              <p className="text-sm text-gray-600">Sociability, assertiveness, enthusiasm, and enjoyment of social interaction</p>
            </div>
            
            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">🤝</span>
                <h4 className="font-semibold text-pink-800">Agreeableness</h4>
              </div>
              <p className="text-sm text-gray-600">Compassion, cooperation, trust, and concern for others</p>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">🎭</span>
                <h4 className="font-semibold text-red-800">Neuroticism</h4>
              </div>
              <p className="text-sm text-gray-600">Emotional stability, sensitivity to stress, and tendency to experience negative emotions</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <span className="text-2xl mr-2">📈</span>
                <h4 className="font-semibold text-gray-800">Percentile Scores</h4>
              </div>
              <p className="text-sm text-gray-600">Shows where you stand compared to the general population (0-100%)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}