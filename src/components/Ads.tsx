'use client';

import Script from 'next/script';

export default function Ads() {
  return (
    <>
      {/* External AdSense script */}
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4386714040098164"
        crossOrigin="anonymous"
      />

      {/* Ad container */}
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

      {/* Inline script to trigger ad load — MUST have an `id` */}
      <Script id="adsbygoogle-init" strategy="afterInteractive">
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </>
  );
}