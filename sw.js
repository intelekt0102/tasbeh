const CACHE_NAME = 'tasbehim-v1';

// Birlamchi lokal fayllar (bular albatta keshlanishi shart)
const LOCAL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png'
];

// Tashqi CDN resurslari
const EXTERNAL_ASSETS = [
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Scheherazade:wght@400;700&display=swap'
];

// O'rnatish jarayoni
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Lokal fayllarni keshga olamiz
      await cache.addAll(LOCAL_ASSETS);
      // Tashqi fayllarni alohida, xavfsiz keshga olamiz
      for (const url of EXTERNAL_ASSETS) {
        try {
          await cache.add(url);
        } catch (err) {
          console.warn('Tashqi resurs keshlanmadi:', url);
        }
      }
    })
  );
  self.skipWaiting();
});

// Eski keshni tozalash
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// So'rovlarni tutib olish (Offline ishlash rejimi)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
