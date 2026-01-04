// src/components/home/DailyTriviaCards.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Clock, Users, Zap, ChevronLeft, ChevronRight } from 'lucide-react';

export default function DailyTriviaCards() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);

  const featuredQuizzes = [
    {
      id: 1,
      title: "Quick Fire Challenge",
      description: "Blitz through rapid-fire questions in just 60 seconds",
      questions: 7,
      time: "1 min",
      players: "8.3K",
      category: "Quick Fire",
      image: "/imgs/daily-trivias/quick-fire.webp",
      color: "from-orange-500 to-red-600",
      featured: true,
      slug: "quick-fire",
      difficulty: "Hard"
    },
    {
      id: 2,
      title: "General Knowledge",
      description: "Test your knowledge across all categories with today's featured quiz",
      questions: 10,
      time: "6 mins",
      players: "5.2K",
      category: "Mixed",
      image: "/imgs/daily-trivias/general-knowledge.webp",
      color: "from-cyan-500 to-blue-600",
      featured: true,
      slug: "general-knowledge",
      difficulty: "Medium"
    },
    {
      id: 3,
      title: "Today in History",
      description: "Journey through time and explore historical events",
      questions: 5,
      time: "3 min",
      players: "3.2K",
      category: "History",
      image: "/imgs/daily-trivias/today-history.webp", 
      color: "from-amber-500 to-orange-600",
      slug: "today-in-history",
      difficulty: "Medium"
    },
    {
      id: 4,
      title: "Entertainment",
      description: "Blockbusters, classics, and everything in between",
      questions: 10,
      time: "5 min",
      players: "4.5K",
      category: "Entertainment",
      image: "/imgs/daily-trivias/entertainment.webp",
      color: "from-purple-500 to-pink-600",
      slug: "entertainment",
      difficulty: "Easy"
    },
    {
      id: 5,
      title: "Geography",
      description: "Explore countries, capitals, and landmarks around the world",
      questions: 10,
      time: "5 min",
      players: "3.2K",
      category: "Geography",
      image: "/imgs/daily-trivias/geography.webp", 
      color: "from-blue-500 to-indigo-600",
      slug: "geography",
      difficulty: "Medium"
    },
    {
      id: 6,
      title: "Science & Technology",
      description: "Explore the latest in tech and scientific discoveries",
      questions: 10,
      time: "6 mins", 
      players: "3.8K",
      category: "Science",
      image: "/imgs/daily-trivias/science.webp",
      color: "from-green-500 to-emerald-600",
      slug: "science",
      difficulty: "Medium"
    },
    {
      id: 7,
      title: "Arts and Literature",
      description: "Masterpieces, authors, and artistic movements",
      questions: 10,
      time: "5 min",
      players: "2.9K",
      category: "Arts",
      image: "/imgs/daily-trivias/arts-literature.webp",
      color: "from-amber-500 to-orange-600",
      slug: "arts-literature",
      difficulty: "Hard"
    },
    {
      id: 8,
      title: "Sports Legends",
      description: "Test your knowledge of sports history and legends",
      questions: 10,
      time: "5 min",
      players: "2.9K",
      category: "Sports",
      image: "/imgs/daily-trivias/sports.webp",
      color: "from-red-500 to-rose-600",
      slug: "sports",
      difficulty: "Easy"
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

  const totalScrollIndicators = Math.ceil(featuredQuizzes.length / cardsPerView);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 180;
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
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 180;
      const gap = 16;
      const scrollPosition = scrollLeft;
      const itemWidth = cardWidth + gap;
      const newIndex = Math.round(scrollPosition / (itemWidth * cardsPerView));
      setCurrentScrollIndex(Math.max(0, Math.min(newIndex, totalScrollIndicators - 1)));
    }
  };

  const scrollToIndex = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 180;
      const gap = 16;
      const scrollAmount = (cardWidth + gap) * cardsPerView * index;
      
      scrollRef.current.scrollTo({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-500/20 border-green-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'hard': return 'text-red-400 bg-red-500/20 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return '🌿';
      case 'medium': return '⚡';
      case 'hard': return '🔥';
      default: return '🎯';
    }
  };

  return (
    <section className="bg-gray-900 py-8 border-b border-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Daily Trivias
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Featured quizzes updated every 24 hours
            </p>
          </div>
          <Link 
            href="/daily-trivias"
            className="text-gray-400 hover:text-cyan-400 text-sm font-medium transition-colors mt-2 sm:mt-0"
          >
            View All →
          </Link>
        </div>

        {/* Scrollable Container */}
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

          {/* Cards Row */}
          <div
            ref={scrollRef}
            onScroll={updateArrowVisibility}
            className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-2 px-1 group"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            
            {featuredQuizzes.map((quiz, index) => (
              <Link
                key={quiz.id}
                href={`/daily-trivias/${quiz.slug}`}
                className="relative flex-shrink-0 w-40 sm:w-48 transition-all duration-300"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onFocus={() => setHoveredCard(index)}
                onBlur={() => setHoveredCard(null)}
              >
                {/* Card with gradient background like BrainTeaserRow */}
                <div className={`relative rounded-xl overflow-hidden border-2 transition-all duration-300 transform h-full ${
                  hoveredCard === index 
                    ? 'border-cyan-500 shadow-2xl shadow-cyan-500/20 scale-105 z-10' 
                    : 'border-transparent hover:border-cyan-400/50 scale-100'
                }`}>
                  
                  {/* Background Gradient */}
                  <div className="absolute inset-0 bg-gray-700" />
                  
                  {/* Subtle dark gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />
                  
                  {/* Very subtle texture overlay */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/5 to-transparent" />

                  {/* Image Container with thumbnail like BrainTeaserRow */}
                  <div className="relative h-24 sm:h-32 flex items-center justify-center p-3 sm:p-4">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 border-white/20 bg-black/30 backdrop-blur-sm">
                      <Image
                        src={quiz.image}
                        alt={quiz.title}
                        width={160}
                        height={160}
                        className="object-contain w-full h-full p-1 sm:p-2"
                      />
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
                      hoveredCard === index 
                        ? 'bg-black/30 opacity-100' 
                        : 'opacity-0'
                    }`}>
                      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-lg">
                        <Play className="w-3 h-3 sm:w-4 sm:h-4 text-gray-900" />
                      </div>
                    </div>
                  </div>

                  {/* Content - Compact layout */}
                  <div className="relative p-3 sm:p-4 min-h-[80px] sm:min-h-[100px] flex flex-col justify-center">
                    <h3 className="text-white font-bold text-sm sm:text-lg mb-1 sm:mb-2 text-center leading-tight drop-shadow-md">
                      {quiz.title}
                    </h3>
                    <p className="text-white/95 text-xs sm:text-sm mb-2 sm:mb-3 text-center leading-tight line-clamp-2 drop-shadow-sm">
                      {quiz.description}
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