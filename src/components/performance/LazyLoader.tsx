'use client';

import React, { Suspense, lazy, ComponentType } from 'react';
import { Spin } from 'antd';

// 懒加载组件包装器
interface LazyLoaderProps {
  fallback?: React.ReactNode;
  delay?: number;
}

// 创建懒加载组件的工厂函数
export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoaderProps = {}
) {
  const LazyComponent = lazy(importFunc);
  
  return function LazyWrapper(props: React.ComponentProps<T>) {
    const { fallback = <Spin size="large" />, delay = 200 } = options;
    
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}

// 页面级懒加载组件
export const LazyPageLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense 
      fallback={
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh' 
        }}>
          <Spin size="large" tip="加载页面中..." />
        </div>
      }
    >
      {children}
    </Suspense>
  );
};

// 组件级懒加载
export const LazyComponentLoader: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={<Spin />}>
      {children}
    </Suspense>
  );
};

// 图片懒加载组件
interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtc2l6ZT0iMTgiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjOTk5Ij5sb2FkaW5nLi4uPC90ZXh0Pjwvc3ZnPg==',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const image = entry.target as HTMLImageElement;
            image.src = src;
            observer.unobserve(image);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(img);

    return () => {
      if (img) observer.unobserve(img);
    };
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <img
      ref={imgRef}
      src={placeholder}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        opacity: isLoaded ? 1 : 0.5,
        transition: 'opacity 0.3s ease',
        filter: hasError ? 'grayscale(100%)' : 'none',
      }}
    />
  );
};

// 代码分割的路由懒加载
export const createLazyRoute = (importFunc: () => Promise<{ default: ComponentType<any> }>) => {
  return createLazyComponent(importFunc, {
    fallback: (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '60vh' 
      }}>
        <Spin size="large" tip="加载页面中..." />
      </div>
    ),
  });
};