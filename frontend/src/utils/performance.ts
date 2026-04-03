/**
 * Performance Optimization Utilities for IslandFruitGuide
 * Handles code splitting, lazy loading, caching, and bundle optimization
 */

/**
 * Debounce function for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle function for scroll events
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function(this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Check if element is in viewport
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Lazy load component helper
 */
export function lazyLoadComponent(importFunc: () => Promise<any>) {
  // Dynamic import of React to avoid UMD global reference
  return import('react').then(({ lazy }) => lazy(() =>
    Promise.all([
      importFunc(),
      new Promise(resolve => setTimeout(resolve, 300)) // Minimum delay to show loading state
    ]).then(([moduleExports]) => moduleExports)
  ));
}

/**
 * Cache utility for API responses
 */
class Cache {
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private maxAge: number = 5 * 60 * 1000; // 5 minutes default
  
  set(key: string, data: any, _maxAge?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // Optional: limit cache size
    if (this.cache.size > 100) {
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey!);
    }
  }
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    const age = Date.now() - item.timestamp;
    if (age > this.maxAge) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
  
  has(key: string): boolean {
    return this.cache.has(key) && this.get(key) !== null;
  }
}

export const cache = new Cache();

/**
 * Memoize expensive computations
 */
export function memoize<T extends (...args: any[]) => any>(fn: T): T {
  const cache = new Map();
  
  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Optimize images with srcset
 */
export function generateSrcSet(baseUrl: string, sizes: number[]): string {
  return sizes
    .map(size => `${baseUrl}?w=${size} ${size}w`)
    .join(', ');
}

/**
 * Preload next route data
 */
export function preloadRouteData(route: string): void {
  // This would be used with your data fetching strategy
  console.log(`Preloading data for route: ${route}`);
}

/**
 * Report Web Vitals to analytics
 */
export function reportWebVitals(metric: any): void {
  // Send to analytics endpoint
  console.log(metric);
  
  // Example: send to Google Analytics
  if (window.gtag) {
    window.gtag('event', metric.name, {
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      event_label: metric.id,
      non_interaction: true,
    });
  }
}

/**
 * Optimize font loading
 */
export function optimizeFontLoading(): void {
  // Use font-display: swap in CSS
  document.fonts.ready.then(() => {
    document.body.classList.add('fonts-loaded');
  });
}

/**
 * Service Worker registration
 */
export function registerServiceWorker(): void {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then(registration => {
          console.log('SW registered:', registration);
        })
        .catch(error => {
          console.log('SW registration failed:', error);
        });
    });
  }
}

/**
 * Prefetch links on hover
 */
export function enableLinkPrefetch(): void {
  const links = document.querySelectorAll('a[href^="/"]');
  
  links.forEach(link => {
    link.addEventListener('mouseenter', function(this: HTMLAnchorElement) {
      const href = this.getAttribute('href');
      if (href && !document.querySelector(`link[rel="prefetch"][href="${href}"]`)) {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'prefetch';
        prefetchLink.href = href;
        document.head.appendChild(prefetchLink);
      }
    }, { once: true });
  });
}

/**
 * Compress data before storing in localStorage
 */
export function compressData(data: any): string {
  return btoa(JSON.stringify(data));
}

export function decompressData(compressed: string): any {
  return JSON.parse(atob(compressed));
}

/**
 * Monitor performance metrics
 */
export function monitorPerformance(): void {
  if ('PerformanceObserver' in window) {
    // Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', (lastEntry as any).renderTime || (lastEntry as any).loadTime);
    });
    lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
    
    // First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        console.log('FID:', (entry as any).processingStart - entry.startTime);
      });
    });
    fidObserver.observe({ entryTypes: ['first-input'] });
    
    // Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          console.log('CLS:', clsValue);
        }
      }
    });
    clsObserver.observe({ entryTypes: ['layout-shift'] });
  }
}

/**
 * Initialize all performance optimizations
 */
export function initializePerformanceOptimizations(): void {
  optimizeFontLoading();
  enableLinkPrefetch();
  monitorPerformance();
  
  // Defer non-critical JavaScript
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      registerServiceWorker();
    });
  } else {
    registerServiceWorker();
  }
}

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}
