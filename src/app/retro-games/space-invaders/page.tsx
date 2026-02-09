// src/app/brainwave/space-invaders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { Gamepad2, Clock, Trophy, Zap, Target, Shield, Rocket, Crosshair, Award } from 'lucide-react';
// import an alternative icon for Alien, or use a placeholder
import { Bug as Alien } from 'lucide-react';
import MuteButton from '@/components/common/MuteButton';
import Ads from '@/components/common/Ads';
import SpaceInvadersComponent from '@/components/retro-games/SpaceInvadersComponent';

export default function SpaceInvadersPage() {
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated] = useState(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Space Invaders - Classic Arcade Game | Triviaah',
    description: 'Play the classic Space Invaders arcade game online. Defend Earth from alien invaders in this iconic 1978 shooter game with increasing difficulty waves.',
    url: 'https://triviaah.com/brainwave/space-invaders',
    dateModified: lastUpdated,
    mainEntity: {
      '@type': 'Game',
      name: 'Space Invaders',
      description: 'Classic arcade shooter game where players defend Earth from descending alien invaders while using shields for protection.',
      gameLocation: 'https://triviaah.com/brainwave/space-invaders',
      characterAttribute: 'Arcade, Shooter, Aliens, Spaceship, Defense, Classic, Retro'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Structured Data */}
      <Script
        id="space-invaders-schema"
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
              <div className="bg-gradient-to-r from-green-500 to-cyan-500 p-3 rounded-2xl">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">
                SPACE INVADERS
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-cyan-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-cyan-400 text-sm font-medium"
              >
                Classic 1978 Arcade Game
              </time>
            </div>
          </div>
          
          <p className="text-gray-300 text-lg mb-2">Defend Earth from Alien Invasion!</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8 flex-wrap">
            <div className="flex items-center gap-2 text-gray-400">
              <Alien className="w-5 h-5 text-green-500" />
              <span className="text-sm">Alien Waves</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Score Multipliers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-red-500" />
              <span className="text-sm">Precise Shooting</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Defensive Shields</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Rocket className="w-5 h-5 text-orange-500" />
              <span className="text-sm">Increasing Speed</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Award className="w-5 h-5 text-purple-500" />
              <span className="text-sm">Mystery UFOs</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-5 h-5 text-pink-500" />
              <span className="text-sm">Progressive Difficulty</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Crosshair className="w-5 h-5 text-white" />
              <span className="text-sm">Limited Ammo</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        <SpaceInvadersComponent />

        {/* Game History & Tips */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">About Space Invaders</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-900/30 to-cyan-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-green-400 mb-2">History</h3>
              <p className="text-gray-300 text-sm">
                Space Invaders was created by Tomohiro Nishikado and released by Taito in 1978. 
                It revolutionized the video game industry, popularized the shoot 'em up genre, 
                and was the first game to introduce continuous background music and high score saving.
              </p>
            </div>
            <div className="bg-gradient-to-br from-red-900/30 to-orange-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-red-400 mb-2">The Invasion Force</h3>
              <p className="text-gray-300 text-sm">
                The aliens descend in a 5x11 formation with different point values. 
                As you destroy aliens, the remaining invaders speed up, creating intense pressure. 
                The mystery UFO appears randomly at the top for bonus points.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-blue-400 mb-2">Scoring System</h3>
              <ul className="text-gray-300 text-sm list-disc pl-4">
                <li>Top row aliens: 30 points</li>
                <li>Second row aliens: 20 points</li>
                <li>Third & fourth row aliens: 10 points</li>
                <li>Mystery UFO: 50-300 points (random)</li>
                <li>Score doubles on second wave</li>
                <li>Shields can be destroyed by both sides</li>
              </ul>
            </div>
            <div className="md:col-span-2 bg-gradient-to-r from-gray-900/50 to-blue-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-cyan-400 mb-2">Strategy & Tips</h3>
              <p className="text-gray-300 text-sm">
                Focus on the edges first to reduce alien count quickly, 
                use shields strategically for protection while shooting through gaps, 
                prioritize the mystery UFO for bonus points, and remember - 
                aliens speed up as their numbers decrease. Never let them reach the bottom!
              </p>
            </div>
          </div>
          
          {/* Alien Types Guide */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-green-900/20 rounded-lg p-3 border border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <h4 className="font-bold text-green-300">Squid</h4>
                <span className="ml-auto text-xs text-yellow-400">30 pts</span>
              </div>
              <p className="text-gray-300 text-xs">Top row - Fastest movement, highest score value</p>
            </div>
            <div className="bg-blue-900/20 rounded-lg p-3 border border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                <h4 className="font-bold text-blue-300">Crab</h4>
                <span className="ml-auto text-xs text-yellow-400">20 pts</span>
              </div>
              <p className="text-gray-300 text-xs">Second row - Medium speed, standard enemy</p>
            </div>
            <div className="bg-yellow-900/20 rounded-lg p-3 border border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <h4 className="font-bold text-yellow-300">Octopus</h4>
                <span className="ml-auto text-xs text-yellow-400">10 pts</span>
              </div>
              <p className="text-gray-300 text-xs">Third/fourth row - Slow but numerous</p>
            </div>
            <div className="bg-purple-900/20 rounded-lg p-3 border border-purple-800">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <h4 className="font-bold text-purple-300">UFO</h4>
                <span className="ml-auto text-xs text-yellow-400">50-300 pts</span>
              </div>
              <p className="text-gray-300 text-xs">Mystery bonus - Appears randomly at top</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}