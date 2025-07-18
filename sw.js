const CACHE_NAME = 'codecatalyst-ai-v1.1.0';
const STATIC_CACHE = 'codecatalyst-static-v1.1.0';
const DYNAMIC_CACHE = 'codecatalyst-dynamic-v1.1.0';

// Define what to cache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/script.js',
  '/js/config.js',
  '/js/email-service.js',
  '/images/robot.svg',
  '/images/profile-photo.jpg',
  '/images/animated-logo.svg',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[ServiceWorker] Installation complete');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('[ServiceWorker] Installation failed:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activating...');
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[ServiceWorker] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle navigation requests (HTML pages)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/')
        .then(response => {
          return response || fetch(request);
        })
        .catch(() => {
          return caches.match('/');
        })
    );
    return;
  }

  // Handle static assets
  if (STATIC_ASSETS.includes(request.url) || request.url.includes('fonts.googleapis.com') || request.url.includes('cdnjs.cloudflare.com')) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          return response || fetch(request).then(fetchResponse => {
            const responseClone = fetchResponse.clone();
            caches.open(STATIC_CACHE)
              .then(cache => {
                cache.put(request, responseClone);
              });
            return fetchResponse;
          });
        })
        .catch(() => {
          // If it's a font or CSS file, try to return a cached version
          if (request.url.includes('fonts.googleapis.com') || request.url.includes('cdnjs.cloudflare.com')) {
            return caches.match(request);
          }
        })
    );
    return;
  }

  // Handle other requests with network-first strategy
  event.respondWith(
    fetch(request)
      .then(response => {
        // Only cache successful responses
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE)
            .then(cache => {
              cache.put(request, responseClone);
            });
        }
        return response;
      })
      .catch(() => {
        // If network fails, try to serve from cache
        return caches.match(request);
      })
  );
});

// Handle background sync for offline form submissions
self.addEventListener('sync', event => {
  if (event.tag === 'contact-form-sync') {
    event.waitUntil(
      // Handle offline form submissions here
      console.log('[ServiceWorker] Background sync: contact-form-sync')
    );
  }
});

// Handle push notifications (optional)
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body || 'New update from CodeCatalyst AI',
      icon: '/images/robot.svg',
      badge: '/images/robot.svg',
      vibrate: [200, 100, 200],
      data: {
        url: data.url || '/'
      },
      actions: [
        {
          action: 'open',
          title: 'Open App',
          icon: '/images/robot.svg'
        },
        {
          action: 'close',
          title: 'Close',
          icon: '/images/robot.svg'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'CodeCatalyst AI', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'open') {
    event.waitUntil(
      clients.openWindow(event.notification.data.url || '/')
    );
  }
});

// App update handling
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[ServiceWorker] Service Worker loaded successfully!');
