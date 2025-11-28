// Updated Ads.tsx
'use client';

import { useState, useEffect, useRef } from 'react';

interface AdsProps {
  className?: string;
  slot?: string;
  format?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  closeButtonPosition?: 'top-left' | 'top-right';
  isMobileFooter?: boolean;
}

// Global flag to track if AdSense script is loaded
let adSenseLoaded = false;

export default function Ads({
  className = '',
  slot = '2207590813',
  format = 'auto',
  fullWidthResponsive = true,
  style = {},
  closeButtonPosition = 'top-right',
  isMobileFooter = false
}: AdsProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const hasPushedAd = useRef(false);

  // Move the conditional check after hooks
  const shouldShowAds = process.env.NEXT_PUBLIC_SHOW_ADS !== 'false';

  useEffect(() => {
    if (!isVisible || !shouldShowAds || hasPushedAd.current) return;

    const loadAd = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle && insRef.current && !hasPushedAd.current) {
        try {
          // Only push if we haven't already
          if (!hasPushedAd.current) {
            (window.adsbygoogle as Record<string, unknown>[]).push({});
            hasPushedAd.current = true;
            setIsLoaded(true);
          }
        } catch (error) {
          console.error('AdSense error:', error);
        }
      }
    };

    // If AdSense is already loaded, load ad immediately
    if (typeof window !== 'undefined' && window.adsbygoogle) {
      loadAd();
    } else if (!adSenseLoaded) {
      // Load AdSense script only if not already loaded
      adSenseLoaded = true;
      const script = document.createElement('script');
      script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4386714040098164';
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        // Initialize adsbygoogle array if it doesn't exist
        if (!window.adsbygoogle) {
          window.adsbygoogle = [];
        }
        loadAd();
      };
      document.head.appendChild(script);
    }

    // Cleanup function
    return () => {
      // Don't reset adSenseLoaded as the script is still needed for other components
    };
  }, [isVisible, shouldShowAds]);

  const handleClose = () => {
    setIsVisible(false);
  };

  // Return null early if ads should not be shown
  if (!shouldShowAds || !isVisible) {
    return null;
  }

  // Set appropriate dimensions based on format
  const getAdDimensions = () => {
    if (isMobileFooter) {
      return {
        width: '100%',
        height: '50px',
        maxWidth: '728px'
      };
    }

    switch (format) {
      case 'horizontal':
        return {
          width: '100%',
          height: '90px',
          minHeight: '90px'
        };
      case 'rectangle':
        return {
          width: '300px',
          height: '250px'
        };
      case 'vertical':
        return {
          width: '120px',
          height: '600px'
        };
      default: // auto
        return {
          width: '100%',
          minHeight: '90px'
        };
    }
  };

  const dimensions = getAdDimensions();

  // Compact mobile footer style - like Independent.co.uk
  if (isMobileFooter) {
    return (
      <div 
        ref={adRef}
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 ${className}`}
        style={{
          height: '60px',
          minHeight: '60px',
          maxHeight: '60px',
          overflow: 'hidden',
          ...style
        }}
      >
        {/* Minimal close button */}
        <button
          onClick={handleClose}
          className="absolute top-1 right-1 z-50 w-5 h-5 bg-gray-600 hover:bg-gray-800 text-white rounded-full flex items-center justify-center text-xs font-normal transition-colors duration-200"
          aria-label="Close advertisement"
          title="Close advertisement"
        >
          ×
        </button>

        {/* Compact ad container */}
        <div className="flex justify-center items-center w-full h-full px-2 overflow-hidden">
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{
              display: 'block',
              width: dimensions.width,
              height: dimensions.height,
              maxWidth: dimensions.maxWidth,
              margin: '0 auto',
              overflow: 'hidden'
            }}
            data-ad-client="ca-pub-4386714040098164"
            data-ad-slot={slot}
            data-ad-format="horizontal"
            data-full-width-responsive="false"
          />
        </div>

        {/* Minimal loading placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-gray-400 text-xs">Advertisement</div>
          </div>
        )}
      </div>
    );
  }

  // Original style for other ads
  const closeButtonClass = closeButtonPosition === 'top-left' 
    ? 'absolute top-1 left-1 z-50 w-6 h-6 bg-gray-600 hover:bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200'
    : 'absolute top-1 right-1 z-50 w-6 h-6 bg-gray-600 hover:bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200';

  return (
    <div 
      ref={adRef}
      className={`relative ad-container ${className}`}
      style={{
        minHeight: dimensions.minHeight || dimensions.height,
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        contain: 'layout style paint',
        maxWidth: '100%',
        overflow: 'hidden',
        ...style
      }}
    >
      <button
        onClick={handleClose}
        className={closeButtonClass}
        aria-label="Close advertisement"
        title="Close advertisement"
        style={{ zIndex: 50 }}
      >
        ×
      </button>

      <div className="flex justify-center items-center w-full" style={{ maxWidth: '100%', overflow: 'hidden' }}>
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            textAlign: 'center',
            margin: '0 auto',
            width: dimensions.width,
            height: dimensions.height,
            minHeight: dimensions.minHeight,
            maxWidth: '100%',
            overflow: 'hidden',
            ...style
          }}
          data-ad-client="ca-pub-4386714040098164"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={fullWidthResponsive.toString()}
        />
      </div>

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-gray-500 text-sm">Advertisement</div>
        </div>
      )}
    </div>
  );
}

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}