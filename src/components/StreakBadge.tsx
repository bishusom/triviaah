// components/StreakBadge.tsx
'use client';

import { useUser } from '@/context/UserContext';
import Link from 'next/link';

export default function StreakBadge() {
  const { user } = useUser();
  const streak = user?.streak || 0;

  if (streak === 0) return null;

  return (
    <Link href="/daily/general-knowledge" className="block mb-6">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-lg shadow-lg text-center hover:scale-105 transition-transform">
        <div className="flex items-center justify-center gap-2">
          <div className="text-2xl animate-pulse">🔥</div>
          <div>
            <h3 className="font-bold text-lg">Your Streak: {streak} days!</h3>
            <p className="text-sm opacity-90">
              {streak > 1 ? 'Keep it going!' : 'Start building your streak!'}
            </p>
          </div>
        </div>
        <p className="text-xs mt-2 opacity-80">
          Play today&apos;s quiz to maintain your streak
        </p>
      </div>
    </Link>
  );
}