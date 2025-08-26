import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  Timestamp 
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

export async function getDailyTrordle(): Promise<TrordlePuzzle | null> {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    const q = query(
      collection(db, 'trordlePuzzles'),
      where('date', '==', today)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      // If no puzzle for today, get a random one as fallback
      return getRandomTrordle();
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    
    // Ensure all attributes have optionValues with proper fallbacks
    const processedAttributes = data.attributes.map((attr: TrordleAttribute) => ({
      ...attr,
      optionValues: attr.optionValues || {},
      matchType: attr.matchType || 'contains',
      range: attr.range || 0
    }));
    
    return {
      id: doc.id,
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
  puzzleId: string, 
  success: boolean, 
  attempts: number
): Promise<void> {
  try {
    await addDoc(collection(db, 'trordleResults'), {
      puzzleId,
      success,
      attempts,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error('Error saving trordle result:', error);
  }
}

export async function getTrordleStats(puzzleId: string): Promise<{
  totalPlayers: number;
  successRate: number;
  averageAttempts: number;
}> {
  try {
    const q = query(
      collection(db, 'trordleResults'),
      where('puzzleId', '==', puzzleId)
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