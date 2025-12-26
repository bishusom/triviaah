/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  
  // Redirect configuration - UPDATED: Now redirecting triviaah.com to elitetrivias.com
  async redirects() {
    return [
      // Redirect triviaah.com to elitetrivias.com
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'triviaah.com' }],
        destination: 'https://elitetrivias.com/:path*',
        permanent: false, // Use temporary redirect for now
      },
      // Redirect www.triviaah.com to elitetrivias.com
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.triviaah.com' }],
        destination: 'https://elitetrivias.com/:path*',
        permanent: false,
      },
      // Remove or comment out the old redirects for elitetrivias.com to triviaah.com
      // {
      //   source: '/:path*',
      //   has: [{ type: 'host', value: 'elitetrivias.com' }],
      //   destination: 'https://triviaah.com/:path*',
      //   permanent: false,
      // },
      // {
      //   source: '/:path*',
      //   has: [{ type: 'host', value: 'www.elitetrivias.com' }],
      //   destination: 'https://triviaah.com/:path*',
      //   permanent: false,
      // },
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
  
  // Environment variables - updated to reflect new primary domain
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://elitetrivias.com', // Updated to new domain
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