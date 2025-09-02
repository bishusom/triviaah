// context/UserContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the user interface
export interface User {
  id: string;
  name: string;
  isGuest: boolean;
  score?: number;
  streak?: number;
  lastPlayed?: string;
  previousStreak?: number; // Add this for tracking milestones
}

// Define the context type
interface UserContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  updateScore: (points: number) => void;
  updateStreak: () => number;
  getWelcomeMessage: () => string | null;
  isLoaded: boolean;
}

// Create the context with a default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Helper function to check consecutive days
const isConsecutiveDay = (lastDateStr: string, todayDateStr: string) => {
  const lastDate = new Date(lastDateStr);
  const todayDate = new Date(todayDateStr);
  const diffTime = Math.abs(todayDate.getTime() - lastDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays === 1;
};

// Create the provider component
export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user from localStorage on component mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('triviaahUser');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } else {
          // Create a new guest user if none exists
          const guestUser: User = {
            id: `guest_${Math.random().toString(36).substr(2, 9)}`,
            name: `Explorer#${Math.floor(Math.random() * 10000)}`,
            isGuest: true,
            score: 0,
            streak: 0,
            lastPlayed: new Date().toISOString(),
            previousStreak: 0
          };
          setUser(guestUser);
          localStorage.setItem('triviaahUser', JSON.stringify(guestUser));
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Fallback to a basic guest user
        const fallbackUser: User = {
          id: `guest_${Date.now()}`,
          name: `Guest${Math.floor(Math.random() * 1000)}`,
          isGuest: true,
          score: 0,
          streak: 0,
          previousStreak: 0
        };
        setUser(fallbackUser);
      } finally {
        setIsLoaded(true);
      }
    };

    loadUser();
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('triviaahUser', JSON.stringify(user));
    }
  }, [user]);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('triviaahUser');
    setUser(null);
  };

  const updateScore = (points: number) => {
    if (user) {
      setUser(prev => prev ? { 
        ...prev, 
        score: (prev.score || 0) + points 
      } : null);
    }
  };

  const updateStreak = (): number => {
    if (user) {
      const today = new Date().toDateString();
      const lastPlayed = user.lastPlayed ? new Date(user.lastPlayed).toDateString() : null;
      
      let newStreak = user.streak || 0;
      let previousStreak = user.previousStreak || 0;
      
      if (lastPlayed === today) {
        // Already played today, no change
        return newStreak;
      } else if (lastPlayed && isConsecutiveDay(lastPlayed, today)) {
        // Played yesterday, continue streak
        newStreak += 1;
      } else {
        // Broken streak or first time, start at 1
        previousStreak = newStreak; // Save the previous streak for milestones
        newStreak = 1;
      }
      
      setUser(prev => prev ? { 
        ...prev, 
        streak: newStreak,
        previousStreak: previousStreak,
        lastPlayed: new Date().toISOString()
      } : null);
      
      return newStreak;
    }
    return 0;
  };

  const getWelcomeMessage = (): string | null => {
    if (!user) return null;
    
    const streak = user.streak || 0;
    
    if (streak === 0) {
      return "Welcome to Triviaah! 🎯";
    } else if (streak === 1) {
      return "Day 1 streak! Keep it going! 🔥";
    } else if (streak <= 3) {
      return `Welcome back! ${streak}-day streak! 🚀`;
    } else if (streak <= 7) {
      return `Amazing! ${streak}-day streak! 💪`;
    } else {
      return `Legendary ${streak}-day streak! 🏆`;
    }
  };

  const value: UserContextType = {
    user,
    login,
    logout,
    updateScore,
    updateStreak,
    getWelcomeMessage,
    isLoaded
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the user context
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}