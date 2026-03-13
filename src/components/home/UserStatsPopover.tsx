'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, History, User, Hash } from 'lucide-react'; // Added Hash icon
import { getGuestStats, GuestStats } from '@/lib/guestStats';
import { userProfile } from '@/hooks/userProfile';
import { getPersistentGuestId } from '@/lib/guestId'; // Import your existing utility

export default function UserStatsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<GuestStats | null>(null);
  const [guestId, setGuestId] = useState<string>('');
  
  const { profile, loading } = userProfile(null); 

  useEffect(() => {
    setStats(getGuestStats());
    // Get the same ID used in the leaderboard
    setGuestId(getPersistentGuestId());
  }, [isOpen]); // Refresh stats whenever the popover opens

  // Logic for the Dynamic Title
  const isFirstTime = !stats || stats.gamesPlayed === 0;
  const displayTitle = isFirstTime ? "Knowledge Seeker" : guestId;
  const displaySub = isFirstTime ? "Welcome to Triviaah" : "Guest Player";

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-sm bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center hover:ring-2 ring-white/50 transition-all active:scale-95"
      >
        <User size={18} className="text-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[110]" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-72 bg-[#181818] border border-white/10 rounded-md shadow-2xl z-[120] overflow-hidden"
            >
              {/* Header with Dynamic Guest ID / Title */}
              <div className="p-4 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                <p className="text-[10px] font-bold text-cyan-500 uppercase tracking-[0.2em] mb-1">
                  {displaySub}
                </p>
                <div className="flex items-center gap-2">
                  {!isFirstTime && <Hash size={14} className="text-gray-500" />}
                  <h4 className="text-white font-black text-lg truncate">
                    {displayTitle}
                  </h4>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="p-4 grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-md flex flex-col items-center border border-white/5">
                  <Flame className={`${stats?.streak ? 'text-orange-500' : 'text-gray-600'} mb-1`} size={20} />
                  <span className="text-white font-bold">{stats?.streak || 0}</span>
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Streak</span>
                </div>
                <div className="bg-white/5 p-3 rounded-md flex flex-col items-center border border-white/5">
                  <Trophy className="text-cyan-400 mb-1" size={20} />
                  <span className="text-white font-bold">{stats?.totalScore || 0}</span>
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Points</span>
                </div>
              </div>

              {/* Recent Activity Section */}
              <div className="px-4 pb-6">
                <div className="flex items-center gap-2 mb-3">
                  <History size={14} className="text-gray-500" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
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
                        className="block group bg-white/5 hover:bg-white/10 border border-white/5 rounded p-2 transition-all"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-bold text-gray-200 group-hover:text-cyan-400 truncate w-40">
                            {quiz.title}
                          </span>
                          <span className="text-[10px] font-mono text-cyan-500/70">{quiz.score} pts</span>
                        </div>
                        <p className="text-[10px] text-gray-500">{quiz.date}</p>
                      </Link>
                    ))
                  ) : (
                    <div className="py-6 text-center border border-dashed border-white/10 rounded bg-white/5">
                      <p className="text-xs text-gray-600 italic px-4">
                        Play a game to see your guest ID on the leaderboard!
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-3 bg-black/40 border-t border-white/5 flex items-center justify-between">
                <Link href="/leaderboard" onClick={() => setIsOpen(false)} className="text-[10px] text-gray-400 hover:text-white transition-colors underline decoration-gray-700">
                  View Leaderboard
                </Link>
                <p className="text-[9px] text-gray-600 font-medium italic">
                  No registration required.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}