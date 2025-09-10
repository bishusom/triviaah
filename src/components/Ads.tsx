// components/Ads.tsx
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
      { rootMargin: position === 'header' ? '0px' : '200px' } // Load header ad immediately
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
            setTimeout(() => setIsLoaded(true), 50); // Reduced delay
          }
        }
      } catch (e) {
        console.error(`AdSense error for ${adId}:`, e);
        initializedAds.delete(adId);
      }
    }, position === 'header' ? 0 : 100); // No delay for header, 100ms for footer

    return () => clearTimeout(timer);
  }, [isIntersecting, adId, position, hasWidth]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      initializedAds.delete(adId);
    };
  }, [adId]);

  // Maintain space when ad is closed to prevent CLS
  if (!isVisible) {
    return (
      <div 
        className="w-full ad-container"
        style={{ 
          minHeight: '90px', 
          maxWidth: '728px', 
          margin: '0 auto',
          contain: 'layout style paint'
        }}
      />
    );
  }

  // Different ad slots for header vs footer
  const adSlot = position === 'header' 
    ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER 
    : process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER;

  return (
    <div className="relative w-full bg-white ad-container" ref={adRef}>
      <div ref={adContainerRef} className="py-2 px-4">
        {/* Loading placeholder to prevent layout shifts */}
        {!isLoaded && (
          <div 
            className="w-full bg-gray-100 flex items-center justify-center ad-container"
            style={{ 
              minHeight: '90px', 
              maxWidth: '728px', 
              margin: '0 auto',
              contain: 'layout style paint'
            }}
          >
            <div className="text-gray-400 text-sm">Loading ad...</div>
          </div>
        )}
        
        <ins
          className="adsbygoogle"
          style={{ 
            display: 'block',
            minHeight: '90px',
            width: '100%',
            maxWidth: '728px',
            margin: '0 auto',
            visibility: isLoaded ? 'visible' : 'hidden'
          }}
          data-ad-client="ca-pub-4386714040098164"
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
          data-adtest={process.env.NODE_ENV === 'development' ? 'on' : undefined} // Test ads in dev
        />
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition-colors z-10"
        style={{ position: 'absolute' }} // Ensure no layout impact
        aria-label="Close ad"
      >
        <FaTimes className="text-gray-600 text-sm" />
      </button>
    </div>
  );
};

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
      { rootMargin: '500px' } // Load further from viewport to reduce CLS
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
            
            setTimeout(() => setIsLoaded(true), 50); // Reduced delay
          }
        }
      } catch (e) {
        console.error(`AdSense error for ${adId}:`, e);
        initializedAds.delete(adId);
      }
    }, 100); // Reduced delay

    return () => clearTimeout(timer);
  }, [isIntersecting, adId, hasWidth]);

  useEffect(() => {
    return () => {
      initializedAds.delete(adId);
    };
  }, [adId]);

  // Maintain space when ad is closed to prevent CLS
  if (!isVisible) {
    return (
      <div 
        className="ad-square-container"
        style={{ 
          minWidth: '300px', 
          minHeight: '250px', 
          maxWidth: '100%',
          contain: 'layout style paint'
        }}
      />
    );
  }

  return (
    <div className="relative my-4 ad-square-container" ref={adRef}>
      <div ref={adContainerRef} className="flex justify-center">
        {/* Loading placeholder */}
        {!isLoaded && (
          <div 
            className="bg-gray-100 flex items-center justify-center ad-square-container"
            style={{ 
              minWidth: '300px', 
              minHeight: '250px', 
              maxWidth: '100%',
              contain: 'layout style paint'
            }}
          >
            <div className="text-gray-400 text-sm">Loading ad...</div>
          </div>
        )}
        
        <ins
          className="adsbygoogle"
          style={{ 
            display: 'inline-block', 
            minWidth: '300px', 
            minHeight: '250px',
            maxWidth: '100%',
            visibility: isLoaded ? 'visible' : 'hidden'
          }}
          data-ad-client="ca-pub-4386714040098164"
          data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SQUARE}
          data-adtest={process.env.NODE_ENV === 'development' ? 'on' : undefined} // Test ads in dev
        />
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition-colors z-10"
        style={{ position: 'absolute' }} // Ensure no layout impact
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
  const [adId] = useState(() => generateAdId('multiplex'));
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
      { rootMargin: '500px' } // Load further from viewport to reduce CLS
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
            
            setTimeout(() => setIsLoaded(true), 50); // Reduced delay
          }
        }
      } catch (e) {
        console.error(`AdSense error for ${adId}:`, e);
        initializedAds.delete(adId);
      }
    }, 100); // Reduced delay

    return () => clearTimeout(timer);
  }, [isIntersecting, adId, hasWidth]);

  useEffect(() => {
    return () => {
      initializedAds.delete(adId);
    };
  }, [adId]);

  // Maintain space when ad is closed to prevent CLS
  if (!isVisible) {
    return (
      <div 
        className="ad-square-container"
        style={{ 
          minWidth: '300px', 
          minHeight: '250px', 
          maxWidth: '100%',
          contain: 'layout style paint'
        }}
      />
    );
  }

  return (
    <div className="relative my-4 ad-square-container" ref={adRef}>
      <div ref={adContainerRef} className="flex justify-center">
        {/* Loading placeholder */}
        {!isLoaded && (
          <div 
            className="bg-gray-100 flex items-center justify-center ad-square-container"
            style={{ 
              minWidth: '300px', 
              minHeight: '250px', 
              maxWidth: '100%',
              contain: 'layout style paint'
            }}
          >
            <div className="text-gray-400 text-sm">Loading ad...</div>
          </div>
        )}
        
        <ins
          className="adsbygoogle"
          style={{ 
            display: 'inline-block', 
            minWidth: '300px', 
            minHeight: '250px',
            maxWidth: '100%',
            visibility: isLoaded ? 'visible' : 'hidden'
          }}
          data-ad-client="ca-pub-4386714040098164"
          data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MULTIPLEX}
          data-adtest={process.env.NODE_ENV === 'development' ? 'on' : undefined} // Test ads in dev
        />
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition-colors z-10"
        style={{ position: 'absolute' }} // Ensure no layout impact
        aria-label="Close ad"
      >
        <FaTimes className="text-gray-600 text-sm" />
      </button>
    </div>
  );
};