/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  
  // Redirect configuration - FIXED
  async redirects() {
    return [
      // Redirect www to non-www
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.triviaah.com' }],
        destination: 'https://triviaah.com/:path*',
        permanent: true,
      },
      // Redirect from elitetrivias.com to triviaah.com
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'elitetrivias.com' }],
        destination: 'https://triviaah.com/:path*',
        permanent: false, // Use temporary redirect for now
      },
      // Redirect from www.elitetrivias.com to triviaah.com
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.elitetrivias.com' }],
        destination: 'https://triviaah.com/:path*',
        permanent: false,
      },
      // Remove this redundant rule - it redirects triviaah.com to itself
      // {
      //   source: '/:path*',
      //   has: [{ type: 'host', value: 'triviaah.com' }],
      //   destination: 'https://triviaah.com/:path*',
      //   permanent: true,
      // },
      // Keep your existing query parameter redirect
      {
        source: '/trivia-bank/:slug',
        has: [
          {
            type: 'query',
            key: 'show',
            value: 'true',
          }
        ],
        destination: '/trivia-bank/:slug',
        permanent: true,
      },
    ];
  },

  trailingSlash: false,
  
  // Environment variables - simplified
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://triviaah.com',
    // REMOVED duplicate: NEXT_PUBLIC_CANONICAL_URL
  },

  // Image optimization (your existing config is fine)
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
      },
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'books.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'books.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'commons.wikimedia.org',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'vemaps.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 3600,
  },

  experimental: {
    optimizeCss: true,
  },

  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: 20,
          },
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
  },

  async headers() {
    return [
      {
        source: '/:path*\\.(jpg|jpeg|png|webp|avif|ico|svg|css|js)',
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
        source: '/:path*\\.(woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });
  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}