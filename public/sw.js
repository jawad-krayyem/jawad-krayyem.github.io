const CACHE = 'jawad-portfolio-v2';
const CORE = ['/', '/offline.html', '/manifest.webmanifest', '/favicon.svg'];
const SHELL_ASSET = /\.(?:css|js|png|jpe?g|webp|svg|ico|woff2|webm|vtt)$/i;

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.allSettled(CORE.map(path => cache.add(path)));

    // The first page load happens before this worker controls the tab. Read the
    // saved shell HTML and warm every same-origin asset it references now.
    const home = await cache.match(new URL('/', self.location.origin).href);
    if (home) {
      const html = await home.text();
      const assets = new Set();
      for (const [, rawUrl] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
        try {
          const asset = new URL(rawUrl, self.location.origin);
          if (asset.origin === self.location.origin && !asset.search && (asset.pathname.startsWith('/_next/static/') || SHELL_ASSET.test(asset.pathname))) {
            assets.add(asset.pathname);
          }
        } catch { /* Ignore malformed and external references. */ }
      }
      await Promise.allSettled([...assets].map(path => cache.add(path)));
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('jawad-portfolio-') && name !== CACHE).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.search || request.headers.has('range')) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      try {
        const response = await fetch(request);
        if (response.ok && response.type === 'basic') await cache.put(request, response.clone());
        return response;
      } catch {
        const savedPage = (await cache.match(request)) || (await cache.match(url.href)) || (await cache.match(url.pathname));
        return savedPage || (await cache.match(new URL('/offline.html', self.location.origin).href));
      }
    })());
    return;
  }
  if (url.pathname.startsWith('/_next/static/') || SHELL_ASSET.test(url.pathname)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      const saved = await cache.match(request);
      if (saved) return saved;
      const response = await fetch(request);
      if (response.ok && response.type === 'basic') await cache.put(request, response.clone());
      return response;
    })());
  }
});
