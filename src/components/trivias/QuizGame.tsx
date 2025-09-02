// components/trivias/QuizGame.tsx
'use client';
import Image from 'next/image';
import { format } from 'date-fns';
import { event } from '@/lib/gtag';
import { fetchPixabayImage } from '@/lib/pixabay';
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { type Question } from '@/lib/firebase';
import QuizSummary from './QuizSummary';
import { useSound } from '@/app/context/SoundContext';
import { MdCategory, MdSubject, MdStar } from 'react-icons/md';
import CountUp from 'react-countup';
import { extractKeywords } from '@/lib/nlpKeywords';
import { useGuestSession } from '@/hooks/useGuestSession';
import SignupModal from '@/components/SignupModal';

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
  /* -------------------- Config -------------------- */
  const isQuickfire = quizConfig?.isQuickfire || category === 'quick-fire';
  const quickfireTimePerQuestion =
    quizConfig?.timePerQuestion ?? (isQuickfire ? 4 : 30);
  const hasBonusQuestion = quizConfig?.hasBonusQuestion ?? false;

  /* -------------------- Questions -------------------- */
  const [regularQuestions, setRegularQuestions] = useState<Question[]>([]);
  const [bonusQuestion, setBonusQuestion] = useState<Question | null>(null);
  const [showBonusQuestion, setShowBonusQuestion] = useState(false);

  useEffect(() => {
    if (isQuickfire && hasBonusQuestion && initialQuestions.length > 0) {
      // Last question is the bonus question
      setRegularQuestions(initialQuestions.slice(0, initialQuestions.length - 1));
      setBonusQuestion(initialQuestions[initialQuestions.length - 1]);
    } else {
      setRegularQuestions(initialQuestions);
      setBonusQuestion(null);
    }
  }, [initialQuestions, isQuickfire, hasBonusQuestion]);

  // Use regularQuestions for the main quiz, or bonus question when showing it
  const questions = showBonusQuestion && bonusQuestion ? [bonusQuestion] : regularQuestions;

  /* -------------------- Game State -------------------- */
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(
    isQuickfire ? quickfireTimePerQuestion : 30
  );
  const [showSummary, setShowSummary] = useState(false);
  const [titbit, setTitbit] = useState('');
  const [timeUsed, setTimeUsed] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [questionImage, setQuestionImage] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [imageLoadingFailed, setImageLoadingFailed] = useState(false);
  const [isFirstQuestion, setIsFirstQuestion] = useState(true); // Track first question

  /* -------------------- Current Question -------------------- */
  const currentQuestion = questions[currentIndex];
  const isTimedMode = true;

  /* -------------------- Sound Refs -------------------- */
  const correctSound = useRef<HTMLAudioElement | null>(null);
  const incorrectSound = useRef<HTMLAudioElement | null>(null);
  const timeUpSound = useRef<HTMLAudioElement | null>(null);
  const tickSound = useRef<HTMLAudioElement | null>(null);
  const { isMuted } = useSound();

  /* -------------------- Guest / Modal -------------------- */
  const [showSignupModal, setShowSignupModal] = useState(false);
  const { startNewGame, completeGame, isGuest } = useGuestSession();

  /* -------------------- Initialisation -------------------- */
  useEffect(() => {
    startNewGame();
  }, [startNewGame]);

  useEffect(() => {
    const checkGtag = setInterval(() => {
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        event({
          action: 'quiz_started',
          category,
          label: category,
          quiz_category: category.replace(/-/g, ' '),
          difficulty: initialQuestions[0]?.difficulty ?? 'unknown',
        });
        clearInterval(checkGtag);
      }
    }, 100);
    return () => clearInterval(checkGtag);
  }, [category, initialQuestions]);

  useEffect(() => {
    correctSound.current = new Audio('/sounds/correct.mp3');
    incorrectSound.current = new Audio('/sounds/incorrect.mp3');
    timeUpSound.current = new Audio('/sounds/timeout.mp3');
    tickSound.current = new Audio('/sounds/tick.mp3');
    tickSound.current.loop = true;

    return () => {
      correctSound.current?.pause();
      incorrectSound.current?.pause();
      timeUpSound.current?.pause();
      tickSound.current?.pause();
    };
  }, []);

  /* -------------------- Shuffle Options -------------------- */
  // Create a stable reference to current question options to prevent infinite loops
  const currentQuestionId = currentQuestion?.id || `${currentIndex}-${showBonusQuestion}`;
  
  useEffect(() => {
    if (currentQuestion?.options) {
      // Shuffle options only once per question change
      const shuffleArray = (array: string[]) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
      };
      setShuffledOptions(shuffleArray(currentQuestion.options));
    }
  }, [currentQuestionId, currentQuestion?.options]); // Use stable ID instead of questions array

  /* -------------------- Image Loading -------------------- */
  useEffect(() => {
    if (!currentQuestion) return;
    
    if (isFirstQuestion) {
      setIsLoading(true);
    }
    
    const loadingTimeout = setTimeout(() => {
      setIsLoading(false);
      if (isFirstQuestion) setIsFirstQuestion(false);
    }, 1500);

    const fetchImage = async () => {
      try {
        setQuestionImage(null);
        setImageLoadingFailed(false);
        
        const keywords = extractKeywords(currentQuestion.question);
        const cat = currentQuestion.category?.toLowerCase().replace(/-/g, ' ');
        
        const imageFetchPromise = (async () => {
          if (cat && keywords.length) {
            const img = await fetchPixabayImage(keywords[0], cat);
            if (img) return img;
          }
          if (cat) {
            const img = await fetchPixabayImage('', cat);
            if (img) return img;
          }
          for (const kw of keywords) {
            const img = await fetchPixabayImage(kw);
            if (img) return img;
          }
          return null;
        })();

        const timeoutPromise = new Promise<null>((resolve) => 
          setTimeout(() => resolve(null), 1000)
        );

        const image = await Promise.race([imageFetchPromise, timeoutPromise]);
        
        if (image) {
          setQuestionImage(image);
        } else {
          setImageLoadingFailed(true);
        }
      } catch (error) {
        console.error('Error fetching image:', error);
        setImageLoadingFailed(true);
      } finally {
        if (isFirstQuestion) {
          setIsLoading(false);
          setIsFirstQuestion(false);
        }
        clearTimeout(loadingTimeout);
      }
    };

    fetchImage();

    return () => clearTimeout(loadingTimeout);
  }, [currentQuestion, isFirstQuestion]);

  /* -------------------- Helpers -------------------- */
  const playSound = useCallback(
    (sound: 'correct' | 'incorrect' | 'timeUp' | 'tick') => {
      if (isMuted || showSummary) return; // Prevent sound when summary is shown
      try {
        switch (sound) {
          case 'correct':
            tickSound.current?.pause();
            correctSound.current?.play();
            break;
          case 'incorrect':
            tickSound.current?.pause();
            incorrectSound.current?.play();
            break;
          case 'timeUp':
            tickSound.current?.pause();
            timeUpSound.current?.play();
            break;
          case 'tick':
            tickSound.current?.play();
            break;
        }
      } catch (error) {
        console.error('Error playing sound:', error);
      }
    },
    [isMuted, showSummary]
  );

  /* -------------------- End-Game -------------------- */
  const handleGameComplete = useCallback(
    (finalScore: number, finalCorrectCount: number, finalTimeUsed: number) => {
      completeGame(finalScore);
      if (isGuest()) setShowSignupModal(true);
      setShowSummary(true);
      event({
        action: 'quiz_completed',
        category,
        label: category,
        value: finalScore,
      });
    },
    [completeGame, isGuest, category]
  );

  /* -------------------- Answer Logic -------------------- */
  const handleAnswer = useCallback(
    (option: string) => {
      if (!currentQuestion || showSummary) return; // Prevent if summary is shown
      const isCorrect = option === currentQuestion.correct;

      setSelectedOption(option);
      setShowFeedback(true);
      setTitbit(currentQuestion.titbits ?? '');

      let pointsEarned = 0;
      if (isCorrect) {
        if (isQuickfire) {
          if (showBonusQuestion) {
            pointsEarned = 500;
          } else {
            const base =
              currentQuestion.difficulty === 'easy'
                ? 100
                : currentQuestion.difficulty === 'medium'
                ? 200
                : 300;
            pointsEarned = base + (timeLeft ?? 0) * 10;
          }
        } else {
          pointsEarned = (timeLeft ?? 0) * 10 + 50;
        }
      }

      const newScore = score + pointsEarned;
      const newCorrectCount = isCorrect ? correctCount + 1 : correctCount;

      isCorrect ? playSound('correct') : playSound('incorrect');

      setTimeout(() => {
        const shouldShowBonus = hasBonusQuestion && 
                              !showBonusQuestion && 
                              currentIndex >= regularQuestions.length - 1;

        if (shouldShowBonus) {
          setShowBonusQuestion(true);
          setCurrentIndex(0); // Reset index for bonus
          setTimeLeft(null); // No time limit for bonus
        } 
        else if (currentIndex >= questions.length - 1) {
          handleGameComplete(newScore, newCorrectCount, timeUsed + 1);
        } 
        else {
          setCurrentIndex((p) => p + 1);
          setTimeLeft(isQuickfire && !showBonusQuestion ? quickfireTimePerQuestion : 30);
          setScore(newScore);
          setCorrectCount(newCorrectCount);
          setImageLoadingFailed(false);
        }

        setSelectedOption(null);
        setShowFeedback(false);
        setTitbit('');
      }, isQuickfire ? 1000 : 3000);
    },
    [
      currentQuestion,
      timeLeft,
      score,
      correctCount,
      playSound,
      timeUsed,
      handleGameComplete,
      isQuickfire,
      quickfireTimePerQuestion,
      showBonusQuestion,
      hasBonusQuestion,
      currentIndex,
      regularQuestions.length,
      questions.length,
      showSummary,
    ]
  );

  /* -------------------- Time-Up Logic -------------------- */
  const handleTimeUp = useCallback(() => {
    if (showSummary) return; // Prevent if summary is shown
    playSound('timeUp');
    setSelectedOption('timeout');
    setShowFeedback(true);

    setTimeout(() => {
      const shouldShowBonus = hasBonusQuestion && 
                            !showBonusQuestion && 
                            currentIndex >= regularQuestions.length - 1;

      if (shouldShowBonus) {
        setShowBonusQuestion(true);
        setCurrentIndex(0); // Reset index for bonus
        setTimeLeft(null);
      } 
      else if (currentIndex >= questions.length - 1) {
        handleGameComplete(score, correctCount, timeUsed);
      } 
      else {
        setCurrentIndex((p) => p + 1);
        setTimeLeft(isQuickfire && !showBonusQuestion ? quickfireTimePerQuestion : 30);
        setImageLoadingFailed(false);
      }

      setSelectedOption(null);
      setShowFeedback(false);
    }, 1500);
  }, [
    playSound,
    handleGameComplete,
    score,
    correctCount,
    timeUsed,
    isQuickfire,
    hasBonusQuestion,
    showBonusQuestion,
    currentIndex,
    regularQuestions.length,
    questions.length,
    quickfireTimePerQuestion,
    showSummary,
  ]);

  /* -------------------- Timer -------------------- */
  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !showFeedback && !showSummary && questions.length > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((t) => (t !== null ? t - 1 : null));
        setTimeUsed((u) => u + 1);
        if ((timeLeft ?? 999) <= 5 && !isMuted) playSound('tick');
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft !== null && (timeLeft ?? 0) === 0 && questions.length > 0) {
      handleTimeUp();
    }
  }, [timeLeft, showFeedback, showSummary, isMuted, playSound, handleTimeUp, questions.length]);

  /* -------------------- Rendering -------------------- */
  const result = useMemo(
    () => ({
      score,
      correctCount,
      totalQuestions: regularQuestions.length + (hasBonusQuestion && bonusQuestion ? 1 : 0),
      timeUsed,
      category,
      isTimedMode,
    }),
    [score, correctCount, regularQuestions.length, timeUsed, category, isTimedMode, hasBonusQuestion, bonusQuestion]
  );

  if (showSummary)
    return (
      <>
        <QuizSummary
          result={result}
          onRestart={() => {
            startNewGame();
            setCurrentIndex(0);
            setScore(0);
            setCorrectCount(0);
            setTimeLeft(isQuickfire ? quickfireTimePerQuestion : 30);
            setShowSummary(false);
            setTimeUsed(0);
            setIsLoading(true);
            setIsFirstQuestion(true);
            setShowBonusQuestion(false);
            setShowSignupModal(false);
            setImageLoadingFailed(false);
          }}
        />
        <SignupModal
          isOpen={showSignupModal}
          onClose={() => setShowSignupModal(false)}
          finalScore={score}
          category={category}
        />
      </>
    );

  if (isLoading)
    return (
      <div className="relative max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-30 -z-10"></div>
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Loading Question</h2>
          <p className="text-gray-600 text-center">
            Getting everything ready for your quiz...
          </p>
          <div className="mt-8 flex space-x-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              ></div>
            ))}
          </div>
        </div>
      </div>
    );

  if (!currentQuestion) {
    return (
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Question Error</h2>
          <p className="text-gray-600 mb-6">
            There was a problem loading this question. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg"
          >
            Reload Quiz
          </button>
        </div>
      </div>
    );
  }

  /* -------------------- UI -------------------- */
  return (
    <div className="relative max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-30 -z-10"></div>

      {isQuickfire && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-600 to-orange-500 text-white text-center py-2 font-bold">
          {showBonusQuestion
            ? '🎯 BONUS QUESTION - NO TIME LIMIT - 500 POINTS!'
            : `⚡ QUICK-FIRE - ${quickfireTimePerQuestion}s PER QUESTION ⚡`}
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6 mt-8">
        <div
          className="bg-blue-600 h-2 rounded-full transition-all duration-500"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Timer display */}
      {isQuickfire && !showBonusQuestion && timeLeft !== null && (
        <div className="mb-4 text-center">
          <div
            className={`text-2xl font-bold ${
              (timeLeft ?? 999) <= 2 ? 'text-red-600 animate-pulse' : 'text-blue-600'
            }`}
          >
            {timeLeft}s
          </div>
          <div className="text-sm text-gray-500">
            Time bonus: +{(timeLeft ?? 0) * 10} points
          </div>
        </div>
      )}

      {/* Category / difficulty badges */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap gap-2 items-center mb-2">
            {currentQuestion.category === 'today-in-history' && (
              <div className="text-xs italic text-gray-500 mt-1">
                {format(new Date(), 'MMMM do')} • {currentQuestion.year}
              </div>
            )}
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full flex items-center whitespace-nowrap">
              <MdCategory className="mr-1" size={12} />
              {currentQuestion.category.replace(/-/g, ' ')}
            </span>
            {currentQuestion.subcategory && (
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full flex items-center whitespace-nowrap">
                <MdSubject className="mr-1" size={12} />
                {currentQuestion.subcategory}
              </span>
            )}
            <span
              className={`text-xs px-2 py-1 rounded-full flex items-center whitespace-nowrap ${(() => {
                switch (currentQuestion.difficulty?.toLowerCase()) {
                  case 'easy':
                    return 'bg-green-100 text-green-800';
                  case 'medium':
                    return 'bg-yellow-100 text-yellow-800';
                  case 'hard':
                    return 'bg-red-100 text-red-800';
                  default:
                    return 'bg-gray-100 text-gray-800';
                }
              })()}`}
            >
              <MdStar className="mr-1" size={12} />
              {currentQuestion.difficulty ?? 'Unknown'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {correctCount > 1 && (
              <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs flex items-center">
                🔥 {correctCount} streak
              </div>
            )}
            {isTimedMode && !showBonusQuestion && timeLeft !== null && (
              <div className={`bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                timeLeft <= 5 ? 'bg-red-100 text-red-800 animate-pulse' : ''
              }`}>
                ⏱️ {timeLeft}s
                {timeLeft > 20 && (
                  <div className="text-xs text-green-600 mt-1 absolute">
                    +{timeLeft * 10} bonus
                  </div>
                )}
              </div>
            )}
            <div className="font-bold text-blue-600 text-lg whitespace-nowrap">
              🏆 <CountUp end={score} duration={0.5} /> pts
            </div>
          </div>
        </div>
        <div className="text-gray-600 mt-2">
          Question {currentIndex + 1} of {questions.length}
          {hasBonusQuestion && !showBonusQuestion && ` (+1 bonus)`}
          {showBonusQuestion && ` (Bonus Question)`}
        </div>
      </div>

      {/* Question & Image */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
          <div className="w-24 h-24 flex-shrink-0">
            <div
              className={`relative aspect-square w-full rounded-md overflow-hidden bg-gray-100 ${
                questionImage ? '' : 'animate-pulse'
              }`}
            >
              {questionImage ? (
                <Image
                  src={questionImage}
                  alt="Question illustration"
                  width={96}
                  height={96}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  onError={() => {
                    setQuestionImage(null);
                    setImageLoadingFailed(true);
                  }}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                  {imageLoadingFailed ? 'No image' : 'Loading image…'}
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 break-words">
              {currentQuestion.question}
            </h2>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3 mb-6">
        {shuffledOptions.map((option, i) => {
          const isCorrect = option === currentQuestion.correct;
          const isSelected = selectedOption === option;
          const showAsCorrect = showFeedback && isCorrect;

          return (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              disabled={
                showFeedback ||
                (isTimedMode && (timeLeft ?? 0) === 0 && !showBonusQuestion)
              }
              className={`
                w-full text-left p-4 rounded-lg border transition-all
                transform ${!showFeedback ? 'hover:scale-[1.02]' : ''}
                ${
                  isSelected
                    ? 'scale-[1.03] shadow-md border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }
                ${isSelected && !isCorrect ? 'border-red-500 bg-red-50' : ''}
                ${showAsCorrect ? 'border-green-500 bg-green-50' : ''}
                ${
                  isTimedMode && (timeLeft ?? 0) === 0 && !showBonusQuestion
                    ? 'opacity-70 cursor-not-allowed'
                    : ''
                }
              `}
            >
              <div className="flex justify-between items-center">
                <span>{option}</span>
                {isSelected && (
                  <span
                    className={`text-lg ${
                      isCorrect ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {isCorrect ? '✓' : '✗'}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showFeedback && (
        <div className="space-y-3">
          {titbit && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 animate-fade-in">
              <p className="text-yellow-800">{titbit}</p>
            </div>
          )}
          <div className="text-center mt-2 text-sm font-medium">
            {selectedOption === currentQuestion.correct ? (
              <span className="text-green-600">
                {['Nice!', 'Great job!', 'Perfect!', 'Brilliant!'][
                  currentIndex % 4
                ]}
              </span>
            ) : (
              <span className="text-red-600">
                Almost! The correct answer was highlighted.
              </span>
            )}
          </div>
        </div>
      )}


      {/* Confetti */}
      {showFeedback &&
        selectedOption === currentQuestion.correct &&
        [...Array(50)].map((_, i) => {
          const colors = [
            'bg-yellow-400',
            'bg-red-400',
            'bg-blue-400',
            'bg-green-400',
            'bg-purple-400',
            'bg-pink-400',
          ];
          const color = colors[Math.floor(Math.random() * colors.length)];
          const shape = Math.random() > 0.5 ? 'rounded-full' : 'rounded-sm';
          const size = Math.random() > 0.8 ? 'w-3 h-3' : 'w-2 h-2';
          return (
            <div
              key={i}
              className={`absolute ${color} ${shape} ${size} animate-confetti pointer-events-none`}
              style={{
                left: `${Math.random() * 100}%`,
                top: '100%',
                animationDelay: `${i * 0.05}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            />
          );
        })}
    </div>
  );
}