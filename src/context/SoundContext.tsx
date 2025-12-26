// app/context/SoundContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type SoundContextType = {
  isMuted: boolean;
  toggleMute: () => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(false);

  // Load mute state from localStorage on mount
  useEffect(() => {
    const savedMute = localStorage.getItem('Elite TriviasMuted');
    setIsMuted(savedMute === 'true');
  }, []);

  // Save mute state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('Elite TriviasMuted', String(isMuted));
  }, [isMuted]);

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  return (
    <SoundContext.Provider value={{ isMuted, toggleMute }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}