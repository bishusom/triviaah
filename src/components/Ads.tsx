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
  const [isVisible, setIsVisible] = useState(true);
  const [adId] = useState(() => generateAdId('banner', position));
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInViewport, setIsInViewport] = useState(false);

  // Use IntersectionObserver to detect when ad is in viewport AND has width
  useEffect(() => {
    if (!isVisible || !adRef.current || typeof window === 'undefined') return;
    
    if (document.querySelector('.no-ads-page') || initializedAds.has(adId)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Check if element has valid width when it becomes visible
          const rect = entry.target.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0) {
            setIsInViewport(true);
          }
          observer.disconnect();
        }
      },
      { 
        rootMargin: '50px', // Load slightly before entering viewport
        threshold: 0.1 // 10% of element visible
      }
    );

    observer.observe(adRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isVisible, adId]);

  // Initialize ad only when in viewport and visible
  useEffect(() => {
    if (!isInViewport || !isVisible || typeof window === 'undefined') return;
    
    if (initializedAds.has(adId)) return;

    // Use Google's recommended approach with requestIdleCallback
    const initializeAd = () => {
      try {
        if (adRef.current && !initializedAds.has(adId)) {
          // Final check to ensure element is still visible and has width
          const rect = adRef.current.getBoundingClientRect();
          if (rect.width > 0 && rect.height > 0 && isElementInViewport(adRef.current)) {
            initializedAds.add(adId);
            
            window.adsbygoogle = window.adsbygoogle || [];
            window.adsbygoogle.push({});
            
            // Set loaded state after a delay to allow ad rendering
            setTimeout(() => {
              if (adRef.current && adRef.current.offsetWidth > 0) {
                setIsLoaded(true);
              }
            }, 200);
          }
        }
      } catch (e) {
        console.error(`AdSense error for ${adId}:`, e);
        initializedAds.delete(adId);
      }
    };

    // Use requestIdleCallback as recommended by Google for better performance
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(initializeAd, { timeout: 1000 });
    } else {
      setTimeout(initializeAd, 300);
    }
  }, [isInViewport, isVisible, adId]);

  // Helper function to check if element is in viewport
  const isElementInViewport = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      initializedAds.delete(adId);
    };
  }, [adId]);

  // Different ad slots for header vs footer
  const adSlot = position === 'header' 
    ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER 
    : process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER;

  return (
    <div className="relative w-full bg-white" ref={adRef}>
      <div className="py-2 px-4">
        {/* Loading placeholder - ensure it has proper dimensions */}
        {!isLoaded && (
          <div 
            className="w-full bg-gray-100 flex items-center justify-center"
            style={{ 
              minHeight: '90px',
              minWidth: '300px', // Minimum width for ads
              contain: 'layout style paint'
            }}
          >
            <div className="text-gray-400 text-sm">
              {isInViewport ? 'Loading ad...' : 'Ad will load soon...'}
            </div>
          </div>
        )}
        
        <ins
          className="adsbygoogle"
          style={{ 
            display: isLoaded ? 'block' : 'none',
            minHeight: '90px',
            width: '100%',
          }}
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
      <button 
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 bg-gray-200 rounded-full p-1 hover:bg-gray-300 transition-colors z-10"
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
          data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
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

export const ThinAdBanner = ({ position = 'header' }: { position?: 'header' | 'footer' }) => {
  const adRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (adRef.current && typeof window !== 'undefined') {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        setIsLoaded(true);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const adSlot = position === 'header' 
    ? process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER 
    : process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER;

  return (
    <div className="w-full bg-transparent ad-container-thin" ref={adRef}>
      {/* Show loading placeholder until ad loads */}
      {!isLoaded && (
        <div 
          className="w-full bg-gray-100 flex items-center justify-center"
          style={{ 
            height: '50px',
            width: '100%',
          }}
        >
          <div className="text-gray-400 text-xs">Loading ad...</div>
        </div>
      )}
      
      <ins
        className="adsbygoogle"
        style={{
          display: isLoaded ? 'block' : 'none',
          height: '50px',
          width: '100%',
        }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={adSlot}
        data-ad-format="autorelaxed"
        data-full-width-responsive="true"
        data-ad-layout-key="-fg+5n+6t-7i"
      />
    </div>
  );
};