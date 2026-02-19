import { fetchWikimediaImage, getCapitalSearchTerms } from '@/lib/wikimedia';
import { getCoverArt } from '@/lib/musicbrainz-cache'; // Assuming you exported the function

export type GameCategory = 'plotle' | 'literale' | 'citadle' | 'capitale' | 'songle';

export async function fetchGameImage(
  category: GameCategory, 
  title: string, 
  extra?: { artist?: string; country?: string }
): Promise<string | null> {
  if (!title) return null;

  try {
    switch (category) {
      case 'plotle':
        // Movie Logic: TMDB
        const tmdbRes = await fetch(`/api/tmdb?title=${encodeURIComponent(title)}`);
        const tmdbData = await tmdbRes.json();
        return tmdbData.posterUrl;

      case 'songle':
        // Music Logic: MusicBrainz + IndexedDB Cache
        return await getCoverArt(title);

      case 'capitale':
        // Capital Logic: Wikimedia with scoring
        const searchTerms = getCapitalSearchTerms(title, extra?.country || '');
        // Try top search term first
        return await fetchWikimediaImage(searchTerms[0], { entityType: 'capital' });

      case 'citadle':
        // City Logic: Wikimedia
        return await fetchWikimediaImage(title, { entityType: 'city' });

      case 'literale':
        // Book Logic: Google Books API (Optional Enhancement)
        const bookRes = await fetch(`https://www.googleapis.com/books/v1/volumes?q=intitle:${encodeURIComponent(title)}`);
        const bookData = await bookRes.json();
        return bookData.items?.[0]?.volumeInfo?.imageLinks?.thumbnail?.replace('http:', 'https:') || null;

      default:
        return null;
    }
  } catch (error) {
    console.error(`Failed to fetch image for ${category}:`, error);
    return null;
  }
}