// components/daily/dailyQuizTimer.tsx
'use client';

import { useEffect, useState } from 'react';

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const diff = midnight.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 600000); // 10 minutes
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="text-blue-600 font-medium mt-2">
      {timeLeft ? `Resets in ${timeLeft}` : 'Loading...'}
    </div>
  );
}