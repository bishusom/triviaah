'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const BILLBOARD_DATA = [
  {
    id: 1,
    title: "GENERAL KNOWLEDGE",
    description: "Thousands of questions across every topic imaginable.",
    image: "/imgs/billboard/abstract-intel.webp",
    link: "/daily-trivias/general-knowledge"
  },
  {
    id: 2,
    title: "ANCIENT HISTORY",
    description: "Journey through time and uncover the secrets of lost civilizations. From the Pyramids to the Silk Road.",
    image: "/imgs/billboard/ancient-discovery.webp",
    link: "/daily-trivias/today-in-history"
  },
  {
    id: 3,
    title: "MOVIES",
    description: "Step into the spotlight and test your knowledge of cinema history, from silent classics to modern blockbusters.",
    image: "/imgs/billboard/cinema-mastery.webp",
    link: "/trivias/movies/quiz"
  },
  {
    id: 4,
    title: "WORD SEARCH",
    description: "Sharpen your focus and hunt for hidden patterns in our signature daily word puzzles.",
    image: "/imgs/billboard/word-search-glow.webp",
    link: "/word-games/word-search"
  },
  {
    id: 5,
    title: "SCIENCE & TECH",
    description: "From quantum physics to the latest in AI. Challenge your understanding of the world and beyond.",
    image: "/imgs/billboard/science-future.webp",
    link: "/trivias/science/quiz"
  },
  {
    id: 6,
    title: "BRAIN WAVES",
    description: "Elevate your cognitive skills with our trending logic and pattern recognition puzzles.",
    image: "/imgs/billboard/game-stage.webp",
    link: "/brainwave"
  }
];

export default function Billboard() {
  const [index, setIndex] = useState(0);

  // Auto-rotate every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % BILLBOARD_DATA.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const current = BILLBOARD_DATA[index];

  return (
    <div className="relative h-[52vh] min-h-[390px] w-full overflow-hidden bg-black sm:h-[58vh] md:h-[85vh]">
      {/* Background Layer with Cross-Fade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.image}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          <img 
            src={current.image} 
            className="w-full h-full object-cover brightness-[0.6]"
            alt={current.title}
          />
          {/* Netflix Gradients */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="absolute bottom-14 left-4 right-4 z-10 max-w-xl md:top-[35%] md:bottom-auto md:left-16 md:right-auto md:max-w-2xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-2 flex items-center gap-2 md:mb-4">
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                Featured
              </span>
            </div>

            <h2 className="mb-2 text-3xl font-black leading-none tracking-tighter text-white italic sm:text-4xl md:mb-3 md:text-7xl">
              {current.title}
            </h2>
            
            <p className="mb-4 line-clamp-2 max-w-lg text-sm leading-snug text-gray-200 drop-shadow-lg md:mb-8 md:text-xl md:leading-relaxed">
              {current.description}
            </p>

            <div className="flex gap-2 sm:gap-3 md:gap-4">
              <Link 
                href={current.link}
                className="flex items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-black transition-transform hover:bg-white/80 active:scale-95 md:px-8 md:py-2.5 md:text-base"
              >
                <span>▶</span> Play Now
              </Link>
              <Link 
                href="/trivias"
                className="rounded-md bg-gray-500/40 px-4 py-2 text-sm font-bold text-white backdrop-blur-md hover:bg-gray-500/60 md:px-8 md:py-2.5 md:text-base"
              >
                Browse Categories
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators (Small bars at bottom-right) */}
      <div className="absolute bottom-6 right-4 z-30 flex gap-2 md:bottom-24 md:right-16">
        {BILLBOARD_DATA.map((_, i) => (
          <div 
            key={i}
            className={`h-1 transition-all duration-500 ${i === index ? 'w-8 bg-cyan-400' : 'w-4 bg-gray-600'}`}
          />
        ))}
      </div>
    </div>
  );
}
