// app/api/highscores/route.ts
import { NextResponse } from 'next/server';
import { 
  getHighScores, 
  getGlobalHighScore, 
  addHighScore
} from '@/lib/firebase';

// Remove static export settings for dynamic queries
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || 'general knowledge';
  
  try {
    console.log('API: Fetching scores for category:', category);
    
    const [localHighScores, globalHigh] = await Promise.all([
      getHighScores(category),
      getGlobalHighScore(category)
    ]);

    console.log('API: Found scores:', localHighScores.length);

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
  try {
    const { name, score, category, difficulty } = await request.json();
    
    if (!name || score === undefined || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log('API: Saving score:', { name, score, category });

    const newScore = await addHighScore({
      name: name.trim(),
      score: Number(score),
      category,
      ...(difficulty && { difficulty })
    });

    return NextResponse.json({
      id: newScore,
      name: name.trim(),
      score: Number(score),
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