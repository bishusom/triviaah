import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function MiniHeroQuickFire() {
  const [timeLeft, setTimeLeft] = useState(75); // 5 questions × 15 seconds
  const [isVisible, setIsVisible] = useState(false);

  // Animate in on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`bg-blue-600 rounded-xl p-6 mb-8 text-white shadow-lg transition-all duration-700 ease-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
    }`}>
      <div className="flex flex-col md:flex-row items-center justify-center justify-between gap-4">
        
        {/* Left Side - Main Content */}
        <div className="flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <span className="bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">
              🔥 QUICK FIRE CHALLENGE - 5 Questions, 15 Seconds Each!
            </span>
            <Link href="/quick-fire" className="inline-block">
              <button className="bg-white text-orange-600 px-6 py-2 rounded-full font-bold text-sm shadow-md transition-all duration-300 hover:scale-105 active:scale-95 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-orange-500">
                Start Quick Fire →
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}