/* ARISE : cache pour fonctionner hors connexion.
   Pages et icônes : réseau d'abord (les mises à jour arrivent), cache si pas de réseau.
   Polices Google : cache d'abord, rafraîchi en arrière-plan. Augmenter VERSION à chaque mise à jour du site. */
var VERSION = 'arise-v6';
var SHELL = ['./', 'index.html', 'styles.css', 'app.js', 'config.js', 'legal.js', 'manifest.webmanifest', 'favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];
var FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL.map(function (u) { return new Request(u, { cache: 'reload' }); })); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);

  if (FONT_HOSTS.indexOf(url.hostname) >= 0) {
    e.respondWith(caches.open(VERSION).then(function (c) {
      return c.match(req).then(function (hit) {
        var net = fetch(req).then(function (res) { if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(function () { return hit; });
        return hit || net;
      });
    }));
    return;
  }

  if (url.origin !== location.origin) return;
  /* « no-cache » : le navigateur revalide toujours auprès du serveur (GitHub Pages garde les fichiers 10 min), puis le cache sert de secours hors connexion. */
  e.respondWith(fetch(req, { cache: 'no-cache' }).catch(function () { return fetch(req); }).then(function (res) {
    if (res && res.ok) { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(req, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(req).then(function (hit) { return hit || (req.mode === 'navigate' ? caches.match('index.html') : undefined); });
  }));
});
