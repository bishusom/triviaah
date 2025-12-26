'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { event } from '@/lib/gtag';
import Image from 'next/image';
import { fetchPexelsImage } from '@/lib/pexels';
import { useSound } from '@/context/SoundContext';
import { MdShare } from "react-icons/md";
import { addTrordleResult } from '@/lib/brainwave/trordle/trordle-sb';
import FeedbackComponent from '@/components/common/FeedbackComponent';
import { checkTrordleGuess, TrordleData, TrordleGuessResult } from '@/lib/brainwave/trordle/trordle-logic';

interface TrordleComponentProps {
  initialData: TrordleData;
}

interface Attribute {
  name: string;
  value: string;
  status: 'correct' | 'partial' | 'incorrect';
}

// Utility function for meaningful attribute hints
const getAttributeHint = (attrName: string, attrValue: string, status: string, correctValue: string) => {
  const lowerName = attrName.toLowerCase();
  
  if (status === 'correct') {
    return 'Exactly correct! 🎉';
  }
  
  if (status === 'partial') {
    if (lowerName.includes('year') || lowerName.includes('date')) {
      const guessedYear = parseInt(attrValue);
      const correctYear = parseInt(correctValue);
      if (!isNaN(guessedYear) && !isNaN(correctYear)) {
        const diff = correctYear - guessedYear;
        return `${Math.abs(diff)} years ${diff > 0 ? 'later' : 'earlier'}`;
      }
      return 'Close but not exact';
    }
    
    if (lowerName.includes('century')) {
      return 'Right century but different details';
    }
    
    if (lowerName.includes('genre') || lowerName.includes('type')) {
      return 'Related category but not exact';
    }
    
    if (lowerName.includes('nationality') || lowerName.includes('country')) {
      return 'Geographically related';
    }
    
    return 'Partially correct - there\'s a connection';
  }
  
  // Incorrect status
  if (lowerName.includes('year') || lowerName.includes('date')) {
    const guessedYear = parseInt(attrValue);
    const correctYear = parseInt(correctValue);
    if (!isNaN(guessedYear) && !isNaN(correctYear)) {
      const diff = correctYear - guessedYear;
      const centuryDiff = Math.floor(correctYear/100) - Math.floor(guessedYear/100);
      
      if (centuryDiff !== 0) {
        return `${Math.abs(centuryDiff)} century${Math.abs(centuryDiff) > 1 ? 's' : ''} ${centuryDiff > 0 ? 'later' : 'earlier'}`;
      }
      return `${Math.abs(diff)} years ${diff > 0 ? 'later' : 'earlier'}`;
    }
    return 'Different time period';
  }
  
  if (lowerName.includes('century')) {
    return 'Different historical period';
  }
  
  if (lowerName.includes('genre') || lowerName.includes('type')) {
    return 'Different category entirely';
  }
  
  if (lowerName.includes('nationality') || lowerName.includes('country')) {
    return 'Different geographical origin';
  }
  
  if (lowerName.includes('director') || lowerName.includes('author')) {
    return 'Different creator';
  }
  
  if (lowerName.includes('party') || lowerName.includes('affiliation')) {
    return 'Different affiliation';
  }
  
  if (lowerName.includes('setting') || lowerName.includes('location')) {
    return 'Different location';
  }
  
  return 'Not related to the correct answer';
};

// FeedbackCard component - now with Tailwind
const FeedbackCard = ({ attribute, correctValue }: {
  attribute: Attribute;
  correctValue: string;
}) => {
  const hintText = getAttributeHint(attribute.name, attribute.value, attribute.status, correctValue);
  
  const statusColors = {
    correct: 'bg-green-50 border-green-200',
    partial: 'bg-yellow-50 border-yellow-200',
    incorrect: 'bg-red-50 border-red-200'
  };

  const statusIcons = {
    correct: 'bg-green-100 text-green-800',
    partial: 'bg-yellow-100 text-yellow-800',
    incorrect: 'bg-red-100 text-red-800'
  };

  return (
    <div className={`rounded-lg border p-4 ${statusColors[attribute.status]}`}>
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-1">
            {attribute.name}
          </div>
          <div className="font-medium text-gray-800">
            {attribute.value}
          </div>
        </div>
        <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${statusIcons[attribute.status]}`}>
          {attribute.status === 'correct' ? '✓' : 
           attribute.status === 'partial' ? '~' : '✗'}
        </div>
      </div>
      <div className="text-sm text-gray-700">
        <strong>Hint:</strong> {hintText}
        {attribute.status !== 'correct' && (
          <>
            <br />
            <span className="text-gray-600 text-sm">
              Correct: <strong className="font-semibold">{correctValue}</strong>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

// EnhancedProgressiveHint component with Tailwind
const EnhancedProgressiveHint = ({ attempts }: { attempts: TrordleGuessResult[] }) => {
  if (attempts.length === 0) return null;
  
  const hints = [
    {
      icon: "🎯",
      text: "Great start! Focus on the green matches.",
      color: "bg-green-50 border-green-200 text-green-800"
    },
    {
      icon: "🔗",
      text: "Yellow means you're close - look for connections!",
      color: "bg-yellow-50 border-yellow-200 text-yellow-800"
    },
    {
      icon: "🤔",
      text: "Compare your guesses to find patterns.",
      color: "bg-blue-50 border-blue-200 text-blue-800"
    },
    {
      icon: "🔍",
      text: "You're narrowing it down - focus on remaining attributes.",
      color: "bg-purple-50 border-purple-200 text-purple-800"
    },
    {
      icon: "⚡",
      text: "Last chance! Use all clues wisely.",
      color: "bg-red-50 border-red-200 text-red-800"
    }
  ];
  
  const hintIndex = Math.min(attempts.length - 1, hints.length - 1);
  const currentHint = hints[hintIndex];
  
  return (
    <div className={`rounded-lg border p-4 mb-6 ${currentHint.color}`}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xl">{currentHint.icon}</span>
        <span className="font-medium">{currentHint.text}</span>
      </div>
      
      <div className="flex gap-1">
        {attempts[attempts.length - 1].attributes.map((attr, i) => (
          <div
            key={i}
            className={`flex-1 h-2 rounded-full ${
              attr.status === 'correct' ? 'bg-green-500' :
              attr.status === 'partial' ? 'bg-yellow-500' : 'bg-red-500'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// ResultModal component with Tailwind
const ResultModal = ({ result, onClose, onViewHistory, puzzleData }: {
  result: TrordleGuessResult;
  onClose: () => void;
  onViewHistory: () => void;
  puzzleData: TrordleData;
}) => {
  const correctAnswer = puzzleData.answer;
  const correctCount = result.attributes.filter(a => a.status === 'correct').length;
  const partialCount = result.attributes.filter(a => a.status === 'partial').length;
  const total = result.attributes.length;

  const getSummaryText = () => {
    const parts = [];
    if (correctCount > 0) parts.push(`${correctCount} exact`);
    if (partialCount > 0) parts.push(`${partialCount} partial`);
    if (parts.length === 0) return "No matches";
    return parts.join(", ");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                ❌ Wrong Guess
              </h3>
              <p className="text-gray-700 mb-2">
                <strong className="text-lg">{result.guess}</strong>
              </p>
              <p className="text-sm text-gray-600">
                {getSummaryText()} ({correctCount + partialCount} of {total} attributes)
              </p>
            </div>
            <button 
              className="text-gray-500 hover:text-gray-700 text-xl"
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          
          {/* Body */}
          <div className="space-y-3 mb-6">
            {result.attributes.map((attr, index) => {
              const correctAttribute = puzzleData.attributes[index];
              const correctValue = correctAttribute.optionValues[correctAnswer];
              const statusColors = {
                correct: 'bg-green-50 border-green-200',
                partial: 'bg-yellow-50 border-yellow-200',
                incorrect: 'bg-red-50 border-red-200'
              };
              
              const statusIcons = {
                correct: 'bg-green-100 text-green-800',
                partial: 'bg-yellow-100 text-yellow-800',
                incorrect: 'bg-red-100 text-red-800'
              };

              return (
                <div key={index} className={`rounded-lg border p-4 ${statusColors[attr.status]}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-1">
                        {attr.name}
                      </div>
                      <div className="font-medium text-gray-800">
                        {attr.value}
                      </div>
                    </div>
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm ${statusIcons[attr.status]}`}>
                      {attr.status === 'correct' ? '✓' : 
                       attr.status === 'partial' ? '~' : '✗'}
                    </div>
                  </div>
                  <div className="text-sm text-gray-700">
                    {getAttributeHint(attr.name, attr.value, attr.status, correctValue)}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Footer */}
          <div className="flex gap-3">
            <button 
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              onClick={onClose}
            >
              Try Again
            </button>
            <button 
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition-colors"
              onClick={() => {
                onClose();
                onViewHistory();
              }}
            >
              View All Guesses
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main component
export default function TrordleComponent({ initialData }: TrordleComponentProps) {
  const [puzzleData] = useState(initialData);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [attempts, setAttempts] = useState<TrordleGuessResult[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [shareMessage, setShareMessage] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [categoryImage, setCategoryImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState<TrordleGuessResult | null>(null);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Sound effects
  const { isMuted } = useSound();
  const correctSound = useRef<HTMLAudioElement | null>(null);
  const incorrectSound = useRef<HTMLAudioElement | null>(null);
  const winSound = useRef<HTMLAudioElement | null>(null);
  const loseSound = useRef<HTMLAudioElement | null>(null);
  const clickSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Initialize sound effects
    correctSound.current = new Audio('/sounds/correct.mp3');
    incorrectSound.current = new Audio('/sounds/incorrect.mp3');
    winSound.current = new Audio('/sounds/win.mp3');
    loseSound.current = new Audio('/sounds/lose.mp3');
    clickSound.current = new Audio('/sounds/click.mp3');

    return () => {
      [correctSound, incorrectSound, winSound, loseSound, clickSound].forEach(sound => {
        sound.current?.pause();
      });
    };
  }, []);

  useEffect(() => {
    // Fetch category image
    const fetchImage = async () => {
      setIsImageLoading(true);
      const imageUrl = await fetchPexelsImage('', puzzleData.category);
      if (imageUrl) {
        setCategoryImage(imageUrl);
      }
      setIsImageLoading(false);
    };

    fetchImage();
  }, [puzzleData.category]);

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

  useEffect(() => {
    const savedProgress = localStorage.getItem(`trordle-${puzzleData.id}`);
    if (savedProgress) {
      try {
        const progress = JSON.parse(savedProgress);
        setAttempts(progress.attempts || []);
        setGameState(progress.gameState || 'playing');
      } catch (e) {
        console.error('Error loading saved progress:', e);
      }
    }
  }, [puzzleData.id]);

  useEffect(() => {
    if (attempts.length > 0 || gameState !== 'playing') {
      localStorage.setItem(`trordle-${puzzleData.id}`, JSON.stringify({
        attempts,
        gameState
      }));
    }
  }, [attempts, gameState, puzzleData.id]);

  // Add analytics event for game start
  useEffect(() => {
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'trordle_started', category: 'trordle', label: 'trordle'});
        clearInterval(checkGtag);
      }
    }, 100);

    return () => clearInterval(checkGtag);
  }, []);

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

  const handleGuess = (option: string) => {
    if (gameState !== 'playing' || attempts.length >= 6) return;
    
    setSelectedOption(option);
    playSound('click');
    
    setTimeout(() => {
      const result = checkTrordleGuess(option, puzzleData);
      const newAttempts = [...attempts, result];
      setAttempts(newAttempts);
      
      if (result.isCorrect) {
        setGameState('won');
        triggerConfetti();
        playSound('win');
        addTrordleResult(true, newAttempts.length);
        event({
          action: 'trordle_won',
          category: 'trordle',
          label: `attempts_${newAttempts.length}`,
          value: newAttempts.length
        });
      } else if (newAttempts.length >= 6) {
        setGameState('lost');
        playSound('lose');
        addTrordleResult(false, 6);
        event({
          action: 'trordle_lost',
          category: 'trordle',
          label: 'max_attempts'
        });
        setModalData(result);
        setShowModal(true);
      } else {
        setModalData(result);
        setShowModal(true);
        const hasCorrectOrPartial = result.attributes.some(attr => 
          attr.status === 'correct' || attr.status === 'partial'
        );
        if (hasCorrectOrPartial) {
          playSound('correct');
        } else {
          playSound('incorrect');
        }
      }
      
      setSelectedOption(null);
    }, 500);
  };

  const closeModal = () => {
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    }
    setShowModal(false);
    setModalData(null);
  };

  useEffect(() => {
    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [timerId]);

  const generateShareMessage = () => {
    if (gameState !== 'won' && gameState !== 'lost') return '';
    
    const clientDate = new Date();
    const startDate = new Date(2024, 0, 1);
    const puzzleNumber = Math.floor((clientDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    let shareText = `Trordle #${puzzleNumber} ${gameState === 'won' ? attempts.length : 'X'}/6\n\n`;
    
    attempts.forEach(attempt => {
      attempt.attributes.forEach(attr => {
        if (attr.status === 'correct') {
          shareText += '🟩';
        } else if (attr.status === 'partial') {
          shareText += '🟨';
        } else {
          shareText += '⬜';
        }
      });
      shareText += '\n';
    });
    
    shareText += '\nPlay daily at https://elitetrivias.com/brainwave/trordle';
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

  const toggleHistory = () => {
    setShowHistory(!showHistory);
    playSound('click');
  };

  const triesLeft = 6 - attempts.length;
  const triesLeftColor = triesLeft >= 4 ? 'text-green-600' : triesLeft >= 2 ? 'text-yellow-600' : 'text-red-600';

  const availableOptions = puzzleData.options.filter(
    option => !attempts.some(attempt => attempt.guess === option)
  );

  return (
    <div className="relative flex flex-col min-h-[calc(100vh-4rem)]">
      <canvas 
        ref={confettiCanvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
      />
      
      {/* Modal */}
      {showModal && modalData && (
        <ResultModal 
          result={modalData} 
          onClose={closeModal}
          onViewHistory={toggleHistory}
          puzzleData={puzzleData}
        />
      )}
      
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 flex-grow">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            Today&apos;s Category: {puzzleData.category}
          </h2>
          <div className={`text-base font-bold ${triesLeftColor}`}>
            {triesLeft} {triesLeft === 1 ? 'try' : 'tries'} left
          </div>
        </div>
        
        {/* Progressive hints */}
        <EnhancedProgressiveHint attempts={attempts} />
        
        {/* Question and Image Container */}
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            <div className={`relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 ${categoryImage ? '' : 'animate-pulse'}`}>
              {categoryImage ? (
                <Image 
                  src={categoryImage} 
                  alt={`${puzzleData.category} illustration`}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                  {isImageLoading ? 'Loading...' : 'No image'}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-800">{puzzleData.question}</h3>
          </div>
        </div>
        
        {/* Attempt History */}
        {attempts.length > 0 && (
          <div className="mb-6">
            <button 
              onClick={toggleHistory}
              className="text-blue-600 hover:text-blue-800 font-semibold mb-3 text-sm md:text-base transition-colors"
            >
              {showHistory ? 'Hide Guesses' : 'Show Your Guesses'}
            </button>
            
            {/* Attempt dots */}
            <div className="flex gap-2 mb-3">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  onClick={toggleHistory}
                  className={`w-6 h-6 rounded-full cursor-pointer transition-all ${
                    index < attempts.length 
                      ? attempts[index].isCorrect 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-red-500 hover:bg-red-600'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  title={index < attempts.length ? `Guess ${index + 1}` : 'Unused attempt'}
                />
              ))}
            </div>
            
            {/* History details */}
            {showHistory && (
              <div className="space-y-4 mt-4">
                {attempts.slice().reverse().map((attempt, index) => {
                  const correctAnswer = puzzleData.answer;
                  
                  return (
                    <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <div className="font-bold text-lg text-center">
                          {attempt.guess}
                          {attempt.isCorrect && <span className="ml-2 text-green-600">🎯</span>}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {attempt.attributes.map((attr, attrIndex) => {
                            const correctAttribute = puzzleData.attributes[attrIndex];
                            const correctValue = correctAttribute.optionValues[correctAnswer];
                            
                            return (
                              <FeedbackCard
                                key={attrIndex}
                                attribute={attr}
                                correctValue={correctValue}
                              />
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {/* Game result messages */}
        {gameState === 'won' && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-2">Congratulations! 🎉</h3>
            <p>You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            <h3 className="font-bold text-lg mb-2">Game Over</h3>
            <p>The answer was: <strong className="text-lg">{puzzleData.answer}</strong></p>
          </div>
        )}
        
        {/* Answer Options */}
        {gameState === 'playing' && (
          <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-4 md:-mx-6 -mb-4 md:-mb-6 mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleGuess(option)}
                  disabled={selectedOption === option}
                  className={`px-4 py-3 rounded-lg font-medium transition-all text-sm md:text-base ${
                    selectedOption === option 
                      ? 'bg-blue-600 text-white transform scale-95' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:shadow'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Share Results */}
      {(gameState === 'won' || gameState === 'lost') && (
        <div className="mt-6 text-center bg-white rounded-lg shadow-md p-6">
          <button
            onClick={copyToClipboard}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <MdShare className="w-5 h-5" /> Share Results
          </button>
          {shareMessage && (
            <div className="mt-2 text-green-600 font-medium">{shareMessage}</div>
          )}
          
          {/* Share grid visualization */}
          <div className="grid grid-cols-5 gap-2 max-w-xs mx-auto mt-6">
            {attempts.flatMap(attempt => 
              attempt.attributes.map((attr, i) => (
                <div 
                  key={`${attempt.guess}-${i}`} 
                  className={`aspect-square flex items-center justify-center rounded font-bold ${
                    attr.status === 'correct' ? 'bg-green-500 text-white' :
                    attr.status === 'partial' ? 'bg-yellow-500 text-white' :
                    'bg-gray-300 text-gray-700'
                  }`}
                >
                  {attr.status === 'correct' ? '✓' : attr.status === 'partial' ? '~' : '✗'}
                </div>
              ))
            )}
            {[...Array(6 - attempts.length)].flatMap((_, attemptIndex) => 
              [...Array(5)].map((_, attrIndex) => (
                <div key={`empty-${attemptIndex}-${attrIndex}`} className="aspect-square bg-gray-200 text-gray-500 flex items-center justify-center rounded">
                  ?
                </div>
              ))
            )}
          </div>

          <FeedbackComponent
            gameType="trordle"
            category="brainwave"
            metadata={{
              attempts: attempts.length,
              won: gameState === 'won',
              puzzleQuestion: puzzleData.question,
              puzzletAnswer: puzzleData.answer
            }}
          />
        </div>
      )}
      
      {/* How to Play section */}
      <div className="bg-gray-50 rounded-lg p-4 mt-6 border border-gray-200">
        <h3 className="font-bold text-gray-900 mb-3">How to Play:</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Guess the answer to the trivia question in 6 tries</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600 mt-1">•</span>
            <span>Click the colored dots or &quot;Show Your Guesses&quot; to view your guesses</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-1">🟩</span>
            <span>Green: This attribute is exactly correct</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-1">🟨</span>
            <span>Yellow: This attribute is partially correct or related</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-gray-600 mt-1">⬜</span>
            <span>Gray: This attribute is incorrect</span>
          </li>
        </ul>
      </div>
    </div>
  );
}