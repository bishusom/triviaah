// lib/musicbrainz-cache.ts

interface CoverArtCache {
  songKey: string;
  imageUrl: string;
  timestamp: number;
}

// MusicBrainz API response interfaces
export interface MusicBrainzRelease {
  id: string;
  title: string;
  "cover-art-archive"?: {
    front: boolean;
    back: boolean;
    count: number;
  };
}

interface MusicBrainzReleaseResponse {
  releases?: MusicBrainzRelease[];
}

interface MusicBrainzCoverArtArchive {
  front: boolean;
  back: boolean;
  artwork: boolean;
  count: number;
}

interface MusicBrainzDetailedRelease {
  id: string;
  title: string;
  "cover-art-archive": MusicBrainzCoverArtArchive;
}

export class MusicBrainzCache {
  private dbName = 'SongleImageCache';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains('coverArt')) {
          const store = db.createObjectStore('coverArt', { keyPath: 'songKey' });
          store.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  async getCoverArt(songTitle: string, artist: string): Promise<string | null> {
    if (!this.db) await this.init();
    
    const songKey = this.generateSongKey(songTitle, artist);
    
    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('coverArt', 'readonly');
      const store = transaction.objectStore('coverArt');
      const request = store.get(songKey);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result: CoverArtCache | undefined = request.result;
        if (result && this.isCacheValid(result.timestamp)) {
          resolve(result.imageUrl);
        } else {
          resolve(null);
        }
      };
    });
  }

  async saveCoverArt(songTitle: string, artist: string, imageUrl: string): Promise<void> {
    if (!this.db) await this.init();
    
    const songKey = this.generateSongKey(songTitle, artist);
    const cacheItem: CoverArtCache = {
      songKey,
      imageUrl,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction('coverArt', 'readwrite');
      const store = transaction.objectStore('coverArt');
      const request = store.put(cacheItem);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  private generateSongKey(songTitle: string, artist: string): string {
    // Normalize by lowercasing and removing special characters
    return `${songTitle.toLowerCase().replace(/[^a-z0-9]/g, '')}_${artist.toLowerCase().replace(/[^a-z0-9]/g, '')}`;
  }

  private isCacheValid(timestamp: number): boolean {
    // Cache valid for 30 days
    return Date.now() - timestamp < 30 * 24 * 60 * 60 * 1000;
  }
}

// MusicBrainz API functions
export async function searchMusicBrainzRelease(songTitle: string, artist: string): Promise<MusicBrainzRelease | null> {
  try {
    const query = `release:"${songTitle}" AND artist:"${artist}"`;
    const response = await fetch(
      `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(query)}&fmt=json`
    );
    
    if (!response.ok) {
      console.error('MusicBrainz API error:', response.status);
      return null;
    }
    
    const data: MusicBrainzReleaseResponse = await response.json();
    return data.releases?.[0] || null;
  } catch (error) {
    console.error('MusicBrainz search error:', error);
    return null;
  }
}

export async function getCoverArt(releaseId: string): Promise<string | null> {
  try {
    // First try the direct Cover Art Archive URL
    const coverArtUrl = `https://coverartarchive.org/release/${releaseId}/front-500`;
    
    // Use HEAD request first to check if the image exists without downloading it
    const headResponse = await fetch(coverArtUrl, { method: 'HEAD' });
    
    if (headResponse.ok) {
      return coverArtUrl;
    }
    
    // If HEAD fails, check MusicBrainz for cover art availability
    const musicBrainzResponse = await fetch(
      `https://musicbrainz.org/ws/2/release/${releaseId}?fmt=json`
    );
    
    if (!musicBrainzResponse.ok) {
      return null;
    }
    
    const data: MusicBrainzDetailedRelease = await musicBrainzResponse.json();
    
    // Check if cover art is available
    if (data["cover-art-archive"]?.front) {
      return coverArtUrl;
    }
    
    return null;
    
  } catch (error) {
    console.error('Cover Art Archive error:', error);
    return null;
  }
}

// Helper function to get cover art for a song
export async function getSongCoverArt(songTitle: string, artist: string): Promise<string | null> {
  const cache = new MusicBrainzCache();
  await cache.init();
  
  // Check cache first
  const cachedImage = await cache.getCoverArt(songTitle, artist);
  if (cachedImage) {
    return cachedImage;
  }
  
  // Search MusicBrainz for the release
  const release = await searchMusicBrainzRelease(songTitle, artist);
  if (!release) {
    return null;
  }
  
  // Get cover art for the release
  const coverArtUrl = await getCoverArt(release.id);
  if (coverArtUrl) {
    // Cache the result
    await cache.saveCoverArt(songTitle, artist, coverArtUrl);
    return coverArtUrl;
  }
  
  return null;
}