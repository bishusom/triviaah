// app/api/feedback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addFeedback } from '@/lib/firebase';
import { getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { rating, category, score, correctCount, totalQuestions } = body;
    
    if (!rating || !category) {
      return NextResponse.json(
        { error: 'Rating and category are required' },
        { status: 400 }
      );
    }

    const feedbackId = await addFeedback({
      rating: Number(rating),
      category,
      score: Number(score || 0),
      correctCount: Number(correctCount || 0),
      totalQuestions: Number(totalQuestions || 0)
    });

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
    
    const q = query(
      collection(db, 'feedback'),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const snapshot = await getDocs(q);
    const feedback = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(feedback);

  } catch (error) {
    console.error('Feedback GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}