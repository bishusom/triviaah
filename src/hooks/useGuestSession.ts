// hooks/useGuestSession.ts
'use client';

import { useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';

export function useGuestSession() {
  const { user, login } = useUser();
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  const startNewGame = useCallback((): number => {
    let newStreak: number;
    setStreak(prev => {
      newStreak = prev + 1;
      return newStreak;
    });
    return newStreak!;
  }, []);

  const completeGame = useCallback((gameScore: number) => {
    setScore(prev => prev + gameScore);
  }, []);

  const getUserDisplayName = useCallback(() => {
    return user?.name || 'Guest';
  }, [user?.name]);

  const isGuest = useCallback(() => {
    return user?.isGuest !== false;
  }, [user?.isGuest]);

  const getWelcomeMessage = useCallback(() => {
    return user ? `Welcome back, ${user.name}!` : 'Welcome!';
  }, [user]);

  return {
    user: {
      ...user,
      score,
      streak
    },
    startNewGame,
    completeGame,
    getUserDisplayName,
    isGuest,
    login: (name: string) => login({ name, isGuest: name === 'Guest' }),
    getWelcomeMessage
  };
}