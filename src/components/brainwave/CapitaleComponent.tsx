// components/capitale/CapitaleComponent.tsx
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
//import { im } from 'mathjs';

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
  
  // New state for autocomplete
  const [suggestions, setSuggestions] = useState<CapitalInfo[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Start game and trigger analytics
  useEffect(() => {
    setGameStarted(true);
  }, []);

  // Add analytics event for game start
  useEffect(() => {
    if (!gameStarted) return;
    
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'capitale_started', category: 'capitale', label: 'capitale'});
        clearInterval(checkGtag);
      }
    }, 100);

    return () => clearInterval(checkGtag);
  }, [gameStarted]);
  
  // Sound effects
  const { isMuted } = useSound();

  useEffect(() => {
    const savedProgress = localStorage.getItem(`capitale-${puzzleData.id}`);
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setAttempts(progress.attempts || []);
        setGameState(progress.gameState || 'playing');
        setHardMode(progress.hardMode || false);
      } catch (e) {
        console.error('Error loading saved progress:', e);
      }
    }
  }, [puzzleData.id]);

  useEffect(() => {
    if (attempts.length > 0 || gameState !== 'playing') {
      localStorage.setItem(`capitale-${puzzleData.id}`, JSON.stringify({
        attempts,
        gameState,
        hardMode
      }));
    }
  }, [attempts, gameState, puzzleData.id, hardMode]);

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
          setGuess(suggestions[selectedSuggestionIndex].name);
          setShowSuggestions(false);
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
      setShowSuggestions(false);
    setSelectedSuggestionIndex(-1);
    handleGuess(capital.name);
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
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      setTimeout(() => myConfetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } }), 250);
      setTimeout(() => myConfetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } }), 400);
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
    
    // Default fallback
    return { 
      name: 'elitetrivias', 
      url: 'https://triviaah.com.com' 
    };
  };

  const handleGuess = (userGuess?: string) => {
    if (gameState !== 'playing' || attempts.length >= 6) return;
    
    const normalizedGuess = (userGuess || guess).trim();
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
  const triesLeftColor = triesLeft >= 4 ? 'text-green-600' : triesLeft >= 2 ? 'text-amber-600' : 'text-red-600';

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-4rem)]">
      <canvas 
        ref={confettiCanvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      />
      
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold">Today&apos;s Capital City</h2>
          <div className={`text-base font-bold ${triesLeftColor}`}>
            {triesLeft} {triesLeft === 1 ? 'try' : 'tries'} left
          </div>
        </div>

        {/* Mystery city image - moved outside the flex header */}
        {/* Only show image section if an image is available or still loading */}
        {!hasNoImage && (
          <>
            {/* Mystery city image */}
            <div className="relative mb-6 rounded-lg overflow-hidden bg-gray-100" style={{ height: '200px' }}>
              {capitalImage ? (
                <>
                  <Image
                    src={capitalImage}
                    alt="Mystery capital city"
                    fill
                    className="object-cover"
                    style={{ opacity: revealPercentage / 100 }}
                    onError={() => {
                      // If image fails to load, hide the entire section
                      setCapitalImage(null);
                      setHasNoImage(true);
                    }}
                  />
                  <div 
                    className="absolute inset-0 bg-black flex items-center justify-center transition-opacity duration-500"
                    style={{ opacity: (100 - revealPercentage) / 100 }}
                  >
                    <span className="text-white text-6xl font-bold">?</span>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {revealPercentage > 0 ? 
                      `${Math.round(revealPercentage)}% revealed (${attempts.length}/6 guesses)` : 
                      'Image will reveal with guesses'
                    }
                    {revealPercentage > 0 && (
                      <div className="text-[10px] mt-1 opacity-70">
                        Image from {getImageSource(capitalImage).name}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-100 to-gray-200">
                  {isImageLoading ? (
                    <div className="text-gray-600 flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                      <span>Searching for city image...</span>
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* Attribution when image is fully revealed */}
            {revealPercentage === 100 && capitalImage && (
              <div className="text-xs text-gray-500 text-center mb-4">
                Image sourced from{' '}
                <a 
                  href={getImageSource(capitalImage).url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {getImageSource(capitalImage).name}
                </a>
              </div>
            )}
          </>
        )}

        {/* Game mode toggle */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={toggleHardMode}
            className={`px-3 py-1 rounded text-sm ${hardMode ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            {hardMode ? 'Hard Mode: ON' : 'Hard Mode: OFF'}
          </button>
          
          {hardMode && attempts.length > 0 && !showHint && gameState === 'playing' && (
            <button
              onClick={toggleHint}
              className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
            >
              Show Hint
            </button>
          )}
        </div>
        
        {/* Error message */}
        {errorMessage && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorMessage}
          </div>
        )}

        {/* Game result message */}
        {gameState === 'won' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Congratulations! 🎉</h3>
            <p>You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="mt-2">The capital of {puzzleData.country} is {puzzleData.answer.toUpperCase()}.</p>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Game Over</h3>
            <p>The capital was: <strong>{puzzleData.answer.toUpperCase()}</strong> ({puzzleData.country})</p>
          </div>
        )}
        
        {/* Geographic hints - HIDDEN WHEN GAME ENDS */}
        {gameState === 'playing' && attempts.length > 0 && (showHint || !hardMode) && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3 mb-4">
              <h3 className="font-semibold text-blue-800 mb-1">Geographic Hint:</h3>
              <p>{attempts[attempts.length - 1].geographicHint}</p>
              {attempts[attempts.length - 1].silhouetteUrl && (
                <div className="mt-2">
                  <div className="relative h-32 w-full max-w-xs mx-auto">
                    <Image 
                      src={attempts[attempts.length - 1].silhouetteUrl ?? ''} 
                      alt="Country silhouette"
                      fill
                      className="object-contain"
                      onError={(e) => {
                        // Fallback if image fails to load - hide the parent container
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 text-center mt-1">
                    Hint source:{' '}
                    <a 
                      href={getHintSource(attempts[attempts.length - 1].silhouetteUrl).url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {getHintSource(attempts[attempts.length - 1].silhouetteUrl).name}
                    </a>
                  </p>
                </div>
              )}
            </div>
          )}
        
        {/* Letter grid for previous attempts */}
        <div className="mb-6">
          {attempts.map((attempt, index) => (
            <div key={index} className="flex flex-wrap justify-center gap-1 mb-2">
              {attempt.letterFeedback.map((letter, letterIndex) => (
                <div
                  key={letterIndex}
                  className={`w-8 h-8 flex items-center justify-center text-xl font-bold ${
                    letter.status === 'correct' 
                      ? 'bg-green-500 text-white border-green-500' 
                      : letter.status === 'present' 
                      ? 'bg-yellow-500 text-white border-yellow-500'
                      : 'bg-gray-300 text-gray-700 border-gray-300'
                  }`}
                >
                  {letter.letter.toUpperCase()}
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Input for guesses with autocomplete */}
        {gameState === 'playing' && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 z-10 -mx-4 md:-mx-6 -mb-4 md:-mb-6">
            <div className="relative">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => guess.length >= 2 && setShowSuggestions(true)}
                  placeholder="Enter a capital city (type 2+ letters)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                />
                <button
                  onClick={() => handleGuess()}
                  disabled={!guess.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Guess
                </button>
              </div>
              
              {/* Autocomplete suggestions dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div 
                  ref={suggestionsRef}
                  className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-20 mt-1 max-h-60 overflow-y-auto"
                >
                  {suggestions.map((capital, index) => (
                    <button
                      key={capital.name}
                      type="button"
                      onClick={() => selectSuggestion(capital)}
                      className={`w-full text-left px-4 py-2 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none ${
                        index === selectedSuggestionIndex ? 'bg-blue-100' : ''
                      } ${index > 0 ? 'border-t border-gray-100' : ''}`}
                    >
                      <div className="font-medium">{capital.name}</div>
                      <div className="text-sm text-gray-600">{capital.country}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Start typing to see suggestions (minimum 2 characters)
            </div>
          </div>
        )}
        
        {/* Share button & feedback */}
        {(gameState === 'won' || gameState === 'lost') && (
          <div className="flex flex-col items-center mt-4">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <MdShare /> Share Result
            </button>
            {shareMessage && (
              <div className="mt-2 text-blue-600">{shareMessage}</div>
            )}

            <FeedbackComponent
              gameType="capitale"
              category="brainwave"
              metadata={{
                attempts: attempts.length,
                won: gameState === 'won',
                targetCountry: puzzleData.country,
                targetCapital: puzzleData.answer,
                hardMode // if you track this
              }}
            />

          </div>
        )}
      </div>
    </div>
  );
}