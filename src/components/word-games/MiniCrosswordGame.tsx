// src/components/word-games/MiniCrosswordGame.tsx
import { event } from '@/lib/gtag';
import React, { useState, useEffect } from 'react';
import { RefreshCw, Check, X, Trophy, Star, HelpCircle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import confetti from 'canvas-confetti';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Word {
  word: string;
  clue: string;
  row: number;
  col: number;
  direction: 'across' | 'down';
  number: number;
  difficulty?: number;
}

interface Cell {
  letter: string;
  number?: number;
  userInput: string;
  isCorrect: boolean | null;
  isBlack: boolean;
}

interface GameStats {
  puzzlesCompleted: number;
  streak: number;
  bestStreak: number;
  totalWordsFound: number;
}

const MiniCrosswordGame: React.FC = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [words, setWords] = useState<Word[]>([]);
  const [gridSize] = useState(7);
  const [isComplete, setIsComplete] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gameStats, setGameStats] = useState<GameStats>({
    puzzlesCompleted: 0,
    streak: 0,
    bestStreak: 0,
    totalWordsFound: 0
  });
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [isTimedMode, setIsTimedMode] = useState(false);

  // Fetch words from Supabase
  const fetchWordsFromSupabase = async (count: number = 20) => {
    try {
      const { data, error } = await supabase
        .from('mini_crossword_words')
        .select('word, clue, difficulty')
        .in('difficulty', difficulty === 'easy' ? [1] : difficulty === 'medium' ? [1, 2] : [1, 2, 3])
        .order('difficulty')
        .limit(count);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching words:', error);
      // Fallback words if database fails
      return [
        { word: 'CAT', clue: 'Feline pet', difficulty: 1 },
        { word: 'DOG', clue: 'Canine companion', difficulty: 1 },
        { word: 'SUN', clue: 'Star at center of solar system', difficulty: 1 },
        { word: 'MOON', clue: 'Earth\'s natural satellite', difficulty: 1 },
        { word: 'STAR', clue: 'Celestial body that shines', difficulty: 1 },
        { word: 'TREE', clue: 'Woody plant', difficulty: 1 },
        { word: 'FISH', clue: 'Aquatic animal', difficulty: 1 },
        { word: 'BIRD', clue: 'Feathered creature', difficulty: 1 },
        { word: 'BOOK', clue: 'Collection of pages', difficulty: 1 },
        { word: 'RAIN', clue: 'Water falling from sky', difficulty: 1 },
      ];
    }
  };

  // Save game stats to localStorage
  const saveGameStats = (stats: GameStats) => {
    localStorage.setItem('crosswordStats', JSON.stringify(stats));
  };

  // Load game stats from localStorage
  const loadGameStats = () => {
    const saved = localStorage.getItem('crosswordStats');
    if (saved) {
      try {
        setGameStats(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading stats:', e);
      }
    }
  };

  // Celebrate with confetti
  const celebrate = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const generatePuzzle = async () => {
    setIsLoading(true);
    setShowHint(false);
    setTimeLeft(900); // Reset timer
    
    try {
      const wordsFromDb = await fetchWordsFromSupabase(30);
      if (wordsFromDb.length === 0) {
        throw new Error('No words available');
      }

      const newGrid: Cell[][] = Array(gridSize).fill(null).map(() =>
        Array(gridSize).fill(null).map(() => ({
          letter: '',
          userInput: '',
          isCorrect: null,
          isBlack: true,
        }))
      );

      const selectedWords: Word[] = [];
      const shuffled = [...wordsFromDb].sort(() => Math.random() - 0.5);
      
      // Place first word horizontally in the middle
      const firstWord = shuffled[0];
      const startCol = Math.floor((gridSize - firstWord.word.length) / 2);
      const midRow = Math.floor(gridSize / 2);
      
      selectedWords.push({
        ...firstWord,
        row: midRow,
        col: startCol,
        direction: 'across',
        number: 1,
      });

      // Place the first word on grid
      for (let i = 0; i < firstWord.word.length; i++) {
        newGrid[midRow][startCol + i] = {
          ...newGrid[midRow][startCol + i],
          letter: firstWord.word[i].toUpperCase(),
          isBlack: false,
        };
      }

      // Try to place intersecting words
      let wordNumber = 2;
      for (let i = 1; i < shuffled.length && selectedWords.length < (difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 9); i++) {
        const word = shuffled[i];
        let placed = false;

        // Try to intersect with existing words
        for (const existing of selectedWords) {
          if (placed) break;

          for (let j = 0; j < existing.word.length; j++) {
            if (placed) break;

            for (let k = 0; k < word.word.length; k++) {
              if (existing.word[j].toUpperCase() === word.word[k].toUpperCase()) {
                let newRow, newCol;
                const newDirection = existing.direction === 'across' ? 'down' : 'across';

                if (existing.direction === 'across') {
                  newRow = existing.row - k;
                  newCol = existing.col + j;
                } else {
                  newRow = existing.row + j;
                  newCol = existing.col - k;
                }

                // Check if placement is valid
                if (canPlaceWord(newGrid, word.word, newRow, newCol, newDirection, gridSize)) {
                  placeWord(newGrid, word.word, newRow, newCol, newDirection);
                  selectedWords.push({
                    ...word,
                    row: newRow,
                    col: newCol,
                    direction: newDirection,
                    number: wordNumber++,
                  });
                  placed = true;
                  break;
                }
              }
            }
          }
        }
      }

      // Fill remaining cells that should be black
      for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
          if (!newGrid[i][j].letter) {
            newGrid[i][j] = {
              ...newGrid[i][j],
              isBlack: true,
            };
          }
        }
      }

      // Assign numbers to grid cells
      selectedWords.forEach(word => {
        if (word.row >= 0 && word.row < gridSize && word.col >= 0 && word.col < gridSize) {
          newGrid[word.row][word.col].number = word.number;
        }
      });

      setGrid(newGrid);
      setWords(selectedWords.sort((a, b) => a.number - b.number));
      setIsComplete(false);
      setShowErrors(false);
    } catch (error) {
      console.error('Error generating puzzle:', error);
      // Fallback to default puzzle
      generateFallbackPuzzle();
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackPuzzle = () => {
    // ... (keep your existing fallback generation logic from the original)
    // This is your original generatePuzzle function as fallback
  };

  const canPlaceWord = (
    grid: Cell[][],
    word: string,
    row: number,
    col: number,
    direction: 'across' | 'down',
    size: number
  ): boolean => {
    if (direction === 'across') {
      if (col < 0 || col + word.length > size) return false;
      if (row < 0 || row >= size) return false;

      // Check boundaries
      if (col > 0 && grid[row][col - 1].letter) return false;
      if (col + word.length < size && grid[row][col + word.length].letter) return false;

      for (let i = 0; i < word.length; i++) {
        const cell = grid[row][col + i];
        if (cell.letter && cell.letter !== word[i].toUpperCase()) return false;
        
        // Check cells above and below
        if (row > 0 && grid[row - 1][col + i].letter && !cell.letter) return false;
        if (row < size - 1 && grid[row + 1][col + i].letter && !cell.letter) return false;
      }
    } else {
      if (row < 0 || row + word.length > size) return false;
      if (col < 0 || col >= size) return false;

      // Check boundaries
      if (row > 0 && grid[row - 1][col].letter) return false;
      if (row + word.length < size && grid[row + word.length][col].letter) return false;

      for (let i = 0; i < word.length; i++) {
        const cell = grid[row + i][col];
        if (cell.letter && cell.letter !== word[i].toUpperCase()) return false;
        
        // Check cells left and right
        if (col > 0 && grid[row + i][col - 1].letter && !cell.letter) return false;
        if (col < size - 1 && grid[row + i][col + 1].letter && !cell.letter) return false;
      }
    }
    return true;
  };

  const placeWord = (
    grid: Cell[][],
    word: string,
    row: number,
    col: number,
    direction: 'across' | 'down'
  ) => {
    for (let i = 0; i < word.length; i++) {
      if (direction === 'across') {
        grid[row][col + i] = {
          ...grid[row][col + i],
          letter: word[i].toUpperCase(),
          isBlack: false,
        };
      } else {
        grid[row + i][col] = {
          ...grid[row + i][col],
          letter: word[i].toUpperCase(),
          isBlack: false,
        };
      }
    }
  };

  const handleInput = (row: number, col: number, value: string) => {
    if (grid[row][col].isBlack) return;
    
    const newGrid = grid.map(r => r.map(c => ({ ...c })));
    newGrid[row][col].userInput = value.toUpperCase();
    newGrid[row][col].isCorrect = null;
    setGrid(newGrid);
    setShowErrors(false);
  };

  const checkAnswers = () => {
    const newGrid = grid.map((row, i) =>
      row.map((cell, j) => ({
        ...cell,
        isCorrect: cell.letter ? cell.userInput === cell.letter : null,
      }))
    );
    setGrid(newGrid);
    setShowErrors(true);

    const allCorrect = newGrid.every(row =>
      row.every(cell => !cell.letter || cell.isCorrect === true)
    );

    if (allCorrect) {
      setIsComplete(true);
      celebrate();
      
      // Update stats
      const newStats = {
        puzzlesCompleted: gameStats.puzzlesCompleted + 1,
        streak: gameStats.streak + 1,
        bestStreak: Math.max(gameStats.bestStreak, gameStats.streak + 1),
        totalWordsFound: gameStats.totalWordsFound + words.length
      };
      
      setGameStats(newStats);
      saveGameStats(newStats);
    }
  };

  const getHint = () => {
    // Find first incorrect or empty cell
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        const cell = grid[i][j];
        if (!cell.isBlack && (!cell.userInput || cell.userInput !== cell.letter)) {
          const newGrid = [...grid];
          newGrid[i][j].userInput = cell.letter;
          newGrid[i][j].isCorrect = true;
          setGrid(newGrid);
          setShowHint(true);
          setTimeout(() => setShowHint(false), 3000);
          return;
        }
      }
    }
  };

  // Timer effect
  useEffect(() => {
    if (!isTimedMode || timeLeft <= 0 || isComplete) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          checkAnswers();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimedMode, timeLeft, isComplete]);

  useEffect(() => {
    loadGameStats();
    generatePuzzle();
  }, [difficulty]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with Stats */}
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-2">
            Mini Crossword Puzzle
          </h1>
          <p className="text-gray-600 mb-4">Fill in the grid with the correct words</p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
              <Trophy className="text-yellow-500" size={20} />
              <span className="font-semibold">{gameStats.puzzlesCompleted}</span>
              <span className="text-gray-600 text-sm">Puzzles</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
              <Star className="text-yellow-500" size={20} />
              <span className="font-semibold">{gameStats.streak}</span>
              <span className="text-gray-600 text-sm">Streak</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
              <span className="font-semibold">{gameStats.totalWordsFound}</span>
              <span className="text-gray-600 text-sm">Words</span>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <div className="flex gap-2">
            {(['easy', 'medium', 'hard'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  difficulty === level
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setIsTimedMode(!isTimedMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isTimedMode
                ? 'bg-red-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            {isTimedMode ? `Timer: ${formatTime(timeLeft)}` : 'Enable Timer'}
          </button>
        </div>

        <div className="flex gap-8 flex-wrap lg:flex-nowrap">
          {/* Grid */}
          <div className="flex-1">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-96">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <>
                  <div className="inline-block mx-auto">
                    {grid.map((row, i) => (
                      <div key={i} className="flex">
                        {row.map((cell, j) => (
                          <div
                            key={j}
                            className="relative"
                            style={{ width: '40px', height: '40px' }}
                          >
                            {!cell.isBlack ? (
                              <div className={`w-full h-full border ${showErrors && cell.isCorrect === false ? 'border-red-500' : 'border-gray-300'}`}>
                                {cell.number && (
                                  <span className="absolute top-0.5 left-1 text-xs font-bold text-gray-700">
                                    {cell.number}
                                  </span>
                                )}
                                <input
                                  type="text"
                                  maxLength={1}
                                  value={cell.userInput}
                                  onChange={(e) => handleInput(i, j, e.target.value)}
                                  className={`w-full h-full text-center text-lg md:text-xl font-bold uppercase border-none outline-none ${
                                    showErrors
                                      ? cell.isCorrect
                                        ? 'bg-green-100'
                                        : cell.userInput
                                        ? 'bg-red-100'
                                        : 'bg-white'
                                      : 'bg-white'
                                  }`}
                                  disabled={isComplete}
                                />
                              </div>
                            ) : (
                              <div className="w-full h-full bg-gray-900"></div>
                            )}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-4 mt-6">
                    <button
                      onClick={checkAnswers}
                      disabled={isComplete}
                      className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Check size={20} />
                      Check Answers
                    </button>
                    <button
                      onClick={getHint}
                      disabled={isComplete}
                      className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <HelpCircle size={20} />
                      Get Hint
                    </button>
                    <button
                      onClick={generatePuzzle}
                      className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
                    >
                      <RefreshCw size={20} />
                      New Puzzle
                    </button>
                  </div>

                  {showHint && (
                    <div className="mt-4 p-3 bg-blue-100 border border-blue-500 rounded-lg">
                      <p className="text-blue-800 font-medium flex items-center gap-2">
                        <HelpCircle size={20} />
                        Hint applied! One letter has been revealed.
                      </p>
                    </div>
                  )}

                  {isComplete && (
                    <div className="mt-4 p-4 bg-green-100 border-2 border-green-500 rounded-lg">
                      <p className="text-green-800 font-bold text-lg flex items-center gap-2">
                        <Check size={24} />
                        Congratulations! You solved the puzzle!
                      </p>
                      <div className="mt-2 text-green-700">
                        <p>You found {words.length} words in {formatTime(900 - timeLeft)}!</p>
                        <p className="text-sm mt-1">Streak: {gameStats.streak} puzzles</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Clues and Stats */}
          <div className="lg:w-80">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Clues</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Across</h3>
                <div className="space-y-2">
                  {words
                    .filter(w => w.direction === 'across')
                    .map(word => (
                      <div key={word.number} className="text-sm flex items-start gap-2">
                        <span className="font-bold text-indigo-600 min-w-6">{word.number}.</span>
                        <span className="text-gray-700">{word.clue}</span>
                        {isComplete && (
                          <span className="text-green-500 ml-auto">✓</span>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Down</h3>
                <div className="space-y-2">
                  {words
                    .filter(w => w.direction === 'down')
                    .map(word => (
                      <div key={word.number} className="text-sm flex items-start gap-2">
                        <span className="font-bold text-indigo-600 min-w-6">{word.number}.</span>
                        <span className="text-gray-700">{word.clue}</span>
                        {isComplete && (
                          <span className="text-green-500 ml-auto">✓</span>
                        )}
                      </div>
                    ))}
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Puzzle Info</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Difficulty:</span>
                    <span className="font-medium capitalize">{difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Words:</span>
                    <span className="font-medium">{words.length}</span>
                  </div>
                  {isTimedMode && (
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span className={`font-medium ${timeLeft < 60 ? 'text-red-600' : ''}`}>
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Tips */}
        <div className="mt-8 bg-white/80 rounded-xl p-4 shadow-lg">
          <h3 className="font-semibold text-gray-800 mb-2">💡 Tips for Success</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Start with the shortest words or words with unique letters</li>
            <li>• Look for intersecting words to solve multiple clues at once</li>
            <li>• Use the hint feature if you&apos;re stuck on a specific letter</li>
            <li>• Try different difficulty levels to challenge yourself</li>
            <li>• Build your streak by solving puzzles daily!</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MiniCrosswordGame;