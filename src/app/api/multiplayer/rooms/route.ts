import { NextResponse } from 'next/server';

import { getCategoryQuestions, getSubcategoryQuestions } from '@/lib/supabase';
import { getDailyTriviaQuestions } from '@/lib/daily-trivias';
import { makeRoomCode, toRoomQuestion } from '@/lib/multiplayer';
import { supabase } from '@/lib/supabase';

type CreateRoomBody = {
  category?: string;
  subcategory?: string;
  quizType?: 'trivias' | 'daily-trivias';
  hostGuestId?: string;
  hostName?: string;
};

function cleanText(value: unknown, fallback = '') {
  return typeof value === 'string' ? value.trim().slice(0, 80) || fallback : fallback;
}

export async function POST(request: Request) {
  const body = await request.json().catch((): CreateRoomBody => ({}));
  const category = cleanText(body.category, 'general-knowledge');
  const subcategory = cleanText(body.subcategory);
  const quizType = body.quizType === 'daily-trivias' ? 'daily-trivias' : 'trivias';
  const hostGuestId = cleanText(body.hostGuestId, `guest-${crypto.randomUUID()}`);
  const hostName = cleanText(body.hostName, hostGuestId).replace(/\s+/g, ' ');
  const dateKey = new Date().toISOString().slice(0, 10);

  const questions = quizType === 'daily-trivias'
    ? await getDailyTriviaQuestions(category, dateKey)
    : subcategory
      ? await getSubcategoryQuestions(category, subcategory, 10)
      : await getCategoryQuestions(category, 10);

  if (!questions.length) {
    return NextResponse.json({ error: 'No questions available for this quiz.' }, { status: 400 });
  }

  for (let attempt = 0; attempt < 8; attempt += 1) {
    const roomCode = makeRoomCode();
    const { data: room, error: roomError } = await supabase
      .from('multiplayer_rooms')
      .insert({
        room_code: roomCode,
        host_guest_id: hostGuestId,
        category,
        subcategory: subcategory || null,
        time_per_question: category === 'quick-fire' ? 15 : 30,
      })
      .select()
      .single();

    if (roomError) {
      if (roomError.code === '23505') continue;
      console.error('Failed to create multiplayer room:', roomError);
      return NextResponse.json({ error: 'Could not create room.' }, { status: 500 });
    }

    const questionRows = questions.map((question, index) => ({
      room_id: room.id,
      ...toRoomQuestion(question, index),
    }));

    const { error: questionsError } = await supabase
      .from('multiplayer_room_questions')
      .insert(questionRows);

    if (questionsError) {
      console.error('Failed to create room questions:', questionsError);
      await supabase.from('multiplayer_rooms').delete().eq('id', room.id);
      return NextResponse.json({ error: 'Could not create room questions.' }, { status: 500 });
    }

    const { data: player, error: playerError } = await supabase
      .from('multiplayer_players')
      .insert({
        room_id: room.id,
        guest_id: hostGuestId,
        display_name: hostName,
        is_host: true,
      })
      .select()
      .single();

    if (playerError) {
      console.error('Failed to create host player:', playerError);
      await supabase.from('multiplayer_rooms').delete().eq('id', room.id);
      return NextResponse.json({ error: 'Could not create host player.' }, { status: 500 });
    }

    return NextResponse.json({ room, player });
  }

  return NextResponse.json({ error: 'Could not generate a unique room code.' }, { status: 409 });
}
