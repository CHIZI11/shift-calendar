const CACHE = "calendar-cache-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icons/icon-192.svg",
  "./icons/icon-512.svg"
];
self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => k!==CACHE ? caches.delete(k) : null))));
});
self.addEventListener("fetch", (event) => {
  event.respondWith(caches.match(event.request).then(resp => resp || fetch(event.request)));
});
