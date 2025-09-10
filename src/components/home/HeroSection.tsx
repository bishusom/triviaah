'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import sampleQuestions from '@/../data/sample-questions.json';

export default function HeroSection() {
  const [currentQuestion, setCurrentQuestion] = useState(sampleQuestions[0]);
  const [showQuestion, setShowQuestion] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Rotate through questions every 8 seconds
  useEffect(() => {
    // Trigger initial animation
    setIsLoaded(true);

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * sampleQuestions.length);
      setCurrentQuestion(sampleQuestions[randomIndex]);
      setShowQuestion(true);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = () => {
    setShowQuestion(!showQuestion);
  };

  return (
    <section className="bg-blue-700 text-white py-6 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h1
              className={`text-xl md:text-2xl font-bold mb-2 transition-all duration-600 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
              }`}
            >
              Test Your Knowledge in 60 Seconds!
            </h1>
            <p 
              className={`text-blue-100 mb-3 text-sm transition-all duration-600 ease-out delay-200 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Free, fun, and instantly gratifying trivia.
            </p>
            
            {/* CTA Button */}
            <Link href="/quick-fire" className="inline-block">
              <button
                className={`bg-white text-blue-600 px-5 py-2 rounded-full font-semibold text-sm shadow-md 
                  transition-all duration-300 ease-out delay-300 hover:scale-105 active:scale-95 
                  hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 
                  focus:ring-offset-blue-700 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                Play 60 secs Quiz →
              </button>
            </Link>
          </div>

          {/* Right: Interactive Question Card */}
          <div
            className={`flex-1 max-w-sm md:max-w-md transition-all duration-700 ease-out delay-300 ${
              isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}
          >
            <div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 cursor-pointer 
                transition-all duration-300 ease-out hover:bg-white/15 hover:scale-105 active:scale-95
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
              onClick={handleCardClick}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick();
                }
              }}
              tabIndex={0}
              role="button"
              aria-label={showQuestion ? 'Reveal answer' : 'Show question'}
              style={{ contain: 'layout style paint' }} // Optimize rendering
            >
              <div className="min-h-[100px] flex flex-col items-center justify-center relative">
                {/* Question Content */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
                    showQuestion ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
                  }`}
                >
                  <p className="text-sm md:text-base font-medium text-center overflow-wrap break-word">
                    {currentQuestion.question}
                  </p>
                </div>

                {/* Answer Content */}
                <div
                  className={`absolute inset-0 flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
                    !showQuestion ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
                  }`}
                >
                  <div className="text-center">
                    <p className="text-sm md:text-base font-bold text-green-200 overflow-wrap break-word">
                      {currentQuestion.answer}
                    </p>
                    <p className="text-xs text-white/80 italic mt-1 overflow-wrap break-word">
                      {currentQuestion.titbits}
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-3">
                <span className="text-xs text-white/70">
                  {showQuestion ? 'Tap to reveal answer' : 'Tap for question'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bar - Simplified */}
        <div 
          className={`flex justify-center items-center gap-4 mt-4 text-xs text-white/80 
            transition-all duration-800 ease-out delay-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="text-center">
            <div className="font-semibold text-white">10K+</div>
            <div>Players</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-white">25+</div>
            <div>Categories</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-white">Free</div>
            <div>To Play</div>
          </div>
        </div>
      </div>
    </section>
  );
}