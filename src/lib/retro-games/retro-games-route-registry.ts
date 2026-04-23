export type RetroGamesSlug =
  | 'tic-tac-toe'
  | 'snake'
  | 'pong'
  | 'minesweeper'
  | 'tetris'
  | 'space-invaders'
  | 'pacman'
  | 'breakout';

export interface RetroGamesRouteDefinition {
  slug: RetroGamesSlug;
  routePath: `/retro-games/${RetroGamesSlug}`;
  title: string;
  ogImage: string;
  componentKey: string;
}

const RETRO_GAMES_ROUTE_REGISTRY: Record<RetroGamesSlug, RetroGamesRouteDefinition> = {
  'tic-tac-toe': {
    slug: 'tic-tac-toe',
    routePath: '/retro-games/tic-tac-toe',
    title: 'Tic Tac Toe',
    ogImage: '/imgs/retro-games/tictactoe.webp',
    componentKey: 'TicTacToeGame',
  },
  snake: {
    slug: 'snake',
    routePath: '/retro-games/snake',
    title: 'Snake',
    ogImage: '/imgs/retro-games/snake.webp',
    componentKey: 'SnakeGame',
  },
  pong: {
    slug: 'pong',
    routePath: '/retro-games/pong',
    title: 'Pong',
    ogImage: '/imgs/retro-games/pong.webp',
    componentKey: 'PongGame',
  },
  minesweeper: {
    slug: 'minesweeper',
    routePath: '/retro-games/minesweeper',
    title: 'Minesweeper',
    ogImage: '/imgs/retro-games/minesweeper.webp',
    componentKey: 'MinesweeperGame',
  },
  tetris: {
    slug: 'tetris',
    routePath: '/retro-games/tetris',
    title: 'Tetris',
    ogImage: '/imgs/retro-games/tetris.webp',
    componentKey: 'TetrisGame',
  },
  'space-invaders': {
    slug: 'space-invaders',
    routePath: '/retro-games/space-invaders',
    title: 'Space Invaders',
    ogImage: '/imgs/retro-games/space-invaders.webp',
    componentKey: 'SpaceInvadersGame',
  },
  pacman: {
    slug: 'pacman',
    routePath: '/retro-games/pacman',
    title: 'Pac-Man',
    ogImage: '/imgs/retro-games/pacman.webp',
    componentKey: 'PacManGame',
  },
  breakout: {
    slug: 'breakout',
    routePath: '/retro-games/breakout',
    title: 'Breakout',
    ogImage: '/imgs/retro-games/breakout.webp',
    componentKey: 'BreakoutGame',
  },
};

export function getRetroGamesRouteDefinition(slug: string): RetroGamesRouteDefinition | null {
  if (!slug || !(slug in RETRO_GAMES_ROUTE_REGISTRY)) return null;
  return RETRO_GAMES_ROUTE_REGISTRY[slug as RetroGamesSlug];
}

export function getRetroGamesRouteDefinitionByPath(routePath: string): RetroGamesRouteDefinition | null {
  const slug = routePath.replace('/retro-games/', '') as RetroGamesSlug;
  return getRetroGamesRouteDefinition(slug);
}

export function getRetroGamesRouteDefinitions(): RetroGamesRouteDefinition[] {
  return Object.values(RETRO_GAMES_ROUTE_REGISTRY);
}
