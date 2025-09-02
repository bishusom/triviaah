// components/HeroSection.tsx
'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import sampleQuestions from '@/../data/sample-questions.json';

export default function HeroSection() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(sampleQuestions[0]);
  const [showQuestion, setShowQuestion] = useState(true);

  // Rotate through questions every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * sampleQuestions.length);
      setCurrentQuestion(sampleQuestions[randomIndex]);
      setShowQuestion(true);
      setIsFlipped(false);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
    setShowQuestion(!showQuestion);
  };

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Left: Text Content */}
          <div className="flex-1 text-center md:text-left">
            <motion.h1
              className="text-2xl md:text-3xl font-bold mb-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Test Your Knowledge in 60 Seconds!
            </motion.h1>
            <motion.p 
              className="text-blue-100 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Join thousands playing our daily trivia challenges. Free, fun, and instantly gratifying.
            </motion.p>
            
            {/* CTA Button */}
            <Link href="/trordle" className="inline-block">
              <motion.button
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 0 15px 3px rgba(255, 255, 255, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Play Trordle Now →
              </motion.button>
            </Link>
          </div>

          {/* Right: Interactive Question Card */}
          <motion.div
            className="flex-1 max-w-xs"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            <div 
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 cursor-pointer hover:bg-white/15 transition-colors"
              onClick={handleCardClick}
            >
              <div className="text-center mb-3">
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {currentQuestion.category}
                </span>
              </div>
              
              <motion.div
                key={currentQuestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="min-h-[100px] flex flex-col items-center justify-center"
              >
                {showQuestion ? (
                  <p className="text-lg font-medium text-center mb-2">
                    {currentQuestion.question}
                  </p>
                ) : (
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-200 mb-2">
                      {currentQuestion.answer}
                    </p>
                    {/* Added titbits with smaller font */}
                    <p className="text-xs text-white/80 italic mt-2">
                      {currentQuestion.titbits}
                    </p>
                  </div>
                )}
              </motion.div>

              <div className="text-center mt-4">
                <motion.span 
                  className="text-xs text-white/70"
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {showQuestion ? 'Click to reveal answer & fun fact' : 'Click for question'}
                </motion.span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div 
          className="flex justify-center items-center gap-6 mt-6 text-sm text-white/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <div className="text-center">
            <div className="font-bold text-white">10K+</div>
            <div>Daily Players</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-white">25+</div>
            <div>Categories</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-white">100%</div>
            <div>Free to Play</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}