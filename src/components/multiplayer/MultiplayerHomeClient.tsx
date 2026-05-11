'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Plus, Users } from 'lucide-react';

import Ads from '@/components/common/Ads';
import { getPersistentGuestId } from '@/lib/guestId';

const TIMER_OPTIONS = [10, 15, 20, 30, 45, 60];

type MultiplayerHomeClientProps = {
  initialCategory?: string;
  initialCategoryName?: string;
  initialSubcategory?: string;
  quizType?: 'trivias' | 'daily-trivias';
};

export function MultiplayerHomeClient({
  initialCategory,
  initialCategoryName,
  initialSubcategory,
  quizType = 'trivias',
}: MultiplayerHomeClientProps) {
  const router = useRouter();
  const category = initialCategory || '';
  const subcategory = initialSubcategory || '';
  const displayCategory = initialCategoryName || initialCategory || '';
  const [timePerQuestion, setTimePerQuestion] = useState(
    quizType === 'daily-trivias' && category === 'quick-fire' ? 15 : 30
  );
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');

  const guestId = useMemo(() => {
    if (typeof window === 'undefined') return 'Guest';
    return getPersistentGuestId();
  }, []);

  async function createRoom() {
    setIsCreating(true);
    setError('');

    const response = await fetch('/api/multiplayer/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category,
        subcategory,
        quizType,
        timePerQuestion,
        hostGuestId: guestId,
        hostName: name || guestId,
      }),
    });

    const data = await response.json();
    setIsCreating(false);

    if (!response.ok) {
      setError(data.error || 'Could not create a room.');
      return;
    }

    router.push(`/multiplayer/${data.room.room_code}`);
  }

  function joinRoom() {
    const code = roomCode.trim().toUpperCase();
    if (code) router.push(`/multiplayer/${code}`);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-10">
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
            <Users className="h-3.5 w-3.5" />
            Multiplayer Trivia
          </div>
          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            Invite friends into a private trivia room.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
            Create a room from the quiz you selected, share the link, and race through the same question set with a live scoreboard.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl">
            <h2 className="text-xl font-bold">Create a room</h2>
            <div className="mt-5 grid gap-4">
              {!initialCategory ? (
                <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
                  Start from a trivia category or topic page so the multiplayer room knows which quiz to use.
                </div>
              ) : null}
              <label className="grid gap-2 text-sm font-semibold text-slate-200">
                Display name
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder={guestId}
                  className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
                />
              </label>
              {initialCategory ? (
                <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200">
                    {quizType === 'daily-trivias' ? 'Daily quiz category' : 'Quiz category'}
                  </p>
                  <p className="mt-2 font-bold text-white">{displayCategory}</p>
                </div>
              ) : null}
              {subcategory ? (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200">
                    Focused topic
                  </p>
                  <p className="mt-2 font-bold text-white">{subcategory}</p>
                </div>
              ) : null}
              <div className="grid gap-2">
                <p className="text-sm font-semibold text-slate-200">Time per question</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                  {TIMER_OPTIONS.map((seconds) => (
                    <button
                      key={seconds}
                      type="button"
                      onClick={() => setTimePerQuestion(seconds)}
                      className={`rounded-xl border px-3 py-2 text-sm font-bold transition ${
                        timePerQuestion === seconds
                          ? 'border-cyan-300 bg-cyan-400 text-slate-950'
                          : 'border-slate-700 bg-slate-950 text-slate-200 hover:border-cyan-400/60'
                      }`}
                    >
                      {seconds} seconds
                    </button>
                  ))}
                </div>
              </div>
              {error ? <p className="text-sm text-rose-300">{error}</p> : null}
              <button
                type="button"
                onClick={createRoom}
                disabled={isCreating || !initialCategory}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isCreating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                Create Invite Room
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl">
            <h2 className="text-xl font-bold">Join by code</h2>
            <div className="mt-5 grid gap-4">
              <input
                value={roomCode}
                onChange={(event) => setRoomCode(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') joinRoom();
                }}
                placeholder="ABC123"
                className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white uppercase tracking-[0.2em] outline-none transition focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={joinRoom}
                className="rounded-xl border border-cyan-400/30 px-5 py-3 text-sm font-bold text-cyan-100 transition hover:bg-cyan-400/10"
              >
                Join Room
              </button>
            </div>
          </section>
        </div>

        <div className="mt-6">
          <Ads format="horizontal" slot="2207590813" isMobileFooter={false} />
        </div>
      </main>
    </div>
  );
}
