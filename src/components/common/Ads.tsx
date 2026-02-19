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
  isInArticle?: boolean;
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

    const loadAd = () => {
      if (typeof window !== 'undefined' && window.adsbygoogle && insRef.current) {
        // Only initialize if this specific element hasn't been processed
        if (insRef.current.getAttribute('data-adsbygoogle-status') !== 'processed') {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            setIsLoaded(true);
          } catch (error) {
            console.error('AdSense error:', error);
          }
        }
      }
    };

    // Delay initialization to ensure DOM and width are ready (fixes availableWidth=0)
    const timer = setTimeout(loadAd, 300);
    return () => clearTimeout(timer);
  }, [isVisible, shouldShowAds]);

  if (!shouldShowAds || !isVisible) return null;

  // FIX: Explicitly set fixed bottom for mobile footer
  if (isMobileFooter) {
    return (
      <div 
        ref={adRef}
        className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-[9999] shadow-inner ${className}`}
        style={{
          height: '65px',
          display: 'block',
          ...style
        }}
      >
        <button
          onClick={() => setIsVisible(false)}
          className="absolute -top-3 right-2 z-[10000] w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center text-xs shadow-lg"
          aria-label="Close"
        >
          ×
        </button>

        <div className="flex justify-center items-center w-full h-full overflow-hidden">
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{
              display: 'inline-block',
              width: '320px',
              height: '50px'
            }}
            data-ad-client="ca-pub-4386714040098164"
            data-ad-slot={slot}
            data-ad-format="horizontal"
            data-full-width-responsive="false"
          />
        </div>
      </div>
    );
  }

  // Styles for In-Article and Standard Ads
  const containerStyle: React.CSSProperties = isInArticle ? {
    margin: '2.5rem 0',
    padding: '1.5rem',
    backgroundColor: '#f3f4f6',
    borderRadius: '12px',
    border: '1px solid #e5e7eb',
    flexDirection: 'column'
  } : {
    backgroundColor: '#f5f5f5',
  };

  return (
    <div 
      ref={adRef}
      className={`relative ad-container flex items-center justify-center w-full ${className}`}
      style={{
        minHeight: '100px',
        ...containerStyle,
        ...style
      }}
    >
      {isInArticle && (
        <span className="text-[10px] uppercase tracking-widest text-gray-400 mb-3 font-bold">
          Advertisement
        </span>
      )}

      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 z-50 w-6 h-6 bg-gray-500/50 hover:bg-gray-700 text-white rounded-full flex items-center justify-center text-sm transition-colors"
      >
        ×
      </button>

      <div className="w-full flex justify-center overflow-hidden">
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ 
            display: 'block', 
            width: '100%', 
            minWidth: '250px', 
            minHeight: '90px'
          }}
          data-ad-client="ca-pub-4386714040098164"
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive={fullWidthResponsive.toString()}
        />
      </div>

      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 text-gray-400 text-xs">
          Loading Ad...
        </div>
      )}
    </div>
  );
}