// components/ScrollButtons.tsx
'use client';

import { useState, useEffect } from 'react';
import { MoveUp, MoveDown } from 'lucide-react';

export default function ScrollButtons() {
  const [showTop, setShowTop] = useState(false);
  const [showBottom, setShowBottom] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 100);
      setShowBottom(
        window.innerHeight + window.scrollY < document.body.scrollHeight - 100
      );
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (position: 'top' | 'bottom') => {
    window.scrollTo({
      top: position === 'top' ? 0 : document.body.scrollHeight,
      behavior: 'smooth'
    });
  };

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 md:hidden">
      {showTop && (
        <button 
          onClick={() => scrollTo('top')}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Scroll to top"
        >
          <MoveUp />
        </button>
      )}
      {showBottom && (
        <button 
          onClick={() => scrollTo('bottom')}
          className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Scroll to bottom"
        >
          <MoveDown />
        </button>
      )}
    </div>
  );
}