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
  isInArticle?: boolean; // New prop for blog context
}

export default function Ads({
  className = '',
  slot = '2207590813',
  format = 'auto',
  fullWidthResponsive = true,
  style = {},
  closeButtonPosition = 'top-right',
  isMobileFooter = false,
  isInArticle = false
}: AdsProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);

  const shouldShowAds = process.env.NEXT_PUBLIC_SHOW_ADS !== 'false';

  useEffect(() => {
    if (!isVisible || !shouldShowAds) return;

    // Small delay ensures the parent container has a width/height calculated
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined' && window.adsbygoogle && insRef.current) {
        // Only push if the element is actually in the DOM and has width
        if (insRef.current.offsetWidth > 0) {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setIsLoaded(true);
          } catch (error) {
            console.error('AdSense error:', error);
          }
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [isVisible, shouldShowAds]);

  if (!shouldShowAds || !isVisible) return null;

  // Grey container style for in-article ads
  const containerStyle: React.CSSProperties = isInArticle ? {
    margin: '2.5rem 0',
    padding: '1.5rem',
    backgroundColor: '#f3f4f6', // Greyish background
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ...style
  } : {
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...style
  };

  return (
    <div 
      ref={adRef}
      className={`relative ad-container w-full ${className}`}
      style={{
        minHeight: '100px',
        ...containerStyle
      }}
    >
      {isInArticle && (
        <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 font-semibold">
          Advertisement
        </span>
      )}

      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 z-50 w-6 h-6 bg-gray-400 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-sm"
      >
        ×
      </button>

      <div className="flex justify-center items-center w-full overflow-hidden">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ 
            display: 'block', 
            minWidth: '250px', 
            minHeight: '90px', 
            width: '100%',
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
          <div className="text-gray-400 text-xs italic">Loading Ad...</div>
        </div>
      )}
    </div>
  );
}