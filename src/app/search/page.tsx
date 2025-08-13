// app/search/page.tsx
'use client';
import { useEffect } from 'react';

export default function SearchPage() {
  useEffect(() => {
    // Load Google CSE script dynamically
    const script = document.createElement('script');
    script.src = 'https://cse.google.com/cse.js?cx=51497f278d4994ebf';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="gcse-search"></div>
      
      {/* Fallback UI */}
      <div id="search-fallback" className="mt-4 text-center text-gray-500">
        Loading search...
      </div>
    </div>
  );
}