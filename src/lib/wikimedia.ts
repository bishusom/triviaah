// lib/wikimedia.ts

// Interface definitions for Wikimedia API response
interface WikimediaImageInfo {
  url: string;
  descriptionurl: string;
  descriptionshorturl: string;
}

interface WikimediaPage {
  pageid: number;
  ns: number;
  title: string;
  index: number;
  imageinfo?: WikimediaImageInfo[];
}

interface WikimediaQuery {
  pages?: Record<string, WikimediaPage>;
}

interface WikimediaContinue {
  [key: string]: string;
}

interface WikimediaResponse {
  query?: WikimediaQuery;
  continue?: WikimediaContinue;
  error?: {
    code: string;
    info: string;
  };
}

export async function fetchWikimediaImage(searchTerm: string): Promise<string | null> {
  try {
    // Clean up the search term for URL encoding
    const encodedSearch = encodeURIComponent(searchTerm);
    
    // Wikimedia Commons API endpoint
    const apiUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodedSearch}&gsrnamespace=6&gsrlimit=5&prop=imageinfo&iiprop=url&format=json&origin=*`;
    
    const response = await fetch(apiUrl);
    const data: WikimediaResponse = await response.json();
    
    if (data.query && data.query.pages) {
      // Get the first image result
      const pages = Object.values(data.query.pages);
      if (pages.length > 0) {
        const firstImage = pages[0];
        if (firstImage.imageinfo && firstImage.imageinfo[0]) {
          return firstImage.imageinfo[0].url;
        }
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching Wikimedia image:', error);
    return null;
  }
}

// Get the specific search term format: "capital skyline country"
export const getCapitalSearchTerms = (capital: string, country: string): string[] => {
  return [
    `${capital} skyline ${country}`,  // Primary search
    `${capital} ${country}`,           // Fallback search
    `${capital} city ${country}`,      // Additional fallback
    `${capital} capital`               // Final fallback
  ];
};