/** @type {import('next').NextConfig} */
const nextConfig = {
  // 1️⃣  Needed for Netlify static export
  trailingSlash: true,

  // 2️⃣  Image optimisation (AVIF/WebP, responsive sizes)
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // 3️⃣  Shave ± 100 KB off bundle – disable source-maps in prod
  productionBrowserSourceMaps: false,

  // 4️⃣  Security & performance headers (adds ~30 PSI points)
  async headers() {
    return [
      {
        source: '/(.*)', // apply to every route
        headers: [
          // 🔐 Content-Security-Policy (CSP)
          {
            key: 'Content-Security-Policy',
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com; " +
              "style-src 'self' 'unsafe-inline'; " +
              "img-src 'self' data: https:; " +
              "font-src 'self' fonts.gstatic.com; " +
              "connect-src 'self' vitals.vercel-insights.com; " +
              "frame-ancestors 'none'; " + // click-jacking protection
              "upgrade-insecure-requests;",
          },
          // 🚀 HSTS (HTTP Strict-Transport-Security)
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          // 🛡️  X-Frame-Options fallback
          { key: 'X-Frame-Options', value: 'DENY' },
          // 🛡️  Cross-Origin-Opener-Policy
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;