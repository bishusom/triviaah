// hooks/useCoverArt.ts
import { useState, useEffect } from 'react';
import { getSongCoverArt } from '@/lib/musicbrainz-cache';

export function useCoverArt(songTitle: string, artist: string, albumTitle?: string) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCoverArt = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Prefer the validated album metadata when resolving release artwork.
        const coverArtUrl = await getSongCoverArt(songTitle, artist, albumTitle);
        
        if (isMounted) {
          if (coverArtUrl) {
            setImageUrl(coverArtUrl);
          } else {
            setError('No cover art available');
          }
          setIsLoading(false);
        }
      } catch {
        if (isMounted) {
          setError('Failed to fetch cover art');
          setIsLoading(false);
        }
      }
    };

    fetchCoverArt();

    return () => {
      isMounted = false;
    };
  }, [songTitle, artist, albumTitle]);

  return { imageUrl, isLoading, error };
}
