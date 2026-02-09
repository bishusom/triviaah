// src/app/brainwave/breakout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { Gamepad2, Clock, Trophy, Zap, Target, Square, BrickWall, Circle, Award, Sparkles } from 'lucide-react';
import MuteButton from '@/components/common/MuteButton';
import Ads from '@/components/common/Ads';
import BreakoutComponent from '@/components/retro-games/BreakoutComponent';

export default function BreakoutPage() {
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated] = useState(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Breakout - Classic Arcade Game | Triviaah',
    description: 'Play the classic Breakout arcade game online. Use the paddle to bounce a ball and break bricks in this iconic 1976 Atari game with multiple levels.',
    url: 'https://triviaah.com/brainwave/breakout',
    dateModified: lastUpdated,
    mainEntity: {
      '@type': 'Game',
      name: 'Breakout',
      description: 'Classic arcade game where players use a paddle to bounce a ball and break a wall of bricks, with the ball speeding up over time.',
      gameLocation: 'https://triviaah.com/brainwave/breakout',
      characterAttribute: 'Arcade, Paddle, Ball, Bricks, Atari, Classic, Retro'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-orange-900 to-red-900 text-white">
      {/* Structured Data */}
      <Script
        id="breakout-schema"
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
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-3 rounded-2xl">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
                BREAKOUT
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-orange-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-orange-400 text-sm font-medium"
              >
                Classic 1976 Arcade Game
              </time>
            </div>
          </div>
          
          <p className="text-gray-300 text-lg mb-2">Bounce, Break, and Beat the High Score!</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8 flex-wrap">
            <div className="flex items-center gap-2 text-gray-400">
              <Circle className="w-5 h-5 text-orange-500" />
              <span className="text-sm">Bouncing Ball Physics</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Multi-Level Challenge</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-red-500" />
              <span className="text-sm">Precision Paddle Control</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <BrickWall className="w-5 h-5 text-amber-500" />
              <span className="text-sm">Color-Coded Bricks</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Square className="w-5 h-5 text-green-500" />
              <span className="text-sm">Increasing Speed</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Award className="w-5 h-5 text-purple-500" />
              <span className="text-sm">Bonus Lives</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Angle Control Strategy</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Sparkles className="w-5 h-5 text-pink-500" />
              <span className="text-sm">Special Power-ups</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        <BreakoutComponent />

        {/* Game History & Tips */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">About Breakout</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-orange-900/30 to-red-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-orange-400 mb-2">History</h3>
              <p className="text-gray-300 text-sm">
                Breakout was developed and published by Atari, Inc. in 1976. 
                It was designed by Nolan Bushnell and Steve Jobs, with Steve Wozniak creating the hardware. 
                The game was a major hit and inspired numerous clones and sequels.
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-yellow-400 mb-2">Game Mechanics</h3>
              <p className="text-gray-300 text-sm">
                Control a paddle to bounce a ball and break a wall of bricks. 
                The ball speeds up as gameplay progresses, and each row of bricks 
                is worth different point values. Miss the ball and you lose a life.
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-red-400 mb-2">Scoring System</h3>
              <ul className="text-gray-300 text-sm list-disc pl-4">
                <li>Yellow bricks: 1 point</li>
                <li>Green bricks: 3 points</li>
                <li>Orange bricks: 5 points</li>
                <li>Red bricks: 7 points</li>
                <li>Extra life: Every 10,000 points</li>
                <li>Ball speed increases after certain breaks</li>
              </ul>
            </div>
            <div className="md:col-span-2 bg-gradient-to-r from-gray-900/50 to-orange-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-amber-400 mb-2">Strategy & Tips</h3>
              <p className="text-gray-300 text-sm">
                Aim for corners to break multiple bricks with one hit, 
                control ball angles by hitting different parts of the paddle, 
                prioritize breaking bricks to create openings, and always 
                keep the paddle centered until you need to make a strategic move.
              </p>
            </div>
          </div>
          
          {/* Brick Types Guide */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-yellow-900/20 rounded-lg p-3 border border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <h4 className="font-bold text-yellow-300">Yellow Bricks</h4>
                <span className="ml-auto text-xs text-white">1 pt</span>
              </div>
              <p className="text-gray-300 text-xs">Top row - Easiest to break, lowest point value</p>
            </div>
            <div className="bg-green-900/20 rounded-lg p-3 border border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <h4 className="font-bold text-green-300">Green Bricks</h4>
                <span className="ml-auto text-xs text-white">3 pts</span>
              </div>
              <p className="text-gray-300 text-xs">Second row - Medium difficulty, good points</p>
            </div>
            <div className="bg-orange-900/20 rounded-lg p-3 border border-orange-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <h4 className="font-bold text-orange-300">Orange Bricks</h4>
                <span className="ml-auto text-xs text-white">5 pts</span>
              </div>
              <p className="text-gray-300 text-xs">Third row - Harder to reach, high value</p>
            </div>
            <div className="bg-red-900/20 rounded-lg p-3 border border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <h4 className="font-bold text-red-300">Red Bricks</h4>
                <span className="ml-auto text-xs text-white">7 pts</span>
              </div>
              <p className="text-gray-300 text-xs">Bottom row - Most challenging, highest value</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}