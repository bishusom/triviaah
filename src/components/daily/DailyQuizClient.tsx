// app/components/daily/DailyQuizClient.tsx - Updated with square images
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
  timeLeft: initialTimeLeft,
  layout = 'default',
}: {
  quiz: Quiz;
  timeLeft: string;
  layout?: 'default' | 'wide';
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
        
        // More robust date comparison that handles midnight properly
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
      
      // Update played state every minute to catch date changes
      updatePlayedState();
      
      // Force reset at midnight
      if (diff < 60000) { // Less than 1 minute to midnight
        setPlayed(false);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [quiz.category]);

  if (layout === 'wide') {
    return (
      <div className="flex h-full min-h-[23rem] flex-col p-5">
        <div className="mb-4 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-600/20 transition-transform duration-300 hover:from-cyan-500/30 hover:to-blue-600/30">
          <div className="relative aspect-[16/10] w-full">
            <Image
              src={quiz.image}
              alt={`${quiz.name} Trivia Challenge`}
              fill
              className="object-contain p-4"
              loading="lazy"
              quality={75}
              sizes="(min-width: 1024px) 33vw, 50vw"
            />
          </div>
        </div>

        <div className="min-w-0 flex-1 text-center">
          <h3 className="text-xl font-black leading-tight text-white">{quiz.name}</h3>
          {isMounted && (
            <>
              <p className="mx-auto mt-2 line-clamp-2 max-w-sm text-sm leading-6 text-gray-300">
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
            <div className="h-10 w-full animate-pulse rounded-lg bg-gray-700"></div>
          ) : played ? (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-600 bg-gray-700/50 px-4 py-2.5 text-sm text-gray-300">
              <span className="inline-flex items-center">
                <FaCheckCircle className="mr-2 text-green-400" />
                Completed Today
              </span>
              <span className="text-xs text-gray-400">New in {timeLeft}</span>
            </div>
          ) : (
            <Link
              href={quiz.path}
              className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:from-cyan-500 hover:to-blue-500 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >
              Explore
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 flex flex-col h-full">
      <div className="flex items-center justify-center mb-4">
        <div className="w-20 h-20 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-105 hover:from-cyan-500/30 hover:to-blue-600/30">
          <Image
            src={quiz.image}
            alt={`${quiz.name} Trivia Challenge`}
            width={80}
            height={80}
            className="object-cover w-full h-full p-1"
            loading="lazy"
            quality={75}
          />
        </div>
      </div>

      {/* Text Content */}
      <div className="text-center mb-4 flex-grow">
        <h3 className="text-md font-bold text-white mb-2">{quiz.name}</h3>
        {isMounted && (
          <>
            <p className="text-xs text-gray-300 italic hidden sm:block mb-3">
              {quiz.tagline}
            </p>
            <div className="sr-only" aria-hidden="true">
              Keywords: {quiz.keywords}
            </div>
          </>
        )}
      </div>

      {/* Button/Timer */}
      <div className="mt-auto">
        {!isMounted ? (
          <div className="w-full bg-gray-700 animate-pulse h-10 rounded-lg"></div>
        ) : played ? (
          <div className="text-center">
            <div className="inline-flex items-center bg-gray-700/50 text-gray-300 text-sm px-4 py-2.5 rounded-lg border border-gray-600">
              <FaCheckCircle className="mr-2 text-green-400" />
              <span>Completed Today</span>
            </div>
            <div className="text-xs text-gray-400 mt-2">
              New challenge in {timeLeft}
            </div>
          </div>
        ) : (
          <Link
            href={quiz.path} 
            className="block w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium py-2.5 px-4 rounded-lg text-center transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Explore
          </Link>
        )}
      </div>
    </div>
  );
}
