'use client';
import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { addFavorite, removeFavorite, isFavorite, FavoriteItem } from '@/lib/favourites';
import { Play, Plus, Check, ChevronDown, ChevronRight } from 'lucide-react';

interface TriviaItem {
  id?: string | number;
  title?: string;
  name?: string;
  image?: string;
  image_url?: string;
  path?: string;
  playCount?: number;
  isNew?: boolean;
  duration?: string;
  difficulty?: string;
  tagline?: string;
}

interface NetflixRowProps {
  title: string;
  items: readonly TriviaItem[];
  sectionHref?: string;
}

export const NetflixRow = ({ title, items, sectionHref = "#" }: NetflixRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [favoriteStatus, setFavoriteStatus] = useState<Record<string | number, boolean>>({});

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.7 : scrollLeft + clientWidth * 0.7;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  const handleMouseEnter = (id: string | number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveId(id);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveId(null);
    }, 200);
  };

  const handleClick = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (activeId === id) {
      setActiveId(null);
    } else {
      setActiveId(id);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Load favorite statuses for all items
  useEffect(() => {
    const statuses: Record<string | number, boolean> = {};
    items.forEach((item, i) => {
      const id = item.id ?? i;
      statuses[id] = isFavorite(id);
    });
    setFavoriteStatus(statuses);
  }, [items]);

  const toggleFavorite = (item: TriviaItem, index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const id = item.id ?? index;
    if (favoriteStatus[id]) {
      removeFavorite(id);
    } else {
      const favItem: Omit<FavoriteItem, 'addedAt'> = {
        id: id,
        title: item.title || item.name || 'Untitled',
        image: item.image || item.image_url,
        path: item.path || '#',
      };
      addFavorite(favItem);
    }
    setFavoriteStatus(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="relative mb-8 group/row z-10">
      {/* Row Header */}
      <div className="flex items-center justify-between mb-2 px-8 md:px-12">
        <Link href={sectionHref} className="group/title flex items-center gap-2">
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

        {/* Scrollable Row - Important: overflow-y-visible + enough bottom padding */}
        <div
          ref={scrollRef}
          onScroll={() => setShowLeftArrow(scrollRef.current ? scrollRef.current.scrollLeft > 0 : false)}
          className="flex gap-3 overflow-x-auto overflow-y-visible px-8 md:px-12 no-scrollbar scroll-smooth pt-4 pb-32"
          style={{ minHeight: '280px' }} // ensure room for popup
        >
          {items.map((item, i) => {
            const id = item.id ?? i;
            const isActive = activeId === id;
            return (
              <div
                key={id}
                className="flex-none relative w-44 md:w-72 group/item"
                onMouseEnter={() => handleMouseEnter(id)}
                onMouseLeave={handleMouseLeave}
                onClick={(e) => handleClick(id, e)}
              >
                {/* Base Card */}
                <Link href={item.path || '#'}>
                  <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden border border-white/5 transition-transform duration-300 group-hover/item:opacity-0">
                    <img
                      src={item.image || item.image_url || "/api/placeholder/400/225"}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover brightness-90"
                    />
                    <div className="absolute inset-0 p-3 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white font-bold text-xs md:text-sm line-clamp-1">
                        {item.title || item.name}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Popup Card */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: -30 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute top-0 left-0 z-50 w-full bg-[#181818] rounded-lg shadow-2xl border border-white/10 overflow-hidden"
                      style={{ transformOrigin: "top center" }}
                    >
                      <div className="relative aspect-video w-full">
                        <img
                          src={item.image || item.image_url || "/api/placeholder/400/225"}
                          className="w-full h-full object-cover"
                          alt="preview"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Play className="w-10 h-10 text-white fill-white drop-shadow-lg" />
                        </div>
                      </div>

                      <div className="p-3 space-y-3">
                        <div className="flex items-center gap-2">
                          <Link href={item.path || '#'} className="bg-white p-1.5 rounded-full hover:bg-gray-200 transition">
                            <Play className="w-4 h-4 text-black fill-black" />
                          </Link>
                           <button 
                            onClick={(e) => toggleFavorite(item, i, e)}
                            className="border-2 border-gray-500 p-1.5 rounded-full hover:border-white transition"
                          >
                            {favoriteStatus[item.id ?? i] ? 
                              <Check className="w-4 h-4 text-cyan-400" /> : 
                              <Plus className="w-4 h-4 text-white" />
                            }
                          </button>
                          <button className="ml-auto border-2 border-gray-500 p-1.5 rounded-full hover:border-white transition">
                            <ChevronDown className="w-4 h-4 text-white" />
                          </button>
                        </div>

                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[11px] font-bold">
                            {item.playCount != null && (
                              <span className="text-cyan-400">
                                {item.playCount >= 1000 
                                  ? `${(item.playCount / 1000).toFixed(1)}k` 
                                  : item.playCount} plays
                              </span>
                            )}
                            {item.isNew && <span className="text-white bg-red-600 px-1 text-[9px] rounded-sm">NEW</span>}
                          </div>
                          <p className="text-white text-xs font-semibold">{item.title || item.name}</p>
                          <div className="flex items-center gap-1.5 text-[10px] text-gray-300">
                            <span>{item.duration || '5m'}</span>
                            <span className="text-gray-600">•</span>
                            <span>{item.difficulty || 'Casual'}</span>
                          </div>
                          {item.tagline && (
                            <p className="text-xs text-gray-400 italic line-clamp-2 mt-2">{item.tagline}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
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