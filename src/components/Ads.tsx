'use client';

import { useState, useEffect, useRef } from 'react';

interface AdsProps {
  className?: string;
  slot?: string;
  format?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  closeButtonPosition?: 'top-left' | 'top-right';
}

export default function Ads({
  className = '',
  slot = '2207590813',
  format = 'auto',
  fullWidthResponsive = true,
  style = {},
  closeButtonPosition = 'top-right' 
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

  const closeButtonClass = closeButtonPosition === 'top-left' 
    ? 'absolute top-1 left-1 z-10 w-6 h-6 bg-gray-600 hover:bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200'
    : 'absolute top-1 right-1 z-10 w-6 h-6 bg-gray-600 hover:bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200';

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
        className={closeButtonClass}
        aria-label="Close advertisement"
        title="Close advertisement"
      >
        ×
      </button>

      {/* Ad container - FIXED: Added centering wrapper */}
      <div className="flex justify-center items-center w-full">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{
            display: 'block',
            textAlign: 'center', // Added text alignment
            margin: '0 auto', // Added auto margins for centering
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

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}