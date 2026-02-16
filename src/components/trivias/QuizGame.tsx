// components/trivias/QuizGame.tsx (Simplified without Premium Features)
'use client';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import Confetti from 'react-confetti';
import { useState, useEffect, useRef, useCallback } from 'react';
import { type Question } from '@/lib/supabase';
import { event } from '@/lib/gtag';
import { extractKeywords } from '@/lib/nlpKeywords';
import { fetchPixabayImage } from '@/lib/pixabay';
import { useSound } from '@/context/SoundContext';
import useWindowSize from 'react-use/lib/useWindowSize';
import QuizSummary from '@/components/trivias/QuizSummary';
import { Maximize2, Minimize2, Home, Clock } from 'lucide-react';

interface QuizGameProps {
  initialQuestions: Question[];
  category: string;
  subcategory?: string;
  quizConfig?: QuizConfig;
  quizType?: 'trivias' | 'daily-trivias' | 'quick-fire';
}

interface QuizConfig {
  isQuickfire?: boolean;
  timePerQuestion?: number;
  hasBonusQuestion?: boolean;
}

interface QuizResult {
  score: number;
  correctCount: number;
  totalQuestions: number;
  timeUsed: number;
  category: string;
  subcategory?: string;
  isTimedMode: boolean;
  helpUsed: number;
}

export default function QuizGame({
  initialQuestions,
  category,
  subcategory,
  quizConfig,
  quizType
}: QuizGameProps){
  
  /* ---------- Config ---------- */
  const isQuickfire = quizConfig?.isQuickfire || category === 'quick-fire';
  const timePerQuestion = isQuickfire ? 10 : 30;
  const hasBonusQuestion = quizConfig?.hasBonusQuestion ?? (category === 'quick-fire');
  
  /* ---------- Game is always timed ---------- */
  const [isTimedMode] = useState(true);

  /* ---------- Full Screen State ---------- */
  const [isFullScreen, setIsFullScreen] = useState(false);

  /* ---------- Data slicing ---------- */
  const [regularQuestions, setRegularQuestions] = useState<Question[]>([]);
  const [bonusQuestion, setBonusQuestion] = useState<Question | null>(null);
  const [showBonusQuestion, setShowBonusQuestion] = useState(false);

  useEffect(() => {
    if (isQuickfire && hasBonusQuestion && initialQuestions.length >= 6) {
      setRegularQuestions(initialQuestions.slice(0, 6));
      setBonusQuestion(initialQuestions[6]);
    } else {
      setRegularQuestions(initialQuestions);
      setBonusQuestion(null);
    }
    
    setIsLoading(false);
  }, [initialQuestions, isQuickfire, hasBonusQuestion]);

  const questions = showBonusQuestion && bonusQuestion ? [bonusQuestion] : regularQuestions;

  /* ---------- Game state ---------- */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(timePerQuestion);
  const [titbit, setTitbit] = useState('');
  const [timeUsed, setTimeUsed] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [questionImage, setQuestionImage] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  /* ---------- Hooks ---------- */
  const { isMuted } = useSound();
  const { width, height } = useWindowSize();

  /* ---------- Full Screen Toggle ---------- */
  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.log(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  /* ---------- Start Game ---------- */
  useEffect(() => {
    setGameStarted(true);
  }, []);

  /* ---------- Sound refs ---------- */
  const correctSound = useRef<HTMLAudioElement | null>(null);
  const incorrectSound = useRef<HTMLAudioElement | null>(null);
  const timeUpSound = useRef<HTMLAudioElement | null>(null);
  const tickSound = useRef<HTMLAudioElement | null>(null);

  /* ---------- Helpers ---------- */
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    correctSound.current = new Audio('/sounds/correct.mp3');
    incorrectSound.current = new Audio('/sounds/incorrect.mp3');
    timeUpSound.current = new Audio('/sounds/timeout.mp3');
    tickSound.current = new Audio('/sounds/tick.mp3');
    tickSound.current.loop = true;
    return () => {
      [correctSound, incorrectSound, timeUpSound, tickSound].forEach(s => s.current?.pause());
    };
  }, []);

  const playSound = useCallback(
    (type: 'correct' | 'incorrect' | 'timeUp' | 'tick') => {
      if (isMuted) {
        if (type === 'tick' && tickSound.current) {
          tickSound.current.pause();
          tickSound.current.currentTime = 0;
        }
        return;
      }
      const map = {
        correct: correctSound,
        incorrect: incorrectSound,
        timeUp: timeUpSound,
        tick: tickSound,
      };
      map[type].current?.play();
    },
    [isMuted]
  );

  useEffect(() => {
    if (isMuted && tickSound.current) {
      tickSound.current.pause();
      tickSound.current.currentTime = 0;
    }
  }, [isMuted]);

  /* ---------- Move to next question function ---------- */
  const moveToNextQuestion = useCallback(() => {
    if (isQuickfire && hasBonusQuestion && bonusQuestion && 
        currentIndex === regularQuestions.length - 1 && 
        !showBonusQuestion) {
      setShowBonusQuestion(true);
      setCurrentIndex(0);
    } else {
      setCurrentIndex(i => i + 1);
    }
    setTimeLeft(timePerQuestion);
    setSelectedOption(null);
    setShowFeedback(false);
    setTimeUp(false);
  }, [timePerQuestion, isQuickfire, hasBonusQuestion, currentIndex, regularQuestions.length, showBonusQuestion, bonusQuestion]);

  /* ---------- Analytics ---------- */
  useEffect(() => {
    if (!gameStarted) return;
    
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({action: 'quiz_started', category: 'quiz', label: 'quiz'});
        clearInterval(checkGtag);
      }
    }, 100);

    return () => clearInterval(checkGtag);
  }, [gameStarted]);

  /* ---------- Shuffle options ---------- */
  useEffect(() => {
    if (!currentQuestion?.options || !gameStarted) return;
    const arr = [...currentQuestion.options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffledOptions(arr);
  }, [currentQuestion?.id, currentQuestion?.options, gameStarted]);

  /* ---------- Image ---------- */
  useEffect(() => {
    if (!currentQuestion) return;
    const fetchImage = async () => {
      setQuestionImage(null);
      try {
        if (currentQuestion.image_url) {
          setQuestionImage(currentQuestion.image_url);
        } else {
          const img = await fetchPixabayImage(extractKeywords(currentQuestion.question)[0] || '', category);
          setQuestionImage(img || null);
        }
      } catch {
        // Silently fail if image can't be loaded
      } finally {
        setIsLoading(false);
      }
    };
    fetchImage();
  }, [currentQuestion, category]);

  /* ---------- Close image modal ---------- */
  useEffect(() => {
    setShowImageModal(false);
  }, [currentQuestion?.id, showFeedback, timeUp]);

  /* ---------- Enhanced Finish Quiz Logic ---------- */
  const finishQuiz = useCallback(async (finalScore: number, finalCorrectCount: number) => {
    event({action: 'quiz_completed', category: 'quiz', label: 'quiz'});    
    
    const totalQuestions = regularQuestions.length + (bonusQuestion ? 1 : 0);
    const quizResult = {
      score: finalScore,
      correctCount: finalCorrectCount,
      totalQuestions,
      timeUsed,
      category,
      subcategory,
      isTimedMode,
      helpUsed: 0 // Always 0 since premium features are removed
    };
    
    setQuizResult(quizResult);
    setShowSummary(true);
  }, [regularQuestions.length, bonusQuestion, timeUsed, category, subcategory]);

  /* ---------- Updated handleTimeUp callback ---------- */
  const handleTimeUp = useCallback(() => {
  if (showFeedback || !gameStarted) return;
  
  setTimeUp(true);
  playSound('timeUp');
  setShowFeedback(true);
  setTitbit(currentQuestion?.titbits || 'Time\'s up! No points awarded.');
  
  setSelectedOption(null);
  
  setTimeout(() => {
    const isLastRegularQuestion = currentIndex >= regularQuestions.length - 1 && !showBonusQuestion;
    const isLastBonusQuestion = showBonusQuestion;
    const finished = isLastBonusQuestion || (isLastRegularQuestion && !bonusQuestion);
    
    if (finished) {
      finishQuiz(score, correctCount);
    } else {
      moveToNextQuestion();
    }
  }, 2000);
  }, [currentQuestion, currentIndex, regularQuestions.length, showBonusQuestion, bonusQuestion, score, showFeedback, playSound, moveToNextQuestion, gameStarted, correctCount, finishQuiz]);

  /* ---------- Timer ---------- */
  useEffect(() => {
    if (!gameStarted || timeLeft <= 0 || showFeedback) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
      setTimeUsed(u => u + 1);
      
      if (timeLeft <= 5) playSound('tick');
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showFeedback, playSound, gameStarted, handleTimeUp]);

  /* ---------- Answer & next ---------- */
  const handleAnswer = useCallback(
    (option: string) => {
      if (!gameStarted || showFeedback || timeUp) return;
      
      const correct = option === currentQuestion.correct;
      const base = { easy: 100, medium: 200, hard: 300 }[currentQuestion.difficulty || 'easy'] || 100;
      const earned = isQuickfire
        ? (showBonusQuestion ? 500 : base + (timeLeft || 0) * 10)
        : (timeLeft || 0) * 10 + 50;
      
      setSelectedOption(option);
      setShowFeedback(true);
      setTitbit(currentQuestion.titbits || '');

      const newCorrectCount = correct ? correctCount + 1 : correctCount;
      const newScore = correct ? score + earned : score;

      if (correct) {
        setScore(newScore);
        setCorrectCount(newCorrectCount);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
        playSound('correct');
      } else {
        playSound('incorrect');
      }
      
      setTimeout(() => {
        const isLastRegularQuestion = currentIndex >= regularQuestions.length - 1 && !showBonusQuestion;
        const isLastBonusQuestion = showBonusQuestion;
        const finished = isLastBonusQuestion || (isLastRegularQuestion && !bonusQuestion);
        
        if (finished) {
          event({action: 'quiz_completed', category: 'quiz', label: 'quiz'});
          finishQuiz(newScore, newCorrectCount);
        } else {
          moveToNextQuestion();
        }
      }, 3500);
    },
    [currentQuestion, timeLeft, score, playSound, timeUp, isQuickfire, showBonusQuestion, moveToNextQuestion, currentIndex, regularQuestions.length, bonusQuestion, gameStarted, showFeedback, correctCount, finishQuiz]
  );

  /* ---------- Loading ---------- */
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          className="w-16 h-16 border-4 border-cyan-500 border-dashed rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      </div>
    );

  /* ---------- Render quiz or summary ---------- */
  if (showSummary && quizResult) {
    return (
      <QuizSummary 
        result={quizResult} 
        onRestart={() => {
          setShowSummary(false);
          setQuizResult(null);
          setCurrentIndex(0);
          setScore(0);
          setCorrectCount(0);
          setTimeUsed(0);
          setGameStarted(false);
        }}
        context={quizType || 'trivias'}
      />
    );
  }

  /* ---------- Container Classes ---------- */
  const containerClasses = isFullScreen 
    ? "fixed inset-0 z-50 bg-gradient-to-br from-gray-900 to-gray-800 overflow-y-auto"
    : "relative max-w-4xl mx-auto p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden";

  /* ---------- Render quiz ---------- */
  return (
    <div className={containerClasses}>
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      
      {/* Full Screen Controls */}
      {gameStarted && currentQuestion && (
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            {!isFullScreen && (
              <button
                onClick={toggleFullScreen}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                title="Enter Full Screen"
              >
                <Maximize2 size={20} />
              </button>
            )}
            {isFullScreen && (
              <button
                onClick={toggleFullScreen}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors"
                title="Exit Full Screen"
              >
                <Minimize2 size={20} />
              </button>
            )}
          </div>
          
          {isFullScreen && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.location.href = '/'}
                className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition-colors flex items-center gap-2"
                title="Go Home"
              >
                <Home size={18} />
                <span className="text-sm">Home</span>
              </button>
            </div>
          )}
        </div>
      )}
      
      {!gameStarted && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-300 mb-4">
              Preparing your quiz...
            </div>
            <motion.div
              className="w-16 h-16 border-4 border-cyan-500 border-dashed rounded-full mx-auto"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            />
          </div>
        </div>
      )}
      
      {gameStarted && currentQuestion && (
        <>
          {/* Compact Header with progress and score - Mobile optimized */}
          <div className="flex flex-wrap justify-between items-center gap-2 mb-4 p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl border border-cyan-500/50 shadow-lg">
            {/* Top row on mobile, left on desktop */}
            <div className="flex items-center gap-2 order-1 sm:order-1">
              <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                <span className="text-xs font-semibold text-white">
                  {showBonusQuestion 
                    ? `Bonus/${regularQuestions.length + 1}` 
                    : `Q${currentIndex + 1}/${regularQuestions.length + (bonusQuestion ? 1 : 0)}`
                  }
                </span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                <span className="text-xs font-semibold text-white capitalize">
                  {currentQuestion.difficulty || 'easy'}
                </span>
              </div>
            </div>
            
            {/* Bottom row on mobile, right on desktop */}
            <div className="flex items-center gap-2 order-2 sm:order-2">
              <div className="bg-white/10 backdrop-blur-sm px-2 py-1 rounded-full border border-white/20">
                <span className="text-xs font-semibold text-white">
                  ⏱ {timeLeft}s
                </span>
              </div>
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1 rounded-full shadow-lg border border-cyan-400/50 min-w-[70px] text-center">
                <span className="text-xs font-semibold text-white">
                  <CountUp end={score} duration={0.3} />
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4 overflow-hidden">
            <motion.div 
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((currentIndex + (showBonusQuestion ? regularQuestions.length : 0)) / (regularQuestions.length + (bonusQuestion ? 1 : 0))) * 100}%` 
              }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          {/* Question card */}
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-gray-750 to-gray-800 rounded-xl border border-gray-600 p-4 sm:p-6 mb-4"
          >
            {/* Question & Image */}
            <div className={`flex flex-col sm:flex-row gap-4 ${questionImage ? 'items-start' : 'items-center'}`}>
              {questionImage && (
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div 
                    className="w-24 h-24 sm:w-32 sm:h-32 cursor-pointer hover:scale-105 transition-transform relative rounded-xl overflow-hidden border-2 border-cyan-500/50 group"
                    onClick={() => setShowImageModal(true)}
                  >
                    <Image
                      src={questionImage || '/placeholder-image.jpg'}
                      alt="Click to enlarge"
                      width={128}
                      height={128}
                      className="w-full h-full object-cover"
                      unoptimized={true}
                      onError={() => console.log('🔴 Image failed to load')}
                    />
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 text-center cursor-pointer hover:text-cyan-400 transition-colors block mt-1" onClick={() => setShowImageModal(true)}>
                    Click to magnify
                  </span>
                </div>
              )}         
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white flex-1 leading-relaxed">
                {currentQuestion.question}
              </h2>  
            </div>
          </motion.div>

          {/* Image Modal */}
          {showImageModal && questionImage && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
              onClick={() => setShowImageModal(false)}
            >
              <div className="relative max-w-4xl max-h-[90vh] w-full">
                <button
                  onClick={() => setShowImageModal(false)}
                  className="absolute -top-12 right-0 bg-cyan-600 hover:bg-cyan-700 rounded-full p-2 sm:p-3 shadow-lg transition-colors z-10"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <Image
                  src={questionImage}
                  alt="Question image enlarged"
                  width={800}
                  height={600}
                  className="w-full h-full object-contain rounded-xl"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Titbit */}
          {showFeedback && titbit && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mb-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-l-4 border-amber-400 p-3 text-amber-100 rounded-r-lg text-sm"
            >
              💡 {titbit}
            </motion.div>
          )}

          {/* Options */}
          <div className="grid gap-3 mb-4">
            <AnimatePresence>
              {shuffledOptions.map((opt, idx) => {
                const correct = opt === currentQuestion.correct;
                const selected = selectedOption === opt;
                const showCorrect = showFeedback && correct;
                const bg = selected
                  ? correct
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg'
                  : showCorrect
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-100 border-2 border-green-500'
                  : timeUp && correct
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-100 border-2 border-green-500'
                  : 'bg-gradient-to-br from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white border border-gray-600 hover:border-cyan-500/50';
                
                return (
                  <motion.button
                    key={opt}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ delay: idx * 0.1 }}
                    disabled={showFeedback || timeUp}
                    whileHover={{ scale: showFeedback || timeUp ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleAnswer(opt)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-300 font-medium text-base sm:text-lg ${bg} ${
                      (showFeedback || timeUp) && correct ? 'ring-2 ring-green-400' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="break-words">{opt}</span>
                      {selected && (
                        <span className="text-lg sm:text-xl flex-shrink-0 ml-2">
                          {correct ? '✅' : '❌'}
                        </span>
                      )}
                      {timeUp && correct && !selected && (
                        <span className="text-lg sm:text-xl flex-shrink-0 ml-2">✅</span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-4">
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 px-3 py-1.5 rounded-full shadow-lg border border-cyan-400/50">
              <span className="text-xs font-semibold text-white capitalize">
                {category.replace(/-/g, ' ')}
              </span>
            </div>
            
            {currentQuestion.subcategory && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1.5 rounded-full shadow-lg border border-purple-400/50">
                <span className="text-xs font-semibold text-white capitalize">
                  {currentQuestion.subcategory}
                </span>
              </div>
            )}
          </div>

          {/* Time up message */}
          {timeUp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-red-500/20 to-pink-500/20 border-l-4 border-red-400 p-3 text-red-100 rounded-r-lg text-sm"
            >
              ⏰ Time&apos;s up! No points awarded for this question.
            </motion.div>
          )}
        </>
      )}
    </div>
  );
}