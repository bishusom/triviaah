// components/daily/dailyQuizTimer.tsx
'use client';

import { useEffect, useState } from 'react';
import { Timer as TimerIcon, RefreshCcw } from 'lucide-react';

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState('');
  const [isToday, setIsToday] = useState(true);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      // Check if it's today (before midnight)
      setIsToday(diff > 0);
      
      if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000); // Update every second for better accuracy
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 rounded-2xl px-6 py-4 backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
          <TimerIcon className="text-white text-lg" />
        </div>
        <div className="text-left">
          <div className="text-sm text-cyan-300 font-medium">Daily Reset</div>
          <div className="text-white font-bold text-lg">
            {timeLeft ? (
              <span className="flex items-center gap-1">
                <RefreshCcw className="text-cyan-400 animate-spin" style={{ animationDuration: '2s' }} />
                {timeLeft}
              </span>
            ) : (
              'Loading...'
            )}
          </div>
        </div>
      </div>
      
      {/* Status Indicator */}
      <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${
        isToday 
          ? 'bg-green-500/20 text-green-400 border-green-500/30' 
          : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
      }`}>
        {isToday ? 'Today' : 'Tomorrow'}
      </div>
    </div>
  );
}