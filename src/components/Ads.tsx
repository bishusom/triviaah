'use client';

import { useState, useEffect, useRef } from 'react';

interface AdsProps {
  className?: string;
  slot?: string;
  format?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
}

export default function Ads({
  className = '',
  slot = '2207590813',
  format = 'auto',
  fullWidthResponsive = true,
  style = {}
}: AdsProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);

  useEffect(() => {
    if (!isVisible) return;

    // Wait for Google AdSense script to be available
    const loadAd = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle && insRef.current) {
        try {
          // Push the ad configuration
          (window.adsbygoogle as Record<string, unknown>[]).push({});
          setIsLoaded(true);
        } catch (error) {
          console.error('AdSense error:', error);
        }
      }
    };

    // Check if adsbygoogle is already available
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
        ...style
      }}
    >
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-1 right-1 z-10 w-6 h-6 bg-gray-600 hover:bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200"
        aria-label="Close advertisement"
        title="Close advertisement"
      >
        ×
      </button>

      {/* Ad container */}
      <div className="w-full">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            ...style
          }}
          data-ad-client="ca-pub-4386714040098164"
          data-ad-slot={slot}
          data-ad-format={format}
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

// Declare global types for TypeScript
declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}