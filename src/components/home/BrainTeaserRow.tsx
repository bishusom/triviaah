// src/components/home/BrainTeaserRow.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import path from 'path';

function BrainTeaserRow() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);

  const brainTeasers = [
    {
      category: 'plotle',
      name: 'Plotle',
      path: '/brainwave/plotle',
      image: '/imgs/thumbnails/plotle-160x160.webp',
      tagline: 'Guess the movie from emoji plots',
      players: '15.2K',
      color: 'from-purple-500 to-pink-600'
    },
    {
      category: 'capitale',
      name: 'Capitale',
      path: '/brainwave/capitale',
      image: '/imgs/thumbnails/capitale-160x160.webp',
      tagline: 'World capitals challenge',
      color: 'from-green-500 to-emerald-600'
    },
    {
      category: 'celebrile',
      name: 'Celebrile',
      path: '/brainwave/celebrile',
      image: '/imgs/thumbnails/celebrile-160x160.webp',
      tagline: 'Guess the celebrity',
      color: 'from-amber-500 to-orange-600'
    },
    {
      category: 'creaturedle',
      name: 'Creaturedle',
      path: '/brainwave/creaturedle',
      image: '/imgs/thumbnails/creaturedle-160x160.webp',
      tagline: 'Guess the animal',
      color: 'from-emerald-500 to-green-600'
    },
    {
      category: 'foodle',
      name: 'Foodle',
      path: '/brainwave/foodle',
      image: '/imgs/thumbnails/foodle-160x160.webp',
      tagline: 'Guess the food dish',
      color: 'from-yellow-500 to-amber-600'
    },
    {
      category: 'songle',
      name: 'Songle', 
      path: '/brainwave/songle',
      image: '/imgs/thumbnails/songle-160x160.webp',
      tagline: 'Identify songs from lyrics',
      color: 'from-blue-500 to-purple-600'
    },
    {
      category: 'historidle',
      name: 'Historidle',
      path: '/brainwave/historidle',
      image: '/imgs/thumbnails/historidle-160x160.webp',
      tagline: 'Historical events puzzle',
      color: 'from-gray-500 to-slate-600'
    },
    {
      category: 'landmarkdle',
      name: 'Landmardle',
      path: '/brainwave/landmarkdle',
      image: '/imgs/thumbnails/landmarkdle-160x160.webp',
      tagline: 'Identify the landmark from the clues',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      category: 'inventionle',
      name: 'Inventionle',
      path: '/brainwave/inventionle',
      image: '/imgs/thumbnails/inventionle-160x160.webp',
      tagline: 'Identify the invention from the clues',
      color: 'from-red-500 to-brown-600'
    },
    {
      category: 'literale',
      name: 'Literale',
      path: '/brainwave/literale',
      image: '/imgs/thumbnails/literale-160x160.webp',
      tagline: 'Identify the book from the opening line',
      color: 'from-pink-500 to-purple-800'
    },
    {
      category: 'automoble',
      name: 'Automoble',
      path: '/brainwave/automoble',
      image: '/imgs/thumbnails/automoble-160x160.webp',
      tagline: 'Guess the car from the clues',
      color: 'from-red-500 to-brown-600'
    },
    {
      category: 'botanle',
      name: 'Botanle',
      path: '/brainwave/botanle',
      image: '/imgs/thumbnails/botanle-160x160.webp',
      tagline: 'Guess the plant from the clues',
      color: 'from-green-500 to-lime-600'
    },
    {
      category: 'citadle',
      name: 'Citadle',
      path: '/brainwave/citadle',
      image: '/imgs/thumbnails/citadle-160x160.webp',
      tagline: 'Guess the city from the clues',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      category: 'countridle',
      name: 'Countridle', 
      path: '/brainwave/countridle',
      image: '/imgs/thumbnails/countridle-160x160.webp',
      tagline: 'Guess the country from the clues',
      color: 'from-green-500 to-teal-600'
    },
    {
      category: 'synonymle',
      name: 'Synonymle',
      path: '/brainwave/synonymle',
      image: '/imgs/thumbnails/synonymle-160x160.webp',
      tagline: 'Guess the synonym in 6 tries',
      color: 'from-purple-500 to-cyan-600'
    },
    {
      category: 'trordle',
      name: 'Trordle',
      path: '/brainwave/trordle',
      image: '/imgs/thumbnails/trordle-160x160.webp',
      tagline: 'Wordle Style Trivia Quiz - 6 attempts',
      color: 'from-brown-500 to-red-600'
    }
  ];

  // Calculate cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth < 640) {
          setCardsPerView(2); // Mobile: 2 cards
        } else if (window.innerWidth < 768) {
          setCardsPerView(3); // Tablet: 3 cards
        } else {
          setCardsPerView(4); // Desktop: 4 cards
        }
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const totalScrollIndicators = Math.ceil(brainTeasers.length / cardsPerView);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 200;
      const gap = 16; // gap-4 = 16px
      const scrollAmount = (cardWidth + gap) * cardsPerView;
      
      const newScrollLeft = scrollRef.current.scrollLeft + 
        (direction === 'right' ? scrollAmount : -scrollAmount);
      
      scrollRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });

      setTimeout(updateArrowVisibility, 300);
    }
  };

  const updateArrowVisibility = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
      
      // Update current scroll index for dots
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 200;
      const gap = 16;
      const scrollPosition = scrollLeft;
      const itemWidth = cardWidth + gap;
      const newIndex = Math.round(scrollPosition / (itemWidth * cardsPerView));
      setCurrentScrollIndex(Math.max(0, Math.min(newIndex, totalScrollIndicators - 1)));
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 200;
      const gap = 16;
      const scrollAmount = (cardWidth + gap) * cardsPerView * index;
      
      scrollRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="bg-gray-900 py-8 border-b border-gray-800">
      <div className="container mx-auto px-4">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Daily Brain Teasers</h2>
          <Link 
            href="/brainwave"
            className="text-gray-400 hover:text-cyan-400 text-sm font-medium transition-colors"
          >
            View All →
          </Link>
        </div>

        {/* Scrollable Row Container */}
        <div className="relative">
          
          {/* Left Arrow */}
          {showLeftArrow && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-black/80 hover:bg-black rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 backdrop-blur-sm border border-white/20"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Right Arrow */}
          {showRightArrow && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-20 w-8 h-8 sm:w-10 sm:h-10 bg-black/80 hover:bg-black rounded-full flex items-center justify-center text-white transition-all duration-300 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 backdrop-blur-sm border border-white/20"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}

          {/* Teasers Row */}
          <div
            ref={scrollRef}
            onScroll={updateArrowVisibility}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2 px-1 group"
            style={{
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE and Edge
            }}
          >
            {/* Hide scrollbar for Webkit browsers */}
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            {brainTeasers.map((teaser, index) => (
              <Link
                key={teaser.category}
                href={teaser.path}
                className="relative flex-shrink-0 w-36 sm:w-48 transition-all duration-300" // Smaller on mobile
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onFocus={() => setHoveredCard(index)}
                onBlur={() => setHoveredCard(null)}
              >
                {/* Card - Responsive sizing */}
                <div className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 transform h-full ${
                  hoveredCard === index 
                    ? 'border-cyan-500 shadow-2xl shadow-cyan-500/20 scale-105 z-10' 
                    : 'border-transparent hover:border-cyan-400/50 scale-100'
                }`}>
                  
                  {/* Background Gradient with subtle overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${teaser.color}`} />
                  
                  {/* Subtle dark gradient overlay for depth */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
                  
                  {/* Very subtle texture overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/5 to-transparent" />

                  {/* Image Container - Responsive size */}
                  <div className="relative h-24 sm:h-32 flex items-center justify-center p-3 sm:p-4">
                    <div className="relative w-16 h-16 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 border-white/20 bg-black/30 backdrop-blur-sm">
                      <Image
                        src={teaser.image}
                        alt={teaser.name}
                        width={80}
                        height={80}
                        className="object-contain w-full h-full p-1 sm:p-2"
                      />
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                      hoveredCard === index 
                        ? 'bg-black/30 opacity-100' 
                        : 'opacity-0'
                    }`}>
                      <div className="w-8 h-8 sm:w-12 sm:h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg">
                        <Play className="w-3 h-3 sm:w-5 sm:h-5 text-gray-900" />
                      </div>
                    </div>
                  </div>

                  {/* Content - Responsive sizing */}
                  <div className="relative p-3 sm:p-4 min-h-[80px] sm:min-h-[100px] flex flex-col justify-center">
                    <h3 className="text-white font-bold text-sm sm:text-lg mb-1 sm:mb-2 text-center leading-tight drop-shadow-md">
                      {teaser.name}
                    </h3>
                    <p className="text-white/95 text-xs sm:text-sm mb-2 sm:mb-3 text-center leading-tight line-clamp-2 drop-shadow-sm">
                      {teaser.tagline}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Scroll Indicators (Dots) */}
          {totalScrollIndicators > 1 && (
            <div className="flex justify-center items-center gap-2 mt-4 sm:mt-6">
              {Array.from({ length: totalScrollIndicators }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentScrollIndex
                      ? 'bg-cyan-500 w-4'
                      : 'bg-gray-600 hover:bg-gray-500'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default BrainTeaserRow;