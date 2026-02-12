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
import { Maximize2, Minimize2, Home } from 'lucide-react';

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
  
  /* ---------- States ---------- */
  const [isTimedMode] = useState(true);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [regularQuestions, setRegularQuestions] = useState<Question[]>([]);
  const [bonusQuestion, setBonusQuestion] = useState<Question | null>(null);
  const [showBonusQuestion, setShowBonusQuestion] = useState(false);
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

  /* ---------- Data Initialization ---------- */
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
  const currentQuestion = questions[currentIndex];

  /* ---------- Sound Refs & Logic ---------- */
  const correctSound = useRef<HTMLAudioElement | null>(null);
  const incorrectSound = useRef<HTMLAudioElement | null>(null);
  const timeUpSound = useRef<HTMLAudioElement | null>(null);
  const tickSound = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    correctSound.current = new Audio('/sounds/correct.mp3');
    incorrectSound.current = new Audio('/sounds/incorrect.mp3');
    timeUpSound.current = new Audio('/sounds/timeout.mp3');
    tickSound.current = new Audio('/sounds/tick.mp3');
    if (tickSound.current) tickSound.current.loop = true;
    
    return () => {
      [correctSound, incorrectSound, timeUpSound, tickSound].forEach(s => s.current?.pause());
    };
  }, []);

  const playSound = useCallback((type: 'correct' | 'incorrect' | 'timeUp' | 'tick') => {
    if (isMuted) return;
    const map = { correct: correctSound, incorrect: incorrectSound, timeUp: timeUpSound, tick: tickSound };
    map[type].current?.play();
  }, [isMuted]);

  /* ---------- Navigation Logic ---------- */
  const moveToNextQuestion = useCallback(() => {
    if (isQuickfire && hasBonusQuestion && bonusQuestion && currentIndex === regularQuestions.length - 1 && !showBonusQuestion) {
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

  const finishQuiz = useCallback(async (finalScore: number, finalCorrectCount: number) => {
    event({action: 'quiz_completed', category: 'quiz', label: 'quiz'});    
    const totalQuestions = regularQuestions.length + (bonusQuestion ? 1 : 0);
    setQuizResult({
      score: finalScore,
      correctCount: finalCorrectCount,
      totalQuestions,
      timeUsed,
      category,
      subcategory,
      isTimedMode,
      helpUsed: 0
    });
    setShowSummary(true);
  }, [regularQuestions.length, bonusQuestion, timeUsed, category, subcategory, isTimedMode]);

  const handleAdvance = useCallback((currentScore: number, currentCorrect: number) => {
    const isLastRegularQuestion = currentIndex >= regularQuestions.length - 1 && !showBonusQuestion;
    const isLastBonusQuestion = showBonusQuestion;
    const finished = isLastBonusQuestion || (isLastRegularQuestion && !bonusQuestion);
    
    if (finished) {
      finishQuiz(currentScore, currentCorrect);
    } else {
      moveToNextQuestion();
    }
  }, [currentIndex, regularQuestions.length, showBonusQuestion, bonusQuestion, finishQuiz, moveToNextQuestion]);

  /* ---------- Core Game Handlers ---------- */
  const handleTimeUp = useCallback(() => {
    if (showFeedback || !gameStarted) return;
    setTimeUp(true);
    playSound('timeUp');
    setShowFeedback(true);
    setTitbit(currentQuestion?.titbits || 'Time\'s up!');
    
    // Auto-advance after timeout regardless of mode to keep flow
    setTimeout(() => {
      handleAdvance(score, correctCount);
    }, 3000);
  }, [showFeedback, gameStarted, playSound, currentQuestion, handleAdvance, score, correctCount]);

  const handleAnswer = useCallback((option: string) => {
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
    
    // Quickfire: Auto-advance after 3.5s
    // Regular: No auto-advance (UI shows Next button)
    if (isQuickfire) {
      setTimeout(() => {
        handleAdvance(newScore, newCorrectCount);
      }, 3500);
    }
  }, [gameStarted, showFeedback, timeUp, currentQuestion, isQuickfire, showBonusQuestion, timeLeft, correctCount, score, playSound, handleAdvance]);

  /* ---------- Effects (Timer, Fullscreen, Images) ---------- */
  useEffect(() => {
    if (!gameStarted || timeLeft <= 0 || showFeedback) {
      if (tickSound.current) tickSound.current.pause();
      return;
    }
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
      } catch { /* Silent fail */ } finally { setIsLoading(false); }
    };
    fetchImage();
  }, [currentQuestion, category]);

  useEffect(() => { setGameStarted(true); }, []);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  }, []);

  /* ---------- Render Logic ---------- */
  if (isLoading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <motion.div className="w-16 h-16 border-4 border-cyan-500 border-dashed rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} />
    </div>
  );

  if (showSummary && quizResult) {
    return (
      <QuizSummary 
        result={quizResult} 
        onRestart={() => {
          setShowSummary(false); setQuizResult(null); setCurrentIndex(0); setScore(0);
          setCorrectCount(0); setTimeUsed(0); setGameStarted(false); setShowBonusQuestion(false);
          setTitbit(''); setTimeLeft(timePerQuestion);
        }}
        context={quizType || 'trivias'}
      />
    );
  }

  const containerClasses = isFullScreen 
    ? "fixed inset-0 z-50 bg-gradient-to-br from-gray-900 to-gray-800 overflow-y-auto p-4"
    : "relative max-w-4xl mx-auto p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden";

  return (
    <div className={containerClasses}>
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={toggleFullScreen} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white">
          {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
        {isFullScreen && (
          <button onClick={() => window.location.href = '/'} className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white flex items-center gap-2">
            <Home size={18} /> <span className="text-sm">Home</span>
          </button>
        )}
      </div>

      {gameStarted && currentQuestion && (
        <>
          {/* Progress Header */}
          <div className="flex justify-between items-center gap-2 mb-4 p-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl border border-cyan-500/50 shadow-lg text-white">
            <div className="flex gap-2">
              <span className="bg-white/10 px-2 py-1 rounded-full text-xs font-bold">
                {showBonusQuestion ? 'BONUS' : `Q${currentIndex + 1}/${regularQuestions.length + (bonusQuestion ? 1 : 0)}`}
              </span>
              <span className="bg-white/10 px-2 py-1 rounded-full text-xs font-bold capitalize">{currentQuestion.difficulty}</span>
            </div>
            <div className="flex gap-2">
              <span className="bg-white/10 px-2 py-1 rounded-full text-xs font-bold">⏱ {timeLeft}s</span>
              <span className="bg-cyan-500 px-3 py-1 rounded-full text-xs font-bold shadow-inner"><CountUp end={score} duration={0.3} /></span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
            <motion.div className="h-full bg-cyan-500 rounded-full" animate={{ width: `${((currentIndex + (showBonusQuestion ? regularQuestions.length : 0)) / (regularQuestions.length + (bonusQuestion ? 1 : 0))) * 100}%` }} />
          </div>

          {/* Question Card */}
          <motion.div key={currentQuestion.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-gray-800/50 rounded-xl border border-gray-600 p-6 mb-4">
            <div className="flex flex-col sm:flex-row gap-6 items-center">
              {questionImage && (
                <div className="relative w-32 h-32 flex-shrink-0 cursor-pointer" onClick={() => setShowImageModal(true)}>
                  <Image src={questionImage} alt="Quiz" fill className="object-cover rounded-xl border-2 border-cyan-500/30" />
                </div>
              )}
              <h2 className="text-xl sm:text-2xl font-bold text-white leading-tight">{currentQuestion.question}</h2>
            </div>
          </motion.div>

          {/* Factoid (Titbit) */}
          <AnimatePresence>
            {showFeedback && titbit && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mb-4 p-4 bg-amber-500/10 border-l-4 border-amber-500 rounded-r-lg">
                <p className="text-amber-200 text-sm sm:text-base">💡 <span className="font-semibold">Did you know?</span> {titbit}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Options Grid */}
          <div className="grid gap-3">
            {shuffledOptions.map((opt) => {
              const isCorrect = opt === currentQuestion.correct;
              const isSelected = selectedOption === opt;
              const status = showFeedback ? (isCorrect ? 'correct' : isSelected ? 'wrong' : 'inactive') : 'default';

              return (
                <button
                  key={opt}
                  disabled={showFeedback || timeUp}
                  onClick={() => handleAnswer(opt)}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all border-2 ${
                    status === 'correct' ? 'bg-green-500/20 border-green-500 text-green-100' :
                    status === 'wrong' ? 'bg-red-500/20 border-red-500 text-red-100' :
                    status === 'inactive' ? 'bg-gray-800/50 border-gray-700 opacity-50 text-gray-400' :
                    'bg-gray-700 border-gray-600 hover:border-cyan-500 text-white'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span>{opt}</span>
                    {status === 'correct' && <span>✅</span>}
                    {status === 'wrong' && <span>❌</span>}
                  </div>
                </button>
              );
            })}
          </div>

          {/* NEXT BUTTON (Only for Regular Mode) */}
          {!isQuickfire && showFeedback && !timeUp && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handleAdvance(score, correctCount)}
              className="w-full mt-6 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              { (currentIndex >= regularQuestions.length - 1 && !showBonusQuestion && !bonusQuestion) 
                ? "Finish Quiz" 
                : "Next Question →" }
            </motion.button>
          )}

          {/* Time Up Message */}
          {timeUp && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-center text-sm font-bold">
              ⏰ Time&apos;s up! Moving on...
            </div>
          )}
        </>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/95 z-[60] flex items-center justify-center p-4" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-4xl w-full h-[80vh]">
            <Image src={questionImage!} alt="Zoom" fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
}