// components/daily/DailyQuizClient.tsx - Updated with universal 24-hour timer
'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaCheckCircle } from 'react-icons/fa';

type Quiz = {
  category: string;
  name: string;
  path: string;
  image: string;
  tagline: string;
  keywords: string;
};

const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMk8Ybf4RfLkNW2WYqCzq6gS2Ml6U5kkyR8Yya4n//2Q==";

export default function DailyQuizClient({
  quiz,
  priorityImage = false,
  className = "" 
}: {
  quiz: Quiz;
  priorityImage?: boolean;
  className?: string;
}) {
  const [played, setPlayed] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [isMounted, setIsMounted] = useState(false);

  // Calculate time until next reset (24 hours from when user last played)
  const calculateTimeLeft = useCallback((lastPlayedTimestamp: number) => {
    const now = Date.now();
    const timeSinceLastPlayed = now - lastPlayedTimestamp;
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const timeUntilReset = twentyFourHours - timeSinceLastPlayed;
    
    if (timeUntilReset <= 0) {
      return '0h 0m';
    }
    
    const hours = Math.floor(timeUntilReset / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  }, []);

  const updatePlayedState = useCallback(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const playedQuizzes = JSON.parse(localStorage.getItem('playedQuizzes') || '{}');
      const quizData = playedQuizzes[quiz.category];
      
      if (quizData && quizData.timestamp) {
        const lastPlayedTimestamp = quizData.timestamp;
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        // Check if 24 hours have passed since last play
        if (now - lastPlayedTimestamp < twentyFourHours) {
          setPlayed(true);
          setTimeLeft(calculateTimeLeft(lastPlayedTimestamp));
        } else {
          setPlayed(false);
          // Clean up expired entry
          const updatedQuizzes = { ...playedQuizzes };
          delete updatedQuizzes[quiz.category];
          localStorage.setItem('playedQuizzes', JSON.stringify(updatedQuizzes));
        }
      } else {
        setPlayed(false);
      }
    } catch (e) {
      console.error('Error reading from localStorage', e);
      setPlayed(false);
    }
  }, [quiz.category, calculateTimeLeft]);

  useEffect(() => {
    setIsMounted(true);
    updatePlayedState();

    // Update timer every minute
    const interval = setInterval(() => {
      updatePlayedState();
    }, 60000);

    return () => clearInterval(interval);
  }, [quiz.category, updatePlayedState]);

  const handleQuizClick = useCallback(() => {
    try {
      const playedQuizzes = JSON.parse(localStorage.getItem('playedQuizzes') || '{}');
      const now = Date.now();
      
      playedQuizzes[quiz.category] = { 
        played: true, 
        timestamp: now 
      };
      
      localStorage.setItem('playedQuizzes', JSON.stringify(playedQuizzes));
      setPlayed(true);
      setTimeLeft(calculateTimeLeft(now));
    } catch (e) {
      console.error('Error writing to localStorage', e);
    }
  }, [quiz.category, calculateTimeLeft]);

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 flex flex-col h-full ${className}`}>
      <div className="flex items-center justify-center mb-4 w-20 h-20 mx-auto">
        <Image
          src={quiz.image}
          alt={`${quiz.name} Trivia Challenge`}
          width={80}
          height={80}
          className="object-cover rounded-full bg-blue-100"
          priority={priorityImage}
          loading={priorityImage ? 'eager' : 'lazy'}
          quality={75}
          placeholder="blur"
          blurDataURL={blurDataURL}
        />
      </div>

      <div className="text-center mb-4 flex-grow">
        <h3 className="text-lg font-bold text-gray-800 mb-1">{quiz.name}</h3>
        {isMounted && (
          <>
            <p className="text-sm text-gray-600 italic hidden sm:block mb-2">
              {quiz.tagline}
            </p>
            <div className="sr-only" aria-hidden="true">
              Keywords: {quiz.keywords}
            </div>
          </>
        )}
      </div>

      <div className="mt-auto">
        {!isMounted ? (
          <div className="w-full bg-gray-200 animate-pulse h-10 rounded-lg"></div>
        ) : played ? (
          <div className="text-center">
            <div className="inline-flex items-center bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full">
              <FaCheckCircle className="mr-2 text-green-500" />
              <span>Completed</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              New challenge in {timeLeft}
            </div>
          </div>
        ) : (
          <Link
            href={quiz.path} 
            onClick={handleQuizClick}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors"
            prefetch={false}
          >
            Play Daily Challenge
          </Link>
        )}
      </div>
    </div>
  );
}