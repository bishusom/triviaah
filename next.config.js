/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration for Netlify compatibility
  trailingSlash: true,
  
  // Image optimization settings for static export
  images: {
    domains: ['cdn.pixabay.com', 'pixabay.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  trailingSlash: true,
}

module.exports = nextConfig