const CACHE_NAME = 'abdallah-portfolio-v1';

// الملفات الأساسية التي سيتم تخزينها من أول زيارة
const CORE_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/render.js',
  '/data/content.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CORE_ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  // استثناء طلبات الكروم والـ API الخارجية
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // تحديث الكاش بالنسخة الجديدة في الخلفية
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // في حال انقطاع الإنترنت، جلب الملف من الكاش
        return caches.match(event.request);
      })
  );
});
