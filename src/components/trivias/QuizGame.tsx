'use client';
import { event } from '@/lib/gtag';
import { fetchPixabayImage } from '@/lib/pixabay';
import { useState, useEffect, useRef } from 'react';
import { type Question } from '@/lib/firebase';
import QuizSummary from './QuizSummary';
import { useSound } from '@/app/context/SoundContext';
import { MdCategory, MdSubject, MdStar } from 'react-icons/md';
import CountUp from 'react-countup';
import { extractKeywords } from '@/lib/nlpKeywords';

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
  const [timeLeft, setTimeLeft] = useState(30);
  const [showSummary, setShowSummary] = useState(false);
  const [titbit, setTitbit] = useState('');
  const [timeUsed, setTimeUsed] = useState(0);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [isTimedMode, setIsTimedMode] = useState(true);
  const [questionImage, setQuestionImage] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  
  const correctSound = useRef<HTMLAudioElement | null>(null);
  const incorrectSound = useRef<HTMLAudioElement | null>(null);
  const timeUpSound = useRef<HTMLAudioElement | null>(null);
  const tickSound = useRef<HTMLAudioElement | null>(null);

  const { isMuted } = useSound();

  const currentQuestion = questions[currentIndex];

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
        
        if (timeLeft <= 5 && !isMuted && isTimedMode) {
          tickSound.current?.play().catch(e => console.error('Error playing tick sound:', e));
        }
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isTimedMode) {
      handleTimeUp();
    }
  }, [timeLeft, showFeedback, isMuted, isTimedMode]);

  useEffect(() => {
    const fetchImage = async () => {
      setQuestionImage(null);
      
      // Get NLP-extracted keywords
      const keywords = extractKeywords(currentQuestion.question);
      
      // Get category (formatted for search)
      const category = currentQuestion.category?.toLowerCase().replace(/-/g, ' ');

      // Search priority:
      // 1. Category + best keyword (e.g. "sports baseball")
      // 2. Category alone
      // 3. Individual keywords
      
      if (category && keywords.length > 0) {
        const combinedImage = await fetchPixabayImage(keywords[0], category);
        if (combinedImage) return setQuestionImage(combinedImage);
      }

      if (category) {
        const categoryImage = await fetchPixabayImage('', category);
        if (categoryImage) return setQuestionImage(categoryImage);
      }

      for (const keyword of keywords) {
        const imageUrl = await fetchPixabayImage(keyword);
        if (imageUrl) {
          setQuestionImage(imageUrl);
          break;
        }
      }
    };

    const debounceTimer = setTimeout(fetchImage, 300);
    return () => clearTimeout(debounceTimer);
  }, [currentQuestion]);

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


  return (
    <div className="relative max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-30 -z-10"></div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        ></div>
      </div>

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
            <div className="flex items-center gap-1">
              <span className={`text-xs px-2 py-1 rounded-full flex items-center whitespace-nowrap ${getDifficultyColor(currentQuestion.difficulty)}`}>
                <MdStar className="mr-1" size={12} />
                {(currentQuestion.difficulty || 'Unknown').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <div className="flex gap-1 items-center">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < (currentQuestion.difficulty === 'easy' ? 1 : 
                          currentQuestion.difficulty === 'medium' ? 2 : 3) 
                            ? 'bg-yellow-400' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {correctCount > 1 && (
              <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs flex items-center">
                🔥 {correctCount} streak
              </div>
            )}
            {isTimedMode && (
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
        </div>
      </div>

      {/* Question and Image Container */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6 bg-white shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Image container with responsive sizing */}
          <div className="w-full md:w-32 flex-shrink-0">
            <div className={`relative aspect-square w-full rounded-md overflow-hidden bg-gray-100 ${questionImage ? '' : 'animate-pulse'}`}>
              {questionImage ? (
                <img 
                  src={questionImage} 
                  alt="Question illustration" 
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  onError={() => setQuestionImage(null)}
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                  Loading image...
                </div>
              )}
            </div>
          </div>
          
          {/* Question text */}
          <div className="flex-1 min-w-0">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 break-words">
              {currentQuestion.question}
            </h2>
          </div>
        </div>
      </div>
          
      {/* Answer Options */}
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
                w-full text-left p-4 rounded-lg border transition-all
                transform ${!showFeedback ? 'hover:scale-[1.02]' : ''}
                ${isSelected ? 'scale-[1.03] shadow-md border-blue-500 bg-blue-50' : 'border-gray-200'}
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
                {['Nice!', 'Great job!', 'Perfect!', 'Brilliant!'][currentIndex % 4]}
              </span>
            ) : (
              <span className="text-red-600">Almost! The correct answer was highlighted.</span>
            )}
          </div>
        </div>
      )}

      {/* Confetti effect for correct answers */}
      {showFeedback && selectedOption === currentQuestion.correct && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          {[...Array(50)].map((_, i) => {
            const randomColor = [
              'bg-yellow-400',
              'bg-red-400',
              'bg-blue-400',
              'bg-green-400',
              'bg-purple-400',
              'bg-pink-400'
            ][Math.floor(Math.random() * 6)];
            
            const randomShape = Math.random() > 0.5 ? 'rounded-full' : 'rounded-sm';
            const size = Math.random() > 0.8 ? 'w-3 h-3' : 'w-2 h-2';
            
            return (
              <div 
                key={i}
                className={`absolute ${randomColor} ${randomShape} ${size} animate-confetti`}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '100%',
                  animationDelay: `${i * 0.05}s`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                  transform: `rotate(${Math.random() * 360}deg)`
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}