const CACHE_NAME = 'romani-szó-a-nap-v12';
const urlsToCache = [
    '/',
    '/index.html',
    '/dashboard.css',
    '/dashboard.js',
    '/words.js'
];

// Service Worker telepítése
self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                return cache.addAll(urlsToCache);
            })
    );
});

// Cache-elt válaszok kiszolgálása
self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
            .then(function(response) {
                // Cache találat esetén visszaadjuk a cache-elt verziót
                if (response) {
                    return response;
                }
                
                // Egyébként próbáljuk letölteni
                return fetch(event.request);
            }
        )
    );
}); 