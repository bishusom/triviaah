'use client';

import React, { useEffect, useRef } from 'react';

// Shared initialization guard
let adInitialized = false;

const initializeAdSense = () => {
  if (adInitialized || typeof window === 'undefined') return;
  
  try {
    // Initialize ads only once globally
    (window.adsbygoogle = window.adsbygoogle || []).push({});
    adInitialized = true;
  } catch (e) {
    console.error("AdSense initialization error", e);
  }
};

export const AdBanner = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current || adRef.current.dataset.initialized) return;
    
    try {
      // Mark as initialized
      adRef.current.dataset.initialized = "true";
      
      // Initialize global AdSense if not done
      if (!adInitialized) {
        initializeAdSense();
      }
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <div ref={adRef} className="w-full py-4 bg-white">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4386714040098164"
        data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Similar updates for other ad components
export const AdSquare = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current || adRef.current.dataset.initialized) return;
    
    try {
      adRef.current.dataset.initialized = "true";
      if (!adInitialized) initializeAdSense();
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <div ref={adRef} className="my-6 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '300px', height: '250px' }}
        data-ad-client="ca-pub-4386714040098164"
        data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SQUARE}
      />
    </div>
  );
};

export const AdMultiplex = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adRef.current || adRef.current.dataset.initialized) return;
    
    try {
      adRef.current.dataset.initialized = "true";
      if (!adInitialized) initializeAdSense();
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <div ref={adRef} className="hidden md:block w-[300px]">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4386714040098164"
        data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MULTIPLEX}
        data-ad-format="autorelaxed"
      />
    </div>
  );
};