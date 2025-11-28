// src/app/api/daily-facts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDailyFact } from '@/lib/daily-fact-sb';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateParam = searchParams.get('date');

    console.log(`Info: [API] Getting daily fact for: ${dateParam || 'today'}`);
    
    // Convert string to Date object if provided
    const dateObject = dateParam ? new Date(dateParam) : undefined;
    
    const result = await getDailyFact(dateObject);
    
    if (!result) {
      console.log('Error: [API] No fact found');
      return NextResponse.json({ error: 'No facts available' }, { status: 404 });
    }
    
    console.log(`Success: [API] Successfully returned ${result.type} fact`);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error: [API] Error in daily-facts API:', error);
    
    if (error instanceof Error && error.message === 'No facts available in database') {
      return NextResponse.json({ error: 'No facts available' }, { status: 404 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}