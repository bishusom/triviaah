'use client';

import MBTITestComponent from '@/components/iq-and-personality-tests/MBTITestComponent';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { useState } from 'react';

export default function MBTIPage() {
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Free MBTI Personality Test | Elite Trivias",
    "description": "Take our scientifically-based MBTI personality test to discover your personality type. Free, accurate, and detailed results with downloadable reports.",
    "url": "https://elitetrivias.com/personality/mbti",
    "mainEntity": {
      "@type": "PsychologicalTest",
      "name": "MBTI Personality Test",
      "description": "Free Myers-Briggs Type Indicator test with detailed analysis of your personality type, strengths, weaknesses, career matches, and downloadable reports.",
      "assesses": "Personality traits based on Carl Jung's psychological types"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Structured Data */}
      <Script
        id="mbti-schema"
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
            🎭 MBTI Personality Test
          </h1>
          <p className="text-lg text-gray-30 mb-2">
            Discover your true personality type in just 10 minutes
          </p>
          <div className="inline-flex items-center bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-2">
            🔒 Privacy-first: Your results stay on your device
          </div>
          <p className="text-gray-30">
            60 questions • Based on Carl Jung&apos;s theory • Downloadable reports
          </p>
        </div>
        
        <MBTITestComponent />

        {/* FAQ Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🔒 Is my data private?</h3>
              <p className="text-gray-600">Yes! All calculations happen on your device. We don&apos;t store your answers or results. You can download your report and it stays with you.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📊 How accurate is this test?</h3>
              <p className="text-gray-600">Our test is based on the official MBTI framework and Carl Jung&apos;s psychological types. While personality tests have limitations, the MBTI is widely used in career counseling and personal development.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">💾 Can I save my results?</h3>
              <p className="text-gray-600">Yes! You can download your results in three formats: PDF (for printing), Image (for sharing), and Text (for easy reference). Your download includes your complete personality profile.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🔄 Can I retake the test?</h3>
              <p className="text-gray-600">Yes! You can retake the test as many times as you want. Each time you&apos;ll get a new downloadable report with your updated results.</p>
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="font-bold text-lg text-gray-800 mb-3">🔒 Our Privacy Promise</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>No account required - just take the test</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Your answers never leave your device</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Results are generated locally in your browser</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Download reports to keep forever</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>No tracking of individual results</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}