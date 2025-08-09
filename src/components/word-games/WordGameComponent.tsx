'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';

type GameType = 'scramble' | 'spelling-bee' | 'boggle' | 'word-search' | 'word-ladder';

interface GameMetadata {
  title: string;
  description: string;
}

interface GameState {
  // Define your game state structure here based on gameType
  // Example for scramble game:
  scrambledWord?: string;
  currentGuess?: string;
  score?: number;
  timeLeft?: number;
  // Add other game-specific state properties as needed
}

export default function WordGameComponent({ gameType }: { gameType: GameType }) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  
  // Game specific metadata
  const gameMetadata: Record<GameType, GameMetadata> = {
    'scramble': {
      title: 'Word Scramble',
      description: 'Unscramble letters to form words',
    },
    'spelling-bee': {
      title: 'Spelling Bee',
      description: 'Spell words using given letters',
    },
    'boggle': {
      title: 'Boggle',
      description: 'Find as many words as possible in the letter grid',
    },
    'word-search': {
      title: 'Word Search',
      description: 'Find hidden words in a letter grid',
    },
    'word-ladder': {
      title: 'Word Ladder',
      description: 'Change one letter at a time to reach the target word',
    },
  };

  useEffect(() => {
    // Initialize game based on gameType
    const initialState: GameState = {
      // Initialize with default values based on gameType
      score: 0,
      timeLeft: 120, // 2 minutes
      // Add other initial state properties as needed
    };
    setGameState(initialState);

    // Cleanup function
    return () => {
      // Any cleanup needed when component unmounts or gameType changes
    };
  }, [gameType]);

  return (
    <>
      <Head>
        <title>{gameMetadata[gameType].title} | Triviaah</title>
        <meta name="description" content={gameMetadata[gameType].description} />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {gameMetadata[gameType].title}
          </h1>
          <p className="text-gray-600 mb-6">
            {gameMetadata[gameType].description}
          </p>
          
          {/* Game UI would go here */}
          <div className="min-h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">
              {gameMetadata[gameType].title} Game UI
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">How to Play</h2>
            <div className="prose prose-gray">
              {/* Game-specific instructions */}
              {gameType === 'scramble' && (
                <ul>
                  <li>Unscramble the letters to form a valid word</li>
                  <li>You have 2 minutes to solve as many as possible</li>
                  <li>Each correct word earns you points based on length</li>
                </ul>
              )}
              {gameType === 'spelling-bee' && (
                <ul>
                  <li>Create words using the given letters</li>
                  <li>The center letter must be used in every word</li>
                  <li>Words must be at least 4 letters long</li>
                </ul>
              )}
              {/* Add instructions for other games as needed */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}