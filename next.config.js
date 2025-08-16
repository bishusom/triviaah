/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  productionBrowserSourceMaps: false,

  async headers() {
    // ------------ LOCAL vs PROD CSP ------------
    const isDev = process.env.NODE_ENV === 'development';

    const devCsp =
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://pagead2.googlesyndication.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' fonts.gstatic.com; connect-src 'self' vitals.vercel-insights.com;";

    const prodCsp =
      "default-src 'self'; script-src 'self' 'unsafe-inline' https://pagead2.googlesyndication.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' fonts.gstatic.com; connect-src 'self' vitals.vercel-insights.com; frame-ancestors 'none'; upgrade-insecure-requests;";

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: isDev ? devCsp : prodCsp,
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        ],
      },
    ];
  },
};

module.exports = nextConfig;