// app/api/highscores/route.ts
import { NextResponse } from 'next/server';
import { 
  getHighScores, 
  getGlobalHighScore, 
  addHighScore
} from '@/lib/firebase';

// Add these for static export compatibility
export const dynamic = 'force-static';
export const revalidate = false;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general knowledge';
  
  try {
    const [localHighScores, globalHigh] = await Promise.all([
      getHighScores(category),
      getGlobalHighScore(category)
    ]);

    return NextResponse.json({
      localHighScores,
      globalHigh
    });
    
  } catch (error) {
    console.error('Failed to fetch high scores:', error);
    return NextResponse.json(
      { error: "Failed to fetch high scores" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { name, score, category, difficulty } = await request.json();
  
  if (!name || !score || !category) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const newScore = await addHighScore({
      name,
      score: Number(score),
      category,
      ...(difficulty && { difficulty })
    });

    return NextResponse.json({
      id: newScore,
      name,
      score,
      category
    });
  } catch (error) {
    console.error('Failed to save score:', error);
    return NextResponse.json(
      { error: "Failed to save score" },
      { status: 500 }
    );
  }
}