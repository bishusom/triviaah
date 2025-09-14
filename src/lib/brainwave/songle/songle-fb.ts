// src/lib/brainwave/songle/songle-fb.ts
import { 
  collection, 
  query, 
  where,
  limit, 
  getDocs, 
  addDoc, 
  Timestamp,
  doc,
  getDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface SonglePuzzle {
  id: string;
  targetTitle: string;
  normalizedTitle: string;
  artist: string;
  decade: string;
  genre: string;
  lyricHint: string;
  date: string;
  validationHints: {
    releaseYear?: number;
    album?: string;
    featuredArtists?: string[];
    duration?: number;
    billboardPeak?: number;
  };
}

export interface SongleResult {
  userId?: string;
  puzzleId: string;
  success: boolean;
  attempts: number;
  timestamp: Date;
}

export interface DailyPuzzle {
  id: string;
  date: string;
  category: string;
  parent_document_id: string;
}

// Helper function to get client-side date string
function getClientDateString(customDate?: Date): string {
  const date = customDate || new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getDailySongle(customDate?: Date): Promise<SonglePuzzle | null> {
  try {
    const dateString = getClientDateString(customDate);
    
    const dailyPuzzlesRef = collection(db, 'dailyPuzzles');
    const dailyQuery = query(
      dailyPuzzlesRef,
      where('date', '==', dateString),
      where('category', '==', 'songle'),
      limit(1)
    );
    
    const dailyQuerySnapshot = await getDocs(dailyQuery);
    
    if (dailyQuerySnapshot.empty) {
      return getRandomSongle();
    }
    
    const dailyDoc = dailyQuerySnapshot.docs[0];
    const dailyData = dailyDoc.data() as DailyPuzzle;
    const parentDocumentId = dailyData.parent_document_id;
    
    const songleRef = doc(db, 'songlePuzzles', parentDocumentId);
    const songleDoc = await getDoc(songleRef);
    
    if (!songleDoc.exists()) {
      return getRandomSongle();
    }
    
    const data = songleDoc.data();
    
    return {
      id: songleDoc.id,
      ...data
    } as SonglePuzzle;
  } catch (error) {
    console.error('Error getting daily songle:', error);
    return null;
  }
}

export async function getRandomSongle(): Promise<SonglePuzzle | null> {
  try {
    const countQuery = query(collection(db, 'songlePuzzles'));
    const countSnapshot = await getDocs(countQuery);
    const totalPuzzles = countSnapshot.size;
    
    if (totalPuzzles === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * totalPuzzles);
    const randomQuery = query(collection(db, 'songlePuzzles'));
    const randomSnapshot = await getDocs(randomQuery);
    
    if (randomIndex >= randomSnapshot.docs.length) return null;
    
    const randomDoc = randomSnapshot.docs[randomIndex];
    const data = randomDoc.data();
    
    return {
      id: randomDoc.id,
      ...data
    } as SonglePuzzle;
  } catch (error) {
    console.error('Error getting random songle:', error);
    return null;
  }
}

export async function checkSongExists(title: string): Promise<boolean> {
  try {
    const normalized = normalizeSongTitle(title);
    console.log('Checking if song exists:', normalized);
    
    const puzzlesRef = collection(db, 'songlePuzzles');
    const q = query(puzzlesRef, where('normalizedTitle', '==', normalized), limit(1));
    const snapshot = await getDocs(q);
    
    console.log('Song exists check:', !snapshot.empty);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking if song exists:', error);
    return false;
  }
}

export async function getSongDetails(title: string): Promise<{
  artist: string;
  decade: string;
  genre: string;
  lyricHint: string;
} | null> {
  try {
    const normalized = normalizeSongTitle(title);
    console.log('Looking up details for normalized title:', normalized);
    
    const puzzlesRef = collection(db, 'songlePuzzles');
    const q = query(puzzlesRef, where('normalizedTitle', '==', normalized), limit(1));
    const snapshot = await getDocs(q);
    
    console.log('Found documents:', snapshot.size);
    
    if (snapshot.empty) {
      console.log('No song found in puzzles:', normalized);
      return null;
    }
    
    const data = snapshot.docs[0].data();
    console.log('Song data found:', data);
    
    return {
      artist: data.artist || '',
      decade: data.decade || '',
      genre: data.genre || '',
      lyricHint: data.lyricHint || ''
    };
  } catch (error) {
    console.error('Error getting song details:', error);
    return null;
  }
}

export async function addSongleResult(
  success: boolean, 
  attempts: number
): Promise<void> {
  try {
    await addDoc(collection(db, 'puzzleResults'), {
      category: 'songle',
      success,
      attempts,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error('Error saving songle result:', error);
  }
}

export async function getSongleStats(): Promise<{
  totalPlayers: number;
  successRate: number;
  averageAttempts: number;
}> {
  try {
    const q = query(
      collection(db, 'puzzleResults'),
      where('category', '==', 'songle')
    );
    
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => doc.data());
    
    const totalPlayers = results.length;
    const successfulResults = results.filter(result => result.success);
    const successRate = totalPlayers > 0 ? successfulResults.length / totalPlayers : 0;
    
    const totalAttempts = results.reduce((sum, result) => sum + result.attempts, 0);
    const averageAttempts = totalPlayers > 0 ? totalAttempts / totalPlayers : 0;
    
    return {
      totalPlayers,
      successRate: Math.round(successRate * 100),
      averageAttempts: Math.round(averageAttempts * 10) / 10
    };
  } catch (error) {
    console.error('Error getting songle stats:', error);
    return {
      totalPlayers: 0,
      successRate: 0,
      averageAttempts: 0
    };
  }
}

// Helper function for title normalization
export function normalizeSongTitle(title: string): string {
  // First normalize the string
  let normalized = title.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ');
  
  // Only remove articles if they are the first word
  if (normalized.startsWith('the ')) {
    normalized = normalized.substring(4);
  } else if (normalized.startsWith('a ')) {
    normalized = normalized.substring(2);
  } else if (normalized.startsWith('an ')) {
    normalized = normalized.substring(3);
  }
  
  return normalized;
}