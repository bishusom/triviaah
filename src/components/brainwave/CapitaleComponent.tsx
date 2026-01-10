// components/brainwave/CapitaleComponent.tsx - REDESIGNED
'use client';

import { event } from '@/lib/gtag';
import confetti from 'canvas-confetti';
import { MdShare } from "react-icons/md";
import { fetchWikimediaImage, getCapitalSearchTerms } from '@/lib/wikimedia';
import { useSound } from '@/context/SoundContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import FeedbackComponent from '@/components/common/FeedbackComponent';
import { CapitalePuzzle, CapitalInfo, addCapitaleResult } from '@/lib/brainwave/capitale/capitale-sb';
import { checkCapitaleGuess, CapitaleGuessResult, isValidCapital } from '@/lib/brainwave/capitale/capitale-logic';
import Image from 'next/image';
import { Home, Brain, MapPin, Target, Zap, Eye, EyeOff, Search, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface CapitaleComponentProps {
  initialData: CapitalePuzzle;
  allCapitals: CapitalInfo[];
}

export default function CapitaleComponent({ initialData, allCapitals }: CapitaleComponentProps) {
  const [puzzleData] = useState(initialData);
  const [guess, setGuess] = useState('');
  const [attempts, setAttempts] = useState<CapitaleGuessResult[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shareMessage, setShareMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hardMode, setHardMode] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  const [capitalImage, setCapitalImage] = useState<string | null>(null);
  const [hasNoImage, setHasNoImage] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [revealPercentage, setRevealPercentage] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Autocomplete state
  const [suggestions, setSuggestions] = useState<CapitalInfo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Start game and trigger analytics
  useEffect(() => {
    setGameStarted(true);
  }, []);

  // Analytics and other effects remain the same...
  // (keeping the same logic but with updated styling)
  const { isMuted } = useSound();
  const playSound = useCallback((soundType: 'correct' | 'incorrect' | 'win' | 'lose' | 'click') => {
    if (isMuted) return;
    
    try {
      const sounds = {
        correct: '/sounds/correct.mp3',
        incorrect: '/sounds/incorrect.mp3',
        win: '/sounds/win.mp3',
        lose: '/sounds/lose.mp3',
        click: '/sounds/click.mp3'
      };
      
      const audio = new Audio(sounds[soundType]);
      audio.play().catch(() => {});
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [isMuted]);

  const triggerConfetti = () => {
    if (confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true
      });
      
      myConfetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#00FFFF', '#0066FF', '#9933FF']
      });
    }
  };

  // Add this useEffect to fetch the image
  useEffect(() => {
    // Fetch capital image when component mounts
    const fetchImage = async () => {
      setIsImageLoading(true);
      setHasNoImage(false);
      
      // Use the enhanced function with proper entity type and context
      const imageUrl = await fetchWikimediaImage(puzzleData.answer, {
        entityType: 'capital',
        context: puzzleData.country,
        minImageSize: 500
      });
      
      if (imageUrl) {
        setCapitalImage(imageUrl);
      } else {
        console.log('No image found for capital:', puzzleData.answer);
        setCapitalImage(null);
        setHasNoImage(true);
      }
      
      setIsImageLoading(false);
    };

    // Only fetch if we haven't already determined there's no image
    if (!hasNoImage) {
      fetchImage();
    } else {
      setIsImageLoading(false);
    }
  }, [puzzleData.answer, puzzleData.country, hasNoImage]);

  // Update the re-fetch logic to respect hasNoImage
  useEffect(() => {
    if (attempts.length > 0 && !capitalImage && !hasNoImage) {
      // Re-fetch image if not loaded yet when user starts guessing
      const fetchImage = async () => {
        const searchTerms = getCapitalSearchTerms(
          puzzleData.answer.toLowerCase(), 
          puzzleData.country
        );
        
        let imageUrl = null;
        for (const term of searchTerms) {
          imageUrl = await fetchWikimediaImage(term);
          if (imageUrl) break;
        }
        
        if (imageUrl) {
          setCapitalImage(imageUrl);
        } else {
          setHasNoImage(true); // Mark that no image exists
        }
      };
      fetchImage();
    }
    
    // Increase reveal percentage with each guess - 16.67% per attempt for 6 attempts
    if (attempts.length > 0 && gameState === 'playing') {
      const newReveal = Math.min(attempts.length * 16.67, 100); // 16.67 × 6 = ~100
      setRevealPercentage(newReveal);
    }
    
    // Fully reveal image when game is won or lost
    if (gameState === 'won' || gameState === 'lost') {
      setRevealPercentage(100);
    }
  }, [attempts.length, gameState, capitalImage, puzzleData.answer, puzzleData.country, hasNoImage]);

  // NEW: Autocomplete suggestion logic
  useEffect(() => {
    if (guess.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedSuggestionIndex(-1);
      return;
    }

    const normalizedGuess = guess.toLowerCase().trim();
    const filtered = allCapitals
      .filter(capital => 
        capital.name.toLowerCase().includes(normalizedGuess)
      )
      .slice(0, 8); // Limit to 8 suggestions

    setSuggestions(filtered);
    setShowSuggestions(filtered.length > 0);
    setSelectedSuggestionIndex(-1);
  }, [guess, allCapitals]);

  // NEW: Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current && 
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // NEW: Keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < suggestions.length) {
          // Auto-submit when selecting with Enter
          setGuess(suggestions[selectedSuggestionIndex].name);
          setShowSuggestions(false);
          setTimeout(() => {
            handleGuess();
          }, 100);
        } else {
          // Regular Enter press without selection
          handleGuess();
        }
        break;
      
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // NEW: Select suggestion
  const selectSuggestion = (capital: CapitalInfo) => {
    const normalizedGuess = capital.name.trim();
    
    setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    
    if (gameState !== 'playing' || attempts.length >= 6) return;
    
    console.log('User guess:', normalizedGuess);
    console.log('Valid capitals:', puzzleData.validCapitals);
    console.log('Validation result:', isValidCapital(normalizedGuess, puzzleData.validCapitals));

    // Validate that the guess is a capital city
    if (!isValidCapital(normalizedGuess, puzzleData.validCapitals)) {
      setErrorMessage('Not a valid capital city');
      setTimeout(() => setErrorMessage(''), 3000);
      setGuess('');
      return;
    }
    
    playSound('click');
    
    const result = checkCapitaleGuess(
      normalizedGuess,
      puzzleData,
      attempts.length + 1,
      allCapitals
    );
    const newAttempts = [...attempts, result];
    setAttempts(newAttempts);
    setGuess('');
    setShowHint(false);
    
    if (result.isCorrect) {
      setGameState('won');
      triggerConfetti();
      playSound('win');
      addCapitaleResult(true, newAttempts.length);
      event({action: 'capitale_win', category: 'capitale', label: 'capitale'});
    } else if (newAttempts.length >= 6) {
      setGameState('lost');
      playSound('lose');
      addCapitaleResult(false, newAttempts.length);
      event({action: 'capitale_loss', category: 'capitale', label: 'capitale'});
    } else {
      playSound('incorrect');
    }
  };

  const getHintSource = (silhouetteUrl: string | undefined): {name: string, url: string} => {
    if (!silhouetteUrl) return { name: '', url: '' };
    
    if (silhouetteUrl.includes('wikimedia.org') || silhouetteUrl.includes('wikipedia.org')) {
      return { 
        name: 'Wikimedia.org', 
        url: 'https://commons.wikimedia.org' 
      };
    } else if (silhouetteUrl.includes('vemaps.com')) {
      return { 
        name: 'www.vemaps.com', 
        url: 'https://www.vemaps.com' 
      };
    } else if (silhouetteUrl.includes('upload.wikimedia.org')) {
      return { 
        name: 'Wikimedia.org', 
        url: 'https://commons.wikimedia.org' 
      };
    }
    
    return { 
      name: 'elitetrivias', 
      url: 'https://triviaah.com' 
    };
  };

  const getImageSource = (imageUrl: string | null): {name: string, url: string} => {
    if (!imageUrl) return { name: '', url: '' };
    
    if (imageUrl.includes('wikimedia.org') || imageUrl.includes('wikipedia.org')) {
      return { 
        name: 'Wikimedia Commons', 
        url: 'https://commons.wikimedia.org' 
      };
    } else if (imageUrl.includes('vemaps.com')) {
      return { 
        name: 'VeMaps', 
        url: 'https://www.vemaps.com' 
      };
    }
    
    return { name: '', url: '' };
  };

  const handleGuess = () => {
    if (gameState !== 'playing' || attempts.length >= 6) return;
    
    const normalizedGuess = guess.trim();
    if (!normalizedGuess) return;
    
    console.log('User guess:', normalizedGuess);
    console.log('Valid capitals:', puzzleData.validCapitals);
    console.log('Validation result:', isValidCapital(normalizedGuess, puzzleData.validCapitals));

    // Validate that the guess is a capital city
    if (!isValidCapital(normalizedGuess, puzzleData.validCapitals)) {
        setErrorMessage('Not a valid capital city');
        setTimeout(() => setErrorMessage(''), 3000);
        return;
      }
    
    playSound('click');
    
    const result = checkCapitaleGuess(
      normalizedGuess,
      puzzleData,
      attempts.length + 1,
      allCapitals
    );
    const newAttempts = [...attempts, result];
    setAttempts(newAttempts);
    setGuess('');
    setShowHint(false);
    setShowSuggestions(false); // Hide suggestions after guess
    
    if (result.isCorrect) {
      setGameState('won');
      triggerConfetti();
      playSound('win');
      addCapitaleResult( true, newAttempts.length);
      event({action: 'capitale_win', category: 'capitale', label: 'capitale'});
    } else if (newAttempts.length >= 6) {
      setGameState('lost');
      playSound('lose');
      addCapitaleResult(false, newAttempts.length);
       event({action: 'capitale_loss', category: 'capitale', label: 'capitale'});
    } else {
      playSound('incorrect');
    }
  };

  const generateShareMessage = () => {
    if (gameState !== 'won' && gameState !== 'lost') return '';
    
    const clientDate = new Date();
    const startDate = new Date(2024, 0, 1);
    const puzzleNumber = Math.floor((clientDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let shareText = `Capitale #${puzzleNumber} ${gameState === 'won' ? attempts.length : 'X'}/6\n\n`;
    
    attempts.forEach(attempt => {
      attempt.letterFeedback.forEach(letter => {
        if (letter.status === 'correct') {
          shareText += '🟩';
        } else if (letter.status === 'present') {
          shareText += '🟨';
        } else {
          shareText += '⬜';
        }
      });
      shareText += '\n';
    });
    
    shareText += '\nPlay daily at https://triviaah.com/brainwave/capitale';
    return shareText;
  };

  const copyToClipboard = () => {
    const text = generateShareMessage();
    navigator.clipboard.writeText(text).then(() => {
      setShareMessage('Copied to clipboard!');
      setTimeout(() => setShareMessage(''), 2000);
      playSound('click');
    });
  };

  const toggleHardMode = () => {
    setHardMode(!hardMode);
    playSound('click');
  };

  const toggleHint = () => {
    setShowHint(!showHint);
    playSound('click');
  };

  
  const triesLeft = 6 - attempts.length;
  const triesLeftColor = 
    triesLeft >= 4 ? 'text-green-400' : 
    triesLeft >= 2 ? 'text-yellow-400' : 
    'text-red-400';

  return (
    <div className="relative min-h-[600px]"> {/* Added min-height to ensure enough space */}
      <canvas 
        ref={confettiCanvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
      />
      
      {/* Main Game Card */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-5 mb-5">
        {/* Header with Attempts Counter */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-xl">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Today's Capital City</h2>
          </div>
          <div className={`flex items-center gap-2 text-lg font-bold ${triesLeftColor}`}>
            <Target className="w-5 h-5" />
            <span>{triesLeft} {triesLeft === 1 ? 'TRY' : 'TRIES'}</span>
          </div>
        </div>

        {/* Mystery City Image */}
        {!hasNoImage && (
          <div className="relative mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600">
            <div className="h-48 relative">
              {capitalImage ? (
                <>
                  <Image
                    src={capitalImage}
                    alt="Mystery capital city"
                    fill
                    className="object-cover transition-all duration-1000"
                    style={{ 
                      opacity: revealPercentage / 100,
                      filter: `blur(${20 - (revealPercentage / 5)}px)`
                    }}
                    onError={() => {
                      setCapitalImage(null);
                      setHasNoImage(true);
                    }}
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80 flex items-center justify-center transition-opacity duration-1000"
                    style={{ opacity: (100 - revealPercentage) / 100 }}
                  >
                    <div className="text-center">
                      <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-cyan-500/50">
                        <span className="text-cyan-400 text-2xl font-bold">?</span>
                      </div>
                      <p className="text-cyan-400 font-semibold">Mystery Capital</p>
                    </div>
                  </div>
                  
                  {/* Reveal Progress */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-black/70 backdrop-blur-sm rounded-xl p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-cyan-400 text-sm font-medium">Image Reveal</span>
                        <span className="text-white text-sm font-bold">{Math.round(revealPercentage)}%</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${revealPercentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  {isImageLoading ? (
                    <div className="text-cyan-400 flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mb-3"></div>
                      <span>Loading city image...</span>
                    </div>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Game Controls */}
        <div className="flex flex-wrap gap-3 mb-5">
          <button
            onClick={() => setHardMode(!hardMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
              hardMode 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
            }`}
          >
            <Zap className="w-4 h-4" />
            {hardMode ? 'Hard Mode ON' : 'Hard Mode'}
          </button>
          
          {hardMode && attempts.length > 0 && !showHint && gameState === 'playing' && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300"
            >
              {showHint ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
          )}
        </div>

        {/* Game Messages */}
        {errorMessage && (
          <div className="bg-red-500/20 border border-red-500/30 rounded-2xl p-4 mb-4 animate-pulse">
            <div className="flex items-center gap-2 text-red-400">
              <span className="w-2 h-2 bg-red-400 rounded-full"></span>
              {errorMessage}
            </div>
          </div>
        )}

        {gameState === 'won' && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Victory! 🎉</h3>
            <p className="text-green-400 mb-2">You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="text-gray-300">The capital of {puzzleData.country} is <strong className="text-white">{puzzleData.answer.toUpperCase()}</strong></p>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Game Over</h3>
            <p className="text-red-400">The capital was: <strong className="text-white">{puzzleData.answer.toUpperCase()}</strong></p>
            <p className="text-gray-300 mt-1">Country: {puzzleData.country}</p>
          </div>
        )}

        {/* Geographic Hints */}
        {gameState === 'playing' && attempts.length > 0 && (showHint || !hardMode) && (
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-4 mb-6">
            <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Geographic Hint:
            </h3>
            <p className="text-blue-300">{attempts[attempts.length - 1].geographicHint}</p>
            {attempts[attempts.length - 1].silhouetteUrl && (
              <div className="mt-3">
                <div className="relative h-24 w-full max-w-xs mx-auto">
                  <Image 
                    src={attempts[attempts.length - 1].silhouetteUrl ?? ''} 
                    alt="Country silhouette"
                    fill
                    className="object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <p className="text-xs text-blue-400 text-center mt-2">
                  Hint source: {getHintSource(attempts[attempts.length - 1].silhouetteUrl).name}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Attempts Grid */}
        <div className="mb-5">
          {attempts.map((attempt, index) => (
            <div key={index} className="flex flex-wrap justify-center gap-1 mb-2">
              {attempt.letterFeedback.map((letter, letterIndex) => (
                <div
                  key={letterIndex}
                  className={`flex items-center justify-center text-lg font-bold rounded-lg transition-all duration-500 transform hover:scale-105 min-w-[40px] h-10 ${
                    letter.status === 'correct' 
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg' 
                      : letter.status === 'present' 
                      ? 'bg-gradient-to-br from-yellow-500 to-amber-600 text-white shadow-lg'
                      : 'bg-gray-700 text-gray-300 border border-gray-600'
                  }`}
                  style={{ 
                    width: `calc(100% / ${attempt.letterFeedback.length > 10 ? 10 : attempt.letterFeedback.length} - 8px)`,
                    maxWidth: '48px',
                    minWidth: '36px'
                  }}
                >
                  {letter.letter.toUpperCase()}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Input Section */}
        {gameState === 'playing' && (
          <div className="sticky bottom-0 bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-700 p-4 z-[1000] -mx-2 md:-mx-4 -mb-2 md:-mb-6">
            <div className="relative">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={guess}
                    onChange={(e) => setGuess(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => guess.length >= 2 && setShowSuggestions(true)}
                    placeholder="Enter capital city..."
                    className="w-full pl-12 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300"
                    onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                  />
                </div>
                <button
                  onClick={handleGuess}
                  disabled={!guess.trim()}
                  className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl hover:from-cyan-600 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 font-semibold"
                >
                  GUESS
                </button>
              </div>
              
              {/* Autocomplete Suggestions - Updated with higher z-index and better positioning */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl z-[1001] mt-2 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((capital, index) => (
                    <button
                      key={capital.name}
                      type="button"
                      onClick={() => selectSuggestion(capital)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-700 focus:bg-gray-700 focus:outline-none transition-all duration-200 ${
                        index === selectedSuggestionIndex ? 'bg-gray-700' : ''
                      } ${index > 0 ? 'border-t border-gray-700' : ''}`}
                    >
                      <div className="font-medium text-white">{capital.name}</div>
                      <div className="text-sm text-cyan-400">{capital.country}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-3 text-center">
              Start typing to see suggestions • Minimum 2 characters
            </div>
          </div>
        )}  
        
        {/* Share & Feedback Section */}
        {gameState === 'won' && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Victory! 🎉</h3>
            <p className="text-green-400 mb-2">You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="text-gray-300 break-words">
              The capital of {puzzleData.country} is{" "}
              <strong className="text-white text-lg md:text-xl">
                {puzzleData.answer.toUpperCase()}
              </strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}