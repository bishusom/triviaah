// src/components/Ads.tsx
'use client';

import React, { useEffect } from 'react';

export const AdBanner = () => {
  useEffect(() => {
    try {
      // Initialize ads
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <div className="w-full py-4 bg-white">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4386714040098164"
        data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export const AdSquare = () => {
  useEffect(() => {
    try {
      // Initialize ads
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <div className="my-6 flex justify-center">
      <ins
        className="adsbygoogle"
        style={{ display: 'inline-block', width: '300px', height: '250px' }}
        data-ad-client="ca-pub-4386714040098164"
        data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SQUARE}
      />
    </div>
  );
};

export const AdMultiplex = () => {
  useEffect(() => {
    try {
      // Initialize ads
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      console.error("AdSense error", e);
    }
  }, []);

  return (
    <div className="hidden md:block w-[300px]">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4386714040098164"
        data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MULTIPLEX}
        data-ad-format="autorelaxed"
      />
    </div>
  );
};