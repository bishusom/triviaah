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
  isMobileFooter?: boolean; // New prop for mobile footer style
}

export default function Ads({
  className = '',
  slot = '2207590813',
  format = 'auto',
  fullWidthResponsive = true,
  style = {},
  closeButtonPosition = 'top-right',
  isMobileFooter = false // Default to false
}: AdsProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    const loadAd = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle && insRef.current) {
        try {
          (window.adsbygoogle as Record<string, unknown>[]).push({});
          setIsLoaded(true);
        } catch (error) {
          console.error('AdSense error:', error);
        }
      }
    };

    if (typeof window !== 'undefined' && window.adsbygoogle) {
      loadAd();
    } else {
      const checkAdSense = setInterval(() => {
        if (typeof window !== 'undefined' && window.adsbygoogle) {
          clearInterval(checkAdSense);
          loadAd();
        }
      }, 100);

      setTimeout(() => clearInterval(checkAdSense), 10000);
      return () => clearInterval(checkAdSense);
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  // Mobile footer style - similar to Independent.co.uk
  if (isMobileFooter) {
    return (
      <div 
        ref={adRef}
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 ${className}`}
        style={{
          height: '100px', // Fixed height for footer ad
          ...style
        }}
      >
        {/* Close button - positioned like Independent */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 z-50 w-6 h-6 bg-gray-300 hover:bg-gray-400 text-gray-700 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200"
          aria-label="Close advertisement"
          title="Close advertisement"
        >
          ×
        </button>

        {/* Ad container */}
        <div className="flex justify-center items-center w-full h-full">
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{
              display: 'block',
              width: '100%',
              height: '100%',
              maxWidth: '728px', // Standard leaderboard width
              margin: '0 auto'
            }}
            data-ad-client="ca-pub-4386714040098164"
            data-ad-slot={slot}
            data-ad-format={format === 'horizontal' ? 'horizontal' : 'auto'}
            data-full-width-responsive={fullWidthResponsive.toString()}
          />
        </div>

        {/* Loading placeholder */}
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-gray-500 text-sm">Advertisement</div>
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
        minHeight: '90px',
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