'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

// Shared initialization guard
let adInitialized = false;

const initializeAdSense = () => {
  if (adInitialized || typeof window === 'undefined') return;
  
  try {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
    adInitialized = true;
  } catch (e) {
    console.error("AdSense initialization error", e);
  }
};

export const AdBanner = () => {
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible || !adRef.current || adRef.current.dataset.initialized) return;
    
    try {
      adRef.current.dataset.initialized = "true";
      if (!adInitialized) {
        initializeAdSense();
      }
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="relative w-full bg-white">
      <div ref={adRef} className="py-2 px-4">
        <ins
          className="adsbygoogle"
          style={{ 
            display: 'block',
            height: '90px',
            width: '100%',
            maxWidth: '728px',
            margin: '0 auto'
          }}
          data-ad-client="ca-pub-4386714040098164"
          data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-1 right-1 md:top-2 md:right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition-colors"
        aria-label="Close ad"
      >
        <FaTimes className="text-gray-600 text-sm" />
      </button>
    </div>
  );
};

export const AdSquare = () => {
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible || !adRef.current || adRef.current.dataset.initialized) return;
    
    try {
      adRef.current.dataset.initialized = "true";
      if (!adInitialized) initializeAdSense();
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="relative my-4">
      <div ref={adRef} className="flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ 
            display: 'inline-block', 
            width: '300px', 
            height: '250px',
            maxWidth: '100%'
          }}
          data-ad-client="ca-pub-4386714040098164"
          data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SQUARE}
        />
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-0 right-0 md:right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition-colors"
        aria-label="Close ad"
      >
        <FaTimes className="text-gray-600 text-sm" />
      </button>
    </div>
  );
};

export const AdMultiplex = () => {
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible || !adRef.current || adRef.current.dataset.initialized) return;
    
    try {
      adRef.current.dataset.initialized = "true";
      if (!adInitialized) initializeAdSense();
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="relative hidden md:block w-[300px]">
      <div ref={adRef}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-4386714040098164"
          data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MULTIPLEX}
          data-ad-format="autorelaxed"
        />
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-0 right-0 bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition-colors"
        aria-label="Close ad"
      >
        <FaTimes className="text-gray-600 text-sm" />
      </button>
    </div>
  );
};