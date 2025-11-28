// lib/book-covers.ts
// Enhanced version with fallbacks and caching
interface CoverCache {
  [key: string]: {
    url: string;
    timestamp: number;
  };
}

const COVER_CACHE: CoverCache = {};
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function getBookCover(title: string, author?: string): Promise<string | null> {
  const cacheKey = `${title.toLowerCase()}-${author?.toLowerCase() || ''}`;
  
  // Check cache first
  if (COVER_CACHE[cacheKey] && Date.now() - COVER_CACHE[cacheKey].timestamp < CACHE_DURATION) {
    return COVER_CACHE[cacheKey].url;
  }
  
  try {
    // Try Google Books first
    let coverUrl =  await fetchGoogleBooksCover(title, author);
    
    // Fallback to Open Library
    if (!coverUrl) {
      coverUrl = await fetchBookCover(title, author);
    }
    
    // Cache the result
    if (coverUrl) {
      COVER_CACHE[cacheKey] = {
        url: coverUrl,
        timestamp: Date.now()
      };
    }
    
    return coverUrl;
  } catch (error) {
    console.error('Error getting book cover:', error);
    return null;
  }
}

export async function fetchGoogleBooksCover(title: string, author?: string): Promise<string | null> {
  try {
    const query = `${encodeURIComponent(title)}${author ? `+inauthor:${encodeURIComponent(author)}` : ''}`;
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1`);
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const volumeInfo = data.items[0].volumeInfo;
      // Use thumbnail or small thumbnail
      return volumeInfo.imageLinks?.thumbnail || 
             volumeInfo.imageLinks?.smallThumbnail || 
             null;
    }
    return null;
  } catch (error) {
    console.error('Error fetching Google Books cover:', error);
    return null;
  }
}

export async function fetchBookCover(title: string, author?: string): Promise<string | null> {
  try {
    // First, search for the book
    const searchUrl = `https://openlibrary.org/search.json?title=${encodeURIComponent(title)}${author ? `&author=${encodeURIComponent(author)}` : ''}`;
    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    
    if (searchData.docs && searchData.docs.length > 0) {
      const firstResult = searchData.docs[0];
      
      
      // Try ISBN first
      if (firstResult.isbn && firstResult.isbn.length > 0) {
        return `https://covers.openlibrary.org/b/isbn/${firstResult.isbn[0]}-M.jpg`;
      }
      
      // Try OCLC
      if (firstResult.oclc && firstResult.oclc.length > 0) {
        return `https://covers.openlibrary.org/b/oclc/${firstResult.oclc[0]}-M.jpg`;
      }

      // Try cover_i 
      if (firstResult.cover_i) {
        return `https://covers.openlibrary.org/b/id/${firstResult.cover_i}-M.jpg`;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching book cover from Open Library:', error);
    return null;
  }
}