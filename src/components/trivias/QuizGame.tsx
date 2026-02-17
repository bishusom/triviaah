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
import { Maximize2, Minimize2, Flame, Zap } from 'lucide-react';

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
  wrongAnswers: { question: string; correct: string; userSelected: string }[];
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
  const [streak, setStreak] = useState(0);
  const [milestone, setMilestone] = useState<string | null>(null);
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
  const [wrongAnswers, setWrongAnswers] = useState<{ question: string; correct: string; userSelected: string }[]>([]);

  const { isMuted } = useSound();
  const { width, height } = useWindowSize();

  /* ---------- Logic ---------- */
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

  useEffect(() => {
    if (!currentQuestion?.options) return;
    const arr = [...currentQuestion.options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffledOptions(arr);
  }, [currentQuestion?.id, currentQuestion?.options]);

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
    setMilestone(null);
  }, [timePerQuestion, isQuickfire, hasBonusQuestion, currentIndex, regularQuestions.length, showBonusQuestion, bonusQuestion]);

  const finishQuiz = useCallback(async (finalScore: number, finalCorrectCount: number) => {
    event({action: 'quiz_completed', category: 'quiz', label: 'quiz'});    
    setQuizResult({
      score: finalScore,
      correctCount: finalCorrectCount,
      totalQuestions: regularQuestions.length + (bonusQuestion ? 1 : 0),
      timeUsed, category, subcategory, isTimedMode, helpUsed: 0,
      wrongAnswers: wrongAnswers
    });
    setShowSummary(true);
  }, [regularQuestions.length, bonusQuestion, timeUsed, category, subcategory, isTimedMode, wrongAnswers]);

  const handleAdvance = useCallback(() => {
    const isLastRegularQuestion = currentIndex >= regularQuestions.length - 1 && !showBonusQuestion;
    const isLastBonusQuestion = showBonusQuestion;
    const finished = isLastBonusQuestion || (isLastRegularQuestion && !bonusQuestion);
    
    if (finished) finishQuiz(score, correctCount);
    else moveToNextQuestion();
  }, [currentIndex, regularQuestions.length, showBonusQuestion, bonusQuestion, finishQuiz, moveToNextQuestion, score, correctCount]);

  const handleTimeUp = useCallback(() => {
    if (showFeedback || !gameStarted) return;
    setTimeUp(true);
    setStreak(0);
    setWrongAnswers(prev => [...prev, {
      question: currentQuestion.question,
      correct: currentQuestion.correct,
      userSelected: "Time Out"
    }]);
    playSound('timeUp');
    setShowFeedback(true);
    setTitbit(currentQuestion?.titbits || 'Time\'s up!');
    if (isQuickfire) setTimeout(() => handleAdvance(), 3500);
    else setTimeout(() => setShowNextButton(true), 2000);
  }, [showFeedback, gameStarted, playSound, currentQuestion, handleAdvance, isQuickfire]);

  const handleAnswer = useCallback((option: string) => {
    if (!gameStarted || showFeedback || timeUp) return;
    
    const correct = option === currentQuestion.correct;
    const base = { easy: 100, medium: 200, hard: 300 }[currentQuestion.difficulty || 'easy'] || 100;
    
    const multiplier = correct ? Math.min(1 + streak * 0.1, 2) : 1;
    const earned = isQuickfire ? (showBonusQuestion ? 500 : base + (timeLeft || 0) * 10) : (timeLeft || 0) * 10 + 50;
    const finalEarned = Math.floor(earned * multiplier);
    
    setSelectedOption(option);
    setShowFeedback(true);
    setTitbit(currentQuestion.titbits || '');

    if (correct) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      setScore(s => s + finalEarned);
      setCorrectCount(c => c + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      playSound('correct');

      if (newStreak === 3) setMilestone("3 STREAK! 🔥");
      if (newStreak === 5) setMilestone("UNSTOPPABLE! ⚡");
      if (newStreak === 10) setMilestone("TRIVIA GOD! 👑");
    } else {
      setWrongAnswers(prev => [...prev, {
        question: currentQuestion.question,
        correct: currentQuestion.correct,
        userSelected: option
      }]);
      setStreak(0);
      playSound('incorrect');
    }
    
    if (isQuickfire) setTimeout(() => handleAdvance(), 4000);
    else setTimeout(() => setShowNextButton(true), 2000);
  }, [gameStarted, showFeedback, timeUp, currentQuestion, isQuickfire, showBonusQuestion, timeLeft, streak, playSound, handleAdvance]);

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
      } catch { } finally { setIsLoading(false); }
    };
    fetchImage();
  }, [currentQuestion, category]);

  useEffect(() => { setGameStarted(true); }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) { document.exitFullscreen(); setIsFullScreen(false); }
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[400px]"><motion.div className="w-16 h-16 border-4 border-cyan-500 border-dashed rounded-full" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} /></div>;

  if (showSummary && quizResult) return <QuizSummary result={quizResult} context={quizType || 'trivias'}onRestart={() => window.location.reload()} />;

  return (
    <div className={isFullScreen ? "fixed inset-0 z-50 bg-gray-900 overflow-y-auto p-4" : "relative max-w-4xl mx-auto p-2 sm:p-4 bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl"}>
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      
      <AnimatePresence>
        {milestone && (
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1.2, opacity: 1 }} exit={{ scale: 0, opacity: 0 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] bg-yellow-500 text-black font-black px-8 py-4 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.6)] text-2xl pointer-events-none">
            {milestone}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center mb-2">
        <button onClick={toggleFullScreen} className="p-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600">
          {isFullScreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
      </div>

      {gameStarted && currentQuestion && (
        <>
          <div className="flex justify-between items-center mb-3 p-2 bg-blue-600 rounded-lg text-white font-bold text-xs sm:text-sm">
            <span className="flex items-center gap-1">
              {showBonusQuestion ? 'BONUS ⚡' : `Q${currentIndex + 1}/${regularQuestions.length + (bonusQuestion ? 1 : 0)}`}
              {streak > 1 && <span className="ml-2 px-2 bg-orange-500 rounded-full flex items-center gap-1 animate-bounce text-[10px]"><Flame size={10} /> {streak}</span>}
            </span>
            <div className="flex gap-3 items-center">
              <span className={timeLeft <= 5 ? "text-red-300 animate-pulse" : ""}>⏱ {timeLeft}s</span>
              <div className="flex items-center gap-1 bg-black/20 px-2 py-0.5 rounded border border-white/10">
                <span>Score: <CountUp end={score} /></span>
                {streak > 1 && <span className="text-yellow-400 text-[10px]"><Zap size={10} className="inline" /> {(1 + streak * 0.1).toFixed(1)}x</span>}
              </div>
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

            <AnimatePresence>
              {showFeedback && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="mt-4 flex flex-col gap-3">
                  {titbit && <div className="bg-amber-500/10 border-l-4 border-amber-500 p-3 text-amber-100 rounded text-xs sm:text-sm italic">💡 <strong>Fun Fact:</strong> {titbit}</div>}
                  {!isQuickfire && showNextButton && (
                    <motion.button initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} onClick={handleAdvance} className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg uppercase tracking-wider animate-pulse">
                      { (currentIndex >= regularQuestions.length - 1 && !showBonusQuestion && !bonusQuestion) ? "Finish Result 🏁" : "Continue →" }
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="grid gap-2 mb-4">
            {shuffledOptions.map((opt) => {
              const status = showFeedback ? (opt === currentQuestion.correct ? 'correct' : selectedOption === opt ? 'wrong' : 'dimmed') : 'default';
              return (
                <button key={opt} disabled={showFeedback || timeUp} onClick={() => handleAnswer(opt)} className={`p-3 sm:p-4 rounded-xl text-left border-2 transition-all font-medium text-sm sm:text-base ${
                  status === 'correct' ? 'bg-green-600/40 border-green-500 text-white' :
                  status === 'wrong' ? 'bg-red-600/40 border-red-500 text-white' :
                  status === 'dimmed' ? 'bg-gray-800 border-gray-700 text-gray-400 opacity-60' :
                  'bg-gray-700 border-gray-600 text-gray-100 hover:border-cyan-500'
                }`}>
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
          <div className="relative w-full h-[70vh]"><Image src={questionImage} alt="Zoom" fill className="object-contain" unoptimized /></div>
        </div>
      )}
    </div>
  );
}