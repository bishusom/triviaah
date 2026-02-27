'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import Link from 'next/link';
import { event } from '@/lib/gtag';
import Image from 'next/image';
import { fetchPexelsImage } from '@/lib/pexels';
import { useSound } from '@/context/SoundContext';
import { MdShare } from "react-icons/md";
import { addTrordleResult } from '@/lib/brainwave/trordle/trordle-sb';
import FeedbackComponent from '@/components/common/FeedbackComponent';
import { checkTrordleGuess, TrordleData, TrordleGuessResult } from '@/lib/brainwave/trordle/trordle-logic';
import { Home, Brain, Target, Users, Sparkles, HelpCircle, Trophy } from 'lucide-react';

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

// FeedbackCard component
const FeedbackCard = ({ attribute, correctValue }: {
  attribute: Attribute;
  correctValue: string;
}) => {
  const hintText = getAttributeHint(attribute.name, attribute.value, attribute.status, correctValue);
  
  const statusColors = {
    correct: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30',
    partial: 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30',
    incorrect: 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30'
  };
  
  const statusIcons = {
    correct: '✓',
    partial: '~',
    incorrect: '✗'
  };
  
  const statusTextColors = {
    correct: 'text-green-400',
    partial: 'text-yellow-400',
    incorrect: 'text-red-400'
  };

  return (
    <div className={`rounded-xl p-4 ${statusColors[attribute.status]}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex-1">
          <div className="text-white font-semibold text-sm">{attribute.name}</div>
          <div className="text-gray-300 text-sm">{attribute.value}</div>
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${statusTextColors[attribute.status]} bg-gray-800/50`}>
          {statusIcons[attribute.status]}
        </div>
      </div>
      <div className="text-xs text-gray-300">
        <strong>Hint:</strong> {hintText}
        {attribute.status !== 'correct' && (
          <>
            <br />
            <span className="text-white">
              Correct: <strong>{correctValue}</strong>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

// EnhancedProgressiveHint component
const EnhancedProgressiveHint = ({ attempts }: { attempts: TrordleGuessResult[] }) => {
  if (attempts.length === 0) return null;
  
  const hints = [
    {
      icon: "🎯",
      text: "Great start! Focus on the green matches.",
      color: "bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400"
    },
    {
      icon: "🔗",
      text: "Yellow means you're close - look for connections!",
      color: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border border-yellow-500/30 text-yellow-400"
    },
    {
      icon: "🤔",
      text: "Compare your guesses to find patterns.",
      color: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-blue-400"
    },
    {
      icon: "🔍",
      text: "You're narrowing it down - focus on remaining attributes.",
      color: "bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 text-purple-400"
    },
    {
      icon: "⚡",
      text: "Last chance! Use all clues wisely.",
      color: "bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/30 text-orange-400"
    }
  ];
  
  const hintIndex = Math.min(attempts.length - 1, hints.length - 1);
  const currentHint = hints[hintIndex];
  
  return (
    <div className={`rounded-2xl p-4 mb-4 ${currentHint.color}`}>
      <div className="flex items-center mb-2">
        <span className="text-xl mr-3">{currentHint.icon}</span>
        <span className="font-semibold">{currentHint.text}</span>
      </div>
      
      <div className="flex gap-1 mt-3">
        {attempts[attempts.length - 1].attributes.map((attr, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded ${
              attr.status === 'correct' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
              attr.status === 'partial' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// ResultModal component with X button and auto-timer
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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-gray-800 border border-gray-700 rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white">❌ Wrong Guess</h3>
            <button 
              className="text-gray-400 hover:text-white transition-colors"
              onClick={onClose}
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
          
          <div className="text-center mb-6">
            <p className="text-white font-semibold text-lg mb-2">{result.guess}</p>
            <p className="text-gray-300">
              {getSummaryText()} ({correctCount + partialCount} of {total} attributes)
            </p>
          </div>
          
          <div className="space-y-3 mb-6">
            {result.attributes.map((attr, index) => {
              const correctAttribute = puzzleData.attributes[index];
              const correctValue = correctAttribute.optionValues[correctAnswer];
              
              return (
                <FeedbackCard
                  key={index}
                  attribute={attr}
                  correctValue={correctValue}
                />
              );
            })}
          </div>
          
          <div className="flex gap-3">
            <button 
              className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-3 rounded-2xl font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all duration-300"
              onClick={onClose}
            >
              Try Again
            </button>
            <button 
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 text-white py-3 rounded-2xl font-semibold hover:from-purple-600 hover:to-pink-700 transition-all duration-300"
              onClick={() => {
                onClose();
                onViewHistory();
              }}
            >
              View All
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
  const [timeToNext, setTimeToNext] = useState<{ hours: number; minutes: number } | null>(null);
  
  // Sound effects
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
        origin: { y: 0.6 },
        colors: ['#10B981', '#059669', '#047857']
      });
      
      setTimeout(() => myConfetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } }), 250);
      setTimeout(() => myConfetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } }), 400);
    }
  };

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0); // next midnight local time
      const diffMs = midnight.getTime() - now.getTime();
      const diffMinutes = Math.floor(diffMs / 60000);
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      setTimeToNext({ hours, minutes });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  // Generate last 7 days (including today)
  const getLast7Days = () => {
    const today = new Date();
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push(date);
    }
    return days;
  };

  // Format date for display (e.g., "Feb 26")
  const formatDateDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format date for URL parameter (YYYY-MM-DD)
  const formatDateParam = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Update handleGuess to use modal
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

  // Add modal close function
  const closeModal = () => {
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    }
    setShowModal(false);
    setModalData(null);
  };

  // Add cleanup on unmount
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
    
    shareText += '\nPlay daily at https://triviaah.com/brainwave/trordle';
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
  const triesLeftColor = 
    triesLeft >= 4 ? 'text-green-400' : 
    triesLeft >= 2 ? 'text-yellow-400' : 
    'text-red-400';

  const availableOptions = puzzleData.options.filter(
    option => !attempts.some(attempt => attempt.guess === option)
  );

  return (
    <div className="relative">
      <canvas 
        ref={confettiCanvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-10"
      />
      
      {/* Add modal here */}
      {showModal && modalData && (
        <ResultModal 
          result={modalData} 
          onClose={closeModal}
          onViewHistory={toggleHistory}
          puzzleData={puzzleData}
        />
      )}
      
      {/* Main Game Card */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-5 mb-5">
        {/* Header with Attempts Counter */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-2 rounded-xl">
              <HelpCircle className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">Today&apos;s Trivia Challenge</h2>
          </div>
          <div className={`flex items-center gap-2 text-lg font-bold ${triesLeftColor}`}>
            <Target className="w-5 h-5" />
            <span>{triesLeft} {triesLeft === 1 ? 'TRY' : 'TRIES'}</span>
          </div>
        </div>

        {/* Category & Image Container */}
        <div className="flex flex-col md:flex-row gap-6 mb-6 items-center">
          {/* Category Image Container */}
          <div className="flex-shrink-0">
            <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-600 ${categoryImage ? '' : 'animate-pulse'}`} style={{ width: '200px', height: '120px' }}>
              {categoryImage ? (
                <Image 
                  src={categoryImage} 
                  alt={`${puzzleData.category} illustration`}
                  fill
                  className="object-cover"
                  loading="lazy"
                  onError={() => setCategoryImage(null)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                  {isImageLoading ? 'Loading...' : 'No image'}
                </div>
              )}
            </div>
          </div>

          {/* Question Section */}
          <div className="flex-grow text-center">
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-3">Today&apos;s Category: {puzzleData.category}</h3>
              <p className="text-gray-300 text-lg mb-4">
                {puzzleData.question}
              </p>
              <div className="flex justify-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>Trivia Enthusiasts</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="w-4 h-4" />
                  <span>6 Attributes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced progressive hints */}
        <EnhancedProgressiveHint attempts={attempts} />

        {/* Collapsible Attempt History */}
        {attempts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={toggleHistory}
                className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-2 transition-colors"
              >
                {showHistory ? 'Hide Guesses' : 'Show Your Guesses'}
                <Sparkles className="w-4 h-4" />
              </button>
              
              <div className="flex gap-1">
                {[...Array(6)].map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index < attempts.length 
                        ? attempts[index].isCorrect 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                          : 'bg-gradient-to-r from-yellow-400 to-amber-500'
                        : 'bg-gray-600'
                    }`}
                    title={index < attempts.length ? `Guess ${index + 1}` : 'Unused attempt'}
                  />
                ))}
              </div>
            </div>
            
            {showHistory && (
              <div className="space-y-3">
                {attempts.slice().reverse().map((attempt, index) => {
                  const correctAnswer = puzzleData.answer;
                  
                  return (
                    <div key={index} className="bg-gray-700/30 rounded-xl border border-gray-600 overflow-hidden">
                      <div className="bg-gray-600/50 px-4 py-3 border-b border-gray-600">
                        <div className="font-bold text-lg text-center text-white">
                          {attempt.guess}
                          {attempt.isCorrect && <span className="ml-2 text-green-400">🎯</span>}
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
        
        {/* Game result message */}
        {gameState === 'won' && (
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Congratulations! 🎉</h3>
            <p className="text-green-400 mb-2">You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
            <p className="text-gray-300">The answer was: <strong className="text-white">{puzzleData.answer}</strong></p>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border border-red-500/30 rounded-2xl p-6 mb-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center">
                <HelpCircle className="w-8 h-8 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Game Over</h3>
            <p className="text-red-400">The answer was: <strong className="text-white">{puzzleData.answer}</strong></p>
          </div>
        )}

        {/* Countdown + Last 7 Days (now directly after the outcome box) */}
        {(gameState === 'won' || gameState === 'lost') && (
          <div className="flex flex-col items-center gap-4 mt-2 mb-6">
            {/* Countdown */}
            {timeToNext && (
              <div className="text-center bg-gray-800/50 backdrop-blur-sm rounded-xl px-4 py-2 border border-gray-700">
                <p className="text-gray-300 text-sm">
                  New puzzle in{' '}
                  <span className="text-cyan-400 font-bold">
                    {timeToNext.hours}h {timeToNext.minutes}m
                  </span>
                </p>
              </div>
            )}

            {/* Last 7 days buttons */}
            <div className="w-full">
              <h4 className="text-sm font-semibold text-gray-400 mb-3 text-center">Previous Puzzles</h4>
              <div className="flex flex-wrap justify-center gap-2">
                {getLast7Days().map((date) => {
                  const dateParam = formatDateParam(date);
                  const isToday = date.toDateString() === new Date().toDateString();
                  return (
                    <Link
                      key={dateParam}
                      href={`/brainwave/trordle${isToday ? '' : `?date=${dateParam}`}`}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isToday
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                      }`}
                    >
                      {formatDateDisplay(date)}
                      {isToday && ' (Today)'}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {/* Sticky Answer Options */}
        {gameState === 'playing' && (
          <div className="sticky bottom-0 bg-gray-800/80 backdrop-blur-lg rounded-xl border border-gray-700 p-4 z-[100] -mx-2 md:-mx-4 -mb-2 md:-mb-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {availableOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleGuess(option)}
                  disabled={selectedOption === option}
                  className={`py-3 px-4 bg-gray-700 border border-gray-600 rounded-2xl text-white font-semibold hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-300 ${
                    selectedOption === option ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Share results */}
      {(gameState === 'won' || gameState === 'lost') && (
        <div className="flex flex-col items-center gap-4 mt-6 bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-6">
          <button
            onClick={copyToClipboard}
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-2xl hover:from-blue-600 hover:to-cyan-700 transition-all duration-300 transform hover:scale-105 font-semibold"
          >
            <MdShare className="w-5 h-5" />
            Share Results
          </button>
          {shareMessage && (
            <div className="text-blue-400 font-semibold animate-pulse">{shareMessage}</div>
          )}
          
          <div className="grid grid-cols-5 gap-2 max-w-md">
            {attempts.flatMap(attempt => 
              attempt.attributes.map((attr, i) => (
                <div 
                  key={`${attempt.guess}-${i}`} 
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                    attr.status === 'correct' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                    attr.status === 'partial' ? 'bg-gradient-to-r from-yellow-400 to-amber-500' :
                    'bg-gradient-to-r from-red-400 to-pink-500'
                  }`}
                >
                  {attr.status === 'correct' ? '✓' : attr.status === 'partial' ? '~' : '✗'}
                </div>
              ))
            )}
            {[...Array(6 - attempts.length)].flatMap((_, attemptIndex) => 
              [...Array(5)].map((_, attrIndex) => (
                <div key={`empty-${attemptIndex}-${attrIndex}`} className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center text-gray-400">
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

          {/* Navigation Buttons */}
          <div className="flex flex-wrap justify-center gap-4 mt-4 w-full">
            <Link href="/"
              className="flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-br from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-center text-sm md:text-base"
            >
              <Home className="text-lg md:text-xl" />
              Home
            </Link>

            <Link href="/brainwave"
                className="flex items-center justify-center gap-1 md:gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold py-3 md:py-4 px-6 md:px-8 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl text-center text-sm md:text-base"
              >
                <Brain className="w-4 h-4" />
                More Brain Teasers
            </Link>
          </div>
        </div>
      )}
      
      {/* How to Play section */}
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-3xl border border-gray-700 p-5 mt-6">
        <h3 className="font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-green-400" />
          How to Play:
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-green-400">🎯</span>
            <span>Guess the answer to the trivia question in 6 tries</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-green-400">🔍</span>
            <span>Click colored dots or &quot;Show Your Guesses&quot; to view your guesses</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-green-400">🟩</span>
            <span>Green: This attribute is exactly correct</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-yellow-400">🟨</span>
            <span>Yellow: This attribute is partially correct or related</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-gray-400">⬜</span>
            <span>Gray: This attribute is incorrect</span>
          </div>
          <div className="flex items-start gap-2 text-gray-300">
            <span className="text-blue-400">💡</span>
            <span>Use hints to narrow down your choices</span>
          </div>
        </div>
      </div>
    </div>
  );
}