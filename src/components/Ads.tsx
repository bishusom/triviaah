'use client';

import { useState, useEffect, useRef } from 'react';

interface AdsProps {
  className?: string;
  slot?: string;
  format?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  adType?: 'banner' | 'leaderboard' | 'rectangle' | 'auto';
  showCloseButton?: boolean;
}

// Predefined ad configurations
const AD_CONFIGS = {
  banner: {
    minHeight: '50px',
    maxHeight: '60px',
    format: 'auto',
    responsive: true
  },
  leaderboard: {
    minHeight: '90px',
    maxHeight: '90px', 
    format: 'leaderboard',
    responsive: false // Keep fixed size for leaderboard
  },
  rectangle: {
    minHeight: '250px',
    maxHeight: '300px',
    format: 'rectangle',
    responsive: true
  },
  auto: {
    minHeight: '90px',
    maxHeight: 'auto',
    format: 'auto',
    responsive: true
  }
};

export default function Ads({
  className = '',
  slot = '2944922915', // Your leaderboard slot
  format = 'leaderboard',
  fullWidthResponsive = false, // Turn off for leaderboard to prevent truncation
  style = {},
  adType = 'leaderboard',
  showCloseButton = true
}: AdsProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);

  const config = AD_CONFIGS[adType];

  useEffect(() => {
    if (!isVisible) return;

    const loadAd = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle && insRef.current) {
        try {
          // Clear any existing content
          insRef.current.innerHTML = '';
          
          // Push the ad configuration
          (window.adsbygoogle as Record<string, unknown>[]).push({});
          setIsLoaded(true);
          setError(false);
        } catch (error) {
          console.error('AdSense error:', error);
          setError(true);
        }
      }
    };

    // Delay ad loading slightly to prevent race conditions
    const loadTimer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        loadAd();
      } else {
        // Wait for the script to load
        const checkAdSense = setInterval(() => {
          if (typeof window !== 'undefined' && window.adsbygoogle) {
            clearInterval(checkAdSense);
            loadAd();
          }
        }, 100);

        // Cleanup interval after 10 seconds
        setTimeout(() => {
          clearInterval(checkAdSense);
          if (!isLoaded) setError(true);
        }, 10000);

        return () => clearInterval(checkAdSense);
      }
    }, 300);

    return () => clearTimeout(loadTimer);
  }, [isVisible, isLoaded]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      ref={adRef}
      className={`relative ad-container w-full ${className}`}
      style={{
        minHeight: config.minHeight,
        maxHeight: config.maxHeight,
        backgroundColor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        contain: 'layout style paint',
        overflow: 'hidden',
        ...style
      }}
    >
      {/* Close button - only show if enabled */}
      {showCloseButton && (
        <button
          onClick={handleClose}
          className="absolute top-1 right-1 z-10 w-5 h-5 bg-gray-500 hover:bg-gray-700 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200 opacity-70 hover:opacity-100"
          aria-label="Close advertisement"
          title="Close advertisement"
        >
          ×
        </button>
      )}

      {/* Ad container with proper sizing */}
      <div className="w-full h-full flex items-center justify-center">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            width: '100%',
            height: adType === 'leaderboard' ? '90px' : 'auto',
            maxWidth: adType === 'leaderboard' ? '728px' : '100%',
            minWidth: adType === 'leaderboard' ? '320px' : 'auto',
            margin: '0 auto',
            overflow: 'hidden',
            ...style
          }}
          data-ad-client="ca-pub-4386714040098164"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={fullWidthResponsive.toString()}
        />
      </div>

      {/* Loading placeholder */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-gray-400 text-xs">Advertisement Loading...</div>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
          <div className="text-gray-400 text-xs">Advertisement</div>
        </div>
      )}
    </div>
  );
}

// Export specific ad components for easy use
export const LeaderboardAd = (props: Omit<AdsProps, 'adType'>) => (
  <Ads {...props} adType="leaderboard" fullWidthResponsive={false} />
);

export const BannerAd = (props: Omit<AdsProps, 'adType'>) => (
  <Ads {...props} adType="banner" />
);

export const RectangleAd = (props: Omit<AdsProps, 'adType'>) => (
  <Ads {...props} adType="rectangle" />
);

// Declare global types for TypeScript
declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}