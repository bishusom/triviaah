// lib/wikimedia.ts

// Interface definitions for Wikipedia API response
interface WikipediaSearchResult {
  ns: number;
  title: string;
  pageid: number;
  size: number;
  wordcount: number;
  snippet: string;
  timestamp: string;
}

interface WikipediaSearchResponse {
  batchcomplete?: string;
  continue?: {
    sroffset: number;
    continue: string;
  };
  query?: {
    searchinfo?: {
      totalhits: number;
    };
    search?: WikipediaSearchResult[];
  };
}

interface WikipediaPageImage {
  source: string;
  width: number;
  height: number;
}

interface WikipediaPage {
  pageid: number;
  ns: number;
  title: string;
  thumbnail?: WikipediaPageImage;
  pageimage?: string;
}

interface WikipediaPagesResponse {
  batchcomplete?: string;
  query?: {
    pages: Record<string, WikipediaPage>;
  };
}

export async function fetchArtistImageFromWikipedia(artist: string): Promise<string | null> {
  try {
    // First, try to find the artist's Wikipedia page
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(artist)}&srwhat=text&format=json&origin=*`;
    
    const searchResponse = await fetch(searchUrl);
    if (!searchResponse.ok) {
      console.warn('Wikipedia search failed:', searchResponse.status);
      return null;
    }
    
    const searchData: WikipediaSearchResponse = await searchResponse.json();
    
    if (searchData.query?.search && searchData.query.search.length > 0) {
      // Find the most relevant page (prioritize pages that contain "musician", "band", "singer", etc.)
      const relevantPage = searchData.query.search.find(page => 
        page.title.toLowerCase().includes(artist.toLowerCase()) ||
        page.snippet.toLowerCase().includes('musician') ||
        page.snippet.toLowerCase().includes('band') ||
        page.snippet.toLowerCase().includes('singer') ||
        page.snippet.toLowerCase().includes('artist')
      ) || searchData.query.search[0];

      const pageTitle = relevantPage.title;
      
      // Now get page images with a larger thumbnail size
      const imagesUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&pithumbsize=500&format=json&origin=*`;
      const imagesResponse = await fetch(imagesUrl);
      
      if (!imagesResponse.ok) {
        console.warn('Wikipedia images fetch failed:', imagesResponse.status);
        return null;
      }
      
      const imagesData: WikipediaPagesResponse = await imagesResponse.json();
      
      if (imagesData.query?.pages) {
        const pages = Object.values(imagesData.query.pages);
        if (pages.length > 0 && pages[0].thumbnail) {
          return pages[0].thumbnail.source;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching from Wikipedia:', error);
    return null;
  }
}

// Keep the existing functions for backward compatibility
export async function fetchWikimediaImage(searchTerm: string): Promise<string | null> {
  // For simplicity, just reuse the Wikipedia function
  return fetchArtistImageFromWikipedia(searchTerm);
}

export const getCapitalSearchTerms = (capital: string, country: string): string[] => {
  return [
    `${capital} skyline ${country}`,
    `${capital} ${country}`,
    `${capital} city ${country}`,
    `${capital} capital`
  ];
};