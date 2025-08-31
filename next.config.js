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
      }
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year for immutable assets
  },

  // Enable compression
  compress: true,
  
  // Remove unnecessary headers
  poweredByHeader: false,
  
  // Performance optimizations
  generateEtags: false,
  swcMinify: true,

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
        source: '/_next/image/:path*',
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

  // Experimental features for performance
  experimental: {
    isrFlushToDisk: true,
    // REMOVED: optimizeCss: true - causing critters module error
  },
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Optimize client-side bundles
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk
          vendor: {
            name: 'vendor',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'all',
            priority: 20,
          },
          // Common chunks
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    
    return config;
  }
};

module.exports = nextConfig;