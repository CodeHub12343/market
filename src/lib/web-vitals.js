// ✅ Web Vitals Monitoring for Core Web Vitals metrics
// Track CLS, FID, FCP, LCP, TTFB
// Note: web-vitals package is optional, uses Performance API fallback

const VITALS_THRESHOLD = {
  CLS: 0.1, // Cumulative Layout Shift
  FID: 100, // First Input Delay
  FCP: 1.8, // First Contentful Paint
  LCP: 2.5, // Largest Contentful Paint
  TTFB: 0.6, // Time to First Byte
};

const vitals = {};

// ✅ Track Web Vitals using Performance API (no external dependency)
export function trackWebVitals() {
  if (typeof window === 'undefined') return;

  try {
    // Use Performance API directly - no web-vitals package needed
    trackWithPerformanceAPI();
  } catch (error) {
    console.warn('Web Vitals tracking error:', error);
  }
}

// ✅ Manual tracking fallback
function trackWithPerformanceAPI() {
  if (!window.PerformanceObserver) {
    console.warn('PerformanceObserver not supported');
    return;
  }

  try {
    // FCP
    try {
      const fcpObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            recordVital('FCP', entry.startTime);
          }
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
    } catch (e) {
      console.warn('FCP tracking failed:', e);
    }

    // LCP
    try {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        recordVital('LCP', lastEntry.renderTime || lastEntry.loadTime);
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.warn('LCP tracking failed:', e);
    }

    // CLS
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            recordVital('CLS', clsValue);
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS tracking failed:', e);
    }

    // FID (FirstInputDelay)
    try {
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          recordVital('FID', entry.processingDuration);
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID tracking failed:', e);
    }

    // TTFB via Navigation Timing
    try {
      window.addEventListener('load', () => {
        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation?.responseStart) {
          recordVital('TTFB', navigation.responseStart);
        }
      });
    } catch (e) {
      console.warn('TTFB tracking failed:', e);
    }
  } catch (e) {
    console.warn('Performance API tracking error:', e);
  }
}

// ✅ Record and send vitals
function recordVital(name, value) {
  try {
    if (!name || value === undefined) return;
    
    vitals[name] = value;

    // Send to analytics if threshold exceeded
    if (value > VITALS_THRESHOLD[name]) {
      sendAnalytics({
        metric: name,
        value: value,
        threshold: VITALS_THRESHOLD[name],
        status: 'warning',
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.pathname : 'unknown',
      });
    }

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      const status = value > VITALS_THRESHOLD[name] ? '⚠️' : '✅';
      console.log(
        `${status} ${name}: ${value.toFixed(2)}ms (threshold: ${VITALS_THRESHOLD[name]}ms)`
      );
    }
  } catch (e) {
    console.warn(`Error recording vital ${name}:`, e);
  }
}

// ✅ Send analytics to backend or external service
async function sendAnalytics(data) {
  try {
    if (process.env.NEXT_PUBLIC_ANALYTICS_URL) {
      await fetch(process.env.NEXT_PUBLIC_ANALYTICS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        keepalive: true, // Ensure it sends even on page unload
      });
    }
  } catch (error) {
    console.error('Analytics send failed:', error);
  }
}

// ✅ Get current vitals (for debugging/monitoring)
export function getVitals() {
  return { ...vitals };
}

// ✅ Reset vitals (useful for SPAs)
export function resetVitals() {
  Object.keys(vitals).forEach((key) => delete vitals[key]);
}

// ✅ Report vitals summary
export function reportVitalsSummary() {
  const summary = getVitals();
  const allGood = Object.entries(summary).every(
    ([key, value]) => value <= VITALS_THRESHOLD[key]
  );

  if (process.env.NODE_ENV === 'development') {
    console.group('📊 Web Vitals Summary');
    Object.entries(summary).forEach(([key, value]) => {
      const threshold = VITALS_THRESHOLD[key];
      const status = value <= threshold ? '✅' : '⚠️';
      console.log(`${status} ${key}: ${value.toFixed(2)}ms (target: ${threshold}ms)`);
    });
    console.log(allGood ? '✅ All vitals are good!' : '⚠️ Some vitals need attention');
    console.groupEnd();
  }

  return summary;
}

export default {
  trackWebVitals,
  getVitals,
  resetVitals,
  reportVitalsSummary,
};
