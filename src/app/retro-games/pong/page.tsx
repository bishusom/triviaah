// src/app/brainwave/pong/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { Gamepad2, Clock, Trophy, Zap, Target, Users, Cpu } from 'lucide-react';
import MuteButton from '@/components/common/MuteButton';
import Ads from '@/components/common/Ads';
import PongComponent from '@/components/retro-games/PongComponent';

export default function PongPage() {
  const [showDesktopAds, setShowDesktopAds] = useState(true);
  const [showMobileAd, setShowMobileAd] = useState(true);
  const [lastUpdated] = useState(new Date().toISOString());
  const showAds = process.env.NEXT_PUBLIC_SHOW_ADS === 'true';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Pong - Classic Arcade Game | Triviaah',
    description: 'Play the classic Pong game online. Battle against AI or challenge a friend in this timeless table tennis arcade game.',
    url: 'https://triviaah.com/brainwave/pong',
    dateModified: lastUpdated,
    mainEntity: {
      '@type': 'Game',
      name: 'Pong',
      description: 'Classic table tennis arcade game where players control paddles to hit a ball back and forth.',
      gameLocation: 'https://triviaah.com/brainwave/pong',
      characterAttribute: 'Arcade, Sports, Table Tennis, Pong, Retro, Competitive'
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      {/* Structured Data */}
      <Script
        id="pong-schema"
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
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl">
                <Gamepad2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                PONG
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
          
          <p className="text-gray-300 text-lg mb-2">The Original Arcade Table Tennis Experience</p>
          
          {/* Stats Bar */}
          <div className="flex justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-400">
              <Zap className="w-5 h-5 text-yellow-500" />
              <span className="text-sm">Fast-Paced Action</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Trophy className="w-5 h-5 text-green-500" />
              <span className="text-sm">Track Your Stats</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Target className="w-5 h-5 text-red-500" />
              <span className="text-sm">Reflex Challenge</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Single & Multiplayer</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Cpu className="w-5 h-5 text-purple-500" />
              <span className="text-sm">Adjustable AI</span>
            </div>
          </div>
        </div>

        {/* Mute Button */}
        <div className="fixed right-4 z-50" style={{ top: '6rem' }}>
          <MuteButton />
        </div>
        
        {/* Game Component */}
        <PongComponent />

        {/* Game History */}
        <div className="mt-8 bg-gray-800/30 backdrop-blur-lg rounded-3xl border border-gray-700 p-6">
          <h2 className="text-xl font-bold text-white mb-4">The History of Pong</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-900/30 to-purple-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-blue-400 mb-2">The First Arcade Video Game</h3>
              <p className="text-gray-300 text-sm">
                Pong was one of the first arcade video games, released in 1972 by Atari. 
                It created the video game industry and introduced millions to electronic entertainment.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-purple-400 mb-2">Simple Yet Addictive</h3>
              <p className="text-gray-300 text-sm">
                Despite its simple graphics and gameplay, Pong&apos;s intuitive controls 
                and competitive nature made it incredibly addictive and popular worldwide.
              </p>
            </div>
            <div className="md:col-span-2 bg-gradient-to-r from-gray-900/50 to-blue-900/30 rounded-xl p-4">
              <h3 className="font-semibold text-cyan-400 mb-2">Modern Recreation</h3>
              <p className="text-gray-300 text-sm">
                This version stays true to the original while adding modern features 
                like adjustable difficulty, statistics tracking, and mobile touch controls 
                for a better gaming experience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}