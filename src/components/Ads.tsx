'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

// Track initialized ad slots
const initializedAds = new Set();

// Utility to generate unique ad ID
const generateAdId = (component: string, position?: string) => {
  return `${component}-${position || 'default'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Header Ad Banner
export const AdBanner = ({ position = 'header' }: { position?: 'header' | 'footer' }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [adId] = useState(() => generateAdId('banner', position));

  useEffect(() => {
    if (!isVisible || !adRef.current || typeof window === 'undefined') return;
    
    // Skip if inside a no-ads container or already initialized
    if (document.querySelector('.no-ads-page') || initializedAds.has(adId)) return;
    
    const timer = setTimeout(() => {
      try {
        if (adRef.current && !initializedAds.has(adId)) {
          // Mark as initialized before pushing
          initializedAds.add(adId);
          
          // Initialize AdSense array if needed
          window.adsbygoogle = window.adsbygoogle || [];
          
          // Push this specific ad
          window.adsbygoogle.push({});
        }
      } catch (e) {
        console.error(`AdSense error for ${adId}:`, e);
        // Remove from initialized set on error so it can retry
        initializedAds.delete(adId);
      }
    }, position === 'header' ? 100 : 300); // Different delays for header vs footer

    return () => {
      clearTimeout(timer);
      // Don't remove from set on cleanup to prevent re-initialization
    };
  }, [isVisible, adId, position]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      initializedAds.delete(adId);
    };
  }, [adId]);

  if (!isVisible) return null;

  // Different ad slots for header vs footer
  const adSlot = position === 'header' 
    ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER 
    : process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER;

  return (
    <div className="relative w-full bg-white">
      <div ref={adRef} className="py-2 px-4">
        <ins
          key={adId} // Unique key for React
          className="adsbygoogle"
          style={{ 
            display: 'block',
            height: '90px',
            width: '100%',
            maxWidth: '728px',
            margin: '0 auto'
          }}
          data-ad-client="ca-pub-4386714040098164"
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-1 right-1 md:top-2 md:right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition-colors z-10"
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
  const [adId] = useState(() => generateAdId('square'));

  useEffect(() => {
    if (!isVisible || !adRef.current || typeof window === 'undefined') return;
    
    // Skip if inside a no-ads container or already initialized
    if (document.querySelector('.no-ads-page') || initializedAds.has(adId)) return;
    
    const timer = setTimeout(() => {
      try {
        if (adRef.current && !initializedAds.has(adId)) {
          // Mark as initialized before pushing
          initializedAds.add(adId);
          
          // Initialize AdSense array if needed
          window.adsbygoogle = window.adsbygoogle || [];
          
          // Push this specific ad
          window.adsbygoogle.push({});
        }
      } catch (e) {
        console.error(`AdSense error for ${adId}:`, e);
        // Remove from initialized set on error so it can retry
        initializedAds.delete(adId);
      }
    }, 500); // Longer delay for square ads

    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, adId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      initializedAds.delete(adId);
    };
  }, [adId]);

  if (!isVisible) return null;

  return (
    <div className="relative my-4">
      <div ref={adRef} className="flex justify-center">
        <ins
          key={adId} // Unique key for React
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
        className="absolute top-0 right-0 md:right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition-colors z-10"
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
  const [adId] = useState(() => generateAdId('multiplex'));

  useEffect(() => {
    if (!isVisible || !adRef.current || typeof window === 'undefined') return;
    
    // Skip if inside a no-ads container or already initialized
    if (document.querySelector('.no-ads-page') || initializedAds.has(adId)) return;
    
    const timer = setTimeout(() => {
      try {
        if (adRef.current && !initializedAds.has(adId)) {
          // Mark as initialized before pushing
          initializedAds.add(adId);
          
          // Initialize AdSense array if needed
          window.adsbygoogle = window.adsbygoogle || [];
          
          // Push this specific ad
          window.adsbygoogle.push({});
        }
      } catch (e) {
        console.error(`AdSense error for ${adId}:`, e);
        // Remove from initialized set on error so it can retry
        initializedAds.delete(adId);
      }
    }, 800); // Longest delay for multiplex ads

    return () => {
      clearTimeout(timer);
    };
  }, [isVisible, adId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      initializedAds.delete(adId);
    };
  }, [adId]);

  if (!isVisible) return null;

  return (
    <div className="relative hidden md:block w-[300px]">
      <div ref={adRef}>
        <ins
          key={adId} // Unique key for React
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-4386714040098164"
          data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MULTIPLEX}
          data-ad-format="autorelaxed"
        />
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-0 right-0 bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition-colors z-10"
        aria-label="Close ad"
      >
        <FaTimes className="text-gray-600 text-sm" />
      </button>
    </div>
  );
};