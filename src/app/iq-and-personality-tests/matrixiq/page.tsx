'use client';

import { useState } from 'react';
import MatrixIQTestComponent from '@/components/iq-and-personality-tests/matrixiq/MatrixIQTestComponent';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { 
  Brain, 
  Shield, 
  Download,
  Clock,
  TrendingUp,
  Puzzle,
  Zap,
  Target,
  BarChart3,
  HelpCircle,
  CheckCircle
} from 'lucide-react';

export default function MatrixIQTestPage() {
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Matrix IQ Test | Free Pattern Recognition Assessment",
    "description": "Take our Matrix IQ Test to measure your pattern recognition, abstract reasoning, and fluid intelligence. Get your IQ estimate and cognitive profile.",
    "url": "https://triviaah.com/brainwave/matrix-iq",
    "mainEntity": {
      "@type": "PsychologicalTest",
      "name": "Matrix Intelligence Quotient Test",
      "description": "35 matrix reasoning problems measuring pattern recognition and abstract reasoning abilities associated with fluid intelligence.",
      "educationalUse": "Self-assessment, cognitive profiling, pattern recognition training"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50">
      {/* Structured Data */}
      <Script
        id="matrixiq-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Desktop Side Ads */}
      {showDesktopAds && showAds && (
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
      {showMobileAd && showAds && (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
          <Ads format="horizontal" isMobileFooter={true} />
        </div>
      )}
      
      {/* Ad Controls */}
      {showAds && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setShowDesktopAds(!showDesktopAds)}
            className="bg-gray-700 hover:bg-gray-800 text-white text-xs px-3 py-2 rounded-full hidden lg:block transition-colors shadow-md"
          >
            {showDesktopAds ? 'Hide Ads' : 'Show Ads'}
          </button>
          <button
            onClick={() => setShowMobileAd(!showMobileAd)}
            className="bg-gray-700 hover:bg-gray-800 text-white text-xs px-3 py-2 rounded-full lg:hidden transition-colors shadow-md"
          >
            {showMobileAd ? 'Hide Ad' : 'Show Ad'}
          </button>
        </div>
      )}
      
      <div className="max-w-3xl mx-auto p-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-indigo-600 mb-6">
            <Brain size={40} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Matrix Intelligence Quotient Test
          </h1>
          <p className="text-mb text-gray-600 mb-6 max-w-3xl mx-auto">
            Measure your pattern recognition, abstract reasoning, and fluid intelligence abilities
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-2 rounded-full text-sm font-medium">
              <Shield size={16} className="mr-2" />
              🔒 Private & Secure
            </span>
            <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-2 rounded-full text-sm font-medium">
              <Clock size={16} className="mr-2" />
              20-30 Minutes
            </span>
            <span className="inline-flex items-center bg-purple-100 text-purple-800 px-2 py-2 rounded-full text-sm font-medium">
              <Download size={16} className="mr-2" />
              IQ Estimate Report
            </span>
            <span className="inline-flex items-center bg-orange-100 text-orange-800 px-2 py-2 rounded-full text-sm font-medium">
              <Puzzle size={16} className="mr-2" />
              30 Matrix Problems
            </span>
          </div>
        </div>

        {/* Main Test Component */}
        <div className="mb-16">
          <MatrixIQTestComponent />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20"> {/* Increased mb-8 to mb-20 */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Puzzle size={28} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Pattern Recognition</h3>
            <p className="text-gray-600">
              Measures your ability to identify and complete visual patterns, a key component of fluid intelligence.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Zap size={28} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Abstract Reasoning</h3>
            <p className="text-gray-600">
              Tests your ability to solve problems using logical rules and abstract concepts without prior knowledge.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Target size={28} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Cognitive Profiling</h3>
            <p className="text-gray-600">
              Provides detailed insights into your thinking style, strengths, and ideal career paths.
            </p>
          </div>
        </div>

        {/* Spacing Divider */}
        <div className="flex justify-center mb-10"> {/* Added spacing divider with mb-20 */}
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <div className="text-center mb-12"> {/* Added more margin bottom */}
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 mb-4">
              <HelpCircle size={32} className="text-indigo-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about the Matrix IQ Test
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-xl p-6 hover:border-purple-300 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <HelpCircle className="mr-2 text-purple-600" size={20} />
                What is a Matrix IQ Test?
              </h3>
              <p className="text-gray-600">
                Matrix IQ tests measure pattern recognition and abstract reasoning abilities, 
                which are key components of fluid intelligence. They involve completing visual 
                patterns in a grid format, similar to Raven&apos;s Progressive Matrices.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <BarChart3 className="mr-2 text-blue-600" size={20} />
                How is the IQ estimate calculated?
              </h3>
              <p className="text-gray-600">
                Your IQ estimate is based on your performance percentile compared to normative data. 
                It considers accuracy, speed, and difficulty level to provide an estimate of 
                pattern recognition ability associated with fluid intelligence.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-6 hover:border-green-300 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <CheckCircle className="mr-2 text-green-600" size={20} />
                How accurate is this test?
              </h3>
              <p className="text-gray-600">
                This test measures pattern recognition ability, which correlates with fluid intelligence. 
                However, it&apos;s not a comprehensive IQ test and should be used for self-discovery 
                rather than formal assessment.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors duration-300">
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <TrendingUp className="mr-2 text-orange-600" size={20} />
                Can I improve my score?
              </h3>
              <p className="text-gray-600">
                Yes! Pattern recognition improves with practice. Regular practice with matrix problems, 
                puzzles, and spatial reasoning tasks can enhance your abilities over time.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-gradient-to-r from-gray-100 to-blue-50 border border-gray-300 rounded-2xl p-8">
          <div className="flex items-start">
            <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4 flex-shrink-0">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-3">Important Disclaimer</h3>
              <p className="text-gray-700 mb-3">
                This Matrix IQ Test measures pattern recognition and abstract reasoning abilities, 
                which are components of fluid intelligence. It is for self-discovery, educational, 
                and entertainment purposes only.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>Not a clinical IQ test or psychological evaluation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>Does not measure all aspects of intelligence (verbal, emotional, creative, etc.)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>IQ estimates are approximations based on pattern recognition performance</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>For formal assessment, consult a licensed psychologist</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}