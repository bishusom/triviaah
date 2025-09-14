// app/api/tmdb/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  
  if (!title) {
    return NextResponse.json({ error: 'Title parameter required' }, { status: 400 });
  }

  try {
    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'TMDB API key not configured' }, { status: 500 });
    }

    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(title)}`;
    const searchResponse = await fetch(searchUrl);
    
    if (!searchResponse.ok) {
      throw new Error(`TMDB API error: ${searchResponse.status}`);
    }
    
    const searchData = await searchResponse.json();
    
    if (searchData.results && searchData.results.length > 0) {
      const movie = searchData.results[0];
      if (movie.poster_path) {
        return NextResponse.json({ 
          posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          movieTitle: movie.title
        });
      }
    }
    
    return NextResponse.json({ posterUrl: null, movieTitle: null });
  } catch (error) {
    console.error('TMDB API error:', error);
    return NextResponse.json({ error: 'Failed to fetch movie poster' }, { status: 500 });
  }
}