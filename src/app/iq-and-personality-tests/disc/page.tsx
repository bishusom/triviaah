'use client';

import DISCTestComponent from '@/components/iq-and-personality-tests/DISCTestComponent';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { useState } from 'react';

export default function DISCPage() {
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Free DISC Personality Assessment | Triviaah",
    "description": "Take our comprehensive DISC assessment to discover your behavioral style, communication preferences, and work style adaptations.",
    "url": "https://triviaah.com/personality/disc",
    "mainEntity": {
      "@type": "PsychologicalTest",
      "name": "DISC Behavioral Assessment",
      "description": "Free DISC profile assessment with analysis of Dominance, Influence, Steadiness, and Conscientiousness traits.",
      "assesses": "Behavioral patterns and communication styles"
    }
  };

  return (
    <div className="page-with-ads">
      {/* Structured Data */}
      <Script
        id="disc-schema"
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
            📊 DISC Behavioral Assessment
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Discover your communication style and behavioral preferences
          </p>
          <div className="inline-flex items-center bg-gradient-to-r from-red-100 to-blue-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium mb-2">
            💼 Professional Development • Team Building • Communication Skills
          </div>
          <p className="text-gray-500">
            28 questions • Natural & Work Styles • Communication Insights • Team Dynamics
          </p>
        </div>
        
        <DISCTestComponent />

        {/* FAQ Section */}
        <div className="mt-12 bg-gradient-to-r from-red-50 to-blue-50 p-6 rounded-lg border border-red-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📊 What is DISC?</h3>
              <p className="text-gray-600">DISC is a behavioral assessment tool that measures four primary behavioral styles: Dominance (D), Influence (I), Steadiness (S), and Conscientiousness (C). It&apos;s widely used in professional settings for communication and team development.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🔄 What&apos;s the difference between natural and adapted styles?</h3>
              <p className="text-gray-600"><strong>Natural style:</strong> Your instinctive, preferred way of behaving. <strong>Adapted style:</strong> How you adjust your behavior in work or social situations. The gap between these shows your flexibility.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">💼 How is DISC used professionally?</h3>
              <p className="text-gray-600">DISC is used for team building, leadership development, improving communication, conflict resolution, sales training, and enhancing workplace relationships by understanding different behavioral styles.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🤝 Can my DISC style change?</h3>
              <p className="text-gray-600">Your core preferences remain relatively stable, but you can adapt your style for different situations. DISC helps you understand when and how to adapt for better communication and results.</p>
            </div>
          </div>
        </div>

        {/* The Four DISC Styles */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-bold text-2xl text-gray-800 mb-6 text-center">The Four DISC Behavioral Styles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-red-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">D</div>
                <div>
                  <h4 className="font-bold text-lg text-red-800">Dominance</h4>
                  <p className="text-sm text-red-600">Direct & Decisive</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Results-oriented</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Competitive</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Assertive</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Problem-solver</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">I</div>
                <div>
                  <h4 className="font-bold text-lg text-yellow-800">Influence</h4>
                  <p className="text-sm text-yellow-600">Outgoing & Optimistic</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>People-oriented</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Enthusiastic</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Persuasive</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Trusting</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">S</div>
                <div>
                  <h4 className="font-bold text-lg text-green-800">Steadiness</h4>
                  <p className="text-sm text-green-600">Steady & Supportive</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Team player</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Patient</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Good listener</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Reliable</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">C</div>
                <div>
                  <h4 className="font-bold text-lg text-blue-800">Conscientiousness</h4>
                  <p className="text-sm text-blue-600">Careful & Analytical</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Detail-oriented</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Systematic</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Quality-focused</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Accurate</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border border-green-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4">🌟 Benefits of Understanding DISC:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                  <span>🗣️</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Better Communication</h4>
                  <p className="text-sm text-gray-600">Adapt your communication style to connect more effectively with others</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                  <span>🤝</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Improved Teamwork</h4>
                  <p className="text-sm text-gray-600">Understand team dynamics and leverage diverse strengths</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                  <span>💼</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Career Development</h4>
                  <p className="text-sm text-gray-600">Identify roles and environments that suit your behavioral style</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                  <span>⚡</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Conflict Reduction</h4>
                  <p className="text-sm text-gray-600">Understand behavioral differences to prevent misunderstandings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}