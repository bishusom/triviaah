// hooks/useCoverArt.ts
import { useState, useEffect } from 'react';
import { MusicBrainzCache, searchMusicBrainzRelease, getCoverArt } from '@/lib/musicbrainz-cache';

const cache = new MusicBrainzCache();

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

        // First try to get from cache
        const cachedUrl = await cache.getCoverArt(songTitle, artist);
        if (cachedUrl) {
          if (isMounted) {
            setImageUrl(cachedUrl);
            setIsLoading(false);
          }
          return;
        }

        // If not in cache, fetch from MusicBrainz
        const release = await searchMusicBrainzRelease(songTitle, artist);
        if (!release) {
          if (isMounted) {
            setError('No release found');
            setIsLoading(false);
          }
          return;
        }

        const coverArtUrl = await getCoverArt(release.id);
        if (coverArtUrl) {
          // Save to cache
          await cache.saveCoverArt(songTitle, artist, coverArtUrl);
          
          if (isMounted) {
            setImageUrl(coverArtUrl);
            setIsLoading(false);
          }
        } else {
          if (isMounted) {
            setError('No cover art available');
            setIsLoading(false);
          }
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