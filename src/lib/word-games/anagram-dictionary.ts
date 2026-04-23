import { supabase } from '@/lib/supabase';

const DICTIONARY_API_KEY = process.env.NEXT_PUBLIC_MW_DICTIONARY_KEY;

const candidateCache = new Map<string, string[]>();
const validationCache = new Map<string, boolean>();

export function normalizeWord(value: string) {
  return value.trim().toLowerCase();
}

export function canUseLetters(word: string, letters: string) {
  const available = letters.toLowerCase().split('').reduce<Record<string, number>>((acc, letter) => {
    acc[letter] = (acc[letter] ?? 0) + 1;
    return acc;
  }, {});

  for (const letter of word.toLowerCase().split('')) {
    if (!available[letter]) return false;
    available[letter] -= 1;
  }

  return true;
}

export async function loadDictionaryCandidates(letters: string, minLength = 4) {
  const cacheKey = `${letters.toLowerCase()}-${minLength}`;
  const cached = candidateCache.get(cacheKey);
  if (cached) return cached;

  try {
    const { data, error } = await supabase
      .from('dictionary')
      .select('word, letters, length')
      .gte('length', minLength)
      .lte('length', letters.length)
      .limit(2500);

    if (error) throw error;

    const normalizedLetters = letters.toLowerCase();
    const candidates = Array.from(
      new Set(
        (data ?? [])
          .map((row: { word?: string }) => row.word?.toLowerCase().trim())
          .filter((word): word is string => Boolean(word))
          .filter((word) => canUseLetters(word, normalizedLetters)),
      ),
    );

    candidateCache.set(cacheKey, candidates);
    return candidates;
  } catch (error) {
    console.error('Failed to load dictionary candidates:', error);
    candidateCache.set(cacheKey, []);
    return [];
  }
}

export async function getScrambleTargetWord(length: number, usedWords: string[] = []) {
  const excluded = new Set(usedWords.map((word) => word.toLowerCase()));

  try {
    const randomFloor = Math.floor(Math.random() * 900_000);
    const { data, error } = await supabase
      .from('dictionary')
      .select('word, letters, length, is_common, random_index')
      .eq('length', length)
      .eq('is_common', true)
      .gte('random_index', randomFloor)
      .order('random_index')
      .limit(60);

    if (error) throw error;

    const available = (data ?? [])
      .map((row: { word?: string }) => row.word?.trim().toLowerCase())
      .filter((word): word is string => Boolean(word))
      .filter((word) => !excluded.has(word));

    if (available.length > 0) {
      const chosen = available[Math.floor(Math.random() * available.length)];
      return chosen;
    }

    const fallbackQuery = await supabase
      .from('dictionary')
      .select('word')
      .eq('length', length)
      .limit(60);

    const fallbackAvailable = (fallbackQuery.data ?? [])
      .map((row: { word?: string }) => row.word?.trim().toLowerCase())
      .filter((word): word is string => Boolean(word))
      .filter((word) => !excluded.has(word));

    if (fallbackAvailable.length > 0) {
      return fallbackAvailable[Math.floor(Math.random() * fallbackAvailable.length)];
    }
  } catch (error) {
    console.error('Failed to fetch scramble target word:', error);
  }

  return null;
}

async function isValidViaMerriamWebster(word: string) {
  const cacheKey = word.toLowerCase();
  const cached = validationCache.get(cacheKey);
  if (typeof cached === 'boolean') return cached;

  if (!DICTIONARY_API_KEY) {
    validationCache.set(cacheKey, false);
    return false;
  }

  try {
    const response = await fetch(
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${cacheKey}?key=${DICTIONARY_API_KEY}`,
    );

    if (!response.ok) {
      validationCache.set(cacheKey, false);
      return false;
    }

    const data = await response.json();
    const valid = Array.isArray(data)
      && data.some((entry) => {
        if (typeof entry === 'string' || !entry) return false;
        return (
          entry.meta?.id?.split(':')[0]?.toLowerCase() === cacheKey
          || entry.hwi?.hw?.replace(/\*/g, '')?.toLowerCase() === cacheKey
          || Array.isArray(entry.meta?.stems) && entry.meta.stems.some((stem: string) => stem.toLowerCase() === cacheKey)
        );
      });

    validationCache.set(cacheKey, valid);
    return valid;
  } catch (error) {
    console.error('Dictionary validation failed:', error);
    validationCache.set(cacheKey, false);
    return false;
  }
}

export async function validateAnagramWord(word: string, letters: string) {
  const normalizedWord = normalizeWord(word);
  const normalizedLetters = letters.toLowerCase();

  if (!normalizedWord) {
    return { valid: false, reason: 'empty' as const };
  }

  if (!canUseLetters(normalizedWord, normalizedLetters)) {
    return { valid: false, reason: 'letters' as const };
  }

  const candidates = await loadDictionaryCandidates(normalizedLetters, Math.min(4, normalizedLetters.length));
  if (candidates.includes(normalizedWord)) {
    return { valid: true, source: 'dictionary-table' as const };
  }

  const apiValid = await isValidViaMerriamWebster(normalizedWord);
  if (apiValid) {
    return { valid: true, source: 'dictionary-api' as const };
  }

  return { valid: false, reason: 'dictionary' as const };
}
