// app/api/search/suggest/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAllSubcategories } from '@/lib/supabase';

// In-memory cache for search suggestions
let cachedSuggestions: string[] = [];
let lastCacheUpdate = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

async function getSearchSuggestions(): Promise<string[]> {
  const now = Date.now();
  
  // Return cached suggestions if they're fresh
  if (cachedSuggestions.length > 0 && (now - lastCacheUpdate) < CACHE_DURATION) {
    return cachedSuggestions;
  }

  try {
    // Fetch all subcategories for suggestions
    const subcategories = await getAllSubcategories();
    
    // Extract unique category names and subcategory names
    const suggestions = new Set<string>();
    
    subcategories.forEach(sub => {
      suggestions.add(sub.category);
      suggestions.add(sub.subcategory);
      
      // Add words from subcategory names
      sub.subcategory_name.split(/[\s-]+/).forEach((word: string) => {
        if (word.length > 3) {
          suggestions.add(word);
        }
      });
    });

    // Add some common trivia topics
    const commonTopics = [
      'History', 'Science', 'Geography', 'Entertainment', 
      'Sports', 'Movies', 'Music', 'TV Shows', 'Books',
      'Technology', 'Animals', 'Food', 'Art', 'Literature',
      'Mathematics', 'Physics', 'Chemistry', 'Biology',
      'World Capitals', 'Famous People', 'Historical Events'
    ];

    commonTopics.forEach(topic => suggestions.add(topic));

    cachedSuggestions = Array.from(suggestions).sort();
    lastCacheUpdate = now;

    return cachedSuggestions;
  } catch (error) {
    console.error('Error generating search suggestions:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q')?.toLowerCase() || '';

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] });
  }

  try {
    const allSuggestions = await getSearchSuggestions();
    
    // Filter suggestions based on query
    const filteredSuggestions = allSuggestions
      .filter(suggestion => 
        suggestion.toLowerCase().includes(query) ||
        query.split(' ').some(word => suggestion.toLowerCase().includes(word))
      )
      .slice(0, 10); // Limit to 10 suggestions

    return NextResponse.json({ suggestions: filteredSuggestions });
  } catch (error) {
    console.error('Error in search suggestions API:', error);
    return NextResponse.json({ suggestions: [] }, { status: 500 });
  }
}