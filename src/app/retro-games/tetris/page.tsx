// src/app/brainwave/tetris/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { Box, Clock, Trophy, Zap, Target, Gamepad2 } from 'lucide-react';
import MuteButton from '@/components/common/MuteButton';
import Ads from '@/components/common/Ads';
import TetrisComponent from '@/components/retro-games/TetrisComponent';

export default function TetrisPage() {
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated] = useState(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Tetris - Classic Puzzle Game | Triviaah',
    description: 'Play the classic Tetris puzzle game online. Arrange falling blocks to clear lines and achieve high scores in this timeless arcade game.',
    url: 'https://triviaah.com/brainwave/tetris',
    dateModified: lastUpdated,
    mainEntity: {
      '@type': 'Game',
      name: 'Tetris',
      description: 'Classic tile-matching puzzle game where players arrange falling tetrominoes to create and clear horizontal lines.',
      gameLocation: 'https://triviaah.com/brainwave/tetris',
      characterAttribute: 'Puzzle, Strategy, Arcade, Tetris, Blocks, Line Clear'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-blue-900 text-white">
      {/* Structured Data */}
      <Script
        id="tetris-schema"
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
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-3 rounded-2xl">
                <Box className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                TETRIS
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-blue-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-blue-400 text-sm font-medium"
              >
                Classic Arcade Game
              </time>
            </div>
          </div>
          
          <p className="text-gray-300 text-lg mb-2">Arrange Falling Blocks to Clear Lines</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Increasing Speed</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-green-500" />
              <span className="text-sm">Track High Scores</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-red-500" />
              <span className="text-sm">Challenge Your Reflexes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Gamepad2 className="w-5 h-5 text-purple-500" />
              <span className="text-sm">Touch & Keyboard Controls</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        <TetrisComponent />

        {/* Game Instructions */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">How to Play Tetris</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700/30 rounded-xl p-4">
              <h3 className="font-semibold text-purple-400 mb-2">Objective</h3>
              <p className="text-gray-300 text-sm">
                Arrange falling blocks (tetrominoes) to create complete horizontal lines. Each completed line disappears and earns points.
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4">
              <h3 className="font-semibold text-purple-400 mb-2">Controls</h3>
              <p className="text-gray-300 text-sm">
                Use arrow keys (desktop) or on-screen buttons (mobile) to move and rotate pieces. Space bar for hard drop, C to hold a piece.
              </p>
            </div>
            <div className="bg-gray-700/30 rounded-xl p-4">
              <h3 className="font-semibold text-purple-400 mb-2">Scoring</h3>
              <p className="text-gray-300 text-sm">
                Clear 1 line: 40 points, 2 lines: 100, 3 lines: 300, 4 lines (Tetris): 1200. Points multiply with level.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}