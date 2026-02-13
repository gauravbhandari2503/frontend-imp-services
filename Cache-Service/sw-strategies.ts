/**
 * Service Worker Caching Strategies Reference
 *
 * This file serves as a reference for implementing caching strategies in your Service Worker (sw.js).
 * These are not directly executable in method calls but patterns to follow.
 */

// --- 1. Cache First (Network Fallback) ---
// Best for: Asset files (images, fonts, scripts) that don't change often.
//
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       return response || fetch(event.request);
//     })
//   );
// });

// --- 2. Network First (Cache Fallback) ---
// Best for: API requests where fresh data is critical but offline support is needed.
//
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     fetch(event.request).catch(() => {
//       return caches.match(event.request);
//     })
//   );
// });

// --- 3. Stale While Revalidate ---
// Best for: Content that updates frequently but speed is priority (e.g., news feed).
//
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     caches.open('dynamic-cache').then((cache) => {
//       return cache.match(event.request).then((response) => {
//         const fetchPromise = fetch(event.request).then((networkResponse) => {
//           cache.put(event.request, networkResponse.clone());
//           return networkResponse;
//         });
//         return response || fetchPromise;
//       });
//     })
//   );
// });

// --- 4. Cache Only ---
// Best for: Static UI shell elements.

// --- 5. Network Only ---
// Best for: Non-GET requests (POST, PUT) or critical real-time data.
