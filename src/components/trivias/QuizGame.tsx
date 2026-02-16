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

interface QuizConfig {
  isQuickfire?: boolean;
  timePerQuestion?: number;
  hasBonusQuestion?: boolean;
}

interface QuizGameProps {
  initialQuestions: Question[];
  category: string;
  subcategory?: string;
  quizConfig?: QuizConfig;
  quizType?: 'trivias' | 'daily-trivias' | 'quick-fire';
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
}: QuizGameProps) {
  
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
  const [showNextButton, setShowNextButton] = useState(false); 
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

  /* ---------- Shuffle Options ---------- */
  useEffect(() => {
    if (!currentQuestion?.options) return;
    const arr = [...currentQuestion.options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffledOptions(arr);
  }, [currentQuestion?.id, currentQuestion?.options]);

  /* ---------- Audio Setup ---------- */
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
    return () => { [correctSound, incorrectSound, timeUpSound, tickSound].forEach(s => s.current?.pause()); };
  }, []);

  const playSound = useCallback((type: 'correct' | 'incorrect' | 'timeUp' | 'tick') => {
    if (isMuted) return;
    const map = { correct: correctSound, incorrect: incorrectSound, timeUp: timeUpSound, tick: tickSound };
    map[type].current?.play();
  }, [isMuted]);

  /* ---------- Game Navigation ---------- */
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
    setShowNextButton(false);
    setTimeUp(false);
  }, [timePerQuestion, isQuickfire, hasBonusQuestion, currentIndex, regularQuestions.length, showBonusQuestion, bonusQuestion]);

  const finishQuiz = useCallback(async (finalScore: number, finalCorrectCount: number) => {
    event({action: 'quiz_completed', category: 'quiz', label: 'quiz'});    
    setQuizResult({
      score: finalScore,
      correctCount: finalCorrectCount,
      totalQuestions: regularQuestions.length + (bonusQuestion ? 1 : 0),
      timeUsed, category, subcategory, isTimedMode, helpUsed: 0
    });
    setShowSummary(true);
  }, [regularQuestions.length, bonusQuestion, timeUsed, category, subcategory, isTimedMode]);

  const handleAdvance = useCallback(() => {
    const isLastRegularQuestion = currentIndex >= regularQuestions.length - 1 && !showBonusQuestion;
    const isLastBonusQuestion = showBonusQuestion;
    const finished = isLastBonusQuestion || (isLastRegularQuestion && !bonusQuestion);
    
    if (finished) {
      finishQuiz(score, correctCount);
    } else {
      moveToNextQuestion();
    }
  }, [currentIndex, regularQuestions.length, showBonusQuestion, bonusQuestion, finishQuiz, moveToNextQuestion, score, correctCount]);

  /* ---------- Logic Handlers ---------- */
  const handleTimeUp = useCallback(() => {
    if (showFeedback || !gameStarted) return;
    setTimeUp(true);
    playSound('timeUp');
    setShowFeedback(true);
    setTitbit(currentQuestion?.titbits || 'Time\'s up!');
    
    if (isQuickfire) {
      setTimeout(() => { handleAdvance(); }, 3500);
    } else {
      setTimeout(() => { setShowNextButton(true); }, 2000);
    }
  }, [showFeedback, gameStarted, playSound, currentQuestion, handleAdvance, isQuickfire]);

  const handleAnswer = useCallback((option: string) => {
    if (!gameStarted || showFeedback || timeUp) return;
    
    const correct = option === currentQuestion.correct;
    const base = { easy: 100, medium: 200, hard: 300 }[currentQuestion.difficulty || 'easy'] || 100;
    const earned = isQuickfire ? (showBonusQuestion ? 500 : base + (timeLeft || 0) * 10) : (timeLeft || 0) * 10 + 50;
    
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
    
    if (isQuickfire) {
      setTimeout(() => { handleAdvance(); }, 4000);
    } else {
      setTimeout(() => { setShowNextButton(true); }, 2000);
    }
  }, [gameStarted, showFeedback, timeUp, currentQuestion, isQuickfire, showBonusQuestion, timeLeft, correctCount, score, playSound, handleAdvance]);

  /* ---------- Timer & Images ---------- */
  useEffect(() => {
    if (!gameStarted || timeLeft <= 0 || showFeedback) {
      if (tickSound.current) tickSound.current.pause();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timer); handleTimeUp(); return 0; }
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
        if (currentQuestion.image_url) setQuestionImage(currentQuestion.image_url);
        else {
          const img = await fetchPixabayImage(extractKeywords(currentQuestion.question)[0] || '', category);
          setQuestionImage(img || null);
        }
      } catch { /* Fail silently */ } finally { setIsLoading(false); }
    };
    fetchImage();
  }, [currentQuestion, category]);

  useEffect(() => { setGameStarted(true); }, []);

  const toggleFullScreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) { document.exitFullscreen(); setIsFullScreen(false); }
    }
  }, []);

  /* ---------- Render ---------- */
  if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><motion.div className="w-16 h-16 border-4 border-cyan-500 border-dashed rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} /></div>;

  if (showSummary && quizResult) return <QuizSummary result={quizResult} onRestart={() => window.location.reload()} context={quizType || 'trivias'} />;

  return (
    <div className={isFullScreen ? "fixed inset-0 z-50 bg-gray-900 overflow-y-auto p-4" : "relative max-w-4xl mx-auto p-2 sm:p-4 bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl"}>
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      
      <div className="flex justify-between items-center mb-2">
        <button onClick={toggleFullScreen} className="p-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600">
          {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {gameStarted && currentQuestion && (
        <>
          <div className="flex justify-between items-center mb-3 p-2 bg-blue-600 rounded-lg text-white font-bold text-xs sm:text-sm">
            <span>{showBonusQuestion ? 'BONUS' : `Q${currentIndex + 1}/${regularQuestions.length + (bonusQuestion ? 1 : 0)}`}</span>
            <div className="flex gap-3">
              <span>⏱ {timeLeft}s</span>
              <span>Score: <CountUp end={score} /></span>
            </div>
          </div>

          <motion.div key={currentQuestion.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-800 border border-gray-600 p-3 sm:p-4 rounded-xl mb-3">
            <div className={`flex flex-col sm:flex-row gap-4 ${questionImage ? 'items-start' : 'items-center justify-center text-center'}`}>
              {questionImage && (
                <div className="relative w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 mx-auto sm:mx-0">
                  <Image src={questionImage} alt="Quiz" fill className="object-cover rounded-lg border-2 border-cyan-500/20" unoptimized onClick={() => setShowImageModal(true)} />
                </div>
              )}
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-white leading-tight flex-1">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Factoid and Next Button Integrated Below Question */}
            <AnimatePresence>
              {showFeedback && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  className="mt-4 flex flex-col gap-3"
                >
                  {titbit && (
                    <div className="bg-amber-500/10 border-l-4 border-amber-500 p-3 text-amber-100 rounded text-xs sm:text-sm">
                      💡 <strong>Did you know?</strong> {titbit}
                    </div>
                  )}
                  
                  {/* Next Button appearing inside the factoid section */}
                  {!isQuickfire && showNextButton && (
                    <motion.button
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      onClick={handleAdvance}
                      className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg uppercase tracking-wider animate-pulse"
                    >
                      { (currentIndex >= regularQuestions.length - 1 && !showBonusQuestion && !bonusQuestion) 
                        ? "See Final Results" 
                        : "Next Question →" }
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Options Grid */}
          <div className="grid gap-2 mb-4">
            {shuffledOptions.map((opt) => {
              const isCorrect = opt === currentQuestion.correct;
              const isSelected = selectedOption === opt;
              const status = showFeedback ? (isCorrect ? 'correct' : isSelected ? 'wrong' : 'dimmed') : 'default';

              return (
                <button
                  key={opt}
                  disabled={showFeedback || timeUp}
                  onClick={() => handleAnswer(opt)}
                  className={`p-3 sm:p-4 rounded-xl text-left border-2 transition-all font-medium text-sm sm:text-base ${
                    status === 'correct' ? 'bg-green-600/40 border-green-500 text-white' :
                    status === 'wrong' ? 'bg-red-600/40 border-red-500 text-white' :
                    status === 'dimmed' ? 'bg-gray-800 border-gray-700 text-gray-400 opacity-60' :
                    'bg-gray-700 border-gray-600 text-gray-100 hover:border-cyan-500'
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
        </>
      )}

      {showImageModal && questionImage && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4" onClick={() => setShowImageModal(false)}>
          <div className="relative w-full h-[70vh]">
            <Image src={questionImage} alt="Zoom" fill className="object-contain" unoptimized />
          </div>
        </div>
      )}
    </div>
  );
}