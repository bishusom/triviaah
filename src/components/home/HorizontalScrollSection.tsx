// components/home/HorizontalScrollSection.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import DailyQuizClient from '@/components/daily/DailyQuizClient';
import { getTimeLeft } from '@/utils/dateUtils';
import { ReadonlyQuizItems, ReadonlySectionItems, ReadonlyQuizItem, ReadonlySectionItem } from '@/types/home';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Register ScrollToPlugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollToPlugin);
}

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const updateScrollButtons = () => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10); // 10px tolerance
  };

  useEffect(() => {
    updateScrollButtons();
    
    const handleResize = () => updateScrollButtons();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [items]);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollAmount = 300;
    const currentScroll = container.scrollLeft;
    const maxScroll = container.scrollWidth - container.clientWidth;

    let targetScroll: number;

    if (direction === 'right') {
      targetScroll = Math.min(currentScroll + scrollAmount, maxScroll);
    } else {
      targetScroll = Math.max(currentScroll - scrollAmount, 0);
    }

    // Use GSAP for smooth scrolling
    gsap.to(container, {
      scrollTo: { x: targetScroll, autoKill: false },
      duration: 0.5,
      ease: "power2.out",
      onComplete: updateScrollButtons
    });
  };

  return (
    <div className="mb-12 w-full">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        {title}
      </h2>
      
      <div className="relative w-full">
        {/* Desktop Grid */}
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
                  href={`/${item.category}`}
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-lg text-center transition-colors text-sm"
                >
                  Explore
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile horizontal scroll with GSAP */}
        <div className="sm:hidden relative w-full">
          {/* Left scroll button - conditionally shown */}
          {showLeftButton && (
            <button 
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md hover:bg-white transition-opacity"
              aria-label="Scroll left"
            >
              <MdChevronLeft size={24} className="text-gray-600" />
            </button>
          )}
          
          {/* Scroll container */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto pb-4 flex space-x-4 px-2"
            onScroll={updateScrollButtons}
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
            }}
          >
            {items.map((item, idx) => (
              <div 
                key={item.category} 
                className="w-56 flex-shrink-0"
              >
                {isQuizSection && isQuizItem(item) ? (
                  <DailyQuizClient 
                    quiz={item}
                    priorityImage={idx < 2}
                    timeLeft={getTimeLeft()}
                  />
                ) : (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 h-full p-4 flex flex-col">
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

                    <div className="text-center mb-3 flex-grow">
                      <h3 className="font-bold text-gray-800 mb-1 text-sm">{item.name}</h3>
                    </div>

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
          </div>
          
          {/* Right scroll button - conditionally shown */}
          {showRightButton && (
            <button 
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 rounded-full p-1 shadow-md hover:bg-white transition-opacity"
              aria-label="Scroll right"
            >
              <MdChevronRight size={24} className="text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}