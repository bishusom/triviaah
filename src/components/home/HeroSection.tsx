// components/HeroSection.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import sampleQuestions from '@/../data/sample-questions.json';

export default function HeroSection() {
  const [currentQuestion, setCurrentQuestion] = useState(sampleQuestions[0]);
  const [showQuestion, setShowQuestion] = useState(true);

  // Rotate through questions every 8 seconds
  useEffect(() => {
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
            <motion.h1
              className="text-xl md:text-2xl font-bold mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              Test Your Knowledge in 60 Seconds!
            </motion.h1>
            <motion.p 
              className="text-blue-100 mb-3 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              Free, fun, and instantly gratifying trivia.
            </motion.p>
            
            {/* CTA Button */}
            <Link href="/quick-fire" className="inline-block">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="bg-white text-blue-600 px-5 py-2 rounded-full font-semibold text-sm shadow-md"
              >
                Play 60 secs Quiz →
              </motion.button>
            </Link>
          </div>

          {/* Right: Interactive Question Card */}
          <motion.div
            className="flex-1 max-w-xs"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div 
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 cursor-pointer"
              onClick={handleCardClick}
            >
              <div className="text-center mb-2">
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {currentQuestion.category}
                </span>
              </div>
              
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="min-h-[80px] flex flex-col items-center justify-center"
              >
                {showQuestion ? (
                  <p className="text-base font-medium text-center">
                    {currentQuestion.question}
                  </p>
                ) : (
                  <div className="text-center">
                    <p className="text-base font-bold text-green-200">
                      {currentQuestion.answer}
                    </p>
                    <p className="text-xs text-white/80 italic mt-1">
                      {currentQuestion.titbits}
                    </p>
                  </div>
                )}
              </motion.div>

              <div className="text-center mt-2">
                <span className="text-xs text-white/70">
                  {showQuestion ? 'Tap to reveal answer' : 'Tap for question'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Bar - Simplified */}
        <div className="flex justify-center items-center gap-4 mt-4 text-xs text-white/80">
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