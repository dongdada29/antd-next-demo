'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  fill?: boolean;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 75,
  placeholder = 'blur',
  blurDataURL,
  sizes,
  fill = false,
  style,
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.1,
    freezeOnceVisible: true,
  });

  // 生成默认的模糊占位符
  const generateBlurDataURL = (w: number, h: number) => {
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, w, h);
    }
    return canvas.toDataURL();
  };

  const defaultBlurDataURL = blurDataURL || (width && height ? generateBlurDataURL(width, height) : undefined);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  // 如果不是优先级图片且不在视口中，不渲染
  if (!priority && !isVisible) {
    return (
      <div
        ref={ref}
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          ...style,
        }}
        className={className}
      >
        <span style={{ color: '#999', fontSize: '12px' }}>Loading...</span>
      </div>
    );
  }

  if (hasError) {
    return (
      <div
        style={{
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
          backgroundColor: '#f5f5f5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px dashed #d9d9d9',
          ...style,
        }}
        className={className}
      >
        <span style={{ color: '#999', fontSize: '12px' }}>Failed to load</span>
      </div>
    );
  }

  return (
    <div ref={ref} style={{ position: 'relative', ...style }} className={className}>
      <Image
        src={src}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={defaultBlurDataURL}
        sizes={sizes}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          opacity: isLoaded ? 1 : 0.8,
          transition: 'opacity 0.3s ease',
        }}
      />
    </div>
  );
};

// 响应式图片组件
interface ResponsiveImageProps extends Omit<OptimizedImageProps, 'width' | 'height' | 'sizes'> {
  breakpoints: {
    mobile: { width: number; height: number };
    tablet: { width: number; height: number };
    desktop: { width: number; height: number };
  };
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  breakpoints,
  ...props
}) => {
  const sizes = `
    (max-width: 768px) ${breakpoints.mobile.width}px,
    (max-width: 1024px) ${breakpoints.tablet.width}px,
    ${breakpoints.desktop.width}px
  `;

  return (
    <OptimizedImage
      {...props}
      width={breakpoints.desktop.width}
      height={breakpoints.desktop.height}
      sizes={sizes}
    />
  );
};

// 图片画廊组件（支持懒加载）
interface ImageGalleryProps {
  images: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
  columns?: number;
  gap?: number;
  className?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  columns = 3,
  gap = 16,
  className,
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: `${gap}px`,
      }}
    >
      {images.map((image, index) => (
        <OptimizedImage
          key={index}
          src={image.src}
          alt={image.alt}
          width={image.width || 300}
          height={image.height || 200}
          priority={index < 6} // 前6张图片优先加载
          style={{ width: '100%', height: 'auto' }}
        />
      ))}
    </div>
  );
};

// 图片预加载Hook
export function useImagePreloader(urls: string[]) {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  const preloadImages = async () => {
    setIsLoading(true);
    const promises = urls.map(url => {
      return new Promise<string>((resolve, reject) => {
        const img = new window.Image();
        img.onload = () => resolve(url);
        img.onerror = reject;
        img.src = url;
      });
    });

    try {
      const loaded = await Promise.allSettled(promises);
      const successful = loaded
        .filter(result => result.status === 'fulfilled')
        .map(result => (result as PromiseFulfilledResult<string>).value);
      
      setLoadedImages(new Set(successful));
    } catch (error) {
      console.error('Error preloading images:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (urls.length > 0) {
      preloadImages();
    }
  }, [urls]);

  return { loadedImages, isLoading, preloadImages };
}