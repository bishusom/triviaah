'use client';

import type { ReactNode } from 'react';
import TicTacToeComponent from './TicTacToeComponent';
import SnakeComponent from './SnakeComponent';
import PongComponent from './PongComponent';
import MinesweeperComponent from './MinesweeperComponent';
import TetrisComponent from './TetrisComponent';
import SpaceInvadersComponent from './SpaceInvadersComponent';
import PacManComponent from './PacManComponent';
import BreakoutComponent from './BreakoutComponent';

export type RetroGamesComponentKey =
  | 'TicTacToeGame'
  | 'SnakeGame'
  | 'PongGame'
  | 'MinesweeperGame'
  | 'TetrisGame'
  | 'SpaceInvadersGame'
  | 'PacManGame'
  | 'BreakoutGame';

const RETRO_GAMES_COMPONENT_REGISTRY: Record<RetroGamesComponentKey, () => ReactNode> = {
  TicTacToeGame: () => <TicTacToeComponent />,
  SnakeGame: () => <SnakeComponent />,
  PongGame: () => <PongComponent />,
  MinesweeperGame: () => <MinesweeperComponent />,
  TetrisGame: () => <TetrisComponent />,
  SpaceInvadersGame: () => <SpaceInvadersComponent />,
  PacManGame: () => <PacManComponent />,
  BreakoutGame: () => <BreakoutComponent />,
};

export function resolveRetroGamesComponent(componentKey: string): ReactNode | null {
  if (!(componentKey in RETRO_GAMES_COMPONENT_REGISTRY)) return null;
  const renderer = RETRO_GAMES_COMPONENT_REGISTRY[componentKey as RetroGamesComponentKey];
  return renderer();
}
