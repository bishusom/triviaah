'use client';

import HollandTestComponent from '@/components/iq-and-personality-tests/HollandTestComponent';
import Ads from '@/components/common/Ads';
import Script from 'next/script';
import { useState } from 'react';

export default function HollandPage() {
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Free Holland Career Assessment | Triviaah",
    "description": "Discover your career interests and personality type with our comprehensive Holland Code (RIASEC) assessment based on Dr. John Holland's theory.",
    "url": "https://triviaah.com/personality/holland",
    "mainEntity": {
      "@type": "PsychologicalTest",
      "name": "Holland Career Assessment",
      "description": "Free Holland Code assessment with analysis of Realistic, Investigative, Artistic, Social, Enterprising, and Conventional career interests.",
      "assesses": "Career interests and work personality types"
    }
  };

  return (
    <div className="page-with-ads">
      {/* Structured Data */}
      <Script
        id="holland-schema"
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
            🎯 Holland Career Assessment
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Discover your career interests based on the RIASEC theory
          </p>
          <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-green-100 text-gray-800 px-4 py-2 rounded-full text-sm font-medium mb-2">
            💼 Career Guidance • Personality Matching • Professional Development
          </div>
          <p className="text-gray-500">
            36 questions • Get Your Holland Code • Career Recommendations • Growth Insights
          </p>
        </div>
        
        <HollandTestComponent />

        {/* FAQ Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-blue-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🎯 What is the Holland Code?</h3>
              <p className="text-gray-600">The Holland Code (RIASEC) is a theory of career and vocational choice based on six personality types: Realistic, Investigative, Artistic, Social, Enterprising, and Conventional. It helps match personality types with compatible work environments.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🔬 How accurate is the Holland assessment?</h3>
              <p className="text-gray-600">The Holland Code assessment has been extensively researched since the 1950s and is widely used by career counselors, schools, and organizations worldwide. Its validity has been demonstrated across various cultures and populations.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">💼 Can my Holland Code change over time?</h3>
              <p className="text-gray-600">While core interests tend to be relatively stable, your Holland Code can evolve as you gain new experiences, develop new skills, or undergo significant life changes. It&apos;s common for secondary interests to become more prominent over time.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">🎓 How is this used in education and career planning?</h3>
              <p className="text-gray-600">The Holland assessment is used in schools for career guidance, in colleges for major selection, by career counselors for vocational guidance, and by organizations for team building and employee development.</p>
            </div>
          </div>
        </div>

        {/* The Six Holland Types */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="font-bold text-2xl text-gray-800 mb-6 text-center">The Six Holland Types (RIASEC)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">R</div>
                <div>
                  <h4 className="font-bold text-lg text-orange-800">Realistic</h4>
                  <p className="text-sm text-orange-600">Practical & Hands-on</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Enjoys working with tools and machinery</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Prefers concrete, tangible results</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Often athletic and mechanically inclined</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">•</span>
                  <span>Values practicality over theory</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">I</div>
                <div>
                  <h4 className="font-bold text-lg text-green-800">Investigative</h4>
                  <p className="text-sm text-green-600">Analytical & Intellectual</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Enjoys solving complex problems</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Prefers working independently</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Curious and analytical thinker</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  <span>Values knowledge and understanding</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">A</div>
                <div>
                  <h4 className="font-bold text-lg text-purple-800">Artistic</h4>
                  <p className="text-sm text-purple-600">Creative & Expressive</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Enjoys creative self-expression</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Prefers unstructured environments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Imaginative and intuitive</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">•</span>
                  <span>Values originality and beauty</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">S</div>
                <div>
                  <h4 className="font-bold text-lg text-blue-800">Social</h4>
                  <p className="text-sm text-blue-600">Cooperative & Helping</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Enjoys helping and teaching others</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Prefers teamwork over individual work</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Empathetic and understanding</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Values cooperation and harmony</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-red-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">E</div>
                <div>
                  <h4 className="font-bold text-lg text-red-800">Enterprising</h4>
                  <p className="text-sm text-red-600">Ambitious & Persuasive</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Enjoys leading and persuading others</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Prefers competitive environments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Ambitious and energetic</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Values achievement and recognition</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-xl mr-3">C</div>
                <div>
                  <h4 className="font-bold text-lg text-yellow-800">Conventional</h4>
                  <p className="text-sm text-yellow-600">Organized & Systematic</p>
                </div>
              </div>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Enjoys organizing data and systems</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Prefers structured, orderly work</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Detail-oriented and reliable</span>
                </li>
                <li className="flex items-start">
                  <span className="text-yellow-500 mr-2">•</span>
                  <span>Values accuracy and efficiency</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border border-green-200">
          <h3 className="font-bold text-lg text-gray-800 mb-4">🌟 Benefits of Knowing Your Holland Code:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                  <span>🎯</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Better Career Choices</h4>
                  <p className="text-sm text-gray-600">Match your personality with compatible careers and work environments</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                  <span>📈</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Increased Job Satisfaction</h4>
                  <p className="text-sm text-gray-600">Work in environments that align with your natural interests and strengths</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                  <span>🎓</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Educational Guidance</h4>
                  <p className="text-sm text-gray-600">Choose college majors and training programs that fit your personality</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3">
                  <span>🤝</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Improved Team Dynamics</h4>
                  <p className="text-sm text-gray-600">Understand how different personalities complement each other in teams</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}