'use client';

import MuteButton from '@/components/common/MuteButton';
import Ads from '@/components/common/Ads';
import CrossgridGame from '@/components/word-games/CrossgridGame';
import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function CrossgridPage() {
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
      name: 'Crossgrid | Free Mini Crossword Word Square Game | Triviaah',
      description:
        'Play Crossgrid, a free clue-based word puzzle on Triviaah. Solve a compact mini crossword where every row and column must form a valid word.',
      url: 'https://triviaah.com/word-games/crossgrid',
      dateModified: lastUpdated,
      mainEntity: {
        '@type': 'Game',
        name: 'Crossgrid',
        description:
          'Daily word-square puzzle where players solve a compact clue grid so every row and column spells a valid word.',
        gameLocation: 'https://triviaah.com/word-games/crossgrid',
        characterAttribute: 'Vocabulary, Clue Solving, Word Recognition, Logical Thinking',
      },
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://triviaah.com' },
        { '@type': 'ListItem', position: 2, name: 'Word Games', item: 'https://triviaah.com/word-games' },
        { '@type': 'ListItem', position: 3, name: 'Crossgrid', item: 'https://triviaah.com/word-games/crossgrid' },
      ],
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What is Crossgrid?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Crossgrid is a mini clue-based word puzzle where each row and each column must form a valid word at the same time.',
          },
        },
        {
          '@type': 'Question',
          name: 'How do you play Crossgrid?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Use the across and down clues to fill the 3x3 grid. The puzzle is solved only when every row and every column forms the correct answer.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is Crossgrid good for vocabulary practice?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. Crossgrid blends clue-solving, spelling, and letter positioning, which makes it a useful vocabulary and pattern-recognition exercise.',
          },
        },
      ],
    },
  };

  useEffect(() => {
    setLastUpdated(new Date().toISOString());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      <Script id="crossgrid-org-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.organization) }} />
      <Script id="crossgrid-page-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.webpage) }} />
      <Script id="crossgrid-breadcrumb-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.breadcrumb) }} />
      <Script id="crossgrid-faq-schema" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData.faq) }} />

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

        <CrossgridGame />

        <div className="mt-8 bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <details className="group">
            <summary className="flex justify-between items-center cursor-pointer list-none">
              <h2 className="text-xl font-bold text-white">Crossgrid Guide & FAQ</h2>
              <span className="text-gray-500 transition-transform duration-200 group-open:rotate-180">▼</span>
            </summary>
            <div className="mt-4 space-y-4 pt-4 border-t border-gray-200">
              <p className="text-gray-300 text-sm">
                <strong>Last updated:</strong> {new Date(lastUpdated).toLocaleString()} (Server Time)
              </p>
              <p className="text-gray-300">
                Crossgrid is designed as a fast daily word puzzle. Because the same three answers must work
                both across and down, every letter placement matters.
              </p>
              <p className="text-gray-300">
                Start with the clue you feel most confident about, then use the crossing letters to narrow
                the remaining answers.
              </p>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
