'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function TrordlePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/brainwave/cryptodle');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center">
      <p className="text-gray-300">Redirecting to Cryptodle...</p>
    </div>
  );
}
