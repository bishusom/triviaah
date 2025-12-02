// app/api/highscores/route.ts
import { NextResponse } from 'next/server';
import {
  getHighScores,
  getGlobalHighScore,
  addHighScore,
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
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general knowledge';

  try {
    console.log('API: Fetching scores for category:', category);

    const [localHighScores, globalHigh] = await Promise.all([
      getHighScores(category),
      getGlobalHighScore(category),
    ]);

    console.log('API: Found scores:', localHighScores.length);

    return NextResponse.json({
      localHighScores,
      globalHigh,
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

    const newScoreId = await addHighScore({
      name: name.trim(),
      score: Number(score),
      category,
      subcategory: subcategory ?? null,
      difficulty,
      correct_answers: Number(correct_answers),
      total_questions: Number(total_questions),
      time_used: Number(time_used),
    });

    return NextResponse.json({
      id: newScoreId,
      name: name.trim(),
      score: Number(score),
      category,
    });
  } catch (error) {
    // No more `any` — we just log the error object
    console.error('Failed to save score:', error);
    return NextResponse.json(
      { error: 'Failed to save score', details: (error as Error).message },
      { status: 500 }
    );
  }
}