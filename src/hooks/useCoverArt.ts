// hooks/useCoverArt.ts
import { useState, useEffect } from 'react';
import { getSongCoverArt } from '@/lib/musicbrainz-cache';

export function useCoverArt(songTitle: string, artist: string) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchCoverArt = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Use the enhanced function that includes both MusicBrainz and Wikipedia fallback
        const coverArtUrl = await getSongCoverArt(songTitle, artist);
        
        if (isMounted) {
          if (coverArtUrl) {
            setImageUrl(coverArtUrl);
          } else {
            setError('No cover art available');
          }
          setIsLoading(false);
        }
      } catch (err) {
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
  }, [songTitle, artist]);

  return { imageUrl, isLoading, error };
}