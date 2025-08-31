// components/optimized/Image.tsx
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import NextImage from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  loading?: 'lazy' | 'eager';
}

// Generate optimized blur data URL
const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#f8fafc" offset="20%" />
      <stop stop-color="#e2e8f0" offset="50%" />
      <stop stop-color="#f8fafc" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#f8fafc" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite" />
</svg>`;

const toBase64 = (str: string) =>
  typeof window === 'undefined'
    ? Buffer.from(str).toString('base64')
    : window.btoa(str);

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  placeholder = 'blur',
  blurDataURL,
  loading,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate optimized blur placeholder
  const defaultBlurDataURL = `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
  }, []);

  // Handle image error
  const handleError = useCallback(() => {
    setIsLoading(false);
    setHasError(true);
    console.error(`Failed to load image: ${src}`);
  }, [src]);

  // Intersection Observer for lazy loading optimization
  useEffect(() => {
    if (!priority && imgRef.current && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.loading === 'lazy') {
                img.loading = 'eager';
              }
            }
          });
        },
        { rootMargin: '50px' }
      );

      observer.observe(imgRef.current);
      return () => observer.disconnect();
    }
  }, [priority]);

  // Error fallback component
  if (hasError) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <svg 
          className="w-8 h-8" 
          fill="currentColor" 
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path 
            fillRule="evenodd" 
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden ${className}`} 
      style={{ width, height }}
    >
      {isLoading && (
        <div 
          className="absolute inset-0 img-skeleton z-10"
          style={{ width: '100%', height: '100%' }}
          aria-hidden="true"
        />
      )}
      <NextImage
        ref={imgRef}
        src={src}
        alt={alt}
        width={width}
        height={height}
        quality={quality}
        priority={priority}
        loading={loading || (priority ? 'eager' : 'lazy')}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        sizes={sizes}
        placeholder={placeholder}
        blurDataURL={blurDataURL || defaultBlurDataURL}
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
        }}
        // Performance optimizations
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
      />
    </div>
  );
}