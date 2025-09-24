// src/lib/brainwave/plotle/plotle-fb.ts
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

export interface PlotlePuzzle {
  id: string;
  targetTitle: string;
  emojis: string;
  yearBand: string;
  genre: string;
  date: string;
  language?: string;
  validationHints: {
    releaseYear?: number;
    oscarCategories?: string[];
    featuredActors?: string[];
    director?: string;
    imdbRating?: number;
  };
}

export interface PlotleResult {
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

export async function getDailyPlotle(customDate?: Date): Promise<PlotlePuzzle | null> {
  try {
    const dateString = getClientDateString(customDate);
    
    const dailyPuzzlesRef = collection(db, 'dailyPuzzles');
    const dailyQuery = query(
      dailyPuzzlesRef,
      where('date', '==', dateString),
      where('category', '==', 'plotle'),
      limit(1)
    );
    
    const dailyQuerySnapshot = await getDocs(dailyQuery);
    
    if (dailyQuerySnapshot.empty) {
      return getRandomPlotle();
    }
    
    const dailyDoc = dailyQuerySnapshot.docs[0];
    const dailyData = dailyDoc.data() as DailyPuzzle;
    const parentDocumentId = dailyData.parent_document_id;
    
    const plotleRef = doc(db, 'plotlePuzzles', parentDocumentId);
    const plotleDoc = await getDoc(plotleRef);
    
    if (!plotleDoc.exists()) {
      return getRandomPlotle();
    }
    
    const data = plotleDoc.data();
    
    return {
      id: plotleDoc.id,
      ...data
    } as PlotlePuzzle;
  } catch (error) {
    console.error('Error getting daily plotle:', error);
    return null;
  }
}

export async function getRandomPlotle(): Promise<PlotlePuzzle | null> {
  try {
    const countQuery = query(collection(db, 'plotlePuzzles'));
    const countSnapshot = await getDocs(countQuery);
    const totalPuzzles = countSnapshot.size;
    
    if (totalPuzzles === 0) return null;
    
    const randomIndex = Math.floor(Math.random() * totalPuzzles);
    const randomQuery = query(collection(db, 'plotlePuzzles'));
    const randomSnapshot = await getDocs(randomQuery);
    
    if (randomIndex >= randomSnapshot.docs.length) return null;
    
    const randomDoc = randomSnapshot.docs[randomIndex];
    const data = randomDoc.data();
    
    return {
      id: randomDoc.id,
      ...data
    } as PlotlePuzzle;
  } catch (error) {
    console.error('Error getting random plotle:', error);
    return null;
  }
}


export async function checkMovieExists(title: string): Promise<boolean> {
  try {
    const normalized = normalizeMovieTitle(title);
    console.log('Checking if movie exists:', normalized);
    
    const puzzlesRef = collection(db, 'plotlePuzzles');
    const q = query(puzzlesRef, where('normalizedTitle', '==', normalized), limit(1));
    const snapshot = await getDocs(q);
    
    console.log('Movie exists check:', !snapshot.empty);
    return !snapshot.empty;
  } catch (error) {
    console.error('Error checking if movie exists:', error);
    return false;
  }
}

export async function getMovieEmojis(title: string): Promise<string[] | null> {
  try {
    const normalized = normalizeMovieTitle(title);
    console.log('Looking up emojis for normalized title:', normalized);
    
    // Query the correct collection: plotlePuzzles
    const puzzlesRef = collection(db, 'plotlePuzzles');
    const q = query(puzzlesRef, where('normalizedTitle', '==', normalized), limit(1));
    const snapshot = await getDocs(q);
    
    console.log('Found documents:', snapshot.size);
    
    if (snapshot.empty) {
      console.log('No movie found in puzzles:', normalized);
      return null;
    }
    
    const data = snapshot.docs[0].data();
    console.log('Puzzle data found:', data);
    
    if (!data.emojis) {
      console.log('No emojis found for movie');
      return null;
    }
    
    const emojis = data.emojis.split(' ').filter((emoji: string) => emoji.trim());
    console.log('Parsed emojis:', emojis);
    
    if (emojis.length !== 6) {
      console.log('Incorrect number of emojis:', emojis.length);
      return null;
    }
    
    return emojis;
  } catch (error) {
    console.error('Error getting movie emojis:', error);
    return null;
  }
}

export async function addPlotleResult(
  success: boolean, 
  attempts: number
): Promise<void> {
  try {
    await addDoc(collection(db, 'puzzleResults'), {
      category: 'plotle',
      success,
      attempts,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error('Error saving capitale result:', error);
  }
}

export async function getPlotleStats(): Promise<{
  totalPlayers: number;
  successRate: number;
  averageAttempts: number;
}> {
  try {
    const q = query(
      collection(db, 'puzzleResults'),
      where('category', '==', 'plotle')
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
    console.error('Error getting plotle stats:', error);
    return {
      totalPlayers: 0,
      successRate: 0,
      averageAttempts: 0
    };
  }
}

// Helper function for title normalization (used by both files)
export function normalizeMovieTitle(title: string): string {
  return title.toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^(the|a|an)\s+/i, '');
}