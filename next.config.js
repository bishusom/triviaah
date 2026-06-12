/** @type {import('next').NextConfig} */
const { HTML_LIMITED_BOT_UA_RE_STRING } = require('next/dist/shared/lib/router/utils/is-bot');

const nextConfig = {
  compress: true,
  htmlLimitedBots: new RegExp(`${HTML_LIMITED_BOT_UA_RE_STRING}|Screaming Frog SEO Spider|Screaming Frog`, 'i'),
  
  // Redirect configuration - UPDATED: Now redirecting triviaah.com to elitetrivias.com
  async redirects() {
    return [
      // Redirect triviaah.com to elitetrivias.com
      //{
      //  source: '/:path*',
      //  has: [{ type: 'host', value: 'triviaah.com' }],
      //  destination: 'https://elitetrivias.com/:path*',
      //  permanent: false, // Use temporary redirect for now
      //},
      // Redirect www.triviaah.com to elitetrivias.com
      //{
      //  source: '/:path*',
      //  has: [{ type: 'host', value: 'www.triviaah.com' }],
      //  destination: 'https://elitetrivias.com/:path*',
      //  permanent: false,
      //},
      // Remove or comment out the old redirects for elitetrivias.com to triviaah.com
      {
         source: '/:path*',
         has: [{ type: 'host', value: 'elitetrivias.com' }],
         destination: 'https://triviaah.com/:path*',
         permanent: false,
      },
      {
        source: '/:path*',
         has: [{ type: 'host', value: 'www.elitetrivias.com' }],
         destination: 'https://triviaah.com/:path*',
         permanent: false,
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
      {
        source: '/trivias/quick-fire',
        destination: '/daily-trivias/quick-fire',
        permanent: true,
      },
      {
        source: '/trivias/general-knowledge',
        destination: '/daily-trivias/general-knowledge',
        permanent: true,
      },
    ];
  },

  trailingSlash: false,
  
  // Environment variables - updated to reflect new primary domain
  env: {
    NEXT_PUBLIC_SITE_URL: 'https://triviaah.com', // Updated to new domain
  },

  // Image optimization (your existing config is fine)
  images: {
    unoptimized: true, 
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
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
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
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://googleads.g.doubleclick.net https://fundingchoicesmessages.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https: http://books.google.com; font-src 'self' data:; connect-src 'self' https://*.supabase.co wss://*.supabase.co https://cdn.contentful.com https://preview.contentful.com https://www.google-analytics.com https://analytics.google.com https://region1.google-analytics.com https://pagead2.googlesyndication.com; frame-src 'self' https://googleads.g.doubleclick.net https://tpc.googlesyndication.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'; upgrade-insecure-requests",
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
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
