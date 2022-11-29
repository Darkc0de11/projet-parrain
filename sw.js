// Core assets
var cacheName = 'projet-parrain'
let coreAssets = [
	'/projet-parrain/',
	'/projet-parrain/image/Rectangle%201.svg',
	'/projet-parrain/style.css',
	'/projet-parrain/image/astronaute-_1_.webp',
	'/projet-parrain/image/greenpaint.webp',
	'/projet-parrain/image/chairdesk.webp',
	'/projet-parrain/Police/Inter/Inter-Regular.woff2',
	'/projet-parrain/Police/Roboto/Roboto-Regular.woff2',
	'/projet-parrain/image/machinewrite.webp',
	'/projet-parrain/image/machinewritemob.webp',
	'/projet-parrain/image/astronautemob.webp',
	'/projet-parrain/image/greenpaintmob.webp',
	'/projet-parrain/image/photo1.svg',
	'//projet-parrain/image/milk-1.webp',
	'/projet-parrain/image/chairdeskmob.webp',
	'/projet-parrain/image/milkmob.webp',
	'/projet-parrain/image/icon6.svg',
	'/projet-parrain/image/Electronic_arts.webp',
	'/projet-parrain/image/Capcom.webp',
	'/projet-parrain/image/Ubisoft.webp',
	'/projet-parrain/image/icon8.svg',
	'/projet-parrain/image/Sega.webp',
	'/projet-parrain/image/icon4.svg',
	'/projet-parrain/image/Microsoft.webp',
	'/projet-parrain/image/icon3.svg',
	'/projet-parrain/image/Bethesda.webp',
	'/projet-parrain/image/icon1.svg',
	'/projet-parrain/image/blueorange.webp',
	'/projet-parrain/image/icon11.svg',
	'/projet-parrain/image/blueorangemob.webp',
	'/projet-parrain/image/icon10.svg',
	'/projet-parrain/image/icon2.svg',
	'/projet-parrain/image/tel.svg',
	'/projet-parrain/image/ic2.svg',
	'/projet-parrain/image/icon9.svg',
	'/projet-parrain/image/logo2.svg',
	'/projet-parrain/image/ic3.svg',
	'/projet-parrain/image/ic1.svg',
	'/projet-parrain/image/logo3.svg',
	'/projet-parrain/image/enveloppe.svg',
	'/projet-parrain/image/logo1.svg',
	'/projet-parrain/image/icon5.svg',
	'/projet-parrain/image/icon7.svg',
	'/projet-parrain/apps.js',
	'/projet-parrain/sw.js'
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

