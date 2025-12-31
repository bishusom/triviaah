// lib/wikimedia.ts

// Interface definitions for Wikipedia API response
interface WikipediaSearchResult {
  ns: number;
  title: string;
  pageid: number;
  size: number;
  wordcount: number;
  snippet: string;
  timestamp: string;
}

interface WikipediaSearchResponse {
  batchcomplete?: string;
  continue?: {
    sroffset: number;
    continue: string;
  };
  query?: {
    searchinfo?: {
      totalhits: number;
    };
    search?: WikipediaSearchResult[];
  };
}

interface WikipediaPageImage {
  source: string;
  width: number;
  height: number;
}

interface WikipediaPage {
  pageid: number;
  ns: number;
  title: string;
  thumbnail?: WikipediaPageImage;
  pageimage?: string;
  extract?: string;
}

interface WikipediaPagesResponse {
  batchcomplete?: string;
  query?: {
    pages: Record<string, WikipediaPage>;
  };
}

// Entity types for better classification
export type EntityType = 'car' | 'capital' | 'city' | 'animal' | 'invention' | 'landmark' | 'food' | 'plant' | 'person' | 'general';

// Scoring rules for different entity types
const entityScoringRules: Record<EntityType, {
  bonusTerms: { term: string; score: number }[];
  penaltyTerms: { term: string; score: number }[];
  titlePatterns?: { pattern: RegExp; score: number }[];
  requiredTerms?: string[];
}> = {
  car : {
    bonusTerms: [
      { term: 'car', score: 10 },
      { term: 'automobile', score: 9 },
      { term: 'vehicle', score: 8 },
      { term: 'make', score: 7 },
      { term: 'model', score: 7 },
      { term: 'engine', score: 6 },
      { term: 'horsepower', score: 6 },
      { term: 'torque', score: 6 },
      { term: 'transmission', score: 5 },
      { term: 'drivetrain', score: 5 },
      { term: 'top speed', score: 5 },
      { term: 'acceleration', score: 5 },
    ],
    penaltyTerms: [
      { term: 'band', score: -10 },
      { term: 'song', score: -10 },
      { term: 'album', score: -10 },
      { term: 'singer', score: -10 },
      { term: 'musician', score: -10 },
      { term: 'film', score: -8 },
      { term: 'character', score: -7 },
    ]
  },
  capital: {
    bonusTerms: [
      { term: 'capital', score: 10 },
      { term: 'skyline', score: 8 },
      { term: 'city', score: 7 },
      { term: 'municipality', score: 5 },
      { term: 'located in', score: 4 },
      { term: 'country', score: 4 },
      { term: 'population', score: 3 },
      { term: 'urban', score: 3 },
      { term: 'metropolitan', score: 3 },
      { term: 'largest city', score: 4 },
    ],
    penaltyTerms: [
      { term: 'singer', score: -10 },
      { term: 'musician', score: -10 },
      { term: 'actor', score: -10 },
      { term: 'artist', score: -8 },
      { term: 'band', score: -10 },
      { term: 'song', score: -10 },
      { term: 'album', score: -10 },
      { term: 'novel', score: -8 },
      { term: 'film', score: -8 },
      { term: 'movie', score: -8 },
      { term: 'tv series', score: -8 },
      { term: 'character', score: -7 },
    ],
    titlePatterns: [
      { pattern: /^[A-Z][a-z]+(?:[-\s][A-Z][a-z]+)*$/, score: 5 }, // Proper place name
      { pattern: /\(city\)$/i, score: 8 },
      { pattern: /\(capital\)$/i, score: 10 },
    ]
  },
  city: {
    bonusTerms: [
      { term: 'skyline', score: 8 },
      { term: 'city', score: 7 },
      { term: 'municipality', score: 5 },
      { term: 'located in', score: 4 },
      { term: 'country', score: 4 },
      { term: 'population', score: 3 },
      { term: 'urban', score: 3 },
      { term: 'metropolitan', score: 3 },
      { term: 'largest city', score: 4 },
    ],
    penaltyTerms: [
      { term: 'singer', score: -10 },
      { term: 'musician', score: -10 },
      { term: 'actor', score: -10 },
      { term: 'artist', score: -8 },
      { term: 'band', score: -10 },
      { term: 'song', score: -10 },
      { term: 'album', score: -10 },
      { term: 'novel', score: -8 },
      { term: 'film', score: -8 },
      { term: 'movie', score: -8 },
      { term: 'tv series', score: -8 },
      { term: 'character', score: -7 },
    ],
     titlePatterns: [
      { pattern: /^[A-Z][a-z]+(?:[-\s][A-Z][a-z]+)*$/, score: 5 }, // Proper place name
      { pattern: /\(city\)$/i, score: 8 },
      { pattern: /\(capital\)$/i, score: 10 },
    ]
  },
  animal: {
    bonusTerms: [
      { term: 'species', score: 10 },
      { term: 'animal', score: 9 },
      { term: 'genus', score: 8 },
      { term: 'family', score: 7 },
      { term: 'habitat', score: 6 },
      { term: 'wildlife', score: 5 },
      { term: 'mammal', score: 8 },
      { term: 'bird', score: 8 },
      { term: 'fish', score: 8 },
      { term: 'reptile', score: 8 },
      { term: 'amphibian', score: 8 },
      { term: 'endangered', score: 4 },
      { term: 'conservation', score: 3 },
      { term: 'native', score: 3 },
      { term: 'diet', score: 3 },
    ],
    penaltyTerms: [
      { term: 'band', score: -10 },
      { term: 'singer', score: -10 },
      { term: 'company', score: -8 },
      { term: 'brand', score: -8 },
      { term: 'product', score: -8 },
      { term: 'album', score: -10 },
      { term: 'song', score: -10 },
      { term: 'film', score: -8 },
      { term: 'character', score: -7 },
    ]
  },
  invention: {
    bonusTerms: [
      { term: 'invention', score: 10 },
      { term: 'invented', score: 9 },
      { term: 'inventor', score: 8 },
      { term: 'patent', score: 8 },
      { term: 'device', score: 7 },
      { term: 'technology', score: 6 },
      { term: 'machine', score: 7 },
      { term: 'engineer', score: 6 },
      { term: 'innovation', score: 5 },
      { term: 'century', score: 4 },
      { term: 'developed', score: 5 },
      { term: 'mechanism', score: 6 },
    ],
    penaltyTerms: [
      { term: 'song', score: -10 },
      { term: 'band', score: -10 },
      { term: 'movie', score: -8 },
      { term: 'film', score: -8 },
      { term: 'album', score: -10 },
      { term: 'singer', score: -10 },
    ]
  },
  landmark: {
    bonusTerms: [
      { term: 'landmark', score: 10 },
      { term: 'monument', score: 9 },
      { term: 'building', score: 8 },
      { term: 'tower', score: 8 },
      { term: 'statue', score: 8 },
      { term: 'historic', score: 7 },
      { term: 'unesco', score: 9 },
      { term: 'architecture', score: 7 },
      { term: 'tourist', score: 6 },
      { term: 'attraction', score: 6 },
      { term: 'located', score: 5 },
      { term: 'constructed', score: 5 },
      { term: 'built', score: 5 },
      { term: 'designed', score: 4 },
      { term: 'entrance', score: 4 },
    ],
    penaltyTerms: [
      { term: 'band', score: -10 },
      { term: 'song', score: -10 },
      { term: 'album', score: -10 },
      { term: 'singer', score: -10 },
      { term: 'musician', score: -10 },
      { term: 'person', score: -8 },
      { term: 'born', score: -8 },
      { term: 'list of', score: -12 },
      { term: 'category', score: -10 },
      { term: 'various', score: -8 },
      { term: 'type of', score: -8 },
      { term: 'ancient', score: -5 }, // Penalize overly generic ancient structures
    ]
  },
  food: {
    bonusTerms: [
      { term: 'food', score: 10 },
      { term: 'dish', score: 9 },
      { term: 'cuisine', score: 8 },
      { term: 'recipe', score: 7 },
      { term: 'cooking', score: 6 },
      { term: 'ingredients', score: 6 },
      { term: 'flavor', score: 5 },
      { term: 'served', score: 5 },
      { term: 'traditional', score: 5 },
      { term: 'regional', score: 4 },
      { term: 'culinary', score: 6 },
      { term: 'prepared', score: 4 },
    ],
    penaltyTerms: [
      { term: 'band', score: -10 },
      { term: 'song', score: -10 },
      { term: 'company', score: -8 },
      { term: 'film', score: -8 },
      { term: 'album', score: -10 },
      { term: 'singer', score: -10 },
      { term: 'musician', score: -10 },
    ]
  },
  person: {
    bonusTerms: [
      { term: 'born', score: 9 },
      { term: 'died', score: 7 },
      { term: 'musician', score: 8 },
      { term: 'singer', score: 8 },
      { term: 'scientist', score: 8 },
      { term: 'actor', score: 8 },
      { term: 'artist', score: 8 },
      { term: 'writer', score: 7 },
      { term: 'director', score: 7 },
      { term: 'performer', score: 6 },
      { term: 'biography', score: 5 },
      { term: 'career', score: 4 },
    ],
    penaltyTerms: [
      { term: 'city', score: -9 },
      { term: 'capital', score: -10 },
      { term: 'country', score: -8 },
      { term: 'located', score: -7 },
      { term: 'population', score: -7 },
    ]
  },
  plant: {
    bonusTerms: [
      { term: 'plant', score: 10 },
      { term: 'species', score: 9 },
      { term: 'genus', score: 8 },
      { term: 'family', score: 7 },
      { term: 'habitat', score: 6 },
      { term: 'flora', score: 5 },
      { term: 'botanical', score: 6 },
      { term: 'native', score: 4 },
      { term: 'cultivation', score: 5 },
      { term: 'growth', score: 4 },
      { term: 'flower', score: 7 },
      { term: 'leaf', score: 6 },
      { term: 'fruit', score: 6 },
    ],
    penaltyTerms: [
      { term: 'band', score: -10 },
      { term: 'singer', score: -10 },
      { term: 'company', score: -8 },
      { term: 'brand', score: -8 },
      { term: 'product', score: -8 },
      { term: 'album', score: -10 },
      { term: 'song', score: -10 },
      { term: 'film', score: -8 },
      { term: 'character', score: -7 },
    ]
  },
  general: {
    bonusTerms: [],
    penaltyTerms: []
  }
};

// Helper function to check if a page has an image
async function pageHasImage(pageTitle: string): Promise<boolean> {
  try {
    const imagesUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&format=json&origin=*`;
    const response = await fetch(imagesUrl);
    if (!response.ok) return false;
    
    const data: WikipediaPagesResponse = await response.json();
    if (data.query?.pages) {
      const pages = Object.values(data.query.pages);
      return pages.length > 0 && (!!pages[0].thumbnail || !!pages[0].pageimage);
    }
    return false;
  } catch {
    return false;
  }
}

// Helper function to normalize names for comparison
function normalizeForComparison(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s]/g, '');
}

// Helper function to score a Wikipedia page based on entity type
function scorePage(page: WikipediaSearchResult, entityType: EntityType, searchTerm: string, context?: string): number {
  let score = 0;
  const title = page.title.toLowerCase();
  const snippet = page.snippet.toLowerCase().replace(/<[^>]*>/g, ''); // Remove HTML tags
  const fullText = title + ' ' + snippet;
  
  const rules = entityScoringRules[entityType];
  
  // Check for disambiguation pages - heavy penalty
  if (page.title.includes('(disambiguation)') || snippet.includes('may refer to')) {
    score -= 50;
  }
  
  // Penalty for overly generic or category pages
  if (page.title.match(/^(List of|Category:|Index of|Outline of)/i)) {
    score -= 30;
  }
  
  // For landmarks, heavily penalize generic structure type pages
  if (entityType === 'landmark') {
    // Check if title is just a generic type (e.g., "Pyramid", "Tower", "Bridge")
    const genericStructures = /^(pyramid|tower|bridge|castle|palace|temple|church|cathedral|mosque|building)s?$/i;
    if (genericStructures.test(page.title.replace(/\s*\([^)]*\)\s*/g, '').trim())) {
      score -= 40; // Heavy penalty for generic structure pages
    }
    
    // Bonus for specific named landmarks (contains location or proper name)
    if (page.title.match(/[A-Z][a-z]+\s+(pyramid|tower|bridge|castle|palace|temple|church|cathedral|mosque|building)/i)) {
      score += 8; // e.g., "Louvre Pyramid", "Eiffel Tower"
    }
  }
  
  // CRITICAL: Exact name matching for persons and other entities
  const normalizedSearchTerm = normalizeForComparison(searchTerm);
  const normalizedTitle = normalizeForComparison(page.title.replace(/\s*\([^)]*\)\s*/g, ''));
  
  // Full name match bonus (very important for people)
  if (normalizedTitle === normalizedSearchTerm) {
    score += 20; // Strong bonus for exact match
  } else if (normalizedTitle.includes(normalizedSearchTerm) || normalizedSearchTerm.includes(normalizedTitle)) {
    score += 10; // Partial match
  }
  
  // For multi-word landmarks/entities, check if search term is contained in title
  const searchWords = normalizedSearchTerm.split(/\s+/).filter(w => w.length > 2);
  if (searchWords.length >= 2) {
    const allWordsPresent = searchWords.every(word => normalizedTitle.includes(word));
    if (allWordsPresent) {
      score += 15; // All key words present (e.g., "Louvre Pyramid" contains both "louvre" and "pyramid")
    }
  }
  
  // For person searches, check if first and last names match in order
  if (entityType === 'person') {
    const searchParts = normalizedSearchTerm.split(/\s+/);
    const titleParts = normalizedTitle.split(/\s+/);
    
    // Check if all search term parts appear in title in the same order
    if (searchParts.length >= 2) {
      let allPartsMatch = true;
      let lastIndex = -1;
      
      for (const part of searchParts) {
        const index = titleParts.findIndex((tp, i) => i > lastIndex && tp.includes(part));
        if (index === -1) {
          allPartsMatch = false;
          break;
        }
        lastIndex = index;
      }
      
      if (allPartsMatch) {
        score += 15; // All name parts match in order
      }
    }
  }
  
  // Apply bonus terms
  for (const { term, score: termScore } of rules.bonusTerms) {
    const regex = new RegExp(`\\b${term.toLowerCase()}\\b`, 'i');
    if (regex.test(fullText)) {
      score += termScore;
    }
  }
  
  // Apply penalty terms
  for (const { term, score: termScore } of rules.penaltyTerms) {
    const regex = new RegExp(`\\b${term.toLowerCase()}\\b`, 'i');
    if (regex.test(fullText)) {
      score += termScore;
    }
  }
  
  // Apply title patterns if any
  if (rules.titlePatterns) {
    for (const { pattern, score: patternScore } of rules.titlePatterns) {
      if (pattern.test(page.title)) {
        score += patternScore;
      }
    }
  }
  
  // Context bonus (e.g., country for capital)
  if (context) {
    const contextRegex = new RegExp(`\\b${context.toLowerCase()}\\b`, 'i');
    if (contextRegex.test(fullText)) {
      score += 10;
    }
  }
  
  // Exact or near-exact title match bonus
  if (entityType !== 'person') {
    const cleanTitle = page.title.replace(/\s*\([^)]*\)\s*/g, '').trim();
    if (!page.title.includes('(disambiguation)') && !page.title.includes('List of')) {
      score += 3;
    }
  }
  
  // Penalty for list pages
  if (page.title.startsWith('List of') || page.title.includes('lists')) {
    score -= 10;
  }
  
  // Word count relevance (prefer substantial articles)
  if (page.wordcount > 1000) {
    score += 2;
  }
  
  return score;
}

// Main function to find Wikipedia page with entity type detection
async function findWikipediaPage(
  searchTerm: string, 
  entityType: EntityType = 'general',
  context?: string
): Promise<string | null> {
  try {
    // Build search query - add entity-specific modifiers
    const searchModifiers: Record<EntityType, string[]> = {
      capital: ['city', 'capital'],
      car: ['car', 'automobile', 'vehicle'],
      city: ['city', 'skyline'],
      animal: ['animal', 'species'],
      invention: ['invention', 'device'],
      plant: ['plant', 'flora', 'botanical'],
      landmark: ['landmark', 'monument', 'building'],
      food: ['food', 'dish', 'cuisine'],
      person: ['biography'],
      general: []
    };
    
    // Create search attempts with smart prioritization
    const searchAttempts: string[] = [];
    
    // For capitals with context, prioritize context-based searches
    if (entityType === 'capital' && context) {
      searchAttempts.push(`${searchTerm} ${context}`);
      searchAttempts.push(`${searchTerm} capital ${context}`);
    }
    
    // Add base search
    searchAttempts.push(searchTerm);
    
    // Add modifier-based searches
    if (searchModifiers[entityType].length > 0) {
      for (const modifier of searchModifiers[entityType]) {
        searchAttempts.push(`${searchTerm} ${modifier}`);
      }
    }
    
    let bestResult: WikipediaSearchResult | null = null;
    let bestScore = -Infinity;
    const candidateResults: Array<{ result: WikipediaSearchResult; score: number }> = [];
    
    // Try each search attempt
    for (const attempt of searchAttempts) {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(attempt)}&srlimit=15&format=json&origin=*`;
      
      try {
        const searchResponse = await fetch(searchUrl);
        if (!searchResponse.ok) continue;
        
        const searchData: WikipediaSearchResponse = await searchResponse.json();
        
        if (!searchData.query?.search || searchData.query.search.length === 0) {
          continue;
        }
        
        // Score all results
        for (const result of searchData.query.search) {
          const resultScore = scorePage(result, entityType, searchTerm, context);
          
          // Skip disambiguation pages
          if (result.title.includes('(disambiguation)')) {
            continue;
          }
          
          candidateResults.push({ result, score: resultScore });
          
          if (resultScore > bestScore) {
            bestScore = resultScore;
            bestResult = result;
          }
        }
      } catch (error) {
        console.warn(`Search attempt failed for: ${attempt}`, error);
        continue;
      }
    }
    
    // If we have a result with a positive score, verify it has an image
    if (bestResult && bestScore > 0) {
      const hasImage = await pageHasImage(bestResult.title);
      if (hasImage) {
        return bestResult.title;
      }
      
      // If best result has no image, try next best candidates
      const sortedCandidates = candidateResults
        .filter(c => c.result.title !== bestResult!.title)
        .sort((a, b) => b.score - a.score);
      
      for (const candidate of sortedCandidates.slice(0, 5)) {
        if (candidate.score > 0) {
          const hasImage = await pageHasImage(candidate.result.title);
          if (hasImage) {
            return candidate.result.title;
          }
        }
      }
    }
    
    // Return best result even without image verification as fallback
    return bestResult?.title || null;
    
  } catch (error) {
    console.error('Error searching Wikipedia:', error);
    return null;
  }
}

// Enhanced main function with entity type support
export async function fetchWikimediaImage(
  searchTerm: string, 
  options?: {
    entityType?: EntityType;
    context?: string;
    useFallback?: boolean;
    minImageSize?: number;
  }
): Promise<string | null> {
  try {
    const entityType = options?.entityType || 'general';
    const context = options?.context;
    const useFallback = options?.useFallback !== false; // Default to true
    const minImageSize = options?.minImageSize || 300;
    
    // Find the best Wikipedia page
    const pageTitle = await findWikipediaPage(searchTerm, entityType, context);
    
    if (!pageTitle) {
      if (useFallback && entityType !== 'general') {
        // Try with 'general' type as fallback
        return fetchWikimediaImage(searchTerm, { 
          entityType: 'general',
          context,
          useFallback: false,
          minImageSize
        });
      }
      return null;
    }
    
    // Fetch image for the page with larger thumbnail size
    const imagesUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(pageTitle)}&prop=pageimages&pithumbsize=${minImageSize}&format=json&origin=*`;
    const imagesResponse = await fetch(imagesUrl);
    
    if (!imagesResponse.ok) {
      console.warn('Wikipedia images fetch failed:', imagesResponse.status);
      return null;
    }
    
    const imagesData: WikipediaPagesResponse = await imagesResponse.json();
    
    if (imagesData.query?.pages) {
      const pages = Object.values(imagesData.query.pages);
      if (pages.length > 0 && pages[0].thumbnail) {
        return pages[0].thumbnail.source;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching from Wikipedia:', error);
    return null;
  }
}

// Convenience functions for specific entity types
export const fetchCarImage = (car: string): Promise<string | null> =>
  fetchWikimediaImage(car, { entityType: 'car', minImageSize: 500 });

export const fetchCapitalImage = (capital: string, country?: string): Promise<string | null> =>
  fetchWikimediaImage(capital, { entityType: 'capital', context: country, minImageSize: 500 });

export const fetchCityImage = (capital: string, country?: string): Promise<string | null> =>
  fetchWikimediaImage(capital, { entityType: 'city', context: country, minImageSize: 500 });

export const fetchAnimalImage = (animal: string): Promise<string | null> =>
  fetchWikimediaImage(animal, { entityType: 'animal', minImageSize: 400 });

export const fetchInventionImage = (invention: string): Promise<string | null> =>
  fetchWikimediaImage(invention, { entityType: 'invention', minImageSize: 400 });

export const fetchLandmarkImage = (landmark: string): Promise<string | null> =>
  fetchWikimediaImage(landmark, { entityType: 'landmark', minImageSize: 500 });

export const fetchFoodImage = (food: string): Promise<string | null> =>
  fetchWikimediaImage(food, { entityType: 'food', minImageSize: 400 });

export const fetchPersonImage = (person: string): Promise<string | null> =>
  fetchWikimediaImage(person, { entityType: 'person', minImageSize: 300 }); 

// Enhanced search terms for capitals
export const getCapitalSearchTerms = (capital: string, country: string): string[] => {
  return [
    `${capital}, ${country}`,
    `${capital} city ${country}`,
    `${capital} capital ${country}`,
    `capital of ${country}`,
    `${capital} city`,
    capital
  ];
};

// Type guard to determine entity type from component context (optional)
export function guessEntityType(componentName: string): EntityType {
  const map: Record<string, EntityType> = {
    'capitale': 'capital',
    'creaturedle': 'animal',
    'inventionle': 'invention',
    'landmarkdle': 'landmark',
    'foodle': 'food',
    'artist': 'person'
  };
  
  return map[componentName.toLowerCase()] || 'general';
}