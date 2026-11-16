/* Service worker: ऑफ़लाइन सपोर्ट. नेटवर्क पहले, फिर कैश (ताकि config.js का नया डेटा तुरंत दिखे) */
var CACHE = 'ssdjmt-v1';
var CORE = [
  './', 'index.html', 'about.html', 'darshan.html', 'seva.html', 'booking.html', 'daan.html',
  'events.html', 'gallery.html', 'library.html', 'contact.html',
  'assets/style.css', 'assets/app.js', 'data/config.js', 'assets/logo.svg', 'assets/img/hero.svg'
];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(CORE); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== location.origin) return;
  e.respondWith(
    fetch(r).then(function (res) {
      var copy = res.clone();
      caches.open(CACHE).then(function (c) { c.put(r, copy); });
      return res;
    }).catch(function () {
      return caches.match(r, { ignoreSearch: true }).then(function (m) { return m || caches.match('index.html'); });
    })
  );
});
