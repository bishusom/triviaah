'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Flame, History, Star, User } from 'lucide-react';
import { getGuestStats, GuestStats } from '@/lib/guestStats';
import { userProfile } from '@/hooks/userProfile'; // Using your existing hook
import { im } from 'mathjs';

export default function UserStatsPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState<GuestStats | null>(null);
  
  // Your existing hook (assuming 'user' comes from an Auth context elsewhere)
  // For now, we treat as null to show Guest logic
  const { profile, loading } = userProfile(null); 

  useEffect(() => {
    setStats(getGuestStats());
  }, []);

  return (
    <div className="relative">
      {/* The User Icon in NavBar */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-8 h-8 rounded-sm bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center hover:ring-2 ring-white/50 transition-all"
      >
        <User size={18} className="text-white" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay to close */}
            <div className="fixed inset-0 z-[110]" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-4 w-72 bg-[#181818] border border-white/10 rounded-md shadow-2xl z-[120] overflow-hidden"
            >
              {/* Header */}
              <div className="p-4 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Guest Player</p>
                <h4 className="text-white font-black text-lg">Knowledge Seeker</h4>
              </div>

              {/* Stats Grid */}
              <div className="p-4 grid grid-cols-2 gap-3">
                <div className="bg-white/5 p-3 rounded-md flex flex-col items-center">
                  <Flame className="text-orange-500 mb-1" size={20} />
                  <span className="text-white font-bold">{stats?.streak || 0}</span>
                  <span className="text-[10px] text-gray-500 uppercase">Streak</span>
                </div>
                <div className="bg-white/5 p-3 rounded-md flex flex-col items-center">
                  <Trophy className="text-cyan-400 mb-1" size={20} />
                  <span className="text-white font-bold">{stats?.totalScore || 0}</span>
                  <span className="text-[10px] text-gray-500 uppercase">Points</span>
                </div>
              </div>

              {/* Recent Activity Mini-List */}
              <div className="px-4 pb-6">
                <div className="flex items-center gap-2 mb-3">
                  <History size={14} className="text-cyan-500" />
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                    Continue Playing
                  </span>
                </div>

                <div className="space-y-2">
                  {stats?.recentQuizzes && stats.recentQuizzes.length > 0 ? (
                    stats.recentQuizzes.map((quiz, i) => (
                      <Link 
                        key={i} 
                        href={quiz.href}
                        className="block group bg-white/5 hover:bg-white/10 border border-white/5 rounded p-2 transition-all"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-bold text-gray-200 group-hover:text-cyan-400 truncate w-40">
                            {quiz.title}
                          </span>
                          <span className="text-[10px] font-mono text-cyan-500/70">{quiz.score}pts</span>
                        </div>
                        <p className="text-[10px] text-gray-500">{quiz.date}</p>
                      </Link>
                    ))
                  ) : (
                    <div className="py-4 text-center border border-dashed border-white/10 rounded">
                      <p className="text-xs text-gray-600 italic">Your recent games will appear here</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Call to Action (Optional) */}
              <div className="p-4 bg-cyan-600/10 border-t border-white/5">
                <p className="text-[10px] text-cyan-400 font-medium text-center leading-tight">
                  Your stats are saved locally to this browser.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}