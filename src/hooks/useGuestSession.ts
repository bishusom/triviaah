// hooks/useGuestSession.ts
'use client';

import { useUser } from '@/context/UserContext';

export function useGuestSession() {
  const { user, updateScore, updateStreak, login, getWelcomeMessage } = useUser();

  const startNewGame = (): number => {
    return updateStreak(); // This now returns the streak count
  };

  const completeGame = (score: number) => {
    updateScore(score);
  };

  const getUserDisplayName = () => {
    return user?.name || 'Guest';
  };

  const isGuest = () => {
    return user?.isGuest !== false;
  };

  return {
    user,
    startNewGame,
    completeGame,
    getUserDisplayName,
    isGuest,
    login,
    getWelcomeMessage
  };
}