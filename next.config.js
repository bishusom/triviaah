/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify compatibility
  trailingSlash: true,
  
  // Image optimization
  images: {
    domains: ['cdn.pixabay.com', 'pixabay.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    minimumCacheTTL: 3600, // Cache optimized images for 1 hour
  },

  // Cache-Control headers for static assets
  async headers() {
    return [
      {
        source: '/:path*.(jpg|jpeg|png|webp|avif|ico|svg|css|js)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year for static assets
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable', // 1 year for Next.js static files
          },
        ],
      },
      {
        source: '/:path*', // Fallback for HTML pages
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=600, stale-while-revalidate=300', // 10min cache, 5min SWR
          },
        ],
      },
    ];
  },

  // Netlify-specific ISR (via On-Demand Revalidation)
  experimental: {
    // Next.js 15+ uses built-in ISR handling
    isrFlushToDisk: true, // Persist cache to disk for Netlify
  }
};

module.exports = nextConfig;