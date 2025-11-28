// app/api/pexels/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  if (!search) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    const pexelsResponse = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(search)}&per_page=3`,
      {
        headers: {
          'Authorization': process.env.PEXELS_API_KEY || ''
        }
      }
    );
    
    if (!pexelsResponse.ok) {
      throw new Error(`Pexels API request failed with status ${pexelsResponse.status}`);
    }

    const pexelsData = await pexelsResponse.json();
    
    if (pexelsData.photos && pexelsData.photos.length > 0) {
      return NextResponse.json({ 
        imageUrl: pexelsData.photos[0].src.medium || pexelsData.photos[0].src.large 
      });
    }
    
    return NextResponse.json({ imageUrl: null });
  } catch (error) {
    console.error('Pexels API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image from Pexels' },
      { status: 500 }
    );
  }
}