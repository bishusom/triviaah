'use client';

import { useState, useEffect, useRef } from 'react';

interface AdsProps {
  className?: string;
  slot?: string;
  format?: string;
  fullWidthResponsive?: boolean;
  style?: React.CSSProperties;
  closeButtonPosition?: 'top-left' | 'top-right';
  // New props for chroniclelive-style ads
  variant?: 'default' | 'chronicle-thin' | 'minimal';
}

export default function Ads({
  className = '',
  slot = '2207590813',
  format = 'auto',
  fullWidthResponsive = true,
  style = {},
  closeButtonPosition = 'top-right',
  variant = 'default' // New prop with default value
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
    ? 'absolute top-1 left-1 z-50 w-4 h-4 bg-gray-400 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200'
    : 'absolute top-1 right-1 z-50 w-4 h-4 bg-gray-400 hover:bg-gray-600 text-white rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-200';

  // Chronicle-style thin ad configuration
  const isChronicleStyle = variant === 'chronicle-thin';
  
  const containerStyle = isChronicleStyle 
    ? {
        minHeight: '32px', // Much thinner height
        maxHeight: '50px',
        backgroundColor: 'transparent', // No background color
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        contain: 'layout style paint',
        maxWidth: '100%',
        overflow: 'hidden',
        margin: '8px 0', // Small vertical spacing
        ...style
      }
    : {
        minHeight: '90px',
        backgroundColor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        contain: 'layout style paint',
        maxWidth: '100%',
        overflow: 'hidden',
        ...style
      };

  const adStyle = isChronicleStyle
    ? {
        display: 'block',
        textAlign: 'center',
        margin: '0 auto',
        maxWidth: '100%',
        overflow: 'hidden',
        minHeight: '32px',
        ...style
      }
    : {
        display: 'block',
        textAlign: 'center',
        margin: '0 auto',
        maxWidth: '100%',
        overflow: 'hidden',
        ...style
      };

  return (
    <div 
      ref={adRef}
      className={`relative ad-container ${className} ${isChronicleStyle ? 'chronicle-thin-ad' : ''}`}
      style={containerStyle}
    >
      {/* Smaller close button for thin ads */}
      <button
        onClick={handleClose}
        className={closeButtonClass}
        aria-label="Close advertisement"
        title="Close advertisement"
        style={{ zIndex: 50 }}
      >
        ×
      </button>

      {/* Ad container */}
      <div 
        className="flex justify-center items-center w-full" 
        style={{ 
          maxWidth: '100%', 
          overflow: 'hidden',
          ...(isChronicleStyle ? { minHeight: '32px' } : {})
        }}
      >
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={adStyle as React.CSSProperties}
          data-ad-client="ca-pub-4386714040098164"
          data-ad-slot={slot}
          data-ad-format={isChronicleStyle ? "horizontal" : format}
          data-ad-layout={isChronicleStyle ? "in-article" : undefined}
          data-full-width-responsive={fullWidthResponsive.toString()}
        />
      </div>

      {/* Loading placeholder - smaller for thin ads */}
      {!isLoaded && (
        <div 
          className="absolute inset-0 flex items-center justify-center"
          style={{
            backgroundColor: isChronicleStyle ? 'transparent' : '#f5f5f5',
            minHeight: isChronicleStyle ? '32px' : '90px'
          }}
        >
          <div className={`${isChronicleStyle ? 'text-gray-400 text-xs' : 'text-gray-500 text-sm'}`}>
            Advertisement
          </div>
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