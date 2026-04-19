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
    <div className="relative h-[75vh] md:h-[85vh] w-full overflow-hidden bg-black">
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
      <div className="absolute top-[35%] left-8 md:left-16 max-w-2xl z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                Featured
              </span>
            </div>

            <h2 className="text-5xl md:text-7xl font-black text-white mb-3 leading-none tracking-tighter italic">
              {current.title}
            </h2>
            
            <p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow-lg max-w-lg leading-relaxed">
              {current.description}
            </p>

            <div className="flex gap-4">
              <Link 
                href={current.link}
                className="bg-white text-black px-8 py-2.5 rounded-md font-bold hover:bg-white/80 flex items-center gap-2 transition-transform active:scale-95"
              >
                <span>▶</span> Play Now
              </Link>
              <Link 
                href="/trivias"
                className="bg-gray-500/40 text-white px-8 py-2.5 rounded-md font-bold backdrop-blur-md hover:bg-gray-500/60"
              >
                Browse Categories
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Slide Indicators (Small bars at bottom-right) */}
      <div className="absolute bottom-24 right-8 md:right-16 flex gap-2 z-30">
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
