/* ARISE : cache pour fonctionner hors connexion.
   - Pages, scripts et icônes : réseau d'abord (les mises à jour arrivent tout de suite, revalidées à chaque ouverture),
     cache en secours hors connexion.
   - Polices Google : cache d'abord, rafraîchies en arrière-plan.
   Augmenter VERSION à chaque mise à jour du site (cela renouvelle aussi le cache).
   ATTENTION : tous les sites d'une même adresse (par exemple arise-detox.github.io/arise et arise-detox.github.io/autre-projet)
   partagent le même stockage de caches. ARISE ne supprime donc que ses propres caches (nom commençant par « arise- »)
   et se répare tout seul si un autre site a effacé le sien. */
var VERSION = 'arise-v13';
var PREFIX = 'arise-';
var SHELL = ['./', 'index.html', 'styles.css', 'app.js', 'content.js', 'config.js', 'legal.js', 'manifest.webmanifest', 'favicon.svg', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png'];
var FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', function (e) {
  /* « reload » : on ne se contente pas d'une copie que le navigateur aurait déjà (GitHub Pages garde les fichiers 10 minutes) */
  e.waitUntil(caches.open(VERSION).then(function (c) {
    return c.addAll(SHELL.map(function (u) { return new Request(u, { cache: 'reload' }); }));
  }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    /* uniquement NOS anciens caches : jamais ceux d'un autre site hébergé à la même adresse */
    return Promise.all(keys.filter(function (k) { return k.indexOf(PREFIX) === 0 && k !== VERSION; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

/* Réparation : si un autre site a vidé notre cache, on le reconstitue à la prochaine ouverture avec du réseau. */
function ensureShell() {
  return caches.open(VERSION).then(function (c) {
    return Promise.all(SHELL.map(function (u) {
      return c.match(u).then(function (hit) { return hit || c.add(new Request(u, { cache: 'reload' })).catch(function () { /* hors connexion : plus tard */ }); });
    }));
  });
}

function fetchFresh(req) {
  try { return fetch(req, { cache: 'no-cache' }); } catch (err) { return fetch(req); }   /* « no-cache » : revalide toujours auprès du serveur */
}

function networkFirst(req) {
  var key = req.mode === 'navigate' ? 'index.html' : req;   /* toutes les adresses de la page (?tab=…, ?v=…) partagent une seule copie */
  return fetchFresh(req).then(function (res) {
    if (res && res.ok && res.type === 'basic') { var copy = res.clone(); caches.open(VERSION).then(function (c) { c.put(key, copy); }); }
    return res;
  }).catch(function () {
    return caches.match(key, { ignoreSearch: true }).then(function (hit) {
      return hit || (req.mode === 'navigate' ? caches.match('index.html') : Response.error());
    });
  });
}

function fontsCacheFirst(req) {
  return caches.open(VERSION).then(function (c) {
    return c.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) { if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(function () { return hit || Response.error(); });
      return hit || net;
    });
  });
}

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  var url = new URL(req.url);
  if (FONT_HOSTS.indexOf(url.hostname) >= 0) { e.respondWith(fontsCacheFirst(req)); return; }
  if (url.origin !== location.origin) return;   /* Supabase, jsDelivr… : jamais mis en cache ici */
  if (req.mode === 'navigate') e.waitUntil(ensureShell());
  e.respondWith(networkFirst(req));
});
