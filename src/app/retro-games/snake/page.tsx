// src/app/brainwave/snake/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { Gamepad2, Clock, Trophy, Zap, Target, Apple, Shield, Wind } from 'lucide-react';
import MuteButton from '@/components/common/MuteButton';
import Ads from '@/components/common/Ads';
import SnakeComponent from '@/components/retro-games/SnakeComponent';

export default function SnakePage() {
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated] = useState(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Snake - Classic Arcade Game | Triviaah',
    description: 'Play the classic Snake game online. Control a growing snake, eat food, and avoid collisions in this timeless arcade puzzle game.',
    url: 'https://triviaah.com/brainwave/snake',
    dateModified: lastUpdated,
    mainEntity: {
      '@type': 'Game',
      name: 'Snake',
      description: 'Classic arcade game where players control a growing snake to eat food while avoiding collisions with walls and itself.',
      gameLocation: 'https://triviaah.com/brainwave/snake',
      characterAttribute: 'Arcade, Puzzle, Snake, Retro, Growing, Food, Strategy'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-emerald-900 to-green-900 text-white">
      {/* Structured Data */}
      <Script
        id="snake-schema"
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
              <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-3 rounded-2xl">
                <Wind className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                SNAKE
              </h1>
            </div>
            
            <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-lg px-4 py-2 rounded-2xl border border-gray-700">
              <Clock className="w-4 h-4 text-emerald-400" />
              <time 
                dateTime={lastUpdated} 
                className="text-emerald-400 text-sm font-medium"
              >
                Classic Arcade Game
              </time>
            </div>
          </div>
          
          <p className="text-gray-300 text-lg mb-2">Control the Snake, Eat Food, Grow Longer</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Multiple Game Modes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-green-500" />
              <span className="text-sm">Track High Scores</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-red-500" />
              <span className="text-sm">Avoid Collisions</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Apple className="w-5 h-5 text-red-500" />
              <span className="text-sm">Special Food Types</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Touch & Keyboard Controls</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        <SnakeComponent />

        {/* Game History & Tips */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">About Snake</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-emerald-900/30 to-green-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-emerald-400 mb-2">History</h3>
              <p className="text-gray-300 text-sm">
                Snake originated in the 1976 arcade game &quot;Blockade&quot; and became popular 
                on Nokia mobile phones in the late 1990s. It&apos;s one of the most iconic and 
                recognizable video games of all time.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-900/30 to-teal-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-green-400 mb-2">Gameplay</h3>
              <p className="text-gray-300 text-sm">
                Control a snake that grows longer with each piece of food eaten. 
                The challenge increases as your snake grows, making navigation 
                more difficult in limited space.
              </p>
            </div>
            <div className="md:col-span-2 bg-gradient-to-r from-gray-900/50 to-emerald-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-cyan-400 mb-2">Modern Features</h3>
              <p className="text-gray-300 text-sm">
                This version enhances the classic with multiple game modes, 
                special food types, difficulty settings, and comprehensive 
                statistics tracking for a more engaging experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}