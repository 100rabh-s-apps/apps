const CACHE_NAME = 'saurabh-apps-v1';
const urlsToCache = [
  '/',
  '/index.html',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.min.css'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache urls during install:', error);
          // Re-throw the error to fail the installation
          throw error;
        });
      })
      .catch(error => {
        console.error('Failed to open cache during install:', error);
        // Re-throw the error to fail the installation
        throw error;
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached response if available
        if (response) {
          return response;
        }

        // Otherwise, try to fetch from network with error handling
        return fetch(event.request).catch(error => {
          // Log the network error
          console.error('Network request failed:', error);

          // Try to return an appropriate fallback response
          return getFallbackResponse(event.request);
        });
      })
      .catch(error => {
        // Handle cache matching errors
        console.error('Cache matching failed:', error);

        // Try to fetch from network as fallback
        return fetch(event.request).catch(networkError => {
          console.error('Network request also failed:', networkError);

          // As final fallback, return an appropriate response
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

// Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName).catch(error => {
              console.error('Failed to delete old cache:', cacheName, error);
            });
          }
        })
      ).catch(error => {
        console.error('Error during cache cleanup:', error);
      });
    }).catch(error => {
      console.error('Failed to get cache names during activation:', error);
    })
  );
});