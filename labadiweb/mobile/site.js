var config = {
  staticCacheItems: [
    '/images/loader.gif',
    '/mobile.js',
    '/css/mobile.css',
  ],
  cachePathPattern: /^\/(?:(20[0-9]{2}|css|images|js)\/(.+)?)?$/,
  offlineImage: '<svg role="img" aria-labelledby="offline-title"'
  + 'viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">'
  + '<title id="offline-title">Offline</title>'
  + '<g fill="none" fill-rule="evenodd"><path fill=>"#D8D8D8" d="M0 0h400v300H0z"/>'
  + '<text fill="#9B9B9B" font-family="Times New Roman,Times,serif" font-size="72" font-weight="bold">'
  + '<tspan x="93" y="172">offline</tspan></text></g></svg>',
  offlinePage: '/offline/',
};

self.addEventListener('install', () => {
  function onInstall() {
    return caches
      .open('appFiles')
      .then(cache => cache.addAll([
        '/images/loader.gif',
        '/mobile.js',
        '/css/mobile.css',
      ]);)
  }

  event.waitUntil(onInstall(event));
});

self.addEventListener('fetch', event => {
      function shouldHandleFetch(event, opts) {
        var request = event.request;
        var url = new URL(request.url);
        var criteria = {
          matchesPathPattern: !!(opts.cachePathPattern.exec(url.pathname),
            isGETRequest: request.method === 'GET',
            isFromMyOrigin: url.origin === self.location.origin
          };

          var failingCriteria = Object.keys(criteria)
            .filter(criteriaKey => !criteria[criteriaKey]);

          return !failingCriteria.length;
        }

        function addToCache(cacheKey, request, response) {
          if (response.ok) {
            var copy = response.clone();
            caches.open(cacheKey).then(cache => {
              cache.put(request, copy);
            });
            return response;
          }
        }


        function fetchFromCache(event) {
          return caches.match(event.request).then(response => {
            if (!response) {
              // A synchronous error that will kick off the catch handler
              throw Error('${event.request.url} not found in cache');
            }
            return response;
          });
        }

        function offlineResponse(resourceType, opts) {
          if (resourceType === 'image') {
            return new Response(opts.offlineImage, { headers: { 'Content-Type': 'image/svg+xml' } });
          } else if (resourceType === 'content') {
            return caches.match(opts.offlinePage);
          }
          return undefined;
        }

        function onFetch(event, opts) {
          var request = event.request;
          var acceptHeader = request.headers.get('Accept');
          var resourceType = 'static';
          var cacheKey;

          if (acceptHeader.indexOf('text/html') !== -1) {
            resourceType = 'content';
          } else if (acceptHeader.indexOf('image') !== -1) {
            resourceType = 'image';
          }

          // {String} [static|image|content]
          cacheKey = resourceType;
          if (resourceType === 'content') {
            // Use a network-first strategy.
            event.respondWith(
              fetch(request)
              .then(response => addToCache(cacheKey, request, response))
              .catch(() => fetchFromCache(event))
              .catch(() => offlineResponse(opts))
            );
          } else {
            // Use a cache-first strategy.
            event.respondWith(
              fetchFromCache(event)
              .catch(() => fetch(request))
              .then(response => addToCache(cacheKey, request, response))
              .catch(() => offlineResponse(resourceType, opts))
            );
          }
        }

        if (shouldHandleFetch(event, config)) {
          onFetch(event, config);
        }
      });

    self.addEventListener('activate', () => {

    });
