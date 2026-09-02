/* Service worker de la Bitácora de Vuelo Dron.
   Subí el número de versión (bvd-vN) al publicar una versión nueva del index.html. */
const CACHE = 'bvd-v34';
const TILES = 'bvd-tiles';           // caché de mapa: NO se borra al actualizar
const ASSETS = [
  './','./index.html','./manifest.json','./icon-192.png','./icon-512.png',
  './pdf.min.js','./pdf.worker.min.js','./leaflet.js','./leaflet.css','./fflate.js'
];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(ASSETS.map(u => c.add(u).catch(function(){})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== TILES).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
function isTile(url){ return /tile\.openstreetmap\.org|arcgisonline\.com/.test(url); }
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (/\/seed\.json/.test(e.request.url)) {
    e.respondWith(fetch(e.request).catch(() => new Response('{}', {headers:{'Content-Type':'application/json'}})));
    return;
  }
  if (isTile(e.request.url)) {
    e.respondWith(caches.open(TILES).then(c => c.match(e.request).then(hit =>
      hit || fetch(e.request).then(resp => { c.put(e.request, resp.clone()).catch(function(){}); return resp; }).catch(() => hit)
    )));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit =>
    hit || fetch(e.request).then(resp => {
      const cp = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)).catch(function(){}); return resp;
    }).catch(() => e.request.mode === 'navigate' ? caches.match('./index.html') : undefined)
  ));
});
