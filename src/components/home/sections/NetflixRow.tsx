'use client';
import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react'; // Adding an icon for better affordance

interface TriviaItem {
  id?: string | number;
  title?: string;
  name?: string; 
  image?: string;
  image_url?: string;
  path?: string;
}

interface NetflixRowProps {
  title: string;
  items: readonly TriviaItem[];
  sectionHref?: string; // New prop to link the heading to a specific page
}

export const NetflixRow = ({ title, items, sectionHref = "#" }: NetflixRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.7 : scrollLeft + clientWidth * 0.7;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mb-10 group/row">
      {/* Updated Heading with Gradient and Link */}
      <div className="flex items-center justify-between mb-3 px-8 md:px-12">
        <Link 
          href={sectionHref} 
          className="group/title flex items-center gap-2"
        >
          <h2 className="text-lg md:text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent transition-opacity group-hover/title:opacity-80">
            {title}
          </h2>
          <ChevronRight className="w-5 h-5 text-cyan-500 opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all" />
          
          {/* Subtle "Explore All" hint for desktop */}
          <span className="hidden md:block text-[10px] text-cyan-600 font-bold uppercase tracking-widest opacity-0 group-hover/title:opacity-100 transition-opacity ml-2">
            Explore All
          </span>
        </Link>
      </div>

      <div className="relative flex items-center">
        {/* Navigation Arrows */}
        {showLeftArrow && (
          <button 
            onClick={() => scroll('left')} 
            className="absolute left-0 z-40 h-full w-12 bg-black/60 text-white opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
          >
            ‹
          </button>
        )}
        
        <div 
          ref={scrollRef}
          onScroll={() => setShowLeftArrow(scrollRef.current ? scrollRef.current.scrollLeft > 0 : false)}
          className="flex gap-3 overflow-x-auto px-8 md:px-12 no-scrollbar scroll-smooth py-4"
        >
          {items.map((item, i) => (
            <Link href={item.path || '#'} key={item.id || i} className="flex-none">
              <motion.div
                whileHover={{ scale: 1.08, zIndex: 10 }}
                className="group relative w-44 md:w-72 aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-lg cursor-pointer border border-white/5"
              >
                <img 
                  src={item.image || item.image_url || "/api/placeholder/400/225"} 
                  alt={item.title || item.name}
                  className="w-full h-full object-cover brightness-90 group-hover:brightness-100 transition-all duration-300"
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-end pointer-events-none">
                  <motion.p 
                    variants={{
                      hover: { scale: 1.15, x: 5 }
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="text-white font-bold text-xs md:text-sm drop-shadow-md origin-left"
                  >
                    {item.title || item.name}
                  </motion.p>
                  <div className="w-0 group-hover:w-12 h-0.5 bg-cyan-500 transition-all duration-300 mt-1" />
                </div>
              </motion.div>
            </Link>
          ))}
        </div>

        <button 
          onClick={() => scroll('right')} 
          className="absolute right-0 z-40 h-full w-12 bg-black/60 text-white opacity-0 group-hover/row:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm"
        >
          ›
        </button>
      </div>
    </div>
  );
};