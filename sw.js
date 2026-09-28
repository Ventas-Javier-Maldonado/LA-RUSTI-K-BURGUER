const CACHE_NAME = "rustik-food-v1";

const FILES_TO_CACHE = [
"./",
"./index.html",
"./manifest.webmanifest",

"./images/logo-rustik.png",
"./images/fondo-rustik.jpg",

"./images/icons/icon-192.png",
"./images/icons/icon-512.png",

"./images/productos/promo-miercoles.jpg",
"./images/productos/promo-jueves.jpg",
"./images/productos/promo-viernes.jpg",
"./images/productos/promo-sabados-domingos.jpg",

"./music/rustik.mp3"
];

/* =========================================================
INSTALACIÓN
========================================================= */

self.addEventListener("install", event => {

event.waitUntil(

```
caches.open(CACHE_NAME)
  .then(cache => {

    return cache.addAll(FILES_TO_CACHE);

  })
```

);

self.skipWaiting();

});

/* =========================================================
ACTIVACIÓN
========================================================= */

self.addEventListener("activate", event => {

event.waitUntil(

```
caches.keys().then(cacheNames => {

  return Promise.all(

    cacheNames
      .filter(cacheName => cacheName !== CACHE_NAME)
      .map(cacheName => caches.delete(cacheName))

  );

})
```

);

self.clients.claim();

});

/* =========================================================
PETICIONES
========================================================= */

self.addEventListener("fetch", event => {

if (event.request.method !== "GET") {
return;
}

event.respondWith(

```
caches.match(event.request)
  .then(cachedResponse => {

    if (cachedResponse) {
      return cachedResponse;
    }

    return fetch(event.request)
      .then(networkResponse => {

        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          networkResponse.type === "opaque"
        ) {

          return networkResponse;

        }

        const responseClone =
          networkResponse.clone();

        caches.open(CACHE_NAME)
          .then(cache => {

            cache.put(
              event.request,
              responseClone
            );

          });

        return networkResponse;

      })
      .catch(() => {

        return caches.match("./index.html");

      });

  })
```

);

});
