// lib/trordle/trordle-fb.ts
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

export interface TrordleAttribute {
  name: string;
  value: string;
  matchType?: 'exact' | 'contains' | 'number' | 'year' | 'list';
  range?: number;
  optionValues: Record<string, string>;
}

export interface TrordlePuzzle {
  id: string;
  question: string;
  answer: string;
  options: string[];
  category: string;
  attributes: TrordleAttribute[];
  date: string;
}

export interface TrordleResult {
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
  // Use client's timezone to format the date
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function getDailyTrordle(customDate?: Date): Promise<TrordlePuzzle | null> {
  try {
    // Always use client-side date calculation
    const dateString = getClientDateString(customDate);
    
    console.log('Fetching daily puzzle for date:', dateString);
    
    // First, get the daily puzzle entry
    const dailyPuzzlesRef = collection(db, 'dailyPuzzles');
    const dailyQuery = query(
      dailyPuzzlesRef,
      where('date', '==', dateString),
      where('category', '==', 'trordle'),
      limit(1)
    );
    
    const dailyQuerySnapshot = await getDocs(dailyQuery);
    
    if (dailyQuerySnapshot.empty) {
      console.log('No daily puzzle found for date:', dateString, '- getting random puzzle');
      return getRandomTrordle();
    }
    
    const dailyDoc = dailyQuerySnapshot.docs[0];
    const dailyData = dailyDoc.data() as DailyPuzzle;
    const parentDocumentId = dailyData.parent_document_id;
    
    console.log('Found daily puzzle entry:', dailyDoc.id, 'with parent ID:', parentDocumentId);
    
    // Now fetch the actual puzzle data from trordlePuzzles
    const trordleRef = doc(db, 'trordlePuzzles', parentDocumentId);
    const trordleDoc = await getDoc(trordleRef);
    
    if (!trordleDoc.exists()) {
      console.log('No trordle puzzle found with ID:', parentDocumentId, '- getting random puzzle');
      return getRandomTrordle();
    }
    
    const data = trordleDoc.data();
    
    // Ensure all attributes have optionValues with proper fallbacks
    const processedAttributes = data.attributes.map((attr: TrordleAttribute) => ({
      ...attr,
      optionValues: attr.optionValues || {},
      matchType: attr.matchType || 'contains',
      range: attr.range || 0
    }));
    
    console.log('Found trordle puzzle:', trordleDoc.id, 'for date:', dateString);
    
    return {
      id: trordleDoc.id,
      ...data,
      attributes: processedAttributes
    } as TrordlePuzzle;
  } catch (error) {
    console.error('Error getting daily trordle:', error);
    return null;
  }
}

export async function getRandomTrordle(): Promise<TrordlePuzzle | null> {
  try {
    // Get total count of puzzles
    const countQuery = query(collection(db, 'trordlePuzzles'));
    const countSnapshot = await getDocs(countQuery);
    const totalPuzzles = countSnapshot.size;
    
    if (totalPuzzles === 0) return null;
    
    // Get a random puzzle
    const randomIndex = Math.floor(Math.random() * totalPuzzles);
    const randomQuery = query(collection(db, 'trordlePuzzles'));
    const randomSnapshot = await getDocs(randomQuery);
    
    if (randomIndex >= randomSnapshot.docs.length) return null;
    
    const randomDoc = randomSnapshot.docs[randomIndex];
    const data = randomDoc.data();
    
    // Ensure all attributes have optionValues with proper fallbacks
    const processedAttributes = data.attributes.map((attr: TrordleAttribute) => ({
      ...attr,
      optionValues: attr.optionValues || {},
      matchType: attr.matchType || 'contains',
      range: attr.range || 0
    }));
    
    return {
      id: randomDoc.id,
      ...data,
      attributes: processedAttributes
    } as TrordlePuzzle;
  } catch (error) {
    console.error('Error getting random trordle:', error);
    return null;
  }
}

export async function addTrordleResult(
  success: boolean, 
  attempts: number
): Promise<void> {
  try {
    await addDoc(collection(db, 'puzzleResults'), {
      category: 'trordle',
      success,
      attempts,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error('Error saving trordle result:', error);
  }
}

export async function getTrordleStats(): Promise<{
  totalPlayers: number;
  successRate: number;
  averageAttempts: number;
}> {
  try {
    const q = query(
      collection(db, 'puzzleResults'),
      where('category', '==', 'trordle')
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
    console.error('Error getting trordle stats:', error);
    return {
      totalPlayers: 0,
      successRate: 0,
      averageAttempts: 0
    };
  }
}