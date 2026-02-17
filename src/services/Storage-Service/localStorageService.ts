export class LocalStorageService {
  private static instance: LocalStorageService;

  private constructor() {}

  public static getInstance(): LocalStorageService {
    if (!LocalStorageService.instance) {
      LocalStorageService.instance = new LocalStorageService();
    }
    return LocalStorageService.instance;
  }

  public setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      console.error("LocalStorage setItem failed:", error);
    }
  }

  public getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const serialized = localStorage.getItem(key);
      if (!serialized) return defaultValue;
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error("LocalStorage getItem failed:", error);
      return defaultValue;
    }
  }

  public removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  public clear(): void {
    localStorage.clear();
  }
}

export const localStorageService = LocalStorageService.getInstance();
