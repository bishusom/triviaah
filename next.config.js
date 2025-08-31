/** @type {import('next').NextConfig} */
const nextConfig = {
  // Basic performance optimizations
  compress: true,
  poweredByHeader: false,
  
  // Configuration for static export
  //trailingSlash: true,
  //output: 'export',
  
  // Image optimization settings for static export
  images: {
    unoptimized: true, // Required for static export
  },

  // Experimental features (only valid ones for Next.js 15)
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },

  // Custom webpack config for performance
  webpack: (config, { dev, isServer }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Optimize chunk splitting for better caching
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }

    return config;
  },

  // Environment variables (if needed)
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

module.exports = nextConfig;  