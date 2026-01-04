// app/components/MuteButton.tsx (Alternative with larger size)
'use client';

import { useSound } from '@/context/SoundContext';
import { Volume2, VolumeX } from 'lucide-react';

export default function MuteButton() {
  const { isMuted, toggleMute } = useSound();

  return (
    <button
      onClick={toggleMute}
      className="p-2.5 bg-white hover:bg-gray-50 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl border border-gray-200"
      aria-label={isMuted ? "Unmute sounds" : "Mute sounds"}
    >
      {isMuted ? (
        <VolumeX size={22} className="text-gray-800" />
      ) : (
        <Volume2 size={22} className="text-gray-800" />
      )}
    </button>
  );
}