// src/app/brainwave/minesweeper/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { Bomb, Clock, Trophy, Zap, Target } from 'lucide-react';
import MuteButton from '@/components/common/MuteButton';
import Ads from '@/components/common/Ads';
import MinesweeperComponent from '@/components/retro-games/MinesweeperComponent';

export default function MinesweeperPage() {
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated] = useState(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Minesweeper - Classic Puzzle Game | Triviaah',
    description: 'Play the classic Minesweeper puzzle game with modern features. Clear minefields using logic, strategy, and careful planning with multiple difficulty levels.',
    url: 'https://triviaah.com/brainwave/minesweeper',
    dateModified: lastUpdated,
    mainEntity: {
      '@type': 'Game',
      name: 'Minesweeper',
      description: 'Classic logic-based puzzle game where players clear a rectangular board containing hidden mines without detonating any.',
      gameLocation: 'https://triviaah.com/brainwave/minesweeper',
      characterAttribute: 'Logic, Strategy, Puzzle, Minesweeper, Brain Teaser, Number Game'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Structured Data */}
      <Script
        id="minesweeper-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Desktop Side Ads */}
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
      
      {/* Mobile Bottom Ad */}
      {showMobileAd && (
        <Ads 
          isMobileFooter={true} 
          format="horizontal" 
          style={{ width: '100%', height: '100px' }} 
          className="lg:hidden" 
        />
      )}

      {/* Ad Controls */}
      {showAds && (
        <div className="fixed top-4 right-4 z-50 flex gap-2">
          <button
            onClick={() => setShowDesktopAds(!showDesktopAds)}
            className="bg-gray-700/80 hover:bg-gray-600/80 text-white text-xs px-3 py-2 rounded-2xl backdrop-blur-sm hidden lg:block transition-all duration-300"
          >
            {showDesktopAds ? 'Hide Ads' : 'Show Ads'}
          </button>
          <button
            onClick={() => setShowMobileAd(!showMobileAd)}
            className="bg-gray-700/80 hover:bg-gray-600/80 text-white text-xs px-3 py-2 rounded-2xl backdrop-blur-sm lg:hidden transition-all duration-300"
          >
            {showMobileAd ? 'Hide Ad' : 'Show Ad'}
          </button>
        </div>
      )}

      <div className="max-w-3xl mx-auto p-4 relative z-30">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-blue-500 to-cyan-600 p-3 rounded-2xl">
                <Bomb className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">
                MINESWEEPER
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-cyan-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-cyan-400 text-sm font-medium"
              >
                Classic Puzzle Game
              </time>
            </div>
          </div>
          
          <p className="text-gray-300 text-lg mb-2">Logic, Strategy, and Careful Planning</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Multiple Difficulties</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-green-500" />
              <span className="text-sm">Track Your Stats</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-red-500" />
              <span className="text-sm">No Guesswork Required</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        <MinesweeperComponent />

        {/* Game Tips */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">Pro Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-700/30 rounded-xl p-4">
              <h3 className="font-semibold text-cyan-400 mb-2">Start with Corners</h3>
              <p className="text-gray-300 text-sm">
                Beginning in corners gives you more revealed cells to work with, increasing your chances of finding safe patterns.
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4">
              <h3 className="font-semibold text-cyan-400 mb-2">Look for 1-2-1 Patterns</h3>
              <p className="text-gray-300 text-sm">
                When you see numbers 1-2-1 in a row, the mines are under the ones, and the space between the twos is safe.
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4">
              <h3 className="font-semibold text-cyan-400 mb-2">Use Flags Strategically</h3>
              <p className="text-gray-300 text-sm">
                Don&apos;t just flag random cells. Use flags to mark confirmed mines that help you deduce other safe cells.
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4">
              <h3 className="font-semibold text-cyan-400 mb-2">Master Double-Click</h3>
              <p className="text-gray-300 text-sm">
                When a number has the correct number of flags around it, double-click to quickly reveal remaining safe cells.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}