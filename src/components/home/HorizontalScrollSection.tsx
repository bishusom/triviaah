// components/home/HorizontalScrollSection.tsx
'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import DailyQuizClient from '@/components/daily/DailyQuizClient';
import { getTimeLeft } from '@/utils/dateUtils';
import { ReadonlyQuizItems, ReadonlySectionItems, ReadonlyQuizItem, ReadonlySectionItem } from '@/types/home';

interface HorizontalScrollSectionProps {
  title: string;
  items: ReadonlyQuizItems | ReadonlySectionItems;
  isQuizSection?: boolean;
}

// Type guard to check if an item is a QuizItem
function isQuizItem(item: ReadonlyQuizItem | ReadonlySectionItem): item is ReadonlyQuizItem {
  return 'path' in item;
}

export default function HorizontalScrollSection({ 
  title, 
  items, 
  isQuizSection = false 
}: HorizontalScrollSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="mb-12">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        {title}
      </h2>
      
      <div className="relative">
        {/* Desktop Grid - Updated for 4 columns for non-quiz sections */}
        <div className={`hidden sm:grid ${
          isQuizSection 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        } gap-6`}>
          {items.map((item, idx) => isQuizSection && isQuizItem(item) ? (
            <DailyQuizClient 
              key={item.category}
              quiz={item}
              priorityImage={idx < 2}
              timeLeft={getTimeLeft()}
              className={idx < 2 ? "lcp-priority" : ""}
            />
          ) : (
            <div 
              key={item.category} 
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow hover:border-blue-400"
            >
              <div className="p-5 flex flex-col h-full">
                {/* Image - smaller for non-quiz sections */}
                <div className="flex items-center justify-center mb-3">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                      loading="lazy"
                      quality={75}
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="text-center mb-3 flex-grow">
                  <h3 className="text-md font-bold text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-600 italic hidden sm:block mb-2">
                    {item.tagline}
                  </p>
                  <div className="sr-only" aria-hidden="true">
                    Keywords: {item.keywords}
                  </div>
                </div>

                {/* Button - smaller for non-quiz sections */}
                <Link 
                  href={`/${item.category}`}
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg text-center transition-colors text-sm"
                >
                  Explore
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile horizontal scroll with smaller cards */}
        <div className="sm:hidden relative">
          {/* Left scroll indicator/button */}
          <button 
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md hover:bg-white"
            aria-label="Scroll left"
          >
            <MdChevronLeft size={24} className="text-gray-600" />
          </button>
          
          {/* Scroll container */}
          <div 
            ref={scrollRef}
            className="overflow-x-auto pb-4 flex space-x-4 px-2"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {items.map((item, idx) => (
              <div key={item.category} className="w-56 flex-shrink-0">
                {isQuizSection && isQuizItem(item) ? (
                  <DailyQuizClient 
                    quiz={item}
                    priorityImage={idx < 2}
                    timeLeft={getTimeLeft()}
                  />
                ) : (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 h-full p-4 flex flex-col">
                    {/* Image - smaller on mobile */}
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full"
                          loading="lazy"
                          quality={75}
                        />
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="text-center mb-3 flex-grow">
                      <h3 className="font-bold text-gray-800 mb-1 text-sm">{item.name}</h3>
                    </div>

                    {/* Button - smaller on mobile */}
                    <Link 
                      href={`/${item.category}`}
                      className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg text-center transition-colors text-sm"
                    >
                      Explore
                    </Link>
                  </div>
                )}
              </div>
            ))}
            
            {/* Right side fade effect to indicate more content */}
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
          </div>
          
          {/* Right scroll indicator/button */}
          <button 
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md hover:bg-white"
            aria-label="Scroll right"
          >
            <MdChevronRight size={24} className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}