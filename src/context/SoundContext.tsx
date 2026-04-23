// app/context/SoundContext.tsx
'use client';

import { createContext, useContext, useState, useEffect } from 'react';

type SoundContextType = {
  isMuted: boolean;
  toggleMute: () => void;
};

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('triviaahMuted') === 'true';
  });

  // Save mute state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('triviaahMuted', String(isMuted));
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
