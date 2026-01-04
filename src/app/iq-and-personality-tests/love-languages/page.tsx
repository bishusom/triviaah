'use client';

import LoveLanguagesTestComponent from '@/components/iq-and-personality-tests/LoveLanguagesTestComponent';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { useState } from 'react';

export default function LoveLanguagesPage() {
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Free Love Languages Assessment | Elite Trivias",
    "description": "Discover your primary love language with our comprehensive assessment based on Dr. Gary Chapman's 5 Love Languages theory.",
    "url": "https://elitetrivias.com/personality/love-languages",
    "mainEntity": {
      "@type": "PsychologicalTest",
      "name": "Love Languages Assessment",
      "description": "Free love languages profile assessment with analysis of Words of Affirmation, Acts of Service, Receiving Gifts, Quality Time, and Physical Touch.",
      "assesses": "Relationship communication styles and emotional needs"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Structured Data */}
      <Script
        id="love-languages-schema"
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
      
      <div className="max-w-3xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-30 mb-3">
            ❤️ The 5 Love Languages Assessment
          </h1>
          <p className="text-lg text-gray-30 mb-2">
            Discover how you give and receive love in relationships
          </p>
          <div className="inline-flex items-center bg-gradient-to-r from-pink-100 to-red-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium mb-2">
            💖 Relationship Insights • Better Communication • Emotional Connection
          </div>
          <p className="text-gray-30">
            30 questions • Based on Dr. Gary Chapman&apos;s research • Improves all relationships
          </p>
        </div>
        
        <LoveLanguagesTestComponent />

        {/* FAQ Section */}
        <div className="mt-12 bg-gradient-to-r from-pink-50 to-red-50 p-6 rounded-lg border border-pink-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">❤️ What are Love Languages?</h3>
              <p className="text-gray-600">Love Languages are the different ways people give and receive love, based on Dr. Gary Chapman&apos;s relationship research. Understanding your love language helps improve communication and emotional connection.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🤔 Can I have more than one love language?</h3>
              <p className="text-gray-600">Yes! Most people have a primary love language that&apos;s most important to them, and often a secondary language that also makes them feel loved. The test shows your scores for all five languages.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">💑 Do love languages apply to all relationships?</h3>
              <p className="text-gray-600">Absolutely! While often discussed in romantic contexts, love languages apply to friendships, family relationships, and even workplace connections. Understanding different love languages improves all types of relationships.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📚 Is this based on scientific research?</h3>
              <p className="text-gray-600">Yes, it&apos;s based on decades of relationship research by Dr. Gary Chapman, a marriage counselor and author of &apos;The 5 Love Languages&apos; book series, which has sold millions of copies worldwide.</p>
            </div>
          </div>
        </div>

        {/* The Five Love Languages */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-bold text-2xl text-gray-800 mb-6 text-center">The Five Love Languages Explained</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">❛ ❜</div>
                <div>
                  <h4 className="font-bold text-lg text-blue-800">Words of Affirmation</h4>
                  <p className="text-sm text-blue-600">Verbal expressions of love</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Compliments and praise</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>&quot;I love you&quot; and appreciation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Encouraging words</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Love notes and texts</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">🛠️</div>
                <div>
                  <h4 className="font-bold text-lg text-green-800">Acts of Service</h4>
                  <p className="text-sm text-green-600">Helpful actions</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Doing chores or tasks</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Making life easier</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Thoughtful gestures</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Following through on promises</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">🎁</div>
                <div>
                  <h4 className="font-bold text-lg text-purple-800">Receiving Gifts</h4>
                  <p className="text-sm text-purple-600">Thoughtful tokens</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Meaningful presents</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Small surprises &quot;just because&quot;</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Remembering special occasions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Gifts that show you listen</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">⏰</div>
                <div>
                  <h4 className="font-bold text-lg text-yellow-800">Quality Time</h4>
                  <p className="text-sm text-yellow-600">Undivided attention</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Focused conversations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Shared activities</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Making memories together</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Being fully present</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">🤗</div>
                <div>
                  <h4 className="font-bold text-lg text-red-800">Physical Touch</h4>
                  <p className="text-sm text-red-600">Physical affection</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Hugs and kisses</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Holding hands</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Non-sexual touch</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Physical closeness</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">❤️</div>
                <div>
                  <h4 className="font-bold text-lg text-pink-800">Why It Matters</h4>
                  <p className="text-sm text-pink-600">Improve all relationships</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Better communication</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Deeper emotional connection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Reduced misunderstandings</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Stronger bonds with loved ones</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border border-green-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4">🌟 Benefits of Knowing Your Love Language:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                  <span>💬</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Better Communication</h4>
                  <p className="text-sm text-gray-600">Express your needs clearly and understand your partner&apos;s needs</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                  <span>🤝</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Stronger Connections</h4>
                  <p className="text-sm text-gray-600">Build deeper emotional intimacy in all relationships</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                  <span>❤️</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">More Fulfilling Relationships</h4>
                  <p className="text-sm text-gray-600">Feel more loved and appreciated by those around you</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                  <span>⚡</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Conflict Resolution</h4>
                  <p className="text-sm text-gray-600">Understand and resolve misunderstandings more effectively</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}