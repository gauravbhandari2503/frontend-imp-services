import { openDB, IDBPDatabase } from "idb";

const DB_NAME = "AppDatabase";
const DB_VERSION = 1;

export enum Stores {
  KEY_VALUE = "key-value",
  SYNC_QUEUE = "sync-queue",
  CACHE = "cache",
}

export class IndexedDBService {
  private static instance: IndexedDBService;
  private dbPromise: Promise<IDBPDatabase>;

  private constructor() {
    this.dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Create stores if they don't exist
        if (!db.objectStoreNames.contains(Stores.KEY_VALUE)) {
          db.createObjectStore(Stores.KEY_VALUE);
        }
        if (!db.objectStoreNames.contains(Stores.SYNC_QUEUE)) {
          db.createObjectStore(Stores.SYNC_QUEUE, {
            keyPath: "id",
            autoIncrement: true,
          });
        }
        if (!db.objectStoreNames.contains(Stores.CACHE)) {
          db.createObjectStore(Stores.CACHE);
        }
      },
    });
  }

  public static getInstance(): IndexedDBService {
    if (!IndexedDBService.instance) {
      IndexedDBService.instance = new IndexedDBService();
    }
    return IndexedDBService.instance;
  }

  /**
   * Get a value from a store
   */
  public async get<T>(
    storeName: Stores,
    key: string | number,
  ): Promise<T | undefined> {
    const db = await this.dbPromise;
    return db.get(storeName, key);
  }

  /**
   * Put a value into a store
   */
  public async put<T>(
    storeName: Stores,
    value: T,
    key?: string | number,
  ): Promise<string | number> {
    const db = await this.dbPromise;
    return db.put(storeName, value, key);
  }

  /**
   * Delete a value
   */
  public async delete(storeName: Stores, key: string | number): Promise<void> {
    const db = await this.dbPromise;
    await db.delete(storeName, key);
  }

  /**
   * Get all values from a store
   */
  public async getAll<T>(storeName: Stores): Promise<T[]> {
    const db = await this.dbPromise;
    return db.getAll(storeName);
  }

  /**
   * Add an action to the sync queue (for offline support)
   */
  public async addToSyncQueue(action: {
    type: string;
    payload: any;
    timestamp: number;
  }): Promise<void> {
    const db = await this.dbPromise;
    await db.add(Stores.SYNC_QUEUE, action);
  }

  /**
   * Clear multiple items
   */
  public async clear(storeName: Stores): Promise<void> {
    const db = await this.dbPromise;
    await db.clear(storeName);
  }
}

export const indexedDBService = IndexedDBService.getInstance();
