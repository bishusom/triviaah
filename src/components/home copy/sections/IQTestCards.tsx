// src/components/home/DailyTriviaCards.tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';

export default function IQTestCards() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [currentScrollIndex, setCurrentScrollIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(4);

  const personalityTests = [
    {
      id: 'capa',
      name: 'Cognitive Abilities Profile Assessment (CAPA)',
      description: 'Comprehensive assessment of your cognitive strengths across multiple intelligence domains',
      image: "/imgs/iq-personality-tests/capa.webp",
      color: 'from-indigo-500 to-blue-600',
      questions: 70,
      time: '12 min',
      link: '/iq-and-personality-tests/capa'
    },
    {
      id: 'matrixiq',
      name: 'MatrixIQ Test',
      description: 'Measure your fluid intelligence with advanced pattern recognition and abstract reasoning challenges',
      image: "/imgs/iq-personality-tests/matrixiq.webp",
      color: 'from-teal-500 to-green-600',
      questions: 35,
      time: '15 min',
      link: '/iq-and-personality-tests/matrixiq'
    },
    {
      id: 'mbti',
      name: 'MBTI Personality Test',
      description: 'Discover your Myers-Briggs Type (INFP, ESTJ, etc.) with detailed career matches and strengths analysis',
      image: "/imgs/iq-personality-tests/mbti.webp",
      color: 'from-blue-500 to-purple-600',
      questions: 60,
      time: '10 min',
      link: '/iq-and-personality-tests/mbti'
    },
    {
      id: 'big-five',
      name: 'Big Five (OCEAN) Test',
      description: 'Scientifically-validated trait analysis with percentile scores for all 5 major personality dimensions',
      image: "/imgs/iq-personality-tests/big-five.webp",
      color: 'from-purple-500 to-pink-600',
      questions: 60,
      time: '10 min',
      link: '/iq-and-personality-tests/big-five'
    },
    {
      id: 'enneagram',
      name: 'Enneagram Test',
      description: 'Discover your Enneagram type with core motivations, fears, and growth paths',
      image: "/imgs/iq-personality-tests/enneagram.webp",
      color: 'from-orange-500 to-red-600',
      questions: 50,
      time: '8 min',
      link: '/iq-and-personality-tests/enneagram',
    },
    {
      id: 'disc',
      name: 'DISC Assessment',
      description: 'Understand your communication style (Dominance, Influence, Steadiness, Conscientiousness)',
      image: "/imgs/iq-personality-tests/disc.webp",
      color: 'from-green-500 to-cyan-600',
      questions: 40,
      time: '7 min',
      link: '/iq-and-personality-tests/disc',
    },
    {
      id: 'love-languages',
      name: 'Love Languages Test',
      description: 'Discover how you give and receive love in relationships',
      image: "/imgs/iq-personality-tests/love-languages.webp",
      color: 'from-pink-500 to-red-600',
      questions: 30,
      time: '5 min',
      link: '/iq-and-personality-tests/love-languages',
    },
    {
      id: 'holland-code',
      name: 'Holland Career Test',
      description: 'Find your ideal career path based on your personality (RIASEC model)',
      image: "/imgs/iq-personality-tests/holland-code.webp",
      color: 'from-blue-300 to-blue-600',
      questions: 45,
      time: '8 min',
      link: '/iq-and-personality-tests/holland-code'
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

  const totalScrollIndicators = Math.ceil(personalityTests.length / cardsPerView);

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

  return (
    <section className="bg-gray-900 py-8 border-b border-gray-800">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              IQ & Personality Tests
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              Discover your cognitive abilities and personality traits with our scientifically-backed tests.
            </p>
          </div>
          <Link 
            href="/iq-and-personality-tests"
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
            
            {personalityTests.map((test, index) => (
              <Link
                key={test.id}
                href={`${test.link}`}
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
                        src={test.image}
                        alt={test.name}
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
                      {test.name}
                    </h3>
                    <p className="text-white/95 text-xs sm:text-sm mb-2 sm:mb-3 text-center leading-tight line-clamp-2 drop-shadow-sm">
                      {test.description}
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