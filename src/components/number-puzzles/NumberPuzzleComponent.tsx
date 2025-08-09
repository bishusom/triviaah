'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';

type PuzzleType = 'number-scramble' | 'number-towers' | 'prime-hunter' | 'number-sequence' | 'sudoku';

interface PuzzleMetadata {
  title: string;
  description: string;
}

interface GameState {
  // Define your game state structure here
  // Example properties:
  score?: number;
  level?: number;
  timer?: number;
  // Add other game-specific state properties
}

export default function NumberPuzzleComponent({ puzzleType }: { puzzleType: PuzzleType }) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  
  // Puzzle specific metadata
  const puzzleMetadata: Record<PuzzleType, PuzzleMetadata> = {
    'number-scramble': {
      title: 'Number Scramble',
      description: 'Combine numbers and operators to reach the target value',
    },
    'number-towers': {
      title: 'Number Towers',
      description: 'Build towers by adding numbers to reach specific sums',
    },
    'prime-hunter': {
      title: 'Prime Hunter',
      description: 'Identify all prime numbers in the given grid',
    },
    'number-sequence': {
      title: 'Number Sequence',
      description: 'Find the pattern and complete the number sequence',
    },
    'sudoku': {
      title: 'Sudoku',
      description: 'Classic 9x9 grid puzzle with numbers 1-9',
    },
  };

  useEffect(() => {
    // Initialize puzzle based on puzzleType
    // This would be your game logic implementation
    setGameState({
      // Initialize your game state here
    });
  }, [puzzleType]);

  return (
    <>
      <Head>
        <title>{puzzleMetadata[puzzleType].title} | Triviaah</title>
        <meta name="description" content={puzzleMetadata[puzzleType].description} />
      </Head>

      <div className="container mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-md p-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {puzzleMetadata[puzzleType].title}
          </h1>
          <p className="text-gray-600 mb-6">
            {puzzleMetadata[puzzleType].description}
          </p>
          
          {/* Puzzle UI would go here */}
          <div className="min-h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">
              {puzzleMetadata[puzzleType].title} Puzzle UI
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">How to Play</h2>
            <div className="prose prose-gray">
              {/* Puzzle-specific instructions */}
              {puzzleType === 'number-scramble' && (
                <ul>
                  <li>Combine the given numbers with +, -, ×, ÷ operators</li>
                  <li>Use each number exactly once</li>
                  <li>Reach the target value to solve the puzzle</li>
                </ul>
              )}
              {puzzleType === 'number-towers' && (
                <ul>
                  <li>Add numbers to build towers</li>
                  <li>Each tower must sum to the target value</li>
                  <li>Use all numbers without repetition</li>
                </ul>
              )}
              {puzzleType === 'prime-hunter' && (
                <ul>
                  <li>Identify all prime numbers in the grid</li>
                  <li>Click on numbers you believe are prime</li>
                  <li>You have limited time to find them all</li>
                </ul>
              )}
              {puzzleType === 'number-sequence' && (
                <ul>
                  <li>Identify the pattern in the sequence</li>
                  <li>Enter the next number in the sequence</li>
                  <li>Difficulty increases with each level</li>
                </ul>
              )}
              {puzzleType === 'sudoku' && (
                <ul>
                  <li>Fill the 9×9 grid with digits 1-9</li>
                  <li>No repeats in any row, column or 3×3 box</li>
                  <li>Complete the puzzle in the fastest time</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}