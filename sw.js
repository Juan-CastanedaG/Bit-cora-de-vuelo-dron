/* Service worker de la Bitácora de Vuelo Dron.
   Subí el número de versión (bvd-vN) al publicar una versión nueva del index.html. */
const CACHE = 'bvd-v154';
const TILES = 'bvd-tiles';           // caché de mapa: NO se borra al actualizar
const CART  = 'bvd-cartilla';        // caché de cartilla: NO se borra al actualizar
const PLAN  = 'bvd-plan';            // planificador y sus librerías: NO se borra al actualizar (uso sin señal)
const ASSETS = [
  './','./index.html','./manifest.json','./icon-192.png','./icon-512.png',
  './pdf.min.js','./pdf.worker.min.js','./leaflet.js','./leaflet.css','./fflate.js'
];
self.addEventListener('install', e => {
  e.waitUntil(Promise.all([caches.open(CACHE).then(c => Promise.all(ASSETS.map(u => c.add(u).catch(function(){})))),
    caches.open(PLAN).then(c => Promise.all(['./pl_leaflet.js','./pl_leaflet.css','./pl_proj4.js','./pl_jszip.js','./pl_geotiff.js','./pl_shp.js'].map(u => c.match(u).then(h => h || c.add(u).catch(function(){})))))]));
});
self.addEventListener('message', e => { if(e.data && e.data.type==='skipWaiting') self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE && k !== TILES && k !== CART && k !== PLAN).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});
function isTile(url){ return /tile\.openstreetmap\.org|arcgisonline\.com/.test(url); }
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  if (/api\.open-meteo\.com|nominatim\.openstreetmap\.org|rainviewer\.com|kp\.gfz\.de|kp\.gfz-potsdam\.de|services\.swpc\.noaa\.gov|\/kp\.json/.test(e.request.url)) { e.respondWith(fetch(e.request)); return; }
  if (/\/seed_a\d+\.json/.test(e.request.url)) { e.respondWith(fetch(e.request)); return; }
  if (/\/seed\.json/.test(e.request.url)) {
    e.respondWith(
      fetch(e.request).then(resp => { if(resp && resp.ok) caches.open(CACHE).then(c => c.put(e.request, resp.clone())).catch(function(){}); return resp; })
      .catch(() => caches.match(e.request).then(hit => hit || new Response('{}', {headers:{'Content-Type':'application/json'}})))
    );
    return;
  }
  if (/\/cartilla\.js/.test(e.request.url)) {
    e.respondWith(caches.open(CART).then(c => c.match(e.request).then(hit =>
      hit || fetch(e.request).then(resp => { c.put(e.request, resp.clone()).catch(function(){}); return resp; }).catch(() => hit)
    )));
    return;
  }
  if (/\/planificador\.html/.test(e.request.url)) {
    /* sin señal: la copia guardada; con señal: la copia guardada al instante y se actualiza por detrás */
    e.respondWith(caches.open(PLAN).then(c => c.match('./planificador.html').then(hit => {
      const net = fetch(e.request).then(resp => { if (resp && resp.ok) c.put('./planificador.html', resp.clone()).catch(function(){}); return resp; }).catch(() => hit);
      return hit || net;
    })));
    return;
  }
  if (/\/pl_[a-z]+\.(js|css)|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net|fonts\.googleapis\.com|fonts\.gstatic\.com/.test(e.request.url)) {
    e.respondWith(caches.open(PLAN).then(c => c.match(e.request).then(hit =>
      hit || fetch(e.request).then(resp => { c.put(e.request, resp.clone()).catch(function(){}); return resp; }).catch(() => hit)
    )));
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
