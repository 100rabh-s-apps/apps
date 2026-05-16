const CACHE_NAME = 'saurabh-apps-v4';
const urlsToCache = [
  '/',
  '/index.html',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache urls during install:', error);
          throw error;
        });
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      self.clients.claim()
    ])
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If network request succeeds, update the cache for future offline use
        if (response && response.status === 200 && (response.type === 'basic' || event.request.url.includes('cdn.jsdelivr.net'))) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(error => {
        // Network failed (offline), try the cache
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Log and use fallback if not in cache
          console.error('Network failed and no cache match for:', event.request.url);
          return getFallbackResponse(event.request);
        });
      })
  );
});

// Function to return appropriate fallback responses based on request type
function getFallbackResponse(request) {
  // For navigation requests (HTML pages), return the main page
  if (request.destination === 'document') {
    return caches.match('/').then(response => {
      return response || caches.match('/index.html').then(indexResponse => {
        return indexResponse || new Response('<html><body><h1>Offline</h1><p>You are currently offline. Please check your connection and try again.</p></body></html>', {
          status: 200,
          headers: { 'Content-Type': 'text/html' }
        });
      });
    }).catch(error => {
      console.error('Error retrieving fallback HTML:', error);
      return new Response('<html><body><h1>Offline</h1><p>You are currently offline. Please check your connection and try again.</p></body></html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });
    });
  }

  // For image requests, return a placeholder image
  if (request.destination === 'image') {
    return new Response('<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100" height="100" fill="#e0e0e0"/><text x="50" y="50" font-size="12" text-anchor="middle" dominant-baseline="middle" fill="#999">Offline Image</text></svg>', {
      status: 200,
      headers: { 'Content-Type': 'image/svg+xml' }
    });
  }

  // For other requests, return a generic error response
  return new Response('', {
    status: 503,
    statusText: 'Service Unavailable - Offline Mode'
  });
}
