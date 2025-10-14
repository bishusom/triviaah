// app/ClientLayout.tsx
'use client';

import { useEffect } from 'react';
import { SoundProvider } from '../context/SoundContext';
import MuteButton from '../components/common/MuteButton';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Sound preloading
  useEffect(() => {
    const sounds = [
      new Audio('/sounds/correct.mp3'),
      new Audio('/sounds/incorrect.mp3')
    ];
    sounds.forEach(sound => {
      sound.volume = 0.5;
      sound.load();
    });

    return () => {
      sounds.forEach(sound => {
        sound.pause();
        sound.remove();
      });
    };
  }, []);

  return (
    <SoundProvider>
      {children}
      <MuteButton />
    </SoundProvider>
  );
}