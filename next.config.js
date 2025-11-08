/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  
  // Redirect configuration - FIXED
  async redirects() {
    return [
      // Redirect ALL HTTP to HTTPS
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'elitetrivias.com' }],
        destination: 'https://elitetrivias.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.elitetrivias.com' }],
        destination: 'https://elitetrivias.com/:path*',
        permanent: true,
      },
      // Redirect old domain (all variations) to new domain
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'triviaah.com' }],
        destination: 'https://elitetrivias.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.triviaah.com' }],
        destination: 'https://elitetrivias.com/:path*',
        permanent: true,
      },
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

  // Add this for proper domain handling
  trailingSlash: false,
  
  // Add this to ensure proper canonical URLs
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://elitetrivias.com',
    NEXT_PUBLIC_CANONICAL_URL: 'https://elitetrivias.com',
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