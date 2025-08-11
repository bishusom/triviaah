import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');

  if (!search) {
    return NextResponse.json({ error: 'Missing search query' }, { status: 400 });
  }

  try {
    const pixabayResponse = await fetch(
      `https://pixabay.com/api/?key=${process.env.PIXABAY_API_KEY}&q=${encodeURIComponent(search)}&image_type=photo&per_page=3`
    );
    
    if (!pixabayResponse.ok) {
      throw new Error('Pixabay API request failed');
    }

    const pixabayData = await pixabayResponse.json();
    return NextResponse.json({ 
      imageUrl: pixabayData.hits?.[0]?.webformatURL || null 
    });
  } catch (error) {
    console.error('Pixabay API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch image from Pixabay' },
      { status: 500 }
    );
  }
}