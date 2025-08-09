// src/components/AdInit.tsx
'use client';

import { useEffect } from 'react';

const AdInit = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Initialize ads
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error('AdSense initialization error', e);
      }
    }
  }, []);

  return null;
};

export default AdInit;