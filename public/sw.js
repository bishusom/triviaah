// public/sw.js
const CACHE_NAME = 'triviaah-v1.2.0';
const STATIC_CACHE_NAME = 'triviaah-static-v1.2.0';

// Critical resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/manifest.json',
  '/_next/static/css/app/layout.css',
  '/_next/static/chunks/webpack.js',
  '/_next/static/chunks/main-app.js',
  '/logo.webp',
  '/favicon.ico'
];

// Images to cache
const IMAGE_RESOURCES = [
  '/imgs/general-knowledge.webp',
  '/imgs/entertainment.webp',
  '/imgs/history.webp',
  '/imgs/geography.webp',
  '/imgs/science.webp',
  '/imgs/sports.webp',
  '/imgs/word-games.webp',
  '/imgs/number-puzzles.webp',
  '/imgs/blog.webp',
  '/imgs/tbank.webp'
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      // Cache critical resources
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.addAll(CRITICAL_RESOURCES);
      }),
      // Cache images separately with error handling
      caches.open(CACHE_NAME).then((cache) => {
        return Promise.all(
          IMAGE_RESOURCES.map(async (url) => {
            try {
              const response = await fetch(url);
              if (response.ok) {
                return cache.put(url, response);
              }
            } catch (error) {
              console.log('Failed to cache:', url);
            }
          })
        );
      })
    ])
  );
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all pages immediately
  self.clients.claim();
});

// Fetch event - network first for HTML, cache first for static resources
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests and API calls
  if (!url.origin.includes(self.location.origin) || 
      url.pathname.startsWith('/api/') ||
      url.pathname.startsWith('/_next/webpack-hmr')) {
    return;
  }

  // Handle different types of requests
  if (request.destination === 'document') {
    // Network first strategy for HTML pages
    event.respondWith(networkFirstStrategy(request));
  } else if (request.destination === 'image') {
    // Cache first strategy for images
    event.respondWith(cacheFirstStrategy(request));
  } else if (url.pathname.startsWith('/_next/static/') || 
             url.pathname.includes('.js') || 
             url.pathname.includes('.css')) {
    // Cache first strategy for static assets
    event.respondWith(cacheFirstStrategy(request));
  } else {
    // Stale while revalidate for other resources
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Network first strategy (for HTML)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline page if available
    return caches.match('/offline.html') || 
           new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
  }
}

// Cache first strategy (for images and static assets)
async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Return placeholder for images if needed
    if (request.destination === 'image') {
      return new Response(
        '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#f3f4f6"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="#9ca3af">Image</text></svg>',
        { headers: { 'Content-Type': 'image/svg+xml' } }
      );
    }
    throw error;
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(CACHE_NAME);
      cache.then((c) => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  }).catch(() => {
    // Network failed, return cached version if available
    return cachedResponse;
  });
  
  // Return cached version immediately if available, otherwise wait for network
  return cachedResponse || fetchPromise;
}

// Background sync for offline actions (if needed)
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-quiz-sync') {
    event.waitUntil(syncQuizData());
  }
});

async function syncQuizData() {
  // Implement background sync for quiz data if needed
  console.log('Background sync triggered');
}

// Push notification handling (if needed)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body,
      icon: '/icon-192x192.png',
      badge: '/badge-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: data.primaryKey || 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Play Quiz',
          icon: '/icon-play.png'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/icon-close.png'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Triviaah', options)
    );
  }
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});