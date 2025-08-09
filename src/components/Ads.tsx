// src/components/Ads.tsx
import React from 'react';

const AdBanner = () => (
  <div className="w-full py-4 bg-white">
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
      data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
    <script dangerouslySetInnerHTML={{
      __html: `(adsbygoogle = window.adsbygoogle || []).push({})`
    }} />
  </div>
);

const AdSquare = () => (
  <div className="my-6 flex justify-center">
    <ins
      className="adsbygoogle"
      style={{ display: 'inline-block', width: '300px', height: '250px' }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
      data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SQUARE}
    />
    <script dangerouslySetInnerHTML={{
      __html: `(adsbygoogle = window.adsbygoogle || []).push({})`
    }} />
  </div>
);

const AdMultiplex = () => (
  <div className="hidden md:block w-[300px]">
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
      data-ad-slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_MULTIPLEX}
      data-ad-format="autorelaxed"
    />
    <script dangerouslySetInnerHTML={{
      __html: `(adsbygoogle = window.adsbygoogle || []).push({})`
    }} />
  </div>
);

export { AdBanner, AdSquare, AdMultiplex };