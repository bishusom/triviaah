/** @type {import('next').NextConfig} */
const nextConfig = {
  // Netlify compatibility
  trailingSlash: true,
  
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'pixabay.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/**',
      }
    ],
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
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=600, stale-while-revalidate=300',
          },
        ],
      },
    ];
  },

  experimental: {
    isrFlushToDisk: true,
  }
};

module.exports = nextConfig;