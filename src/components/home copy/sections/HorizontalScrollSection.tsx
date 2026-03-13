// components/home/HorizontalScrollSection.tsx - Updated with square images
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
      <h2 className="text-xl font-bold text-white mb-4 text-center">
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
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1"
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
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="p-5 flex flex-col h-full">
                {/* Square Image Container */}
                <div className="flex items-center justify-center mb-4">
                  <div className="w-20 h-20 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 flex items-center justify-center overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:from-cyan-500/30 group-hover:to-blue-600/30">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full p-1"
                      loading="lazy"
                      quality={75}
                    />
                  </div>
                </div>

                <div className="text-center mb-4 flex-grow">
                  <h3 className="text-md font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{item.name}</h3>
                  <p className="text-xs text-gray-300 italic hidden sm:block mb-3">
                    {item.tagline}
                  </p>
                  <div className="sr-only" aria-hidden="true">
                    Keywords: {item.keywords}
                  </div>
                </div>

                <Link 
                  href={getItemPath(item)}
                  className="block w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium py-2.5 px-4 rounded-lg text-center transition-all duration-300 text-sm hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
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
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium py-2 px-6 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
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
        
        {/* Mobile horizontal scroll */}
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
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all duration-300 h-full">
                    <DailyQuizClient 
                      quiz={item}
                      priorityImage={idx < 2}
                      timeLeft={getTimeLeft()}
                    />
                  </div>
                ) : (
                  <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden border border-gray-700 hover:border-cyan-500/50 hover:shadow-cyan-500/10 transition-all duration-300 h-full p-4 flex flex-col">
                    {/* Square Image Container for Mobile */}
                    <div className="flex items-center justify-center mb-4">
                      <div className="w-16 h-16 rounded-lg bg-gradient-to-r from-cyan-500/20 to-blue-600/20 flex items-center justify-center overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={64}
                          height={64}
                          className="object-cover w-full h-full p-1"
                          loading="lazy"
                          quality={75}
                        />
                      </div>
                    </div>

                    <div className="text-center mb-4 flex-grow">
                      <h3 className="font-bold text-white mb-2 text-sm">{item.name}</h3>
                    </div>

                    <Link 
                      href={getItemPath(item)}
                      className="block w-full bg-gray-700 hover:bg-gray-600 text-white font-medium py-2.5 px-4 rounded-lg text-center transition-all duration-300 text-sm active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900"
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
                  className={`w-2 h-2 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                    index === Math.floor(currentIndex / totalVisibleItems) 
                      ? 'bg-cyan-500 scale-125' 
                      : 'bg-gray-600 hover:bg-gray-500'
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