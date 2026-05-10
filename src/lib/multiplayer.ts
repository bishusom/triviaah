import { supabase, type Question } from '@/lib/supabase';

export type MultiplayerRoomStatus = 'lobby' | 'playing' | 'finished';

export type MultiplayerRoom = {
  id: string;
  room_code: string;
  host_guest_id: string;
  category: string;
  subcategory: string | null;
  status: MultiplayerRoomStatus;
  current_question_index: number;
  question_started_at: string | null;
  time_per_question: number;
  created_at: string;
  expires_at: string;
};

export type MultiplayerQuestion = {
  id: string;
  room_id: string;
  question_index: number;
  question_id: string;
  question: string;
  correct_answer: string;
  options: string[];
  difficulty: string | null;
  titbits: string | null;
  image_url: string | null;
};

export type MultiplayerPlayer = {
  id: string;
  room_id: string;
  guest_id: string;
  display_name: string;
  is_host: boolean;
  score: number;
  correct_count: number;
  joined_at: string;
  last_seen_at: string;
};

export type MultiplayerAnswer = {
  id: string;
  room_id: string;
  player_id: string;
  question_index: number;
  selected_option: string;
  is_correct: boolean;
  response_ms: number;
  points: number;
  answered_at: string;
};

export function normalizeRoomCode(code: string) {
  return code.trim().toUpperCase();
}

export function makeRoomCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
}

export function toRoomQuestion(question: Question, index: number) {
  return {
    question_index: index,
    question_id: question.id,
    question: question.question,
    correct_answer: question.correct,
    options: question.options,
    difficulty: question.difficulty ?? null,
    titbits: question.titbits ?? null,
    image_url: question.image_url ?? null,
  };
}

export async function loadMultiplayerRoom(roomCode: string) {
  const { data, error } = await supabase
    .from('multiplayer_rooms')
    .select('*')
    .eq('room_code', normalizeRoomCode(roomCode))
    .maybeSingle();

  if (error) throw error;
  return data as MultiplayerRoom | null;
}

export async function loadRoomBundle(roomId: string) {
  const [playersResult, questionsResult, answersResult] = await Promise.all([
    supabase.from('multiplayer_players').select('*').eq('room_id', roomId).order('joined_at'),
    supabase.from('multiplayer_room_questions').select('*').eq('room_id', roomId).order('question_index'),
    supabase.from('multiplayer_answers').select('*').eq('room_id', roomId),
  ]);

  if (playersResult.error) throw playersResult.error;
  if (questionsResult.error) throw questionsResult.error;
  if (answersResult.error) throw answersResult.error;

  return {
    players: (playersResult.data ?? []) as MultiplayerPlayer[],
    questions: (questionsResult.data ?? []) as MultiplayerQuestion[],
    answers: (answersResult.data ?? []) as MultiplayerAnswer[],
  };
}

export function scoreAnswer(isCorrect: boolean, responseMs: number, timePerQuestion: number, difficulty?: string | null) {
  if (!isCorrect) return 0;
  const base = { easy: 100, medium: 200, hard: 300 }[difficulty || 'easy'] || 100;
  const remainingRatio = Math.max(0, 1 - responseMs / (timePerQuestion * 1000));
  return base + Math.round(remainingRatio * 150);
}
