// lib/capitale/capitale-fb.ts
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

export interface CapitalInfo {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  continent: string;
  timezone: string; // Add timezone for hint generation
  population?: number; // Optional for alternative hints
  countryCode?: string; 
}

export interface CapitalePuzzle {
  id: string;
  answer: string;
  country: string;
  countryCode: string;
  silhouette: string;
  timezone: string;
  population: number;
  latitude: number;
  longitude: number;
  date: string;
  continent: string;
  validCapitals: string[];
  cityHint: string;
}

export interface CapitaleResult {
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

// Cache for valid capitals to avoid repeated Firebase queries
let validCapitalsCache: CapitalInfo[] | null = null;

// Helper function to get all valid capitals from Firebase  
async function getAllValidCapitalsWithInfo(): Promise<CapitalInfo[]> {
  // Return cached value if available
  if (validCapitalsCache) {
    return validCapitalsCache;
  }
  
  try {
    const puzzlesQuery = query(collection(db, 'capitalePuzzles'));
    const querySnapshot = await getDocs(puzzlesQuery);
    
    console.log('Total documents in capitalePuzzles:', querySnapshot.docs.length); // Debug log
    
    // Extract capital info from all puzzles
    const capitals = querySnapshot.docs
      .map(doc => {
        const data = doc.data();
        console.log('Document data:', data); // Debug log each document
        
        return {
          name: data.answer?.trim(),
          country: data.country,
          latitude: data.latitude,
          longitude: data.longitude,
          continent: data.continent,
          timezone: data.timezone || '', // Add timezone
          population: data.population, // Optional
          countryCode: data.countryCode
        } as Partial<CapitalInfo>;
      })
      .filter((capital): capital is CapitalInfo => {
        const isValid = !!capital.name && capital.latitude !== undefined && 
                        capital.longitude !== undefined && !!capital.continent;
        
        if (!isValid) {
          console.log('Invalid capital data:', capital); // Debug log invalid entries
        }
        
        return isValid;
      });
    
    // Cache the result
    validCapitalsCache = capitals;
    
    console.log('Loaded valid capitals with info:', capitals);
    return capitals;
  } catch (error) {
    console.error('Error fetching valid capitals:', error);
    return []; // Return empty array on error
  }
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

export async function getDailyCapitale(customDate?: Date): Promise<{puzzle: CapitalePuzzle | null, allCapitals: CapitalInfo[]}> {
  try {
    // Always use client-side date calculation
    const dateString = getClientDateString(customDate);
    
    console.log('Fetching daily puzzle for date:', dateString);
    
    // First, get the daily puzzle entry
    const dailyPuzzlesRef = collection(db, 'dailyPuzzles');
    const dailyQuery = query(
      dailyPuzzlesRef,
      where('date', '==', dateString),
      where('category', '==', 'capitale'),
      limit(1)
    );
    
    const dailyQuerySnapshot = await getDocs(dailyQuery);
    
    if (dailyQuerySnapshot.empty) {
      console.log('No daily puzzle found for date:', dateString, '- getting random puzzle');
      return getRandomCapitale();
    }
    
    const dailyDoc = dailyQuerySnapshot.docs[0];
    const dailyData = dailyDoc.data() as DailyPuzzle;
    const parentDocumentId = dailyData.parent_document_id;
    
    console.log('Found daily puzzle entry:', dailyDoc.id, 'with parent ID:', parentDocumentId);
    
    // Now fetch the actual puzzle data from capitalePuzzles
    const capitaleRef = doc(db, 'capitalePuzzles', parentDocumentId);
    const capitaleDoc = await getDoc(capitaleRef);
    
    if (!capitaleDoc.exists()) {
      console.log('No capitale puzzle found with ID:', parentDocumentId, '- getting random puzzle');
      return getRandomCapitale();
    }
    
    const data = capitaleDoc.data();
    
    // Get all valid capitals from Firebase
    const allCapitals = await getAllValidCapitalsWithInfo();
    const validCapitals = allCapitals.map(c => c.name);
    
    console.log('Found capitale puzzle:', capitaleDoc.id, 'for date:', dateString, ' valid capitals count:', validCapitals.length);
    
    return {
      puzzle: {
        id: capitaleDoc.id,
        ...data,
        validCapitals: validCapitals
      } as CapitalePuzzle,
      allCapitals
    };
  } catch (error) {
    console.error('Error getting daily capitale:', error);
    return { puzzle: null, allCapitals: [] };
  }
}

export async function getRandomCapitale(): Promise<{puzzle: CapitalePuzzle | null, allCapitals: CapitalInfo[]}> {
  try {
    // Get all puzzles and capitals info
    const allCapitals = await getAllValidCapitalsWithInfo();
    const validCapitals = allCapitals.map(c => c.name);
    
    // Get total count of puzzles
    const countQuery = query(collection(db, 'capitalePuzzles'));
    const countSnapshot = await getDocs(countQuery);
    const totalPuzzles = countSnapshot.size;
    
    if (totalPuzzles === 0) return { puzzle: null, allCapitals: [] };
    
    // Get a random puzzle
    const randomIndex = Math.floor(Math.random() * totalPuzzles);
    const randomQuery = query(collection(db, 'capitalePuzzles'));
    const randomSnapshot = await getDocs(randomQuery);
    
    if (randomIndex >= randomSnapshot.docs.length) return { puzzle: null, allCapitals: [] };
    
    const randomDoc = randomSnapshot.docs[randomIndex];
    const data = randomDoc.data();
    
    return {
      puzzle: {
        id: randomDoc.id,
        ...data,
        validCapitals: validCapitals
      } as CapitalePuzzle,
      allCapitals
    };
  } catch (error) {
    console.error('Error getting random capitale:', error);
    return { puzzle: null, allCapitals: [] };
  }
}

export async function addCapitaleResult(
  success: boolean, 
  attempts: number
): Promise<void> {
  try {
    await addDoc(collection(db, 'puzzleResults'), {
      category: 'capitale',
      success,
      attempts,
      timestamp: Timestamp.now()
    });
  } catch (error) {
    console.error('Error saving capitale result:', error);
  }
}

export async function getCapitaleStats(): Promise<{
  totalPlayers: number;
  successRate: number;
  averageAttempts: number;
}> {
  try {
    const q = query(
      collection(db, 'puzzleResults'),
      where('category', '==', 'capitale')
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
    console.error('Error getting capitale stats:', error);
    return {
      totalPlayers: 0,
      successRate: 0,
      averageAttempts: 0
    };
  }
}

export function getCapitalCoordinates(capital: string, allCapitals: CapitalInfo[]): { lat: number, lon: number } | null {
  const normalizedCapital = capital.trim().toLowerCase();
  const capitalInfo = allCapitals.find(c => 
    c.name.toLowerCase() === normalizedCapital
  );
  
  return capitalInfo ? { lat: capitalInfo.latitude, lon: capitalInfo.longitude } : null;
}