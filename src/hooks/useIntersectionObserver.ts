'use client';

import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  freezeOnceVisible?: boolean;
}

export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    threshold = 0,
    root = null,
    rootMargin = '0%',
    freezeOnceVisible = false,
  } = options;

  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<Element>();

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([entry]: IntersectionObserverEntry[]): void => {
    setEntry(entry);
    setIsVisible(entry.isIntersecting);
  };

  useEffect(() => {
    const node = elementRef.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [threshold, root, rootMargin, frozen]);

  const setRef = (element: Element | null) => {
    if (element) {
      elementRef.current = element;
    }
  };

  return { ref: setRef, entry, isVisible };
}

// 懒加载Hook
export function useLazyLoad<T extends Element = HTMLDivElement>(
  callback: () => void,
  options: UseIntersectionObserverOptions = {}
) {
  const [hasLoaded, setHasLoaded] = useState(false);
  const { ref, isVisible } = useIntersectionObserver({
    ...options,
    freezeOnceVisible: true,
  });

  useEffect(() => {
    if (isVisible && !hasLoaded) {
      callback();
      setHasLoaded(true);
    }
  }, [isVisible, hasLoaded, callback]);

  return { ref, hasLoaded, isVisible };
}

// 无限滚动Hook
export function useInfiniteScroll(
  callback: () => void,
  hasMore: boolean = true,
  threshold: number = 0.1
) {
  const { ref, isVisible } = useIntersectionObserver({
    threshold,
    freezeOnceVisible: false,
  });

  useEffect(() => {
    if (isVisible && hasMore) {
      callback();
    }
  }, [isVisible, hasMore, callback]);

  return { ref };
}