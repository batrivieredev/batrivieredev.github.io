const CACHE_NAME = 'scriptorium-v1';
const OFFLINE_URL = '/offline.html';

const STATIC_RESOURCES = [
    '/',
    '/static/css/styles.css',
    '/static/js/accessibility.js',
    '/static/fonts/Luciole-Regular.ttf',
    '/static/fonts/Luciole-Bold.ttf',
    '/manifest.json'
];

// Installation
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(STATIC_RESOURCES);
            })
    );
    self.skipWaiting();
});

// Activation et nettoyage des anciens caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Stratégie de cache : Network First avec fallback vers le cache
self.addEventListener('fetch', event => {
    // Ignorer les requêtes non GET
    if (event.request.method !== 'GET') return;

    // Ignorer les requêtes d'autres origines
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                // Mettre en cache la réponse
                const responseClone = response.clone();
                caches.open(CACHE_NAME)
                    .then(cache => {
                        cache.put(event.request, responseClone);
                    });
                return response;
            })
            .catch(() => {
                // En cas d'échec, essayer le cache
                return caches.match(event.request)
                    .then(response => {
                        if (response) {
                            return response;
                        }

                        // Si la requête est pour une page HTML, retourner la page hors-ligne
                        if (event.request.headers.get('Accept').includes('text/html')) {
                            return caches.match(OFFLINE_URL);
                        }
                    });
            })
    );
});

// Gestion des messages
self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Synchronisation en arrière-plan
self.addEventListener('sync', event => {
    if (event.tag === 'sync-preferences') {
        event.waitUntil(
            syncPreferences()
        );
    }
});

// Notifications push
self.addEventListener('push', event => {
    const options = {
        body: event.data.text(),
        icon: '/static/icons/icon-192x192.png',
        badge: '/static/icons/badge-72x72.png'
    };

    event.waitUntil(
        self.registration.showNotification('Scriptorium', options)
    );
});

// Gestion des clics sur les notifications
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
