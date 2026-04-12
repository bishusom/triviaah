'use client';

import { useEffect, useState } from 'react';
import MuteButton from '@/components/common/MuteButton';
import KakuroPuzzle from '@/components/number-puzzles/KakuroPuzzle';
import Ads from '@/components/common/Ads';
import Script from 'next/script';

export default function KakuroPage() {
  const [lastUpdated, setLastUpdated] = useState<string>(new Date().toISOString());
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const structuredData = {
    organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Triviaah',
      url: 'https://triviaah.com',
      logo: 'https://triviaah.com/logo.png',
    },
    webpage: {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: 'Kakuro | Free Cross Sums Number Puzzle | Triviaah',
      description:
        'Play Kakuro on Triviaah, a free cross sums puzzle where each row and column must match its clue total without repeating digits.',
      url: 'https://triviaah.com/number-puzzles/kakuro',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Kakuro',
        description:
          'Mini Kakuro puzzle where players place digits to satisfy row and column sums while avoiding repeats within each run.',
        gameLocation: 'https://triviaah.com/number-puzzles/kakuro',
        characterAttribute: 'Arithmetic, Logical Thinking, Constraint Solving, Pattern Recognition',
      },
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://triviaah.com' },
        { '@type': 'ListItem', position: 2, name: 'Number Puzzles', item: 'https://triviaah.com/number-puzzles' },
        { '@type': 'ListItem', position: 3, name: 'Kakuro', item: 'https://triviaah.com/number-puzzles/kakuro' },
      ],
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Kakuro?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Kakuro is a number puzzle often described as a crossword with sums. Each run must add up to its clue while using distinct digits.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do you solve Kakuro?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Use the clue totals to test valid digit combinations, then narrow options where row and column runs intersect. Repeated digits are not allowed within the same run.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Kakuro good for math practice?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Kakuro strengthens arithmetic fluency, logical deduction, and combination-based reasoning while staying approachable for casual players.',
          },
        },
      ],
    },
  };

  useEffect(() => {
    setLastUpdated(new Date().toISOString());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <Script id="kakuro-org-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }} />
      <Script id="kakuro-page-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }} />
      <Script id="kakuro-breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      <Script id="kakuro-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faq) }} />

      {showDesktopAds && (
        <>
          <div className="fixed left-4 bottom-8 z-40 hidden lg:block">
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-right" />
          </div>
          <div className="fixed right-4 bottom-8 z-40 hidden lg:block">
            <Ads format="vertical" style={{ width: '300px', height: '600px' }} closeButtonPosition="top-left" />
          </div>
        </>
      )}

      {showMobileAd && <Ads format="horizontal" isMobileFooter={true} className="lg:hidden" />}

      {showAds && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button onClick={() => setShowDesktopAds(!showDesktopAds)} className="bg-gray-600 hover:bg-gray-800 text-white text-xs px-2 py-1 rounded hidden lg:block">
            {showDesktopAds ? 'Hide Side Ads' : 'Show Side Ads'}
          </button>
          <button onClick={() => setShowMobileAd(!showMobileAd)} className="bg-gray-600 hover:bg-gray-800 text-white text-xs px-2 py-1 rounded lg:hidden">
            {showMobileAd ? 'Hide Bottom Ad' : 'Show Bottom Ad'}
          </button>
        </div>
      )}

      <div className="max-w-3xl mx-auto p-4">
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>

        <KakuroPuzzle />

        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold text-white">Kakuro Guide & FAQ</h2>
              <span className="text-gray-500 transition-transform duration-200 group-open:rotate-180">▼</span>
            </summary>
            <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
              <p className="text-gray-300 text-sm">
                <strong>Last updated:</strong> {new Date(lastUpdated).toLocaleString()} (Server Time)
              </p>
              <p className="text-gray-300">
                Kakuro rewards combination logic. A clue total does not just tell you the sum, it limits
                which digits can appear together in that run.
              </p>
              <p className="text-gray-300">
                If you get stuck, compare the smallest and largest possible combinations for the clue before
                placing a number.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
