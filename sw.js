// Core assets
var cacheName = 'projet-parrain'
let coreAssets = [
	'/',
	'/image/Rectangle%201.svg',
	'/style.css',
	'/image/astronaute-_1_.webp',
	'/image/greenpaint.webp',
	'/image/chairdesk.webp',
	'/Police/Inter/Inter-Regular.woff2',
	'/Police/Roboto/Roboto-Regular.woff2',
	'/image/machinewrite.webp',
	'/image/machinewritemob.webp',
	'/image/astronautemob.webp',
	'/image/greenpaintmob.webp',
	'/image/photo1.svg',
	'/image/milk-1.webp',
	'/image/chairdeskmob.webp',
	'/image/milkmob.webp',
	'/image/icon6.svg',
	'/image/Electronic_arts.webp',
	'/image/Capcom.webp',
	'/image/Ubisoft.webp',
	'/image/icon8.svg',
	'/image/Sega.webp',
	'/image/icon4.svg',
	'/image/Microsoft.webp',
	'/image/icon3.svg',
	'/image/Bethesda.webp',
	'/image/icon1.svg',
	'/image/blueorange.webp',
	'/image/icon11.svg',
	'/image/blueorangemob.webp',
	'/image/icon10.svg',
	'/image/icon2.svg',
	'/image/tel.svg',
	'/image/ic2.svg',
	'/image/icon9.svg',
	'/image/logo2.svg',
	'/image/ic3.svg',
	'/image/ic1.svg',
	'/image/logo3.svg',
	'/image/enveloppe.svg',
	'/image/logo1.svg',
	'/image/icon5.svg',
	'/image/icon7.svg',
	
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

