/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration for Netlify compatibility
  trailingSlash: true,
  
  // Image optimization settings for static export
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
