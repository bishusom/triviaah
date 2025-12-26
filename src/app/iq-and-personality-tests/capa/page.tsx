'use client';

import { useState } from 'react';
import CAPATestComponent from '@/components/iq-and-personality-tests/CAPATestComponent';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { 
  Brain, 
  Shield, 
  Download,
  Clock,
  TrendingUp,
  Users,
  Award
} from 'lucide-react';

export default function CognitiveAssessmentPage() {
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Cognitive Abilities Profile Assessment | Free Brain Analysis",
    "description": "Take our comprehensive cognitive assessment to discover your thinking style, learning preferences, and career strengths. Free, private, and scientifically-informed.",
    "url": "https://elitetrivias.com/brainwave/cognitive-assessment",
    "mainEntity": {
      "@type": "PsychologicalTest",
      "name": "Cognitive Abilities Profile Assessment",
      "description": "Free cognitive assessment measuring 6 key domains: verbal, numerical, spatial, memory, reasoning, and processing speed.",
      "educationalUse": "Self-discovery, learning style identification, career guidance"
    }
  };

  return (
    <div className="page-with-ads">
      {/* Structured Data */}
      <Script
        id="capa-schema"
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
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 mb-6">
            <Brain size={40} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Cognitive Abilities Profile Assessment
          </h1>
          <p className="text-mb text-gray-600 mb-6 max-w-3xl mx-auto">
            Discover your unique thinking style, learning preferences, and cognitive strengths
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            <span className="inline-flex items-center bg-blue-100 text-blue-800 px-2 py-2 rounded-full text-sm font-medium">
              <Shield size={16} className="mr-2" />
              🔒 Private & Secure
            </span>
            <span className="inline-flex items-center bg-green-100 text-green-800 px-2 py-2 rounded-full text-sm font-medium">
              <Clock size={16} className="mr-2" />
              20–30 minutes
            </span>
            <span className="inline-flex items-center bg-purple-100 text-purple-800 px-2 py-2 rounded-full text-sm font-medium">
              <Download size={16} className="mr-2" />
              Downloadable Report
            </span>
            <span className="inline-flex items-center bg-orange-100 text-orange-800 px-2 py-2 rounded-full text-sm font-medium">
              <TrendingUp size={16} className="mr-2" />
              6 Cognitive Domains
            </span>
          </div>
        </div>

        {/* Main Test Component */}
        <div className="mb-16">
          <CAPATestComponent />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
              <Brain size={28} className="text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Scientifically-Informed</h3>
            <p className="text-gray-600">
              Based on cognitive psychology research, neuroscience, and psychometric principles.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Users size={28} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">Personalized Insights</h3>
            <p className="text-gray-600">
              Receive tailored learning strategies and career suggestions based on your unique profile.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
              <Award size={28} className="text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-3">No Registration</h3>
            <p className="text-gray-600">
              Start immediately. All processing happens on your device for maximum privacy.
            </p>
          </div>
        </div>

        {/* Spacing Divider */}
        <div className="flex justify-center mb-10"> {/* Added spacing divider with mb-20 */}
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-6">
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                🤔 What makes this assessment different from IQ tests?
              </h3>
              <p className="text-gray-600">
                This assessment focuses on understanding your unique cognitive profile rather than calculating a single number. 
                It measures 6 distinct domains and provides practical insights for learning and career development.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                🔒 How is my privacy protected?
              </h3>
              <p className="text-gray-600">
                All test processing happens locally on your device. We don&apos;t store your answers or results on our servers. 
                You can download your report and it remains with you.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                📊 How accurate are the results?
              </h3>
              <p className="text-gray-600">
                This assessment is designed for self-discovery and educational purposes. 
                While it&apos;s based on cognitive science principles, it&apos;s not a clinical evaluation. 
                For formal assessments, consult a licensed psychologist.
              </p>
            </div>
            
            <div className="border border-gray-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                💼 How can I use my results?
              </h3>
              <p className="text-gray-600">
                Your cognitive profile can help you understand your optimal learning styles, 
                choose careers that match your strengths, develop better study strategies, 
                and improve your problem-solving approaches.
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
                This cognitive assessment is for self-discovery, educational, and entertainment purposes only. 
                It is not a psychological evaluation, clinical diagnosis, or professional assessment of intelligence.
              </p>
              <ul className="text-gray-600 space-y-2">
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>Not for use in clinical, educational, or occupational selection</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>Does not measure emotional intelligence or creativity comprehensively</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>Results may vary based on mood, environment, and recent experiences</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-400 mr-2">•</span>
                  <span>For professional assessment, consult a licensed psychologist</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}