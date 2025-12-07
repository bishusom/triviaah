// components/home/HorizontalScrollSection.tsx - Updated with expandable desktop view
'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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

// Helper function to get the correct path for any item
function getItemPath(item: ReadonlyQuizItem | ReadonlySectionItem): string {
  // If item has a custom path, use it
  if ('path' in item && item.path) {
    return item.path;
  }
  // Otherwise fall back to category-based path
  return `/${item.category}`;
}

export default function HorizontalScrollSection({ 
  title, 
  items, 
  isQuizSection = false 
}: HorizontalScrollSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalVisibleItems, setTotalVisibleItems] = useState(1);
  const [isScrolling, setIsScrolling] = useState(false);
  const [showAllDesktop, setShowAllDesktop] = useState(false); // New state for desktop expansion

  const updateScrollPosition = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.querySelector('.w-56')?.clientWidth || 224;
    const gap = 16;
    
    const newIndex = Math.round(scrollLeft / (itemWidth + gap));
    setCurrentIndex(Math.max(0, newIndex));
  };

  // Debounce scroll updates for better performance
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;
    
    const handleScroll = () => {
      setIsScrolling(true);
      
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        updateScrollPosition();
        setIsScrolling(false);
      }, 150);
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => {
        container.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
      };
    }
  }, []);

  useEffect(() => {
    const calculateVisibleItems = () => {
      if (!scrollContainerRef.current) return;
      
      const container = scrollContainerRef.current;
      const containerWidth = container.clientWidth;
      const itemWidth = container.querySelector('.w-56')?.clientWidth || 224;
      const gap = 16;
      
      const visibleCount = Math.max(1, Math.floor(containerWidth / (itemWidth + gap)));
      setTotalVisibleItems(visibleCount);
    };

    calculateVisibleItems();
    updateScrollPosition();
    
    const handleResize = () => {
      calculateVisibleItems();
      updateScrollPosition();
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [items]);

  const scrollToIndex = (index: number) => {
    if (!scrollContainerRef.current || isScrolling) return;

    const container = scrollContainerRef.current;
    const itemWidth = container.querySelector('.w-56')?.clientWidth || 224;
    const gap = 16;
    
    const targetScroll = index * (itemWidth + gap);

    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });

    setCurrentIndex(index);
  };

  // Calculate items to show on desktop - first 4 when collapsed, all when expanded
  const desktopItems = showAllDesktop ? items : items.slice(0, 4);
  const canExpand = items.length > 4;

  const totalDots = Math.max(1, Math.ceil(items.length / Math.max(1, totalVisibleItems)));

  return (
    <div className="mb-12 w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        {title}
      </h2>
      
      <div className="relative w-full">
        {/* Desktop Grid - Now conditional based on showAllDesktop */}
        <div className={`hidden sm:grid ${
          isQuizSection 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' 
            : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        } gap-6`}>
          {desktopItems.map((item, idx) => isQuizSection && isQuizItem(item) ? (
            <div 
              key={item.category}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-400 hover:-translate-y-1"
            >
              <DailyQuizClient 
                quiz={item}
                priorityImage={idx < 2}
                timeLeft={getTimeLeft()}
              />
            </div>
          ) : (
            <div 
              key={item.category} 
              className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-400 hover:-translate-y-1"
            >
              <div className="p-5 flex flex-col h-full">
                <div className="flex items-center justify-center mb-3">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-110">
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

                <div className="text-center mb-3 flex-grow">
                  <h3 className="text-md font-bold text-gray-800 mb-1">{item.name}</h3>
                  <p className="text-xs text-gray-600 italic hidden sm:block mb-2">
                    {item.tagline}
                  </p>
                  <div className="sr-only" aria-hidden="true">
                    Keywords: {item.keywords}
                  </div>
                </div>

                <Link 
                  href={getItemPath(item)}
                  className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-center transition-all duration-300 text-sm hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Explore
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Expand/Collapse Button for Desktop */}
        {canExpand && (
          <div className="hidden sm:flex justify-center mt-6">
            <button
              onClick={() => setShowAllDesktop(!showAllDesktop)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span>{showAllDesktop ? 'Show Less' : `Show All ${items.length}`}</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-300 ${showAllDesktop ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
        
        {/* Mobile horizontal scroll - Unchanged */}
        <div className="sm:hidden relative w-full">
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto pb-4 flex space-x-4 px-2 scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {items.map((item, idx) => (
              <div 
                key={item.category} 
                className="w-56 flex-shrink-0"
                style={{ scrollSnapAlign: 'start' }}
              >
                {isQuizSection && isQuizItem(item) ? (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-400 h-full">
                    <DailyQuizClient 
                      quiz={item}
                      priorityImage={idx < 2}
                      timeLeft={getTimeLeft()}
                    />
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-blue-400 h-full p-4 flex flex-col">
                    <div className="flex items-center justify-center mb-3">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden transition-transform duration-300 hover:scale-110">
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

                    <div className="text-center mb-3 flex-grow">
                      <h3 className="font-bold text-gray-800 mb-1 text-sm">{item.name}</h3>
                    </div>

                    <Link 
                      href={getItemPath(item)}
                      className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg text-center transition-all duration-300 text-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Explore
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Dot indicators - Only show if multiple pages */}
          {totalDots > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalDots }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index * totalVisibleItems)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    index === Math.floor(currentIndex / totalVisibleItems) 
                      ? 'bg-blue-600 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                  disabled={isScrolling}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}