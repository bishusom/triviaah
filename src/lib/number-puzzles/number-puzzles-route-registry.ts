export type NumberPuzzlesSlug =
  | '2048'
  | 'prime-hunter'
  | 'number-sequence'
  | 'number-tower'
  | 'sudoku'
  | 'kakuro'
  | 'kenken'
  | 'number-pyramid';

export interface NumberPuzzlesRouteDefinition {
  slug: NumberPuzzlesSlug;
  routePath: `/number-puzzles/${NumberPuzzlesSlug}`;
  title: string;
  ogImage: string;
  componentKey: string;
}

const NUMBER_PUZZLES_ROUTE_REGISTRY: Record<NumberPuzzlesSlug, NumberPuzzlesRouteDefinition> = {
  '2048': {
    slug: '2048',
    routePath: '/number-puzzles/2048',
    title: '2048',
    ogImage: '/imgs/number-puzzles/2048.webp',
    componentKey: '2048Puzzle',
  },
  'prime-hunter': {
    slug: 'prime-hunter',
    routePath: '/number-puzzles/prime-hunter',
    title: 'Prime Hunter',
    ogImage: '/imgs/number-puzzles/prime-hunter.webp',
    componentKey: 'PrimeHunterPuzzle',
  },
  'number-sequence': {
    slug: 'number-sequence',
    routePath: '/number-puzzles/number-sequence',
    title: 'Number Sequence',
    ogImage: '/imgs/number-puzzles/number-sequence.webp',
    componentKey: 'NumberSequenceGame',
  },
  'number-tower': {
    slug: 'number-tower',
    routePath: '/number-puzzles/number-tower',
    title: 'Number Tower',
    ogImage: '/imgs/number-puzzles/number-tower.webp',
    componentKey: 'NumberTowerGame',
  },
  sudoku: {
    slug: 'sudoku',
    routePath: '/number-puzzles/sudoku',
    title: 'Sudoku',
    ogImage: '/imgs/number-puzzles/sudoku.webp',
    componentKey: 'SudokuPuzzle',
  },
  kakuro: {
    slug: 'kakuro',
    routePath: '/number-puzzles/kakuro',
    title: 'Kakuro',
    ogImage: '/imgs/number-puzzles/kakuro.webp',
    componentKey: 'KakuroPuzzle',
  },
  kenken: {
    slug: 'kenken',
    routePath: '/number-puzzles/kenken',
    title: 'KenKen',
    ogImage: '/imgs/number-puzzles/number-puzzles.webp',
    componentKey: 'KenKenPuzzle',
  },
  'number-pyramid': {
    slug: 'number-pyramid',
    routePath: '/number-puzzles/number-pyramid',
    title: 'Number Pyramid',
    ogImage: '/imgs/number-puzzles/number-puzzles.webp',
    componentKey: 'NumberPyramidPuzzle',
  },
};

export function getNumberPuzzlesRouteDefinition(slug: string): NumberPuzzlesRouteDefinition | null {
  if (!slug || !(slug in NUMBER_PUZZLES_ROUTE_REGISTRY)) return null;
  return NUMBER_PUZZLES_ROUTE_REGISTRY[slug as NumberPuzzlesSlug];
}

export function getNumberPuzzlesRouteDefinitionByPath(routePath: string): NumberPuzzlesRouteDefinition | null {
  const slug = routePath.replace('/number-puzzles/', '') as NumberPuzzlesSlug;
  return getNumberPuzzlesRouteDefinition(slug);
}

export function getNumberPuzzlesRouteDefinitions(): NumberPuzzlesRouteDefinition[] {
  return Object.values(NUMBER_PUZZLES_ROUTE_REGISTRY);
}
