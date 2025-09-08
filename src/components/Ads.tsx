'use client';

import React, { useEffect, useRef, useState } from 'react';
import { FaTimes } from 'react-icons/fa';

// Track initialized ad slots
const initializedAds = new Set();

// Utility to generate unique ad ID
const generateAdId = (component: string, position?: string) => {
  return `${component}-${position || 'default'}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const AdBanner = ({ position = 'header' }: { position?: 'header' | 'footer' }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [adId] = useState(() => generateAdId('banner', position));
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasWidth, setHasWidth] = useState(false);

  // Check if container has width
  useEffect(() => {
    if (!adContainerRef.current) return;
    
    const checkWidth = () => {
      if (adContainerRef.current && adContainerRef.current.offsetWidth > 0) {
        setHasWidth(true);
        return true;
      }
      return false;
    };
    
    // Initial check
    if (checkWidth()) return;
    
    // Set up resize observer to detect when container gets width
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setHasWidth(true);
          resizeObserver.disconnect();
          break;
        }
      }
    });
    
    if (adContainerRef.current) {
      resizeObserver.observe(adContainerRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Intersection Observer to load ads when they're about to enter viewport
  useEffect(() => {
    if (!isVisible || !adRef.current || typeof window === 'undefined' || !hasWidth) return;
    
    // Skip if inside a no-ads container or already initialized
    if (document.querySelector('.no-ads-page') || initializedAds.has(adId)) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(adRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, adId, position, hasWidth]);

  // Initialize ad when it's intersecting AND has width
  useEffect(() => {
    if (!isIntersecting || !hasWidth) return;

    const timer = setTimeout(() => {
      try {
        if (adRef.current && !initializedAds.has(adId) && hasWidth) {
          initializedAds.add(adId);
          
          // Make sure the ad container is visible and has width
          if (adContainerRef.current && adContainerRef.current.offsetWidth > 0) {
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
            
            // Mark as loaded after a short delay
            setTimeout(() => setIsLoaded(true), 100);
          }
        }
      } catch (e) {
        console.error(`AdSense error for ${adId}:`, e);
        initializedAds.delete(adId);
      }
    }, position === 'header' ? 100 : 300);

    return () => clearTimeout(timer);
  }, [isIntersecting, adId, position, hasWidth]);

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
    <div className="relative w-full bg-white" ref={adRef}>
      <div ref={adContainerRef} className="py-2 px-4">
        {/* Loading placeholder to prevent layout shifts */}
        {!isLoaded && (
          <div 
            className="w-full bg-gray-100 flex items-center justify-center"
            style={{ height: '90px', maxWidth: '728px', margin: '0 auto' }}
          >
            <div className="text-gray-400 text-sm">Loading ad...</div>
          </div>
        )}
        
        <ins
          className="adsbygoogle"
          style={{ 
            display: 'block',
            height: '90px',
            width: '100%',
            maxWidth: '728px',
            margin: '0 auto',
            visibility: isLoaded ? 'visible' : 'hidden'
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

// Similar fixes for other ad components...

export const AdSquare = () => {
  const adRef = useRef<HTMLDivElement>(null);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [adId] = useState(() => generateAdId('square'));
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasWidth, setHasWidth] = useState(false);

  // Check if container has width
  useEffect(() => {
    if (!adContainerRef.current) return;
    
    const checkWidth = () => {
      if (adContainerRef.current && adContainerRef.current.offsetWidth > 0) {
        setHasWidth(true);
        return true;
      }
      return false;
    };
    
    // Initial check
    if (checkWidth()) return;
    
    // Set up resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setHasWidth(true);
          resizeObserver.disconnect();
          break;
        }
      }
    });
    
    if (adContainerRef.current) {
      resizeObserver.observe(adContainerRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !adRef.current || typeof window === 'undefined' || !hasWidth) return;
    
    if (document.querySelector('.no-ads-page') || initializedAds.has(adId)) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(adRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, adId, hasWidth]);

  useEffect(() => {
    if (!isIntersecting || !hasWidth) return;

    const timer = setTimeout(() => {
      try {
        if (adRef.current && !initializedAds.has(adId) && hasWidth) {
          initializedAds.add(adId);
          
          if (adContainerRef.current && adContainerRef.current.offsetWidth > 0) {
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
            
            setTimeout(() => setIsLoaded(true), 100);
          }
        }
      } catch (e) {
        console.error(`AdSense error for ${adId}:`, e);
        initializedAds.delete(adId);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isIntersecting, adId, hasWidth]);

  useEffect(() => {
    return () => {
      initializedAds.delete(adId);
    };
  }, [adId]);

  if (!isVisible) return null;

  return (
    <div className="relative my-4" ref={adRef}>
      <div ref={adContainerRef} className="flex justify-center">
        {/* Loading placeholder */}
        {!isLoaded && (
          <div 
            className="bg-gray-100 flex items-center justify-center"
            style={{ width: '300px', height: '250px' }}
          >
            <div className="text-gray-400 text-sm">Loading ad...</div>
          </div>
        )}
        
        <ins
          className="adsbygoogle"
          style={{ 
            display: 'inline-block', 
            width: '300px', 
            height: '250px',
            maxWidth: '100%',
            visibility: isLoaded ? 'visible' : 'hidden'
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
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [adId] = useState(() => generateAdId('square'));
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasWidth, setHasWidth] = useState(false);

  // Check if container has width
  useEffect(() => {
    if (!adContainerRef.current) return;
    
    const checkWidth = () => {
      if (adContainerRef.current && adContainerRef.current.offsetWidth > 0) {
        setHasWidth(true);
        return true;
      }
      return false;
    };
    
    // Initial check
    if (checkWidth()) return;
    
    // Set up resize observer
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setHasWidth(true);
          resizeObserver.disconnect();
          break;
        }
      }
    });
    
    if (adContainerRef.current) {
      resizeObserver.observe(adContainerRef.current);
    }
    
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isVisible || !adRef.current || typeof window === 'undefined' || !hasWidth) return;
    
    if (document.querySelector('.no-ads-page') || initializedAds.has(adId)) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(adRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, adId, hasWidth]);

  useEffect(() => {
    if (!isIntersecting || !hasWidth) return;

    const timer = setTimeout(() => {
      try {
        if (adRef.current && !initializedAds.has(adId) && hasWidth) {
          initializedAds.add(adId);
          
          if (adContainerRef.current && adContainerRef.current.offsetWidth > 0) {
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
            
            setTimeout(() => setIsLoaded(true), 100);
          }
        }
      } catch (e) {
        console.error(`AdSense error for ${adId}:`, e);
        initializedAds.delete(adId);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [isIntersecting, adId, hasWidth]);

  useEffect(() => {
    return () => {
      initializedAds.delete(adId);
    };
  }, [adId]);

  if (!isVisible) return null;

  return (
    <div className="relative my-4" ref={adRef}>
      <div ref={adContainerRef} className="flex justify-center">
        {/* Loading placeholder */}
        {!isLoaded && (
          <div 
            className="bg-gray-100 flex items-center justify-center"
            style={{ width: '300px', height: '250px' }}
          >
            <div className="text-gray-400 text-sm">Loading ad...</div>
          </div>
        )}
        
        <ins
          className="adsbygoogle"
          style={{ 
            display: 'inline-block', 
            width: '300px', 
            height: '250px',
            maxWidth: '100%',
            visibility: isLoaded ? 'visible' : 'hidden'
          }}
          data-ad-client="ca-pub-4386714040098164"
          data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MULTIPLEX}
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