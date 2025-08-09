// components/Timer.tsx
'use client';

import { useState, useEffect } from 'react';
import { MdRefresh } from 'react-icons/md';

export default function Timer() {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000); // Update every second
    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  function calculateTimeLeft() {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const diff = midnight.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  return (
    <div className="mt-4 bg-blue-100 text-blue-800 inline-flex items-center px-4 py-2 rounded-full">
      <MdRefresh className="mr-2" />
      <span>Resets in: <strong>{timeLeft}</strong></span>
    </div>
  );
}