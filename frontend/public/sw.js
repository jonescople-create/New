/**
 * IslandFruitGuide Service Worker
 * Handles offline support, caching, and performance optimization
 */

const CACHE_VERSION = 'islandfruitguide-v1.0.0';
const CACHE_STATIC = `${CACHE_VERSION}-static`;
const CACHE_DYNAMIC = `${CACHE_VERSION}-dynamic`;
const CACHE_IMAGES = `${CACHE_VERSION}-images`;

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.svg',
  '/manifest.json'
];

// Maximum number of items in dynamic cache
const MAX_DYNAMIC_CACHE_SIZE = 50;
const MAX_IMAGE_CACHE_SIZE = 100;

// Cache duration (7 days)
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000;

/**
 * Install Event - Cache static assets
 */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing service worker...');
  
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Failed to cache static assets:', error);
      })
  );
});

/**
 * Activate Event - Clean up old caches
 */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating service worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              // Delete caches that don't match current version
              return cacheName.startsWith('islandfruitguide-') && 
                     !cacheName.startsWith(CACHE_VERSION);
            })
            .map((cacheName) => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service worker activated');
        return self.clients.claim();
      })
  );
});

/**
 * Fetch Event - Serve from cache with network fallback
 */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip chrome extensions and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // API requests - Network first, cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(request, CACHE_DYNAMIC));
    return;
  }

  // Images - Cache first, network fallback
  if (request.destination === 'image' || 
      url.pathname.match(/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i)) {
    event.respondWith(cacheFirstStrategy(request, CACHE_IMAGES, MAX_IMAGE_CACHE_SIZE));
    return;
  }

  // Supabase storage - Cache first
  if (url.hostname.includes('supabase.co') && url.pathname.includes('/storage/')) {
    event.respondWith(cacheFirstStrategy(request, CACHE_IMAGES, MAX_IMAGE_CACHE_SIZE));
    return;
  }

  // HTML pages - Network first, cache fallback
  if (request.destination === 'document') {
    event.respondWith(networkFirstStrategy(request, CACHE_DYNAMIC));
    return;
  }

  // CSS, JS, Fonts - Cache first, network fallback
  if (request.destination === 'style' || 
      request.destination === 'script' || 
      request.destination === 'font' ||
      url.pathname.match(/\.(css|js|woff|woff2|ttf|otf)$/i)) {
    event.respondWith(cacheFirstStrategy(request, CACHE_STATIC));
    return;
  }

  // Default: Network first
  event.respondWith(networkFirstStrategy(request, CACHE_DYNAMIC));
});

/**
 * Network First Strategy
 * Try network, fallback to cache, show offline page if both fail
 */
async function networkFirstStrategy(request, cacheName) {
  try {
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      
      // Limit cache size
      limitCacheSize(cacheName, MAX_DYNAMIC_CACHE_SIZE);
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, try cache
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Both failed, return offline page for HTML requests
    if (request.destination === 'document') {
      return new Response(
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Offline - IslandFruitGuide</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              display: flex;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #1F7A4D 0%, #15573A 100%);
              color: white;
              text-align: center;
              padding: 20px;
            }
            .container {
              max-width: 500px;
            }
            h1 {
              font-size: 3rem;
              margin-bottom: 1rem;
            }
            p {
              font-size: 1.2rem;
              opacity: 0.9;
              margin-bottom: 2rem;
            }
            button {
              background: white;
              color: #1F7A4D;
              border: none;
              padding: 12px 24px;
              font-size: 1rem;
              font-weight: 600;
              border-radius: 8px;
              cursor: pointer;
              transition: transform 0.2s;
            }
            button:hover {
              transform: scale(1.05);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🥥</h1>
            <h1>You're Offline</h1>
            <p>It looks like you've lost your internet connection. Some features may not be available right now.</p>
            <button onclick="window.location.reload()">Try Again</button>
          </div>
        </body>
        </html>
        `,
        {
          headers: { 'Content-Type': 'text/html' }
        }
      );
    }
    
    // For other requests, return 503
    return new Response('Service Unavailable', { status: 503 });
  }
}

/**
 * Cache First Strategy
 * Try cache, fallback to network
 */
async function cacheFirstStrategy(request, cacheName, maxSize) {
  // Try cache first
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Check if cache is still fresh (within 7 days)
    const cachedDate = new Date(cachedResponse.headers.get('date'));
    const now = new Date();
    
    if (now - cachedDate < CACHE_DURATION) {
      return cachedResponse;
    }
  }
  
  try {
    // Cache miss or stale, fetch from network
    const networkResponse = await fetch(request);
    
    if (networkResponse && networkResponse.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
      
      // Limit cache size
      if (maxSize) {
        limitCacheSize(cacheName, maxSize);
      }
    }
    
    return networkResponse;
  } catch (error) {
    // Network failed, return stale cache if available
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Complete failure
    throw error;
  }
}

/**
 * Limit cache size by removing oldest entries
 */
async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    // Remove oldest entries (first in)
    const entriesToDelete = keys.length - maxSize;
    for (let i = 0; i < entriesToDelete; i++) {
      await cache.delete(keys[i]);
    }
  }
}

/**
 * Message Event - Handle messages from clients
 */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_URLS') {
    const urlsToCache = event.data.urls;
    event.waitUntil(
      caches.open(CACHE_DYNAMIC)
        .then((cache) => cache.addAll(urlsToCache))
    );
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys()
        .then((cacheNames) => {
          return Promise.all(
            cacheNames.map((cacheName) => caches.delete(cacheName))
          );
        })
    );
  }
});

console.log('[SW] Service Worker loaded');
