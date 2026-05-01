'use client';
import { useRef, useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { addFavorite, removeFavorite, isFavorite, FavoriteItem } from '@/lib/favourites';
import { Play, Plus, Check, ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';

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

interface PopupPosition {
  cardCenterX: number;
  cardTop: number;
  cardBottom: number;
  cardWidth: number;
}

function CardPopup({
  item,
  position,
  isFav,
  onToggleFav,
  onDismiss,
  onMouseEnter,
  onMouseLeave,
}: {
  item: TriviaItem;
  position: PopupPosition;
  isFav: boolean;
  onToggleFav: (e: React.MouseEvent) => void;
  onDismiss: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  const POPUP_WIDTH = Math.max(position.cardWidth * 1.5, 300);
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1200;
  const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800;

  let left = position.cardCenterX - POPUP_WIDTH / 2;
  if (left < 8) left = 8;
  if (left + POPUP_WIDTH > viewportWidth - 8) left = viewportWidth - POPUP_WIDTH - 8;

  const estimatedHeight = POPUP_WIDTH * (9 / 16) + 140;
  const spaceBelow = viewportHeight - position.cardTop;
  const openUpward = spaceBelow < estimatedHeight + 20;
  const top = openUpward ? position.cardBottom - estimatedHeight : position.cardTop;

  return createPortal(
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{ duration: 0.18, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed bg-[#181818] rounded-lg border border-white/10 overflow-hidden"
      style={{
        top,
        left,
        width: POPUP_WIDTH,
        zIndex: 99999,
        boxShadow: '0 8px 48px rgba(0,0,0,0.9)',
        transformOrigin: openUpward ? 'bottom center' : 'top center',
        pointerEvents: 'auto',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative aspect-video w-full group/popup-img">
        <Link href={item.path || '#'} className="block w-full h-full">
          <img
            src={item.image || item.image_url || '/api/placeholder/400/225'}
            className="w-full h-full object-cover transition-filter duration-300 group-hover/popup-img:brightness-75"
            alt={item.title || item.name}
            draggable={false}
          />
          {/* Large Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/popup-img:bg-black/40 transition-colors">
            <div className="p-3 rounded-full border-2 border-white/40 group-hover/popup-img:border-white group-hover/popup-img:scale-110 transition-all duration-300">
                <Play className="w-10 h-10 text-white fill-white drop-shadow-lg" />
            </div>
          </div>
        </Link>
        
        {item.isNew && (
          <div className="absolute top-2 left-2 pointer-events-none">
            <span className="bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-sm uppercase tracking-wider">
              NEW
            </span>
          </div>
        )}
      </div>

      <div className="p-3 space-y-3">
        <div className="flex items-center gap-2">
          <Link
            href={item.path || '#'}
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-1.5 rounded-full hover:bg-gray-200 transition flex-shrink-0"
            aria-label="Play"
          >
            <Play className="w-4 h-4 text-black fill-black" />
          </Link>

          <button
            onClick={onToggleFav}
            className="border-2 border-gray-500 p-1.5 rounded-full hover:border-white transition flex-shrink-0"
            aria-label={isFav ? 'Remove from My List' : 'Add to My List'}
          >
            {isFav ? (
              <Check className="w-4 h-4 text-cyan-400" />
            ) : (
              <Plus className="w-4 h-4 text-white" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="ml-auto border-2 border-gray-500 p-1.5 rounded-full hover:border-white transition flex-shrink-0"
            aria-label="Close"
          >
            <ChevronDown className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="space-y-1">
          {item.playCount != null && (
            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="text-cyan-400">
                {item.playCount >= 1000
                  ? `${(item.playCount / 1000).toFixed(1)}k`
                  : item.playCount}{' '}
                plays
              </span>
              {item.isNew && (
                <span className="text-white bg-red-600 px-1 text-[9px] rounded-sm">NEW</span>
              )}
            </div>
          )}

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
    </motion.div>,
    document.body
  );
}

export const NetflixRow = ({ title, items, sectionHref = '#' }: NetflixRowProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeId, setActiveId] = useState<string | number | null>(null);
  const [popupPos, setPopupPos] = useState<PopupPosition | null>(null);
  const [activeItem, setActiveItem] = useState<TriviaItem | null>(null);
  const [favoriteStatus, setFavoriteStatus] = useState<Record<string | number | string, boolean>>({});
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const showTimerRef = useRef<NodeJS.Timeout | null>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to generate a unique row‑scoped ID for items without an explicit id
  const getItemKey = useCallback((item: TriviaItem, index: number): string | number => {
    if (item.id !== undefined && item.id !== null) return item.id;
    // Use sectionHref + index to guarantee uniqueness across different rows
    return `${sectionHref}-${index}`;
  }, [sectionHref]);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) dismiss();
  }, [isMobile]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Load favorite statuses using the unique row‑scoped keys
  useEffect(() => {
    const statuses: Record<string | number, boolean> = {};
    items.forEach((item, i) => {
      const key = getItemKey(item, i);
      statuses[key] = isFavorite(key);
    });
    setFavoriteStatus(statuses);
  }, [items, getItemKey]);

  const clearAll = () => {
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  };

  const dismiss = useCallback(() => {
    clearAll();
    setActiveId(null);
    setActiveItem(null);
    setPopupPos(null);
  }, []);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    el?.addEventListener('scroll', updateArrows, { passive: true });
    window.addEventListener('resize', updateArrows);
    return () => {
      el?.removeEventListener('scroll', updateArrows);
      window.removeEventListener('resize', updateArrows);
    };
  }, [items, updateArrows]);

  useEffect(() => {
    const el = scrollRef.current;
    el?.addEventListener('scroll', dismiss);
    window.addEventListener('scroll', dismiss, { passive: true });
    return () => {
      el?.removeEventListener('scroll', dismiss);
      window.removeEventListener('scroll', dismiss);
    };
  }, [dismiss]);

  useEffect(() => () => clearAll(), []);

  const scroll = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    scrollRef.current.scrollTo({
      left: direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8,
      behavior: 'smooth',
    });
  };

  const handleMouseEnter = useCallback(
    (id: string | number, item: TriviaItem, el: HTMLElement) => {
      if (isMobile) return;
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (activeId === id) return;
      if (showTimerRef.current) clearTimeout(showTimerRef.current);
      showTimerRef.current = setTimeout(() => {
        const rect = el.getBoundingClientRect();
        setPopupPos({
          cardCenterX: rect.left + rect.width / 2,
          cardTop: rect.top,
          cardBottom: rect.bottom,
          cardWidth: rect.width,
        });
        setActiveItem(item);
        setActiveId(id);
      }, 400);
    },
    [activeId, isMobile]
  );

  const handleMouseLeave = useCallback(() => {
    if (isMobile) {
      dismiss();
      return;
    }
    if (showTimerRef.current) clearTimeout(showTimerRef.current);
    hideTimerRef.current = setTimeout(dismiss, 250);
  }, [dismiss, isMobile]);

  const keepPopupOpen = useCallback(() => {
    if (isMobile) return;
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
  }, [isMobile]);

  const toggleFavorite = useCallback(
    (item: TriviaItem, index: number, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const key = getItemKey(item, index);
      const currentlyFav = favoriteStatus[key];
      if (currentlyFav) {
        removeFavorite(key);
      } else {
        const favItem: Omit<FavoriteItem, 'addedAt'> = {
          id: key,
          title: item.title || item.name || 'Untitled',
          image: item.image || item.image_url,
          path: item.path || '#',
        };
        addFavorite(favItem);
      }
      setFavoriteStatus((prev) => ({ ...prev, [key]: !currentlyFav }));
    },
    [favoriteStatus, getItemKey]
  );

  return (
    <div className="relative group/row">
      <style jsx>{`
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Row Header */}
      <div className="mb-1 flex items-center px-4 md:mb-2 md:px-12">
        <Link href={sectionHref} className="group/title flex items-center gap-2">
          <h2 className="text-base font-black tracking-tight text-gray-100 transition-colors group-hover/title:text-white md:text-2xl drop-shadow-md">
            {title}
          </h2>
          <ChevronRight className="w-5 h-5 text-cyan-500 opacity-0 -translate-x-2 group-hover/title:opacity-100 group-hover/title:translate-x-0 transition-all" />
          <span className="hidden md:block text-[10px] text-cyan-600 font-bold uppercase tracking-widest opacity-0 group-hover/title:opacity-100 transition-opacity ml-2">
            Explore All
          </span>
        </Link>
      </div>

      <div className="relative">
        {/* LEFT arrow — desktop only */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('left')}
              className="hidden md:flex absolute left-0 top-0 bottom-0 z-40 w-12 items-center justify-center bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-r-md transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* RIGHT arrow — desktop only */}
        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => scroll('right')}
              className="hidden md:flex absolute right-0 top-0 bottom-0 z-40 w-12 items-center justify-center bg-black/70 hover:bg-black/90 backdrop-blur-sm rounded-r-md transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Cards */}
        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-2 overflow-x-auto px-4 py-1 scroll-smooth sm:gap-3 sm:px-6 md:gap-3.5 md:px-12 md:py-2"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {items.map((item, i) => {
            const key = getItemKey(item, i);
            const isActive = activeId === key;

            return (
              <div
                key={key}
                className="group/item relative w-[44vw] max-w-[180px] flex-none sm:w-48 sm:max-w-none md:w-72"
                onMouseEnter={(e) => handleMouseEnter(key, item, e.currentTarget)}
                onMouseLeave={handleMouseLeave}
              >
                <Link href={item.path || '#'}>
                  <div
                    className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden border border-white/5 transition-transform duration-300"
                    style={{ transform: isActive && !isMobile ? 'scale(1.03)' : 'scale(1)' }}
                  >
                    <img
                      src={item.image || item.image_url || '/api/placeholder/400/225'}
                      alt={item.title || item.name}
                      className="w-full h-full object-cover brightness-90"
                      draggable={false}
                    />
                    <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-2 md:p-3">
                      <p className="line-clamp-1 text-[11px] font-bold text-white md:text-sm">
                        {item.title || item.name}
                      </p>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* Portal popup — only on desktop */}
      {mounted && !isMobile && activeItem && popupPos && (
        <AnimatePresence>
          {activeId !== null && (
            <CardPopup
              key={String(activeId)}
              item={activeItem}
              position={popupPos}
              isFav={favoriteStatus[activeId] ?? false}
              onToggleFav={(e) => {
                const idx = items.findIndex((it, i) => getItemKey(it, i) === activeId);
                if (idx !== -1) toggleFavorite(items[idx], idx, e);
              }}
              onDismiss={dismiss}
              onMouseEnter={keepPopupOpen}
              onMouseLeave={handleMouseLeave}
            />
          )}
        </AnimatePresence>
      )}
    </div>
  );
};
