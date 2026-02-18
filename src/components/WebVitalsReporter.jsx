'use client';

import { useEffect } from 'react';
import { trackWebVitals } from '@/lib/web-vitals';

/**
 * ✅ WebVitalsReporter Component
 * Initializes web vitals tracking on client-side
 * Tracks Core Web Vitals (CLS, FID, FCP, LCP, TTFB)
 * 
 * Uses requestIdleCallback to avoid blocking initial render
 */
export function WebVitalsReporter() {
  useEffect(() => {
    // ✅ Use requestIdleCallback to avoid blocking initial render
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => {
        trackWebVitals();
      });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(() => {
        trackWebVitals();
      }, 0);
    }
  }, []);

  // This component renders nothing, it only tracks metrics
  return null;
}

export default WebVitalsReporter;
