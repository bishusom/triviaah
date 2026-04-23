const DICTIONARY_API_KEY = process.env.NEXT_PUBLIC_MW_DICTIONARY_KEY;

export type WordGameCopyContext = 'scramble' | 'connect';

export interface WordGameCopy {
  title: string;
  firstHint: string;
  secondHint: string;
  summary: string;
  partOfSpeech?: string;
  source: 'merriam-webster' | 'fallback';
}

type DictionaryEntry = {
  fl?: string;
  shortdef?: string[];
  meta?: {
    id?: string;
  };
  hwi?: {
    hw?: string;
  };
};

const copyCache = new Map<string, Promise<WordGameCopy>>();

function cleanText(value: string) {
  return value
    .replace(/\{.*?\}/g, '')
    .replace(/\s+/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}

function sentenceCase(value: string) {
  const trimmed = cleanText(value);
  if (!trimmed) return trimmed;
  return `${trimmed[0].toUpperCase()}${trimmed.slice(1)}`;
}

function fallbackCopy(word: string, context: WordGameCopyContext): WordGameCopy {
  const base = word.trim().toLowerCase();
  const label = base ? sentenceCase(base) : 'Word';
  const title = context === 'connect' ? `${label} build` : `${base.length || 0}-letter Word`;
  const firstHint = context === 'connect'
    ? 'Build smaller words from this letter bank.'
    : `Begins with ${base.slice(0, 2).toUpperCase() || '--'}.`;
  const secondHint = context === 'connect'
    ? 'Use the letters to make valid words.'
    : 'A word from the dictionary.';

  return {
    title,
    firstHint,
    secondHint,
    summary: secondHint,
    source: 'fallback',
  };
}

async function fetchWordEntry(word: string): Promise<DictionaryEntry | null> {
  if (!DICTIONARY_API_KEY) return null;

  try {
    const response = await fetch(
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${encodeURIComponent(word)}?key=${DICTIONARY_API_KEY}`,
    );

    if (!response.ok) return null;

    const data = (await response.json()) as Array<DictionaryEntry | string>;
    return (
      data.find((entry): entry is DictionaryEntry => !!entry && typeof entry === 'object' && !Array.isArray(entry)) ??
      null
    );
  } catch (error) {
    console.error(`Failed to fetch dictionary copy for "${word}":`, error);
    return null;
  }
}

function buildCopyFromEntry(word: string, entry: DictionaryEntry, context: WordGameCopyContext): WordGameCopy {
  const shortDefinition = cleanText(entry.shortdef?.[0] || '');
  const partOfSpeech = cleanText(entry.fl || '');
  const readablePartOfSpeech = partOfSpeech
    ? `${partOfSpeech[0].toUpperCase()}${partOfSpeech.slice(1)}`
    : 'Word';
  const title = context === 'connect'
    ? `${sentenceCase(word)} build`
    : `${word.length}-letter ${readablePartOfSpeech}`;
  const firstHint = `Begins with ${word.slice(0, 2).toUpperCase()}.`;
  const secondHint = shortDefinition
    ? `${shortDefinition[0].toUpperCase()}${shortDefinition.slice(1)}`
    : 'A word from the dictionary.';

  return {
    title,
    firstHint,
    secondHint,
    summary: shortDefinition || secondHint,
    partOfSpeech: partOfSpeech || undefined,
    source: 'merriam-webster',
  };
}

export async function getWordGameCopy(word: string, context: WordGameCopyContext): Promise<WordGameCopy> {
  const normalized = word.trim().toLowerCase();
  const cacheKey = `${context}:${normalized}`;
  const cached = copyCache.get(cacheKey);
  if (cached) return cached;

  const promise = (async () => {
    if (!normalized) {
      return fallbackCopy(word, context);
    }

    const entry = await fetchWordEntry(normalized);
    if (!entry) {
      return fallbackCopy(word, context);
    }

    return buildCopyFromEntry(normalized, entry, context);
  })();

  copyCache.set(cacheKey, promise);
  return promise;
}
