'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Crown, Trophy } from 'lucide-react';
import { getLeaderboard, type LeaderboardEntry } from '@/lib/leaderboard';
import { getPersistentGuestId } from '@/lib/guestId';

function RankAvatar({ name, avatar }: { name: string; avatar: string }) {
  const isImage = avatar.startsWith('/') || avatar.startsWith('http');
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-blue-500 to-cyan-500 text-[11px] font-black text-white overflow-hidden">
      {isImage ? (
        <img
          src={avatar}
          alt={name}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

export default function TopScores() {
  const [scores, setScores] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const guestId = getPersistentGuestId();

  useEffect(() => {
    let active = true;

    const loadScores = async () => {
      try {
        setLoading(true);
        const weeklyScores = await getLeaderboard('weekly');
        if (active) {
          setScores(weeklyScores.slice(0, 5));
        }
      } catch (error) {
        console.error('Error loading home top scores:', error);
        if (active) {
          setScores([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadScores();

    return () => {
      active = false;
    };
  }, []);

  return (
    <div
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl p-4"
      style={{
        background: '#12213a',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase">
          Top Scores
        </p>
        <Link href="/leaderboard" className="text-[10px] font-black uppercase tracking-wider text-gray-400 hover:text-white transition-colors">
          View
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-gray-400">
          <Trophy className="h-5 w-5 animate-pulse" />
        </div>
      ) : scores.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center text-center text-gray-400">
          <Trophy className="mb-3 h-10 w-10 text-gray-600" />
          <p className="text-sm text-white">No weekly scores yet</p>
          <p className="mt-1 text-xs">Play this week to appear here.</p>
        </div>
      ) : (
        <ul className="flex-1 space-y-2">
          {scores.map((player) => (
            <li 
              key={`${player.username}-${player.rank}`} 
              className="flex items-center gap-3 flex"
            >
              <span
                className="w-5 text-center text-xs font-black"
                style={{ color: player.rank === 1 ? '#38bdf8' : '#64748b' }}
              >
                {player.rank}
              </span>

              <RankAvatar name={player.displayName} avatar={player.avatar} />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">
                  {player.displayName}
                  {player.rank === 1 && <Crown className="ml-1 inline-block h-3.5 w-3.5 text-yellow-400" />}
                  {player.displayName === guestId && (
                    <span className="ml-2 text-[10px] font-semibold text-blue-300">(You)</span>
                  )}
                </p>
                <p className="text-[10px] uppercase tracking-wide text-gray-500">@{player.username}</p>
              </div>

              <span className="text-sm font-black tabular-nums text-cyan-400">
                {player.score.toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      )}

      {/* ── Community Hub Fill ────────────────────────────────────────── */}
      {!loading && scores.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center justify-between text-[10px] font-bold">
            <span className="text-gray-500 uppercase tracking-widest">Weekly Reset</span>
            <div className="flex items-center gap-1.5 text-blue-400">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              <span>Updating Live</span>
            </div>
          </div>
          <div className="mt-3 rounded-xl bg-blue-500/5 border border-blue-500/10 p-3">
            <p className="text-[10px] text-blue-300/80 leading-relaxed font-medium italic">
              "Competitive play is active! Jump into a game now to secure your spot for the week."
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
