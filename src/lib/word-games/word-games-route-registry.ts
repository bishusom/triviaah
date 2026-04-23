export type WordGamesSlug =
  | 'cryptogram'
  | 'spelling-bee'
  | 'boggle'
  | 'word-search'
  | 'word-ladder'
  | 'crossgrid'
  | 'word-connect'
  | 'anagram-scramble';

export interface WordGamesRouteDefinition {
  slug: WordGamesSlug;
  routePath: `/word-games/${WordGamesSlug}`;
  title: string;
  ogImage: string;
  componentKey: string;
}

const WORD_GAMES_ROUTE_REGISTRY: Record<WordGamesSlug, WordGamesRouteDefinition> = {
  cryptogram: {
    slug: 'cryptogram',
    routePath: '/word-games/cryptogram',
    title: 'Cryptogram',
    ogImage: '/imgs/word-games/cryptogram.webp',
    componentKey: 'CryptogramGame',
  },
  'spelling-bee': {
    slug: 'spelling-bee',
    routePath: '/word-games/spelling-bee',
    title: 'Spelling Bee',
    ogImage: '/imgs/word-games/spelling-bee.webp',
    componentKey: 'SpellingBeeGame',
  },
  boggle: {
    slug: 'boggle',
    routePath: '/word-games/boggle',
    title: 'Boggle',
    ogImage: '/imgs/word-games/boggle.webp',
    componentKey: 'BoggleGame',
  },
  'word-search': {
    slug: 'word-search',
    routePath: '/word-games/word-search',
    title: 'Word Search',
    ogImage: '/imgs/word-games/word-search.webp',
    componentKey: 'WordSearchGame',
  },
  'word-ladder': {
    slug: 'word-ladder',
    routePath: '/word-games/word-ladder',
    title: 'Word Ladder',
    ogImage: '/imgs/word-games/word-ladder.webp',
    componentKey: 'WordLadderGame',
  },
  crossgrid: {
    slug: 'crossgrid',
    routePath: '/word-games/crossgrid',
    title: 'Crossgrid',
    ogImage: '/imgs/word-games/word-crossgrid.webp',
    componentKey: 'CrossgridGame',
  },
  'word-connect': {
    slug: 'word-connect',
    routePath: '/word-games/word-connect',
    title: 'Word Connect',
    ogImage: '/imgs/word-games/word-games.webp',
    componentKey: 'WordConnectGame',
  },
  'anagram-scramble': {
    slug: 'anagram-scramble',
    routePath: '/word-games/anagram-scramble',
    title: 'Anagram Scramble',
    ogImage: '/imgs/word-games/word-scramble.webp',
    componentKey: 'AnagramScrambleGame',
  },
};

export function getWordGamesRouteDefinition(slug: string): WordGamesRouteDefinition | null {
  if (!slug || !(slug in WORD_GAMES_ROUTE_REGISTRY)) return null;
  return WORD_GAMES_ROUTE_REGISTRY[slug as WordGamesSlug];
}

export function getWordGamesRouteDefinitionByPath(routePath: string): WordGamesRouteDefinition | null {
  const slug = routePath.replace('/word-games/', '') as WordGamesSlug;
  return getWordGamesRouteDefinition(slug);
}

export function getWordGamesRouteDefinitions(): WordGamesRouteDefinition[] {
  return Object.values(WORD_GAMES_ROUTE_REGISTRY);
}
