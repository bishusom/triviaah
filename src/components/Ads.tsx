// src/components/Ads.tsx
'use client';

import Script from 'next/script';

export default function Ads({ idSuffix = '1' }: { idSuffix?: string }) {
  return (
    <>
      <ins
        className="adsbygoogle"
        style={{
          display: 'block',
          width: '100%',
          height: '50px',
          minHeight: '50px',
          maxHeight: '50px',
          overflow: 'hidden',
        }}
        data-ad-client="ca-pub-4386714040098164"
        data-ad-slot="2944922915"
        data-ad-format="horizontal"
        data-full-width-responsive="true"
      />
      <Script
        id={`adsbygoogle-init-${idSuffix}`}
        strategy="afterInteractive"
      >
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </>
  );
}