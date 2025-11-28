// app/api/feedback/route.ts - Clean version
import { NextRequest, NextResponse } from 'next/server';
import { addFeedback, getFeedback } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { 
      rating, 
      category, 
      gameType = 'trivia', 
      metadata = {},
      userId 
    } = body;
    
    if (!rating || !gameType) {
      return NextResponse.json(
        { error: 'Rating and gameType are required' },
        { status: 400 }
      );
    }

    const feedbackData = {
      rating: Number(rating),
      category: category || gameType,
      gameType,
      metadata,
      userId: userId || undefined
    };

    const feedbackId = await addFeedback(feedbackData);

    return NextResponse.json({ 
      success: true, 
      id: feedbackId 
    });

  } catch (error) {
    console.error('Feedback API error:', error);
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limitCount = Number(searchParams.get('limit')) || 50;
    const gameType = searchParams.get('gameType');
    
    const feedback = await getFeedback(limitCount, gameType);

    return NextResponse.json(feedback);

  } catch (error) {
    console.error('Feedback GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}