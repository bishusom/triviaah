'use client';
import { event } from '@/lib/gtag';
import { useState, useEffect, useRef } from 'react';
import { type Question } from '@/lib/firebase';
import QuizSummary from './QuizSummary';
import { useSound } from '@/app/context/SoundContext';
import { MdCategory, MdSubject, MdStar } from 'react-icons/md';

export default function QuizGame({ 
  initialQuestions,
  category 
}: {
  initialQuestions: Question[];
  category: string;
}) {
  
  const [questions] = useState(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // Time per question
  const [showSummary, setShowSummary] = useState(false);
  const [titbit, setTitbit] = useState('');
  const [timeUsed, setTimeUsed] = useState(0); // Total time used in seconds
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [isTimedMode, setIsTimedMode] = useState(true); // Add timed mode state
  const [correctCount, setCorrectCount] = useState(0);
  
  const correctSound = useRef<HTMLAudioElement | null>(null);
  const incorrectSound = useRef<HTMLAudioElement | null>(null);
  const timeUpSound = useRef<HTMLAudioElement | null>(null);
  const tickSound = useRef<HTMLAudioElement | null>(null);

  const { isMuted } = useSound();

  useEffect(() => {
      event({
        action: 'quiz_started',
        category: category,
        label: category,
        quiz_category: category.replace(/-/g, ' '),
        difficulty: initialQuestions[0]?.difficulty || 'unknown'
      });
    }, [category]);

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

  // Shuffle options when question changes
  useEffect(() => {
    if (questions[currentIndex]) {
      setShuffledOptions([...questions[currentIndex].options].sort(() => Math.random() - 0.5));
    }
  }, [currentIndex, questions]);

  useEffect(() => {
    if (timeLeft > 0 && !showFeedback && !showSummary) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        setTimeUsed(prev => prev + 1);
        
        // Play tick sound when time is running low
        if (timeLeft <= 5 && !isMuted && isTimedMode) {
          tickSound.current?.play().catch(e => console.error('Error playing tick sound:', e));
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isTimedMode) {
      handleTimeUp();
    }
  }, [timeLeft, showFeedback, isMuted, isTimedMode]);

  const playSound = (sound: 'correct' | 'incorrect' | 'timeUp' | 'tick') => {
    if (isMuted) return;
    try {
      switch(sound) {
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
  };

  const handleAnswer = (option: string) => {
    const isCorrect = option === questions[currentIndex].correct;
    setSelectedOption(option);
    setShowFeedback(true);
    setTitbit(questions[currentIndex].titbits || '');

    // Calculate score based on time left (if timed mode)
    if (isCorrect) {
      const points = isTimedMode ? (timeLeft * 10 + 50) : 100;
      setScore(score + points);
      setCorrectCount(prev => prev + 1); 
      playSound('correct');
    } else {
      playSound('incorrect');
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setTimeLeft(30);
      } else {
        event({
          action: 'quiz_completed', 
          category: category,
          label: category,
          value: score
        });
        setShowSummary(true);
      }
      setSelectedOption(null);
      setShowFeedback(false);
      setTitbit('');
    }, 3000);
  };

  const handleTimeUp = () => {
    playSound('timeUp');
    setSelectedOption('timeout');
    setShowFeedback(true);
    
    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setTimeLeft(30);
      } else {
        setShowSummary(true);
      }
      setSelectedOption(null);
      setShowFeedback(false);
    }, 1500);
  };

  const getDifficultyColor = (difficulty?: string) => {
    switch(difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showSummary) {
    return (
      <QuizSummary 
        result={{
          score,
          correctCount,
          totalQuestions: questions.length,
          timeUsed,
          category,
          isTimedMode
        }} 
        onRestart={() => {
          setCurrentIndex(0);
          setScore(0);
          setCorrectCount(0);
          setTimeLeft(30);
          setShowSummary(false);
          setTimeUsed(0);
        }}
      />
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div className="flex flex-wrap gap-2 items-center mb-2">
            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full flex items-center whitespace-nowrap">
              <MdCategory className="mr-1" size={12} />
              {currentQuestion.category.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            {currentQuestion.subcategory && (
              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full flex items-center whitespace-nowrap">
                <MdSubject className="mr-1" size={12} />
                {currentQuestion.subcategory}
              </span>
            )}
            <span className={`text-xs px-2 py-1 rounded-full flex items-center whitespace-nowrap ${getDifficultyColor(currentQuestion.difficulty)}`}>
              <MdStar className="mr-1" size={12} />
              {(currentQuestion.difficulty || 'Unknown').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {isTimedMode && (
              <div className={`bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs whitespace-nowrap ${
                timeLeft <= 5 ? 'bg-red-100 text-red-800' : ''
              }`}>
                ⏱️ {timeLeft}s
              </div>
            )}
            <div className="font-bold text-blue-600 text-sm whitespace-nowrap">
              Score: {score}
            </div>
          </div>
        </div>
        
        <div className="text-gray-600 mt-2">
          Question {currentIndex + 1} of {questions.length}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {currentQuestion.question}
        </h2>
        
        <div className="space-y-3 mb-6">
          {shuffledOptions.map((option, i) => {
            const isCorrect = option === currentQuestion.correct;
            const isSelected = selectedOption === option;
            const showAsCorrect = showFeedback && isCorrect;

            return (
              <button
                key={i}
                onClick={() => handleAnswer(option)}
                disabled={showFeedback || (isTimedMode && timeLeft === 0)}
                className={`
                  w-full text-left p-4 rounded-lg border transition-colors
                  ${!showFeedback ? 'hover:bg-gray-50' : ''}
                  ${isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}
                  ${isSelected && !isCorrect ? 'border-red-500 bg-red-50' : ''}
                  ${showAsCorrect ? 'border-green-500 bg-green-50' : ''}
                  ${(isTimedMode && timeLeft === 0) ? 'opacity-70 cursor-not-allowed' : ''}
                `}
              >
                <div className="flex justify-between items-center">
                  <span>{option}</span>
                  {isSelected && (
                    <span className={`text-lg ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>
                      {isCorrect ? '✓' : '✗'}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {showFeedback && titbit && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 animate-fade-in">
            <p className="text-yellow-800">{titbit}</p>
          </div>
        )}
      </div>
    </div>
  );
}