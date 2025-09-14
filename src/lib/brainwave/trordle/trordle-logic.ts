export interface TrordleAttribute {
  name: string;
  value: string;
  status: 'correct' | 'partial' | 'incorrect';
}

export interface TrordleGuessResult {
  guess: string;
  isCorrect: boolean;
  attributes: TrordleAttribute[];
}

export interface TrordleData {
  id: string;
  question: string;
  answer: string;
  options: string[];
  category: string;
  attributes: {
    name: string;
    value: string;
    matchType?: 'exact' | 'contains' | 'number' | 'year' | 'list';
    range?: number;
    // Each attribute defines what values each option has
    optionValues: Record<string, string>;
  }[];
  date: string;
}

export function checkTrordleGuess(guess: string, puzzle: TrordleData): TrordleGuessResult {
  const isCorrect = normalizeText(guess) === normalizeText(puzzle.answer);
  const attributes: TrordleAttribute[] = [];
  
  // For each attribute, compare what the guess represents vs what the correct answer represents
  for (const attr of puzzle.attributes) {
    const guessValue = attr.optionValues[guess] || guess; // Fallback to guess text if no specific value
    const correctValue = attr.optionValues[puzzle.answer] || attr.value;
    
    const status = evaluateAttributeMatch(guessValue, correctValue, attr);
    
    attributes.push({
      name: attr.name,
      value: correctValue, // Show the correct answer's value
      status
    });
  }
  
  return {
    guess,
    isCorrect,
    attributes
  };
}

function evaluateAttributeMatch(guessValue: string, correctValue: string, attribute: TrordleData['attributes'][0]): 'correct' | 'partial' | 'incorrect' {
  const { matchType = 'contains', range = 0 } = attribute;
  
  return compareBasedOnType(guessValue, correctValue, matchType, range);
}

function compareBasedOnType(guess: string, value: string, matchType: string, range: number): 'correct' | 'partial' | 'incorrect' {
  const normalizedGuess = normalizeText(guess);
  const normalizedValue = normalizeText(value);
  
  switch (matchType) {
    case 'exact':
      return normalizedGuess === normalizedValue ? 'correct' : 'incorrect';
    
    case 'contains':
      if (normalizedGuess === normalizedValue) return 'correct';
      if (normalizedGuess.includes(normalizedValue) || normalizedValue.includes(normalizedGuess)) {
        return 'partial';
      }
      return 'incorrect';
    
    case 'year':
    case 'number':
      const guessNum = extractNumber(guess);
      const valueNum = extractNumber(value);
      
      if (guessNum === null || valueNum === null) return 'incorrect';
      
      const difference = Math.abs(guessNum - valueNum);
      const allowedRange = range > 0 ? range : (matchType === 'year' ? 10 : 5);
      
      if (difference === 0) return 'correct';
      if (difference <= allowedRange) return 'partial';
      return 'incorrect';
    
    case 'list':
      // For list matching, check if any word from value appears in guess
      const valueWords = normalizedValue.split(/\s*[,;]\s*|\s+/);
      const guessWords = normalizedGuess.split(/\s*[,;]\s*|\s+/);
      
      const exactMatch = valueWords.some(vWord => guessWords.some(gWord => gWord === vWord));
      const partialMatch = valueWords.some(vWord => guessWords.some(gWord => gWord.includes(vWord) || vWord.includes(gWord)));
      
      if (exactMatch) return 'correct';
      if (partialMatch) return 'partial';
      return 'incorrect';
    
    default:
      if (normalizedGuess === normalizedValue) return 'correct';
      if (normalizedGuess.includes(normalizedValue) || normalizedValue.includes(normalizedGuess)) {
        return 'partial';
      }
      return 'incorrect';
  }
}

function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

function extractNumber(text: string): number | null {
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : null;
}