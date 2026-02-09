// src/app/brainwave/tic-tac-toe/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { Gamepad2, Clock, Trophy, Zap, Target, Users, Cpu, Sparkles } from 'lucide-react';
import MuteButton from '@/components/common/MuteButton';
import Ads from '@/components/common/Ads';
import TicTacToeComponent from '@/components/retro-games/TicTacToeComponent';

export default function TicTacToePage() {
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated] = useState(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Tic Tac Toe - Classic Strategy Game | Triviaah',
    description: 'Play the classic Tic Tac Toe game online. Challenge friends or play against AI with multiple difficulty levels in this timeless strategy game.',
    url: 'https://triviaah.com/brainwave/tic-tac-toe',
    dateModified: lastUpdated,
    mainEntity: {
      '@type': 'Game',
      name: 'Tic Tac Toe',
      description: 'Classic strategy game where two players take turns marking spaces in a 3×3 grid, trying to get three in a row.',
      gameLocation: 'https://triviaah.com/brainwave/tic-tac-toe',
      characterAttribute: 'Strategy, Puzzle, Two Player, Board Game, Classic, AI'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-indigo-900 to-purple-900 text-white">
      {/* Structured Data */}
      <Script
        id="tic-tac-toe-schema"
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
              <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 rounded-2xl">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                TIC TAC TOE
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-indigo-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-indigo-400 text-sm font-medium"
              >
                Classic Strategy Game
              </time>
            </div>
          </div>
          
          <p className="text-gray-300 text-lg mb-2">Get Three in a Row to Win!</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Two Players</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Cpu className="w-5 h-5 text-green-500" />
              <span className="text-sm">AI Opponent</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Track Scores</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-5 h-5 text-purple-500" />
              <span className="text-sm">Multiple Levels</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-red-500" />
              <span className="text-sm">Quick Matches</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        <TicTacToeComponent />

        {/* Game History & Tips */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">About Tic Tac Toe</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-900/30 to-purple-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-indigo-400 mb-2">History</h3>
              <p className="text-gray-300 text-sm">
                Tic Tac Toe dates back to ancient Rome and Egypt. The modern version 
                gained popularity in the 20th century and is one of the most widely 
                recognized paper-and-pencil games in the world.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-purple-400 mb-2">Perfect Play</h3>
              <p className="text-gray-300 text-sm">
                With perfect play from both players, Tic Tac Toe always ends in a draw. 
                The first player can force at least a draw, and the second player can 
                force at least a draw if they play correctly.
              </p>
            </div>
            <div className="md:col-span-2 bg-gradient-to-r from-gray-900/50 to-indigo-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-cyan-400 mb-2">Modern Features</h3>
              <p className="text-gray-300 text-sm">
                This version includes both two-player mode and AI opponent with 
                adjustable difficulty levels. Track your win statistics, use keyboard 
                shortcuts, and enjoy smooth animations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}