// app/api/highscores/route.ts
import { NextResponse } from 'next/server';
import {
  getHighScores,
  addHighScore,
  hasDailyTriviaAttempt,
} from '@/lib/supabase';

// Define the expected payload shape
type SaveScorePayload = {
  name: string;
  score: number;
  category: string;
  correct_answers: number;
  total_questions: number;
  time_used: number;
  difficulty?: string;
  subcategory?: string | null;
  quiz_type?: 'trivias' | 'daily-trivias';
  quiz_date?: string;
};

const DATE_KEY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general knowledge';
  const quizType = searchParams.get('quizType') === 'daily-trivias' ? 'daily-trivias' : undefined;
  const quizDate = searchParams.get('quizDate') || undefined;
  const playerName = searchParams.get('playerName')?.trim();

  if (quizType && (!quizDate || !DATE_KEY_PATTERN.test(quizDate))) {
    return NextResponse.json({ error: 'A valid quizDate is required for daily trivia' }, { status: 400 });
  }

  try {
    console.log('API: Fetching scores for category:', category);

    const [localHighScores, hasRankedAttempt] = await Promise.all([
      getHighScores(category, 5, quizType, quizDate),
      quizType && quizDate && playerName
        ? hasDailyTriviaAttempt(playerName, category, quizDate)
        : Promise.resolve(false),
    ]);
    const globalHigh = localHighScores[0] || null;

    console.log('API: Found scores:', localHighScores.length);

    return NextResponse.json({
      localHighScores,
      globalHigh,
      hasRankedAttempt,
    });
  } catch (error) {
    console.error('Failed to fetch high scores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch high scores' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body: SaveScorePayload = await request.json();
    const referrer = request.headers.get('referer');
    let referrerUrl: URL | null = null;
    try {
      referrerUrl = referrer ? new URL(referrer) : null;
    } catch {
      referrerUrl = null;
    }
    const cameFromDailyTrivia = referrerUrl?.pathname.startsWith('/daily-trivias/') ?? false;
    // The canonical route is authoritative. This also protects requests from
    // already-open client bundles that omit or mislabel the new fields.
    const inferredQuizType = cameFromDailyTrivia
      ? 'daily-trivias'
      : body.quiz_type ?? 'trivias';
    const inferredQuizDate = body.quiz_date
      ?? (inferredQuizType === 'daily-trivias'
        ? referrerUrl?.searchParams.get('date') || new Date().toISOString().slice(0, 10)
        : undefined);

    const {
      name,
      score,
      category,
      correct_answers,
      total_questions,
      time_used,
      difficulty = 'mixed',
      subcategory,
    } = body;
    const quiz_type = inferredQuizType;
    const quiz_date = inferredQuizDate;

    // Required fields validation
    if (
      !name ||
      score == null ||
      !category ||
      correct_answers == null ||
      total_questions == null ||
      time_used == null
    ) {
      return NextResponse.json(
        {
          error:
            'Missing required fields: name, score, category, correct_answers, total_questions, time_used',
        },
        { status: 400 }
      );
    }

    if (quiz_type === 'daily-trivias' && (!quiz_date || !DATE_KEY_PATTERN.test(quiz_date))) {
      return NextResponse.json(
        { error: 'A valid quiz_date is required for daily trivia' },
        { status: 400 }
      );
    }

    if (
      quiz_type === 'daily-trivias'
      && quiz_date
      && await hasDailyTriviaAttempt(name, category, quiz_date)
    ) {
      return NextResponse.json({
        ranked: false,
        reason: 'already_played',
      });
    }

    const newScoreId = await addHighScore({
      name: name.trim(),
      score: Number(score),
      category,
      subcategory: subcategory ?? null,
      difficulty,
      correct_answers: Number(correct_answers),
      total_questions: Number(total_questions),
      time_used: Number(time_used),
      quiz_type,
      quiz_date: quiz_type === 'daily-trivias' ? quiz_date : null,
    });

    return NextResponse.json({
      id: newScoreId,
      name: name.trim(),
      score: Number(score),
      category,
      ranked: true,
    });
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      return NextResponse.json({
        ranked: false,
        reason: 'already_played',
      });
    }
    // No more `any` — we just log the error object
    console.error('Failed to save score:', error);
    return NextResponse.json(
      { error: 'Failed to save score', details: (error as Error).message },
      { status: 500 }
    );
  }
}
