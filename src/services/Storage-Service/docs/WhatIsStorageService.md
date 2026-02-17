# Storage Services

We provide three distinct storage services to handle different types of data persistence.

## 1. LocalStorageService

**Use for**: Persistent user preferences (e.g., Theme, Language, Auth Tokens).

- **Persists**: Until explicitly cleared.
- **Size Limit**: ~5MB.
- **Sync**: Synchronous (blocks UI).

```typescript
import { localStorageService } from "@/Storage-Service/localStorageService";

// Save theme
localStorageService.setItem("theme", "dark");

// Get theme (with default)
const theme = localStorageService.getItem("theme", "light");
```

## 2. SessionStorageService

**Use for**: Temporary data relevant only to the current tab (e.g., Multi-step form progress).

- **Persists**: Until the tab is closed.
- **Size Limit**: ~5MB.
- **Sync**: Synchronous.

```typescript
import { sessionStorageService } from "@/Storage-Service/sessionStorageService";

sessionStorageService.setItem("formData", { step: 1 });
```

## 3. IndexedDBService

**Use for**: Large data sets, offline caching, and complex objects (e.g., List of products, Post drafts, Sync Queue).

- **Persists**: Until cleared (more durable than LocalStorage).
- **Size Limit**: Hundreds of MBs (depends on disk space).
- **Sync**: Asynchronous (Promise-based).

We use `idb` to wrap IndexedDB in Promises.

### Stores

- `key-value`: Generic store.
- `sync-queue`: For storing actions when offline.
- `cache`: For API response caching.

### Usage

```typescript
import { indexedDBService, Stores } from "@/Storage-Service/indexedDBService";

// Save a large object
await indexedDBService.put(Stores.CACHE, { id: 1, data: "..." }, "user-1");

// Get it back
const user = await indexedDBService.get(Stores.CACHE, "user-1");

// Add to sync queue (for offline support)
await indexedDBService.addToSyncQueue({
  type: "CREATE_POST",
  payload: { title: "Hello" },
  timestamp: Date.now(),
});
```
