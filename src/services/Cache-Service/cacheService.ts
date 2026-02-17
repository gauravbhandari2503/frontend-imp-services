import { indexedDBService, Stores } from "../Storage-Service/indexedDBService";
import { loggerService } from "../Logger-Service/loggerService";

interface CacheEntry<T> {
  value: T;
  expiry: number;
}

interface SetOptions {
  ttl?: number; // Time to live in milliseconds
  persist?: boolean; // Whether to store in L2 (IndexedDB)
}

export class CacheService {
  private static instance: CacheService;
  private memoryCache: Map<string, CacheEntry<unknown>>;
  private readonly defaultTTL = 5 * 60 * 1000; // 5 minutes
  private readonly maxSize: number = 100; // LRU Max Size

  private constructor() {
    this.memoryCache = new Map();
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Get item from cache (L1 -> L2)
   */
  public async get<T>(key: string): Promise<T | null> {
    const now = Date.now();

    // 1. Check L1 (Memory)
    if (this.memoryCache.has(key)) {
      const entry = this.memoryCache.get(key) as CacheEntry<T>;

      if (entry && entry.expiry > now) {
        loggerService.debug(`[Cache] L1 Hit: ${key}`);
        // LRU: Refresh usage by moving to end of Map
        this.memoryCache.delete(key);
        this.memoryCache.set(key, entry);
        return entry.value;
      } else {
        loggerService.debug(`[Cache] L1 Miss (Expired): ${key}`);
        this.memoryCache.delete(key);
      }
    }

    // 2. Check L2 (Persistent)
    try {
      const entry = await indexedDBService.get<CacheEntry<T>>(
        Stores.CACHE,
        key,
      );
      if (entry) {
        if (entry.expiry > now) {
          loggerService.debug(`[Cache] L2 Hit: ${key}`);
          // Promote to L1
          this.setL1(key, entry);
          return entry.value;
        } else {
          loggerService.debug(`[Cache] L2 Miss (Expired): ${key}`);
          await indexedDBService.delete(Stores.CACHE, key);
        }
      }
    } catch (error) {
      loggerService.error(`[Cache] L2 Read Error: ${key}`, error);
    }

    return null;
  }

  /**
   * Set item in cache
   */
  public async set<T>(
    key: string,
    value: T,
    options: SetOptions = {},
  ): Promise<void> {
    const ttl = options.ttl || this.defaultTTL;
    const expiry = Date.now() + ttl;
    const entry: CacheEntry<T> = { value, expiry };

    // 1. Write to L1
    this.setL1(key, entry);

    // 2. Write to L2 (if requested)
    if (options.persist) {
      try {
        await indexedDBService.put(Stores.CACHE, entry, key);
      } catch (error) {
        loggerService.error(`[Cache] L2 Write Error: ${key}`, error);
      }
    }
  }

  /**
   * Internal helper to set L1 cache with LRU eviction
   */
  private setL1(key: string, entry: CacheEntry<unknown>): void {
    // If updating existing, delete first to move to end
    if (this.memoryCache.has(key)) {
      this.memoryCache.delete(key);
    } else if (this.memoryCache.size >= this.maxSize) {
      // Evict oldest (first item in Map)
      const oldestKey = this.memoryCache.keys().next().value;
      if (oldestKey) this.memoryCache.delete(oldestKey);
    }
    this.memoryCache.set(key, entry);
  }

  /**
   * Invalidate item (remove from L1 and L2)
   */
  public async invalidate(key: string): Promise<void> {
    this.memoryCache.delete(key);
    try {
      await indexedDBService.delete(Stores.CACHE, key);
    } catch (error) {
      loggerService.error(`[Cache] Invalidate Error: ${key}`, error);
    }
  }

  /**
   * Clear all cache
   */
  public async clear(): Promise<void> {
    this.memoryCache.clear();
    try {
      await indexedDBService.clear(Stores.CACHE);
    } catch (error) {
      loggerService.error(`[Cache] Clear Error`, error);
    }
  }
}

export const cacheService = CacheService.getInstance();
