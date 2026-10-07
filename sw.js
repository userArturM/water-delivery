const CACHE = 'clean-water-v18-aqua-20261006';
const APP = [
  './',
  'index.html',
  'catalog.html',
  'about.html',
  'delivery.html',
  'delivery-payment.html',
  'faq.html',
  'contacts.html',
  '404.html',
  'manifest.json',
  'styles.css',
  'app.js',
  'assets/icon-192.png',
  'assets/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(c => c.addAll(APP)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const url = new URL(req.url);
  const isPage = req.mode === 'navigate' || /\.(html|js|css|json)$/.test(url.pathname);
  if (isPage) {
    event.respondWith(
      fetch(req).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() =>
        caches.match(req).then(r => r || caches.match('404.html') || caches.match('index.html'))
      )
    );
  } else {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(res => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      }))
    );
  }
});
