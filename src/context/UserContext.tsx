// context/UserContext.tsx (fixed)
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { SessionProvider, useSession } from 'next-auth/react';

type User = {
  id: string;
  name: string;
  email?: string;
  isGuest: boolean;
  streak?: number;
  lastPlayed?: Date;
  previousStreak?: number;
};

const UserContext = createContext<{
  user: User | null;
  login: (u: Partial<User>) => void;
  logout: () => void;
  getWelcomeMessage?: () => string;
  authChecked: boolean; // Add this to track when auth state is determined
}>({ 
  user: null, 
  login: () => {}, 
  logout: () => {},
  authChecked: false 
});

interface ExtendedUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  streak?: number;
  lastPlayed?: string | Date;
  previousStreak?: number;
}

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const getWelcomeMessage = () => {
    if (!user) return '';
    
    const hour = new Date().getHours();
    let greeting = 'Hello';
    
    if (hour < 12) greeting = 'Good morning';
    else if (hour < 18) greeting = 'Good afternoon';
    else greeting = 'Good evening';
    
    return `${greeting}, ${user.name}! ${user.streak ? `🔥 ${user.streak} day streak!` : 'Welcome back!'}`;
  };

  useEffect(() => {
    if (status === 'loading') {
      // Still loading, don't update state yet
      return;
    }

    setAuthChecked(true);
    
    if (session?.user) {
      const sessionUser = session.user as ExtendedUser;
      setUser({
        id: sessionUser.id || sessionUser.email || 'unknown-id',
        name: sessionUser.name || 'User',
        email: sessionUser.email || undefined,
        isGuest: false,
        streak: sessionUser.streak || 0,
        lastPlayed: sessionUser.lastPlayed ? new Date(sessionUser.lastPlayed) : undefined,
        previousStreak: sessionUser.previousStreak || 0,
      });
    } else {
      setUser({
        id: 'guest-' + Math.random().toString(36).substr(2, 9),
        name: 'Guest',
        isGuest: true,
        streak: 0,
        lastPlayed: undefined,
        previousStreak: 0,
      });
    }
  }, [session, status]);

  const login = (u: Partial<User>) => {
    setUser(prev => ({ ...prev!, ...u }));
  };

  const logout = () => setUser(null);

  return (
    <SessionProvider>
      <UserContext.Provider value={{ 
        user, 
        login, 
        logout, 
        getWelcomeMessage,
        authChecked 
      }}>
        {children}
      </UserContext.Provider>
    </SessionProvider>
  );
}

export const useUser = () => useContext(UserContext);