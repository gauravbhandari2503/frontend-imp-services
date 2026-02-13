# Cache Service & Strategies

This module provides a unified caching layer (L1 + L2) and reference strategies for Service Workers (L3) and HTTP caching.

## Architecture

1.  **L1: Memory Cache**: Fastest, stored in RAM. Good for short-lived UI state. Lost on reload.
2.  **L2: Persistent Cache**: Stored in IndexDB. Good for offline data and expensive API responses. Persists across reloads.
3.  **L3: Service Worker**: Network proxy. Good for assets and offline-first apps. (See `sw-strategies.ts`).

## Usage

### CacheService (App Level)

```typescript
import { cacheService } from "./Cache-Service/cacheService";

// Set item (L1 only)
cacheService.set("user_profile", profileData);

// Set item (L1 + L2) with custom TTL
cacheService.set("dashboard_data", data, { persist: true, ttl: 60000 });

// Get item (Checks L1 -> L2)
const data = await cacheService.get("dashboard_data");
```

---

## Caching Strategies Guide

### HTTP Caching

Control via backend response headers.

- **`Cache-Control: no-store`**: Never cache.
- **`Cache-Control: no-cache`**: Cache but validate with ETag before using.
- **`Cache-Control: public, max-age=31536000`**: Cache efficiently (good for hashed assets).

### CDN Caching

Use for static assets (images, JS, CSS). Ensure cache invalidation via versioning/hashing file names.

### Service Worker (L3)

Refer to `sw-strategies.ts` for implementation patterns:

- **Cache First**: Fonts, Images.
- **Network First**: Critical API data.
- **Stale While Revalidate**: Feeds, Blogs.
