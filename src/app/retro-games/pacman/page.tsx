// src/app/brainwave/pacman/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { Gamepad2, Clock, Trophy, Zap, Target, Ghost, Cherry, Star, Award } from 'lucide-react';
import MuteButton from '@/components/common/MuteButton';
import Ads from '@/components/common/Ads';
import PacManComponent from '@/components/retro-games/PacManComponent';

export default function PacManPage() {
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated] = useState(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Pac-Man - Classic Arcade Game | Triviaah',
    description: 'Play the classic Pac-Man arcade game online. Navigate the maze, eat dots, avoid ghosts, and achieve high scores in this iconic 80s game.',
    url: 'https://triviaah.com/brainwave/pacman',
    dateModified: lastUpdated,
    mainEntity: {
      '@type': 'Game',
      name: 'Pac-Man',
      description: 'Classic arcade game where players control Pac-Man through a maze eating dots while being chased by colorful ghosts.',
      gameLocation: 'https://triviaah.com/brainwave/pacman',
      characterAttribute: 'Arcade, Maze, Ghosts, Dots, Power Pellets, Classic, Retro'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      {/* Structured Data */}
      <Script
        id="pacman-schema"
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
              <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-3 rounded-2xl">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
                PAC-MAN
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-yellow-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-yellow-400 text-sm font-medium"
              >
                Classic 1980 Arcade Game
              </time>
            </div>
          </div>
          
          <p className="text-gray-300 text-lg mb-2">Eat Dots, Avoid Ghosts, Score Points!</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Ghost className="w-5 h-5 text-red-500" />
              <span className="text-sm">4 Unique Ghosts</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Track High Scores</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-pink-500" />
              <span className="text-sm">Power Pellets</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Cherry className="w-5 h-5 text-red-500" />
              <span className="text-sm">Multiple Levels</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Ghost AI Patterns</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Award className="w-5 h-5 text-green-500" />
              <span className="text-sm">3 Lives</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        <PacManComponent />

        {/* Game History & Tips */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">About Pac-Man</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 rounded-xl p-4">
              <h3 className="font-semibold text-yellow-400 mb-2">History</h3>
              <p className="text-gray-300 text-sm">
                Pac-Man was created by Toru Iwatani and released by Namco in 1980. 
                It became a cultural phenomenon and is one of the highest-grossing 
                video games of all time, with over $14 billion in lifetime revenue.
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-900/30 to-pink-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-red-400 mb-2">The Ghosts</h3>
              <p className="text-gray-300 text-sm">
                Each ghost has unique AI: Blinky chases directly, Pinky ambushes, 
                Inky uses complex patterns, and Clyde alternates between chase 
                and scatter. Power pellets make ghosts vulnerable for 10 seconds.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-blue-400 mb-2">Scoring System</h3>
              <ul className="text-gray-300 text-sm list-disc pl-4">
                <li>Dot: 10 points</li>
                <li>Power Pellet: 50 points</li>
                <li>Ghost (1st): 200 points</li>
                <li>Ghost (2nd): 400 points</li>
                <li>Ghost (3rd): 800 points</li>
                <li>Ghost (4th): 1600 points</li>
              </ul>
            </div>
            <div className="md:col-span-2 bg-gradient-to-r from-gray-900/50 to-purple-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-cyan-400 mb-2">Tips & Strategy</h3>
              <p className="text-gray-300 text-sm">
                Learn ghost movement patterns, use tunnels strategically, 
                save power pellets for emergency escapes, and always have an 
                escape route planned. The corners are safest but watch for ambushes!
              </p>
            </div>
          </div>
          
          {/* Ghost Personality Guide */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-red-900/20 rounded-lg p-3 border border-red-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <h4 className="font-bold text-red-300">Blinky</h4>
              </div>
              <p className="text-gray-300 text-xs">The Red Ghost - Aggressive chaser, fastest ghost</p>
            </div>
            <div className="bg-pink-900/20 rounded-lg p-3 border border-pink-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-pink-400 rounded-full"></div>
                <h4 className="font-bold text-pink-300">Pinky</h4>
              </div>
              <p className="text-gray-300 text-xs">The Pink Ghost - Ambush specialist, tries to cut you off</p>
            </div>
            <div className="bg-cyan-900/20 rounded-lg p-3 border border-cyan-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-cyan-400 rounded-full"></div>
                <h4 className="font-bold text-cyan-300">Inky</h4>
              </div>
              <p className="text-gray-300 text-xs">The Cyan Ghost - Unpredictable, uses Blinky's position</p>
            </div>
            <div className="bg-orange-900/20 rounded-lg p-3 border border-orange-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
                <h4 className="font-bold text-orange-300">Clyde</h4>
              </div>
              <p className="text-gray-300 text-xs">The Orange Ghost - Random behavior, chases then runs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}