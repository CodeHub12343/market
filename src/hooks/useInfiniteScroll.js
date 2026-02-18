import { useEffect, useRef, useCallback } from 'react';

/**
 * Hook for infinite scroll functionality
 * Triggers callback when user scrolls near bottom of page
 */
export const useInfiniteScroll = (callback, options = {}) => {
  const {
    threshold = 200, // pixels from bottom
    enabled = true,
    rootMargin = '200px',
  } = options;

  const observerTarget = useRef(null);

  const observerCallback = useCallback(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && enabled) {
          callback();
        }
      });
    },
    [callback, enabled]
  );

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(observerCallback, {
      rootMargin,
    });

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
      observer.disconnect();
    };
  }, [observerCallback, enabled, rootMargin]);

  return observerTarget;
};

/**
 * Hook for scroll position tracking and restoration
 */
export const useScrollRestoration = (key = 'scroll-position') => {
  const containerRef = useRef(null);

  // Save scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        sessionStorage.setItem(key, containerRef.current.scrollTop);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [key]);

  // Restore scroll position
  useEffect(() => {
    if (containerRef.current) {
      const savedPosition = sessionStorage.getItem(key);
      if (savedPosition) {
        containerRef.current.scrollTop = parseInt(savedPosition, 10);
      }
    }
  }, [key]);

  return containerRef;
};

/**
 * Hook for virtual scrolling (for very large lists)
 */
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useRef(0);

  const startIndex = Math.max(0, Math.floor(scrollTop.current / itemHeight) - 1);
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop.current + containerHeight) / itemHeight) + 1
  );

  const visibleItems = items.slice(startIndex, endIndex);
  const offsetY = startIndex * itemHeight;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setScrollTop.current(container.scrollTop);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return {
    containerRef,
    visibleItems,
    offsetY,
    totalHeight: items.length * itemHeight,
  };
};
