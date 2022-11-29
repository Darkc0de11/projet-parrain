// Core assets
let coreAssets = [];
var cacheName = 'projet-parrain'
var appShellFiles = [
	'/pwa-examples/projet-parrain/',
	'/pwa-examples/projet-parrain/image/Rectangle%201.svg',
	'/pwa-examples/projet-parrain/style.css',
	'/pwa-examples/projet-parrain/image/astronaute-_1_.webp',
	'/pwa-examples/projet-parrain/image/greenpaint.webp',
	'/pwa-examples/projet-parrain/image/chairdesk.webp',
	'/pwa-examples/projet-parrain/Police/Inter/Inter-Regular.woff2',
	'/pwa-examples/projet-parrain/Police/Roboto/Roboto-Regular.woff2',
	'/pwa-examples/projet-parrain/image/machinewrite.webp',
	'/pwa-examples/projet-parrain/image/machinewritemob.webp',
	'/pwa-examples/projet-parrain/image/astronautemob.webp',
	'/pwa-examples/projet-parrain/image/greenpaintmob.webp',
	'/pwa-examples/projet-parrain/image/photo1.svg',
	'/pwa-examples//projet-parrain/image/milk-1.webp',
	'/pwa-examples/projet-parrain/image/chairdeskmob.webp',
	'/pwa-examples/projet-parrain/image/milkmob.webp',
	'/pwa-examples/projet-parrain/image/icon6.svg',
	'/pwa-examples/projet-parrain/image/Electronic_arts.webp',
	'/pwa-examples/projet-parrain/image/Capcom.webp',
	'/pwa-examples/projet-parrain/image/Ubisoft.webp',
	'/pwa-examples/projet-parrain/image/icon8.svg',
	'/pwa-examples/projet-parrain/image/Sega.webp',
	'/pwa-examples/projet-parrain/image/icon4.svg',
	'/pwa-examples/projet-parrain/image/Microsoft.webp',
	'/pwa-examples/projet-parrain/image/icon3.svg',
	'/pwa-examples/projet-parrain/image/Bethesda.webp',
	'/pwa-examples/projet-parrain/image/icon1.svg',
	'/pwa-examples/projet-parrain/image/blueorange.webp',
	'/pwa-examples/projet-parrain/image/icon11.svg',
	'/pwa-examples/projet-parrain/image/blueorangemob.webp',
	'/pwa-examples/projet-parrain/image/icon10.svg',
	'/pwa-examples/projet-parrain/image/icon2.svg',
	'/pwa-examples/projet-parrain/image/tel.svg',
	'/pwa-examples/projet-parrain/image/ic2.svg',
	'/pwa-examples/projet-parrain/image/icon9.svg',
	'/pwa-examples/projet-parrain/image/logo2.svg',
	'/pwa-examples/projet-parrain/image/ic3.svg',
	'/pwa-examples/projet-parrain/image/ic1.svg',
	'/pwa-examples/projet-parrain/image/logo3.svg',
	'/pwa-examples/projet-parrain/image/enveloppe.svg',
	'/pwa-examples/projet-parrain/image/logo1.svg',
	'/pwa-examples/projet-parrain/image/icon5.svg',
	'/pwa-examples/projet-parrain/image/icon7.svg',
	'/pwa-examples/projet-parrain/apps.js',
	'/pwa-examples/projet-parrain/sw.js'
];
// On install, cache core assets
self.addEventListener('install', function (event) {

	// Cache core assets
	event.waitUntil(caches.open('app').then(function (cache) {
		for (let asset of coreAssets) {
			cache.add(new Request(asset));
		}
		return cache;
	}));

});

// Listen for request events
self.addEventListener('fetch', function (event) {

	// Get the request
	let request = event.request;

	// Bug fix
	// https://stackoverflow.com/a/49719964
	if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;

	// HTML files
	// Network-first
	if (request.headers.get('Accept').includes('text/html')) {
		event.respondWith(
			fetch(request).then(function (response) {

				// Create a copy of the response and save it to the cache
				let copy = response.clone();
				event.waitUntil(caches.open('app').then(function (cache) {
					return cache.put(request, copy);
				}));

				// Return the response
				return response;

			}).catch(function (error) {

				// If there's no item in cache, respond with a fallback
				return caches.match(request).then(function (response) {
					return response || caches.match('/offline.html');
				});

			})
		);
	}

	// CSS & JavaScript
	// Offline-first
	if (request.headers.get('Accept').includes('text/css') || request.headers.get('Accept').includes('text/javascript')) {
		event.respondWith(
			caches.match(request).then(function (response) {
				return response || fetch(request).then(function (response) {

					// Return the response
					return response;

				});
			})
		);
		return;
	}

	// Images
	// Offline-first
	if (request.headers.get('Accept').includes('image')) {
		event.respondWith(
			caches.match(request).then(function (response) {
				return response || fetch(request).then(function (response) {

					// Save a copy of it in cache
					let copy = response.clone();
					event.waitUntil(caches.open('app').then(function (cache) {
						return cache.put(request, copy);
					}));

					// Return the response
					return response;

				});
			})
		);
	}

});

