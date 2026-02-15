const CACHE_NAME = 'personal-assistant-v1';
const urlsToCache = [
  '/mobile-assistant.html',
  '/manifest.json'
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => console.log('Cache failed:', err))
  );
});

// Fetch from cache
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Update service worker
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Handle background sync for alarms (if supported)
self.addEventListener('sync', event => {
  if (event.tag === 'check-alarms') {
    event.waitUntil(checkAlarmsInBackground());
  }
});

function checkAlarmsInBackground() {
  // This would check alarms even when the app is closed
  return Promise.resolve();
}

// Handle notifications
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('/mobile-assistant.html')
  );
});
