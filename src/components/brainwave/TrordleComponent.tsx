'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { event } from '@/lib/gtag';
import Image from 'next/image';
import { fetchPexelsImage } from '@/lib/pexels';
import styles from '@styles/Trordle.module.css';
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

// FeedbackCard component - moved outside main component
const FeedbackCard = ({ attribute, correctValue }: {
  attribute: Attribute;
  correctValue: string;
}) => {
  const hintText = getAttributeHint(attribute.name, attribute.value, attribute.status, correctValue);
  
  return (
    <div className={`${styles.trordleFeedbackCard} ${styles[`trordleFeedback${attribute.status.charAt(0).toUpperCase() + attribute.status.slice(1)}`]}`}>
      <div className={styles.trordleFeedbackHeader}>
        <div className={styles.trordleFeedbackContent}>
          <div className={styles.trordleAttributeName}>{attribute.name}</div>
          <div className={styles.trordleAttributeValue}>{attribute.value}</div>
        </div>
        <div className={`${styles.trordleStatusIcon} ${styles[attribute.status]}`}>
          {attribute.status === 'correct' ? '✓' : 
           attribute.status === 'partial' ? '~' : '✗'}
        </div>
      </div>
      <div className={styles.trordleHintText}>
        <strong>Hint:</strong> {hintText}
        {attribute.status !== 'correct' && (
          <>
            <br />
            <span className={styles.trordleHintCorrect}>
              Correct: <strong>{correctValue}</strong>
            </span>
          </>
        )}
      </div>
    </div>
  );
};

// EnhancedProgressiveHint component - moved outside main component
const EnhancedProgressiveHint = ({ attempts }: { attempts: TrordleGuessResult[] }) => {
  if (attempts.length === 0) return null;
  
  const hints = [
    {
      icon: "🎯",
      text: "Great start! Focus on the green matches.",
      color: styles.progressHintSuccess
    },
    {
      icon: "🔗",
      text: "Yellow means you're close - look for connections!",
      color: styles.progressHintWarning
    },
    {
      icon: "🤔",
      text: "Compare your guesses to find patterns.",
      color: styles.progressHintInfo
    },
    {
      icon: "🔍",
      text: "You're narrowing it down - focus on remaining attributes.",
      color: styles.progressHintFocus
    },
    {
      icon: "⚡",
      text: "Last chance! Use all clues wisely.",
      color: styles.progressHintCritical
    }
  ];
  
  const hintIndex = Math.min(attempts.length - 1, hints.length - 1);
  const currentHint = hints[hintIndex];
  
  return (
    <div className={`${styles.progressHintContainer} ${currentHint.color}`}>
      <div className={styles.progressHintContent}>
        <span className={styles.progressHintIcon}>{currentHint.icon}</span>
        <span className={styles.progressHintText}>{currentHint.text}</span>
      </div>
      
      <div className={styles.progressBar}>
        {attempts[attempts.length - 1].attributes.map((attr, i) => (
          <div
            key={i}
            className={`${styles.progressSegment} ${
              attr.status === 'correct' ? styles.progressCorrect :
              attr.status === 'partial' ? styles.progressPartial : styles.progressIncorrect
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
    <div className={styles.trordleModalOverlay} onClick={onClose}>
      <div className={styles.trordleModal} onClick={(e) => e.stopPropagation()}>
        <button 
          className={styles.trordleModalClose}
          onClick={onClose}
          aria-label="Close modal"
        >
          ✕
        </button>
        
        <div className={styles.trordleModalHeader}>
          <h3 className={styles.trordleModalTitle}>
            ❌ Wrong Guess
          </h3>
          <p className={styles.trordleModalSubtitle}>
            <strong>{result.guess}</strong>
          </p>
          <p className={styles.trordleMatchSummary}>
            {getSummaryText()} ({correctCount + partialCount} of {total} attributes)
          </p>
        </div>
        
        <div className={styles.trordleModalBody}>
          <div className="space-y-3">
            {result.attributes.map((attr, index) => {
              const correctAttribute = puzzleData.attributes[index];
              const correctValue = correctAttribute.optionValues[correctAnswer];
              
              return (
                <div key={index} className={`${styles.trordleFeedbackCard} ${styles[`trordleFeedback${attr.status.charAt(0).toUpperCase() + attr.status.slice(1)}`]}`}>
                  <div className={styles.trordleFeedbackHeader}>
                    <div className={styles.trordleFeedbackContent}>
                      <div className={styles.trordleAttributeName}>{attr.name}</div>
                      <div className={styles.trordleAttributeValue}>{attr.value}</div>
                    </div>
                    <div className={`${styles.trordleStatusIcon} ${styles[attr.status]}`}>
                      {attr.status === 'correct' ? '✓' : 
                       attr.status === 'partial' ? '~' : '✗'}
                    </div>
                  </div>
                  <div className={styles.trordleHintText}>
                    {getAttributeHint(attr.name, attr.value, attr.status, correctValue)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className={styles.trordleModalFooter}>
          <button 
            className={`${styles.trordleModalButton} continue`} 
            onClick={onClose}
          >
            Try Again
          </button>
          <button 
            className={`${styles.trordleModalButton} viewHistory`} 
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
        // ✅ No modal for correct answers - just show success message
      } else if (newAttempts.length >= 6) {
        setGameState('lost');
        playSound('lose');
        addTrordleResult(false, 6);
        event({
          action: 'trordle_lost',
          category: 'trordle',
          label: 'max_attempts'
        });
        // ✅ Show modal for final wrong guess
        setModalData(result);
        setShowModal(true);
      } else {
        // ✅ Show modal for wrong guesses
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
    
    // ✅ Use client timestamp
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
  const triesLeftColor = triesLeft >= 4 ? 'text-green-600' : triesLeft >= 2 ? 'text-amber-600' : 'text-red-600';

  const availableOptions = puzzleData.options.filter(
    option => !attempts.some(attempt => attempt.guess === option)
  );

  return (
    <div className={`${styles.trordleContainer} relative flex flex-col min-h-[calc(100vh-4rem)]`}>
      <canvas 
        ref={confettiCanvasRef} 
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-50"
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
      
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 flex-grow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg md:text-xl font-semibold">Today&apos;s Category: {puzzleData.category}</h2>
          <div className={`text-base font-bold ${triesLeftColor}`}>
            {triesLeft} {triesLeft === 1 ? 'try' : 'tries' } left
          </div>
        </div>
        
        {/* Enhanced progressive hints */}
        <EnhancedProgressiveHint attempts={attempts} />
        
        {/* Question and Image Container */}
        <div className={styles.questionImageContainer}>
          <div className={styles.questionImage}>
            <div className={`relative aspect-square w-full rounded-md overflow-hidden bg-gray-100 ${categoryImage ? '' : 'animate-pulse'}`}>
              {categoryImage ? (
                <Image 
                  src={categoryImage} 
                  alt={`${puzzleData.category} illustration`}
                  width={80}
                  height={80}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  onError={() => setCategoryImage(null)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xs">
                  {isImageLoading ? 'Loading...' : 'No image'}
                </div>
              )}
            </div>
          </div>
          <div className={styles.questionText}>
            <h3 className="text-lg font-semibold text-gray-800">{puzzleData.question}</h3>
          </div>
        </div>
        
        {/* Collapsible Attempt History */}
        {attempts.length > 0 && (
          <div className="mb-6">
            <button 
              onClick={toggleHistory}
              className="text-blue-500 hover:text-blue-700 font-semibold mb-2 text-sm md:text-base"
            >
              {showHistory ? 'Hide Guesses' : 'Show Your Guesses'}
            </button>
            
            <div className={styles.trordleAttempts}>
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  onClick={toggleHistory}
                  className={`${styles.trordleAttemptDot} ${
                    index < attempts.length 
                      ? attempts[index].isCorrect 
                        ? styles.correct 
                        : styles.used
                      : ''
                  }`}
                  title={index < attempts.length ? `Guess ${index + 1}` : 'Unused attempt'}
                />
              ))}
            </div>
            
            {showHistory && (
              <div className="space-y-3 mt-4">
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
        
        {/* Game result message */}
        {gameState === 'won' && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Congratulations! 🎉</h3>
            <p>You guessed it in {attempts.length} {attempts.length === 1 ? 'try' : 'tries'}!</p>
          </div>
        )}
        
        {gameState === 'lost' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <h3 className="font-bold text-lg mb-2">Game Over</h3>
            <p>The answer was: <strong>{puzzleData.answer}</strong></p>
          </div>
        )}
        
        {/* Sticky Answer Options */}
        {gameState === 'playing' && (
          <div className={`sticky bottom-0 bg-white border-t border-gray-200 p-4 z-10 -mx-4 md:-mx-6 -mb-4 md:-mb-6`}>
            <div className={styles.trordleGrid}>
              {availableOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => handleGuess(option)}
                  disabled={selectedOption === option}
                  className={`${styles.trordleOption} ${selectedOption === option ? styles.selected : ''} text-sm md:text-base`}
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
        <div className="mt-6 text-center bg-white rounded-lg shadow-md p-6">
          <button
            onClick={copyToClipboard}
            className="flex items-center justify-center gap-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            <MdShare /> Share Results
          </button>
          {shareMessage && (
            <div className="mt-2 text-green-600">{shareMessage}</div>
          )}
          
          <div className={styles.trordleShareGrid}>
            {attempts.flatMap(attempt => 
              attempt.attributes.map((attr, i) => (
                <div 
                  key={`${attempt.guess}-${i}`} 
                  className={`${styles.trordleShareCell} ${styles[attr.status]}`}
                >
                  {attr.status === 'correct' ? '✓' : attr.status === 'partial' ? '~' : '✗'}
                </div>
              ))
            )}
            {[...Array(6 - attempts.length)].flatMap((_, attemptIndex) => 
              [...Array(5)].map((_, attrIndex) => (
                <div key={`empty-${attemptIndex}-${attrIndex}`} className={`${styles.trordleShareCell} ${styles.incorrect}`}>
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
      <div className="bg-gray-100 rounded-lg p-4 mt-6">
        <h3 className="font-bold mb-2">How to Play:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Guess the answer to the trivia question in 6 tries</li>
          <li>Click the colored dots or &quot;Show Your Guesses&quot; to view your guesses</li>
          <li>🟩 Green: This attribute is exactly correct</li>
          <li>🟨 Yellow: This attribute is partially correct or related</li>
          <li>⬜ Gray: This attribute is incorrect</li>
        </ul>
      </div>
    </div>
  );
}