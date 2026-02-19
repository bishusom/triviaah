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
  isInArticle?: boolean; // Prop for blog articles
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
  }, [isVisible, shouldShowAds]);

  if (!shouldShowAds || !isVisible) return null;

  // Layout for blog-specific ads
  const containerStyle: React.CSSProperties = isInArticle ? {
    margin: '3rem 0',
    padding: '1.5rem',
    backgroundColor: '#e5e7eb', // Grayish div
    borderRadius: '16px',
    border: '1px solid #d1d5db',
    flexDirection: 'column',
    ...style
  } : {
    backgroundColor: '#f5f5f5',
    ...style
  };

  if (isMobileFooter) {
    return (
      <div ref={adRef} className={`fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 ${className}`} style={{ height: '60px', ...style }}>
        <button onClick={() => setIsVisible(false)} className="absolute top-1 right-1 z-50 w-5 h-5 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs">×</button>
        <div className="flex justify-center items-center w-full h-full px-2">
          <ins ref={insRef} className="adsbygoogle" style={{ display: 'block', width: '100%', height: '50px' }} data-ad-client="ca-pub-4386714040098164" data-ad-slot={slot} data-ad-format="horizontal" data-full-width-responsive="false" />
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={adRef}
      className={`relative ad-container flex items-center justify-center ${className}`}
      style={{ minHeight: '90px', overflow: 'hidden', ...containerStyle }}
    >
      {isInArticle && <span className="text-[10px] uppercase tracking-widest text-gray-500 mb-4 font-bold">Advertisement</span>}
      
      <button onClick={() => setIsVisible(false)} className="absolute top-2 right-2 z-50 w-6 h-6 bg-gray-500 text-white rounded-full flex items-center justify-center text-sm font-bold">×</button>

      <div className="flex justify-center items-center w-full">
        <ins ref={insRef} className="adsbygoogle" style={{ display: 'block', textAlign: 'center', margin: '0 auto', maxWidth: '100%', ...style }} data-ad-client="ca-pub-4386714040098164" data-ad-slot={slot} data-ad-format={format} data-full-width-responsive={fullWidthResponsive.toString()} />
      </div>
      {!isLoaded && <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50 text-gray-400 text-xs">Loading Ad...</div>}
    </div>
  );
}