// lib/daily-fact-sb.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabase = createClient(supabaseUrl, supabaseKey);

export interface TriviaFact {
  id: string;
  fact_text: string;
  category: string;
  subcategory?: string;
  source?: string;
  source_url?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  times_used?: number;
  last_used?: string;
}

export interface DailyTriviaFact {
  id: string;
  date: string;
  fact_id: string;
  fact: TriviaFact;
}

export interface FactResult {
  fact: DailyTriviaFact;
  type: 'scheduled' | 'random' | 'fallback';
}

// Helper function to get client-side date string
function getClientDateString(customDate?: Date): string {
  const date = customDate || new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get the daily fact for a specific date with fallback strategies
 */
export async function getDailyFact(customDate?: Date): Promise<FactResult | null>  {
  const dateString = getClientDateString(customDate);
  console.log(`ðŸ” [lib] Fetching daily fact for date: ${dateString}`);


  // STEP 1: Get fact_id from daily_trivia_facts for the date - returns array!
  const { data: dailyRecords, error: dailyError } = await supabase
    .from('daily_trivia_facts')
    .select('fact_id, date, id')
    .eq('date', dateString)
    .limit(1); // We only need the first record

  if (dailyError) {
    console.error('âŒ [lib] Error fetching daily records:', dailyError);
  }

  // Check if we got any records from the array
  if (dailyRecords && dailyRecords.length > 0) {
    const dailyRecord = dailyRecords[0];
    console.log(`âœ… [lib] Found daily record with fact_id: ${dailyRecord.fact_id}`);

    // STEP 2: Use that fact_id to get the fact from trivia_facts - also returns array!
    const { data: factRecords, error: factError } = await supabase
      .from('trivia_facts')
      .select('*')
      .eq('id', dailyRecord.fact_id)
      .limit(1);

    if (!factError && factRecords && factRecords.length > 0) {
      const factData = factRecords[0];
      console.log(`âœ… [lib] Successfully fetched scheduled fact`);
      return {
        fact: {
          id: dailyRecord.id,
          date: dailyRecord.date,
          fact_id: dailyRecord.fact_id,
          fact: factData
        },
        type: 'scheduled'
      };
    } else {
      console.error('âŒ [lib] Fact not found with ID:', dailyRecord.fact_id, factError);
      console.log('ðŸ”„ [lib] Scheduled fact ID is invalid, falling back to random fact');
    }
  } else {
    console.log(`âŒ [lib] No daily records found for date: ${dateString}`);
  }

  // STEP 3: Fallback to random_trivia_facts view - returns array!
  console.log('ðŸ”„ [lib] Falling back to random_trivia_facts view');
  const { data: randomFacts, error: randomFactError } = await supabase
    .from('random_trivia_facts')
    .select('*')
    .limit(1);

  if (!randomFactError && randomFacts && randomFacts.length > 0) {
    console.log('âœ… [lib] Using random fact from random_trivia_facts view');
    return {
      fact: {
        id: `random-${Date.now()}`,
        date: dateString,
        fact_id: randomFacts[0].id,
        fact: randomFacts[0]
      },
      type: 'random'
    };
  }

  // STEP 4: Final fallback - get all records from trivia_facts and slice - returns array!
  console.log('ðŸ”„ [lib] Random view failed, fetching all facts from trivia_facts');
  const { data: allFacts, error: allFactsError } = await supabase
    .from('trivia_facts')
    .select('*')
    .order('random_index', { ascending: true });

  if (!allFactsError && allFacts && allFacts.length > 0) {
    // Get a random fact from all available facts
    const randomIndex = Math.floor(Math.random() * allFacts.length);
    const selectedFact = allFacts[randomIndex];
    
    console.log(`âœ… [lib] Using fallback fact from ${allFacts.length} total facts`);
    return {
      fact: {
        id: `fallback-${Date.now()}`,
        date: dateString,
        fact_id: selectedFact.id,
        fact: selectedFact
      },
      type: 'fallback'
    };
  }

  throw new Error('No facts available in database');
}