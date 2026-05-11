'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, Copy, Crown, Loader2, Play, Trophy, Users } from 'lucide-react';

import Ads from '@/components/common/Ads';
import { getPersistentGuestId } from '@/lib/guestId';
import {
  loadMultiplayerRoom,
  loadRoomBundle,
  normalizeRoomCode,
  scoreAnswer,
  type MultiplayerAnswer,
  type MultiplayerPlayer,
  type MultiplayerQuestion,
  type MultiplayerRoom,
} from '@/lib/multiplayer';
import { supabase } from '@/lib/supabase';
import { extractKeywords } from '@/lib/nlpKeywords';
import { fetchPixabayImage } from '@/lib/pixabay';

type RoomBundle = {
  players: MultiplayerPlayer[];
  questions: MultiplayerQuestion[];
  answers: MultiplayerAnswer[];
};

function displayCategory(category: string) {
  return category.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

function getQuestionStartedAt(room: MultiplayerRoom) {
  return room.question_started_at ? new Date(room.question_started_at).getTime() : Date.now();
}

export function MultiplayerRoomClient({ roomCode }: { roomCode: string }) {
  const [room, setRoom] = useState<MultiplayerRoom | null>(null);
  const [bundle, setBundle] = useState<RoomBundle>({ players: [], questions: [], answers: [] });
  const [player, setPlayer] = useState<MultiplayerPlayer | null>(null);
  const [name, setName] = useState('');
  const [joinError, setJoinError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const [now, setNow] = useState(Date.now());
  const [questionImage, setQuestionImage] = useState<string | null>(null);

  const normalizedCode = normalizeRoomCode(roomCode);
  const guestId = useMemo(() => {
    if (typeof window === 'undefined') return 'Guest';
    return getPersistentGuestId();
  }, []);

  const currentQuestion = room ? bundle.questions[room.current_question_index] : null;
  const currentAnswer = player && room
    ? bundle.answers.find((answer) => answer.player_id === player.id && answer.question_index === room.current_question_index)
    : null;
  const isHost = Boolean(player && room && player.guest_id === room.host_guest_id);
  const sortedPlayers = [...bundle.players].sort((a, b) => b.score - a.score || b.correct_count - a.correct_count || a.joined_at.localeCompare(b.joined_at));
  const questionNumber = room ? room.current_question_index + 1 : 1;
  const totalQuestions = bundle.questions.length;
  const elapsedMs = room?.status === 'playing' ? now - getQuestionStartedAt(room) : 0;
  const timeLeft = room?.status === 'playing'
    ? Math.max(0, room.time_per_question - Math.floor(elapsedMs / 1000))
    : room?.time_per_question ?? 30;
  const answeredCurrentQuestion = room
    ? bundle.answers.filter((answer) => answer.question_index === room.current_question_index).length
    : 0;

  const refreshBundle = useCallback(async (roomId: string) => {
    const nextBundle = await loadRoomBundle(roomId);
    setBundle(nextBundle);
    const currentPlayer = nextBundle.players.find((item) => item.guest_id === guestId) || null;
    setPlayer(currentPlayer);
  }, [guestId]);

  const refreshRoom = useCallback(async () => {
    const loadedRoom = await loadMultiplayerRoom(normalizedCode);
    setRoom(loadedRoom);
    if (loadedRoom) await refreshBundle(loadedRoom.id);
    setIsLoading(false);
  }, [normalizedCode, refreshBundle]);

  useEffect(() => {
    let cancelled = false;

    async function loadQuestionImage() {
      if (!currentQuestion) {
        setQuestionImage(null);
        return;
      }

      if (currentQuestion.image_url) {
        setQuestionImage(currentQuestion.image_url);
        return;
      }

      setQuestionImage('/imgs/default-question-img.png');
      const keywords = extractKeywords(`${currentQuestion.question} ${currentQuestion.correct_answer}`);
      const imageUrl = await fetchPixabayImage(keywords.slice(0, 2).join(' '), room?.category);

      if (!cancelled && imageUrl) {
        setQuestionImage(imageUrl);
      }
    }

    loadQuestionImage().catch(console.error);

    return () => {
      cancelled = true;
    };
  }, [currentQuestion?.id, currentQuestion?.question, currentQuestion?.correct_answer, currentQuestion?.image_url, room?.category]);

  useEffect(() => {
    refreshRoom().catch((error) => {
      console.error('Failed to load multiplayer room:', error);
      setIsLoading(false);
    });
  }, [refreshRoom]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!room) return;

    const channel = supabase
      .channel(`multiplayer-room-${room.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'multiplayer_rooms', filter: `id=eq.${room.id}` }, (payload) => {
        if (payload.new) setRoom(payload.new as MultiplayerRoom);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'multiplayer_players', filter: `room_id=eq.${room.id}` }, () => {
        refreshBundle(room.id).catch(console.error);
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'multiplayer_answers', filter: `room_id=eq.${room.id}` }, () => {
        refreshBundle(room.id).catch(console.error);
      })
      .subscribe();

    const poll = window.setInterval(() => {
      loadMultiplayerRoom(room.room_code)
        .then((nextRoom) => {
          if (nextRoom) setRoom(nextRoom);
        })
        .then(() => refreshBundle(room.id))
        .catch(console.error);
    }, 3000);

    return () => {
      window.clearInterval(poll);
      supabase.removeChannel(channel);
    };
  }, [room?.id, refreshBundle]);

  const joinRoom = useCallback(async () => {
    if (!room) return;
    setIsJoining(true);
    setJoinError('');

    const displayName = (name || guestId).trim().replace(/\s+/g, ' ').slice(0, 40);
    const { data, error } = await supabase
      .from('multiplayer_players')
      .upsert({
        room_id: room.id,
        guest_id: guestId,
        display_name: displayName,
        is_host: guestId === room.host_guest_id,
        last_seen_at: new Date().toISOString(),
      }, { onConflict: 'room_id,guest_id' })
      .select()
      .single();

    setIsJoining(false);

    if (error) {
      console.error('Failed to join room:', error);
      setJoinError('Could not join this room.');
      return;
    }

    setPlayer(data as MultiplayerPlayer);
    await refreshBundle(room.id);
  }, [guestId, name, refreshBundle, room]);

  const copyInvite = useCallback(async () => {
    await navigator.clipboard.writeText(window.location.href);
    setIsCopied(true);
    window.setTimeout(() => setIsCopied(false), 1600);
  }, []);

  const startGame = useCallback(async () => {
    if (!room || !isHost || bundle.players.length < 1) return;
    const { error } = await supabase
      .from('multiplayer_rooms')
      .update({
        status: 'playing',
        current_question_index: 0,
        question_started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', room.id);

    if (error) console.error('Failed to start multiplayer game:', error);
  }, [bundle.players.length, isHost, room]);

  const advanceQuestion = useCallback(async () => {
    if (!room || !isHost) return;
    const isLast = room.current_question_index >= bundle.questions.length - 1;
    const { error } = await supabase
      .from('multiplayer_rooms')
      .update({
        status: isLast ? 'finished' : 'playing',
        current_question_index: isLast ? room.current_question_index : room.current_question_index + 1,
        question_started_at: isLast ? room.question_started_at : new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', room.id);

    if (error) console.error('Failed to advance multiplayer question:', error);
  }, [bundle.questions.length, isHost, room]);

  const submitAnswer = useCallback(async (selectedOption: string) => {
    if (!room || !player || !currentQuestion || currentAnswer || room.status !== 'playing') return;

    const responseMs = Math.max(0, Date.now() - getQuestionStartedAt(room));
    const isCorrect = selectedOption === currentQuestion.correct_answer;
    const points = scoreAnswer(isCorrect, responseMs, room.time_per_question, currentQuestion.difficulty);

    const { error } = await supabase
      .from('multiplayer_answers')
      .insert({
        room_id: room.id,
        player_id: player.id,
        question_index: room.current_question_index,
        selected_option: selectedOption,
        is_correct: isCorrect,
        response_ms: responseMs,
        points,
      });

    if (error) {
      if (error.code !== '23505') console.error('Failed to submit answer:', error);
      return;
    }

    const { error: playerError } = await supabase
      .from('multiplayer_players')
      .update({
        score: player.score + points,
        correct_count: player.correct_count + (isCorrect ? 1 : 0),
        last_seen_at: new Date().toISOString(),
      })
      .eq('id', player.id);

    if (playerError) console.error('Failed to update multiplayer score:', playerError);
    await refreshBundle(room.id);
  }, [currentAnswer, currentQuestion, player, refreshBundle, room]);

  useEffect(() => {
    if (!room || room.status !== 'playing' || !player || !currentQuestion || currentAnswer || timeLeft > 0) return;
    submitAnswer('Time Out').catch(console.error);
  }, [currentAnswer, currentQuestion, player, room, submitAnswer, timeLeft]);

  useEffect(() => {
    if (!room || room.status !== 'playing' || !isHost) return;
    const everyoneAnswered = bundle.players.length > 0 && answeredCurrentQuestion >= bundle.players.length;
    if (timeLeft > 0 && !everyoneAnswered) return;

    const timeout = window.setTimeout(() => {
      advanceQuestion().catch(console.error);
    }, everyoneAnswered ? 1200 : 2200);

    return () => window.clearTimeout(timeout);
  }, [advanceQuestion, answeredCurrentQuestion, bundle.players.length, isHost, room, timeLeft]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-300" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <div className="max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 text-center">
          <h1 className="text-2xl font-bold">Room not found</h1>
          <p className="mt-2 text-slate-300">This invite code may have expired or been typed incorrectly.</p>
          <p className="mt-5 text-sm text-slate-400">Start from a trivia category page to create a new room.</p>
        </div>
      </div>
    );
  }

  if (!player) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
        <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Room {room.room_code}</p>
            <h1 className="mt-2 text-2xl font-black">Join {displayCategory(room.category)} Trivia</h1>
          </div>
          <label className="grid gap-2 text-sm font-semibold text-slate-200">
            Display name
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={guestId}
              className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition focus:border-cyan-400"
            />
          </label>
          {joinError ? <p className="mt-3 text-sm text-rose-300">{joinError}</p> : null}
          <button
            type="button"
            onClick={joinRoom}
            disabled={isJoining}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400 disabled:opacity-70"
          >
            {isJoining ? <Loader2 className="h-4 w-4 animate-spin" /> : <Users className="h-4 w-4" />}
            Join Room
          </button>
          <div className="mt-6">
            <Ads format="horizontal" slot="2207590813" isMobileFooter={false} />
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <main className="mx-auto max-w-6xl px-4 py-6">
        <header className="mb-5 flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Room {room.room_code}</p>
            <h1 className="mt-1 text-2xl font-black">{displayCategory(room.category)} Multiplayer</h1>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={copyInvite}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-400/30 px-4 py-2 text-sm font-bold text-cyan-100 transition hover:bg-cyan-400/10"
            >
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {isCopied ? 'Copied' : 'Copy Invite'}
            </button>
          </div>
        </header>

        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-2xl">
            {room.status === 'lobby' ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <Users className="mb-4 h-10 w-10 text-cyan-300" />
                <h2 className="text-3xl font-black">Waiting in the lobby</h2>
                <p className="mt-3 max-w-xl text-slate-300">
                  Share the invite link with friends. The host starts the game when everyone is here.
                </p>
                {isHost ? (
                  <button
                    type="button"
                    onClick={startGame}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-cyan-400"
                  >
                    <Play className="h-4 w-4" />
                    Start Game
                  </button>
                ) : (
                  <p className="mt-6 rounded-full border border-slate-700 px-4 py-2 text-sm text-slate-300">
                    Waiting for host to start
                  </p>
                )}
                <div className="mt-8 w-full max-w-2xl">
                  <Ads format="horizontal" slot="2207590813" isMobileFooter={false} />
                </div>
              </div>
            ) : null}

            {room.status === 'playing' && currentQuestion ? (
              <div>
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                      Question {questionNumber} of {totalQuestions}
                    </p>
                    <div className="mt-2 h-2 w-56 overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="h-full rounded-full bg-cyan-400 transition-all"
                        style={{ width: `${Math.max(0, Math.min(100, (timeLeft / room.time_per_question) * 100))}%` }}
                      />
                    </div>
                  </div>
                  <div className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-2 text-2xl font-black text-cyan-200">
                    {timeLeft}s
                  </div>
                </div>

                {questionImage ? (
                  <img
                    src={questionImage}
                    alt=""
                    className="mb-4 h-28 w-full rounded-xl border border-slate-800 bg-slate-950 object-contain sm:h-36 md:h-40"
                  />
                ) : null}

                <h2 className="text-2xl font-black leading-tight sm:text-3xl">{currentQuestion.question}</h2>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {currentQuestion.options.map((option) => {
                    const isSelected = currentAnswer?.selected_option === option;
                    const reveal = Boolean(currentAnswer);
                    const isCorrect = option === currentQuestion.correct_answer;
                    const color = reveal && isCorrect
                      ? 'border-emerald-400 bg-emerald-400/15 text-emerald-100'
                      : reveal && isSelected
                        ? 'border-rose-400 bg-rose-400/15 text-rose-100'
                        : 'border-slate-700 bg-slate-950 text-white hover:border-cyan-400/60';
                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => submitAnswer(option)}
                        disabled={Boolean(currentAnswer)}
                        className={`min-h-16 rounded-xl border px-4 py-3 text-left text-sm font-bold transition ${color}`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {currentAnswer ? (
                  <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-4">
                    <p className={currentAnswer.is_correct ? 'font-bold text-emerald-300' : 'font-bold text-rose-300'}>
                      {currentAnswer.is_correct ? `Correct +${currentAnswer.points}` : 'Not quite'}
                    </p>
                    {currentQuestion.titbits ? <p className="mt-2 text-sm text-slate-300">{currentQuestion.titbits}</p> : null}
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-slate-500">
                      Waiting for next question
                    </p>
                  </div>
                ) : null}
              </div>
            ) : null}

            {room.status === 'finished' ? (
              <div className="flex min-h-[420px] flex-col items-center justify-center text-center">
                <Trophy className="mb-4 h-12 w-12 text-amber-300" />
                <h2 className="text-3xl font-black">Final Scores</h2>
                <div className="mt-6 w-full max-w-xl overflow-hidden rounded-xl border border-slate-800">
                  {sortedPlayers.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3 last:border-b-0">
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 font-black text-cyan-200">
                          {index + 1}
                        </span>
                        <span className="font-bold">{item.display_name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-black">{item.score}</p>
                        <p className="text-xs text-slate-400">{item.correct_count}/{totalQuestions} correct</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 w-full max-w-2xl">
                  <Ads format="horizontal" slot="9040722315" isMobileFooter={false} />
                </div>
                <p className="mt-6 text-sm text-slate-400">Start from a trivia category page to create another room.</p>
              </div>
            ) : null}
          </section>

          <aside className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-black">Scoreboard</h2>
              <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-bold text-slate-300">
                {bundle.players.length} players
              </span>
            </div>
            <div className="grid gap-2">
              {sortedPlayers.map((item, index) => (
                <div key={item.id} className="rounded-xl border border-slate-800 bg-slate-950 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-bold">
                        {index === 0 && room.status !== 'lobby' ? <Trophy className="mr-1 inline h-4 w-4 text-amber-300" /> : null}
                        {item.is_host ? <Crown className="mr-1 inline h-4 w-4 text-cyan-300" /> : null}
                        {item.display_name}
                      </p>
                      <p className="text-xs text-slate-400">{item.correct_count} correct</p>
                    </div>
                    <p className="text-xl font-black text-cyan-100">{item.score}</p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
