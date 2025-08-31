// components/daily/DailyQuizClient.tsx - Updated with proper image sizing
'use client';

import { useEffect, useState } from 'react';
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

export default function DailyQuizClient({
  quiz,
  priorityImage = false,
  timeLeft: initialTimeLeft,
  className = "" 
}: {
  quiz: Quiz;
  priorityImage?: boolean;
  timeLeft: string;
  className?: string;
}) {
  const [played, setPlayed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(initialTimeLeft);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    const updatePlayedState = () => {
      const playedQuizzes = JSON.parse(localStorage.getItem('playedQuizzes') || '{}');
      const quizData = playedQuizzes[quiz.category];
      
      if (quizData) {
        const playedDate = new Date(quizData.timestamp);
        const today = new Date();
        
        const isSameDay = (
          playedDate.getDate() === today.getDate() &&
          playedDate.getMonth() === today.getMonth() &&
          playedDate.getFullYear() === today.getFullYear()
        );
        
        setPlayed(isSameDay);
      } else {
        setPlayed(false);
      }
    };

    updatePlayedState();

    const interval = setInterval(() => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${h}h ${m}m`);
      
      updatePlayedState();
      
      if (diff < 60000) {
        setPlayed(false);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [quiz.category]);

  return (
    <div className={`bg-white rounded-xl shadow-md p-6 flex flex-col h-full ${className}`}>
      {/* Image Container with explicit dimensions */}
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
          // Add placeholder to prevent layout shift
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaUMk8Ybf4RfLkNW2WYqCzq6gS2Ml6U5kkyR8Yya4n//2Q=="
        />
      </div>

      {/* Rest of the component remains the same */}
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
              <span>Completed Today</span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              New challenge in {timeLeft}
            </div>
          </div>
        ) : (
          <Link
            href={quiz.path} 
            onClick={() => {
              const next = { 
                ...JSON.parse(localStorage.getItem('playedQuizzes') || '{}'), 
                [quiz.category]: { played: true, timestamp: Date.now() } 
              };
              localStorage.setItem('playedQuizzes', JSON.stringify(next));
            }}
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-colors"
          >
            Play Daily Challenge
          </Link>
        )}
      </div>
    </div>
  );
}