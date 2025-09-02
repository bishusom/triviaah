// components/WelcomeBanner.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import { useEffect, useState } from 'react';

export default function WelcomeBanner() {
  const { user, getWelcomeMessage } = useUser();
  const [isVisible, setIsVisible] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const welcomeMessage = getWelcomeMessage?.();
  const streak = user?.streak || 0;

  useEffect(() => {
    if (welcomeMessage && user?.lastPlayed) {
      const today = new Date().toDateString();
      const lastPlayed = new Date(user.lastPlayed).toDateString();
      
      // Only show if they haven't played today or it's a new streak milestone
      if (lastPlayed !== today || streak > (user.previousStreak || 0)) {
        setIsVisible(true);
        
        // Show fireworks for streak milestones
        if (streak >= 3 && streak % 3 === 0) {
          setShowFireworks(true);
          setTimeout(() => setShowFireworks(false), 3000);
        }
        
        // Auto-hide after 5 seconds
        const timer = setTimeout(() => setIsVisible(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [welcomeMessage, user, streak]);

  if (!isVisible || !welcomeMessage) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
        transition={{ duration: 0.5 }}
        className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
      >
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-lg shadow-lg text-center">
          <div className="flex items-center justify-center gap-2">
            {streak > 0 && (
              <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-sm font-bold animate-pulse">
                🔥 {streak}
              </div>
            )}
            <span className="font-semibold">{welcomeMessage}</span>
          </div>
          
          {streak > 1 && (
            <p className="text-sm text-blue-100 mt-1">
              {getStreakEncouragement(streak)}
            </p>
          )}
        </div>

        {/* Fireworks animation for milestones */}
        {showFireworks && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-2xl"
                initial={{ scale: 0, opacity: 1 }}
                animate={{ 
                  scale: [0, 2, 0],
                  opacity: [1, 0.5, 0],
                  y: [-50, -150],
                  x: [0, (Math.random() - 0.5) * 100]
                }}
                transition={{ 
                  duration: 2,
                  delay: i * 0.1
                }}
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '50%'
                }}
              >
                {'🎉🎊🌟🔥⭐🎯'[i % 6]}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

function getStreakEncouragement(streak: number): string {
  if (streak === 2) return "Two days in a row! You're on fire!";
  if (streak === 3) return "Three-day streak! Consistency is key!";
  if (streak === 5) return "Five days! You're a trivia machine!";
  if (streak === 7) return "One week streak! Incredible dedication!";
  if (streak === 10) return "Double digits! You're unstoppable!";
  if (streak === 14) return "Two weeks strong! Trivia mastery!";
  if (streak === 30) return "One month! Legend status achieved!";
  return `Keep your ${streak}-day streak going!`;
}