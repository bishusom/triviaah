// components/trivias/QuizGame.tsx
'use client';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { type Question } from '@/lib/firebase';
import QuizSummary from './QuizSummary';
import { useSound } from '@/app/context/SoundContext';
import CountUp from 'react-countup';
import { extractKeywords } from '@/lib/nlpKeywords';
import { useGuestSession } from '@/hooks/useGuestSession';
import { useUser } from '@/context/UserContext';
import SignupModal from '@/components/SignupModal';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

interface QuizConfig {
  isQuickfire?: boolean;
  timePerQuestion?: number;
  hasBonusQuestion?: boolean;
}

export default function QuizGame({
  initialQuestions,
  category,
  quizConfig,
}: {
  initialQuestions: Question[];
  category: string;
  quizConfig?: QuizConfig;
}) {
  /* ---------- Config ---------- */
  const isQuickfire = quizConfig?.isQuickfire || category === 'quick-fire';
  const timePerQuestion = isQuickfire ? 15 : 30; // 15s for quick-fire, 30s for regular
  const hasBonusQuestion = quizConfig?.hasBonusQuestion ?? false;

  const { user, login } = useUser();
  /* ---------- Data slicing ---------- */
  const [regularQuestions, setRegularQuestions] = useState<Question[]>([]);
  const [bonusQuestion, setBonusQuestion] = useState<Question | null>(null);
  const [showBonusQuestion, setShowBonusQuestion] = useState(false);

  useEffect(() => {
    if (isQuickfire && hasBonusQuestion && initialQuestions.length) {
      setRegularQuestions(initialQuestions.slice(0, -1));
      setBonusQuestion(initialQuestions[initialQuestions.length - 1]);
    } else {
      setRegularQuestions(initialQuestions);
    }
  }, [initialQuestions, isQuickfire, hasBonusQuestion]);

  const questions = showBonusQuestion && bonusQuestion ? [bonusQuestion] : regularQuestions;

  /* ---------- Game state ---------- */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(timePerQuestion);
  const [showSummary, setShowSummary] = useState(false);
  const [titbit, setTitbit] = useState('');
  const [timeUsed, setTimeUsed] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [questionImage, setQuestionImage] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [imageLoadingFailed, setImageLoadingFailed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [scoreAlreadySaved, setScoreAlreadySaved] = useState(false);
  const [timeUp, setTimeUp] = useState(false);

  const [imgKey, setImgKey] = useState(0);

  /* ---------- Hooks ---------- */
  const { isMuted } = useSound();
  const { startNewGame, completeGame, isGuest } = useGuestSession();
  const { width, height } = useWindowSize();

  useEffect(() => { startNewGame(); }, [startNewGame]);

  /* ---------- Handle game completion ---------- */
  useEffect(() => {
    if (showSummary) {
      if (isGuest() && !scoreAlreadySaved) {
        setShowSignupModal(true);
      } else if (!isGuest()) {
        saveScore(user?.name || 'User');
      }
    }
  }, [showSummary, isGuest, scoreAlreadySaved, user]);

  /* ---------- Save score function ---------- */
  const saveScore = async (playerName: string) => {
    if (scoreAlreadySaved) return;
    
    try {
      await fetch('/api/highscores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: playerName, 
          score, 
          category 
        }),
      });
      setScoreAlreadySaved(true);
    } catch (error) {
      console.error('Failed to save score:', error);
    }
  };

  /* ---------- Handle signup modal actions ---------- */
  const handleGuestSave = async (guestName: string) => {
    await saveScore(guestName);
    setShowSignupModal(false);
    
    if (user?.isGuest) {
      login({ ...user, name: guestName, isGuest: false });
    }
  };

  const handleModalClose = () => {
    setShowSignupModal(false);
  };

  /* ---------- Sound refs ---------- */
  const correctSound = useRef<HTMLAudioElement | null>(null);
  const incorrectSound = useRef<HTMLAudioElement | null>(null);
  const timeUpSound = useRef<HTMLAudioElement | null>(null);
  const tickSound = useRef<HTMLAudioElement | null>(null);

  /* ---------- Helpers ---------- */
  const currentQuestion = questions[currentIndex];
  const isTimedMode = true;

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
      if (isMuted) return;
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

  /* ---------- Shuffle options ---------- */
  useEffect(() => {
    if (!currentQuestion?.options) return;
    const arr = [...currentQuestion.options];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setShuffledOptions(arr);
  }, [currentQuestion?.id]);

  /* ---------- Image ---------- */
  useEffect(() => {
    if (!currentQuestion) return;
    const fetchImage = async () => {
      setQuestionImage(null);
      setImageLoadingFailed(false);
      try {
        const { fetchPixabayImage } = await import('@/lib/pixabay');
        const img = await fetchPixabayImage(extractKeywords(currentQuestion.question)[0] || '', category);
        setQuestionImage(img || null);
      } catch {
        setImageLoadingFailed(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImage();
  }, [currentQuestion?.id]);

  useEffect(() => {
    setImgKey(prev => prev + 1);
  }, [currentQuestion?.id]);

  /* ---------- Timer ---------- */
  useEffect(() => {
    if (timeLeft <= 0 || showFeedback || showSummary) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // Time's up!
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
  }, [timeLeft, showFeedback, showSummary, playSound]);

  const handleTimeUp = useCallback(() => {
    if (showFeedback || showSummary) return;
    
    setTimeUp(true);
    playSound('timeUp');
    setShowFeedback(true);
    setTitbit(currentQuestion?.titbits || 'Time\'s up! No points awarded.');
    
    // Show correct answer
    setSelectedOption(null);
    
    setTimeout(() => {
      const finished = currentIndex >= questions.length - 1;
      if (finished) {
        completeGame(score);
        setShowSummary(true);
      } else {
        moveToNextQuestion();
      }
    }, 2000);
  }, [currentQuestion, currentIndex, questions.length, score, showFeedback, showSummary, playSound]);

  const moveToNextQuestion = () => {
    setCurrentIndex(i => i + 1);
    setTimeLeft(timePerQuestion);
    setSelectedOption(null);
    setShowFeedback(false);
    setTimeUp(false);
  };

  /* ---------- Answer & next ---------- */
  const handleAnswer = useCallback(
    (option: string) => {
      if (showFeedback || showSummary || timeUp) return;
      
      const correct = option === currentQuestion.correct;
      const base = { easy: 100, medium: 200, hard: 300 }[currentQuestion.difficulty || 'easy'] || 100;
      const earned = isQuickfire
        ? (showBonusQuestion ? 500 : base + (timeLeft || 0) * 10)
        : (timeLeft || 0) * 10 + 50;
      
      setSelectedOption(option);
      setShowFeedback(true);
      setTitbit(currentQuestion.titbits || '');

      if (correct) {
        setScore(s => s + earned);
        setCorrectCount(c => c + 1);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 2000);
        playSound('correct');
      } else {
        playSound('incorrect');
      }
      
      setTimeout(() => {
        const finished = currentIndex >= questions.length - 1;
        if (finished) {
          completeGame(score + (correct ? earned : 0));
          setShowSummary(true);
        } else {
          moveToNextQuestion();
        }
      }, 1500);
    },
    [currentQuestion, timeLeft, score, showSummary, playSound, timeUp]
  );

  /* ---------- Progress segments ---------- */
  const progressSegments = Array.from({ length: 10 }, (_, i) => {
    const segmentIndex = i;
    const isCurrent = currentIndex === segmentIndex;
    const isPast = currentIndex > segmentIndex;
    const isCorrect = isPast && correctCount > segmentIndex;
    
    return {
      index: segmentIndex,
      isCurrent,
      isPast,
      isCorrect,
      color: isCurrent ? 'bg-blue-500' : 
             isPast ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-300'
    };
  });

  /* ---------- Summary ---------- */
  if (showSummary) {
    return (
      <>
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={120}
            gravity={0.1}
            initialVelocityY={-15}
            initialVelocityX={{ min: -10, max: 10 }}
          />
        )}
        <QuizSummary
          result={{
            score,
            correctCount,
            totalQuestions: questions.length,
            timeUsed,
            category,
            isTimedMode,
          }}
          onRestart={() => window.location.reload()}
          scoreAlreadySaved={scoreAlreadySaved}
        />
        <SignupModal
          isOpen={showSignupModal}
          onClose={handleModalClose}
          onGuestSave={handleGuestSave}
          finalScore={score}
          category={category}
        />
      </>
    );
  }

  /* ---------- Loading ---------- */
  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          className="w-16 h-16 border-4 border-blue-600 border-dashed rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        />
      </div>
    );

  /* ---------- Render quiz ---------- */
  return (
    <div className="relative max-w-3xl mx-auto p-4 md:p-6 bg-white rounded-2xl shadow-2xl overflow-hidden">
      {showConfetti && <Confetti width={width} height={height} recycle={false} />}
      
      {/* Question header */}
      <div className="flex justify-between items-center mb-6 bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="bg-white px-3 py-1 rounded-full shadow-sm border">
            <span className="text-sm font-semibold text-gray-700">
              Q{currentIndex + 1}/{questions.length}
            </span>
          </div>
          <div className="bg-white px-3 py-1 rounded-full shadow-sm border">
            <span className="text-sm font-semibold text-gray-700 capitalize">
              {currentQuestion.difficulty || 'easy'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="bg-white px-3 py-1 rounded-full shadow-sm border">
            <span className="text-sm font-semibold text-blue-600">
              ⏱ {timeLeft}s
            </span>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-3 py-1 rounded-full shadow-md">
            <span className="text-sm font-semibold text-white">
              <CountUp end={score} duration={0.3} />
            </span>
          </div>
        </div>
      </div>

      {/* Progress segments */}
      <div className="flex gap-1 mb-6">
        {Array.from({ length: questions.length }, (_, i) => {
          const isCurrent = currentIndex === i;
          const isPast = currentIndex > i;
          const isCorrect = isPast && correctCount > i;
          const isBonus = hasBonusQuestion && i === questions.length - 1;
          
          return (
            <div
              key={i}
              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                isCurrent ? 'bg-blue-500 animate-pulse' : 
                isPast ? (isCorrect ? 'bg-green-500' : 'bg-red-500') : 'bg-gray-300'
              } ${isBonus ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}`}
              title={isBonus ? 'Bonus Question' : `Question ${i + 1}`}
            />
          );
        })}
      </div>

      {/* Timer */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-blue-600">
            <CountUp end={score} duration={0.3} />
          </span>
        </div>
        <div className="flex items-center gap-2">
          <motion.div
            className={`font-mono text-lg font-bold ${
              timeLeft <= 5 ? 'text-red-600 animate-pulse' : 'text-blue-600'
            }`}
          >
            ⏱ {timeLeft}s
          </motion.div>
        </div>
      </div>

      {/* Question & Image */}
      <motion.div
        key={currentQuestion.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex gap-4 mb-4">
          {questionImage && (
            <Image
              src={questionImage}
              alt="question"
              width={96}
              height={96}
              className="rounded-lg object-cover flex-shrink-0"
            />
          )}
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            {currentQuestion.question}
          </h2>
        </div>
      </motion.div>

      {/* Options */}
      <div className="space-y-3">
        <AnimatePresence>
          {shuffledOptions.map((opt, idx) => {
            const correct = opt === currentQuestion.correct;
            const selected = selectedOption === opt;
            const showCorrect = showFeedback && correct;
            const bg = selected
              ? correct
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
              : showCorrect
              ? 'bg-green-200 text-green-900'
              : timeUp && correct
              ? 'bg-green-200 text-green-900 border-2 border-green-500'
              : 'bg-slate-100 hover:bg-slate-200';
            
            return (
              <motion.button
                key={opt}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.1 }}
                disabled={showFeedback || timeUp}
                whileHover={{ scale: showFeedback || timeUp ? 1 : 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleAnswer(opt)}
                className={`w-full text-left p-4 rounded-lg border transition-all ${bg} ${
                  (showFeedback || timeUp) && correct ? 'ring-2 ring-green-500' : ''
                }`}
              >
                {opt}
                {selected && (
                  <span className="ml-2">
                    {correct ? '✅' : '❌'}
                  </span>
                )}
                {timeUp && correct && !selected && (
                  <span className="ml-2">✅</span>
                )}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Titbit */}
      {showFeedback && titbit && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 text-sm text-yellow-800"
        >
          {titbit}
        </motion.div>
      )}

      {/* Time up message */}
      {timeUp && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 bg-red-50 border-l-4 border-red-400 p-3 text-sm text-red-800"
        >
          ⏰ Time&apos;s up! No points awarded for this question.
        </motion.div>
      )}
    </div>
  );
}