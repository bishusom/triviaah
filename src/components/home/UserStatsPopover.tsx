'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Trophy, Flame, History, User, Hash } from 'lucide-react';
import { getGuestStats, GuestStats } from '@/lib/guestStats';
import { getPersistentGuestId } from '@/lib/guestId';

export default function UserStatsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<GuestStats | null>(null);
  const [guestId, setGuestId] = useState<string>('');
  
  // Logic for the Dynamic Title
  const isFirstTime = !stats || stats.gamesPlayed === 0;
  const displayTitle = isFirstTime ? "Knowledge Seeker" : guestId;
  const displaySub = isFirstTime ? "Welcome to Triviaah" : "Guest Player";

  useEffect(() => {
    setStats(getGuestStats());
    setGuestId(getPersistentGuestId());
  }, [isOpen]);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-[#bdd0c4] bg-[#e9eee0] transition-all hover:ring-2 hover:ring-[#17675b]/25 active:scale-95"
        aria-label="Open player stats"
        aria-expanded={isOpen}
      >
        <User size={18} className="text-[#17675b]" />
      </button>

      {isOpen && (
          <>
            <div className="fixed inset-0 z-[110]" onClick={() => setIsOpen(false)} />
            
            <div className="absolute right-0 z-[120] mt-4 w-72 origin-top-right animate-[popover-in_150ms_ease-out] overflow-hidden rounded-xl border border-[#d8ddd2] bg-[#fffefb] shadow-[0_18px_48px_rgba(32,59,58,0.16)]">
              {/* Header with Dynamic Guest ID / Title */}
              <div className="border-b border-[#e2e3d8] bg-[#f2f4eb] p-4">
                <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#17675b]">
                  {displaySub}
                </p>
                <div className="flex items-center gap-2">
                  {!isFirstTime && <Hash size={14} className="text-[#627065]" />}
                  <h4 className="truncate text-lg font-black text-[#203b3a]">
                    {displayTitle}
                  </h4>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="p-4 grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center rounded-md border border-[#d8ddd2] bg-[#f4f5ee] p-3">
                  <Flame className={`${stats?.streak ? 'text-orange-500' : 'text-gray-600'} mb-1`} size={20} />
                  <span className="font-bold text-[#203b3a]">{stats?.streak || 0}</span>
                  <span className="text-[10px] font-bold uppercase text-[#627065]">Streak</span>
                </div>
                <div className="flex flex-col items-center rounded-md border border-[#d8ddd2] bg-[#f4f5ee] p-3">
                  <Trophy className="mb-1 text-[#b98722]" size={20} />
                  <span className="font-bold text-[#203b3a]">{stats?.totalScore || 0}</span>
                  <span className="text-[10px] font-bold uppercase text-[#627065]">Points</span>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="px-4 pb-6">
                <div className="flex items-center gap-2 mb-3">
                  <History size={14} className="text-[#627065]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#627065]">
                    Recent Quizzes
                  </span>
                </div>

                <div className="space-y-2">
                  {stats?.recentQuizzes && stats.recentQuizzes.length > 0 ? (
                    stats.recentQuizzes.map((quiz, i) => (
                      <Link 
                        key={i} 
                        href={quiz.href}
                        onClick={() => setIsOpen(false)}
                        className="group block rounded border border-[#d8ddd2] bg-[#f4f5ee] p-2 transition-all hover:bg-[#e9eee0]"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="w-40 truncate text-sm font-bold text-[#203b3a] group-hover:text-[#17675b]">
                            {quiz.title}
                          </span>
                          <span className="font-mono text-[10px] text-[#17675b]">{quiz.score} pts</span>
                        </div>
                        <p className="text-[10px] text-[#627065]">{quiz.date}</p>
                      </Link>
                    ))
                  ) : (
                    <div className="rounded border border-dashed border-[#cdd8cf] bg-[#f4f5ee] py-6 text-center">
                      <p className="px-4 text-xs italic text-[#627065]">
                        Play a game to see your guest ID on the leaderboard!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-[#e2e3d8] bg-[#f2f4eb] p-3">
                <Link href="/leaderboard" onClick={() => setIsOpen(false)} className="text-[10px] text-[#17675b] underline decoration-[#9eb9ad] transition-colors hover:text-[#104b42]">
                  View Leaderboard
                </Link>
                <p className="text-[9px] font-medium italic text-[#627065]">
                  No registration required.
                </p>
              </div>
            </div>
          </>
      )}
    </div>
  );
}
