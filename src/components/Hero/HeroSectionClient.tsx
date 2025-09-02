// components/HeroSectionClient.tsx
'use client';

import dynamic from 'next/dynamic';

const HeroSection = dynamic(() => import('./HeroSection'), {
  ssr: false,
  loading: () => (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="h-32 flex items-center justify-center">
          <div className="text-white">Loading interactive quiz...</div>
        </div>
      </div>
    </section>
  )
});

export default function HeroSectionClient() {
  return <HeroSection />;
}