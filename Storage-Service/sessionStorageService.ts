export class SessionStorageService {
  private static instance: SessionStorageService;

  private constructor() {}

  public static getInstance(): SessionStorageService {
    if (!SessionStorageService.instance) {
      SessionStorageService.instance = new SessionStorageService();
    }
    return SessionStorageService.instance;
  }

  public setItem<T>(key: string, value: T): void {
    try {
      const serialized = JSON.stringify(value);
      sessionStorage.setItem(key, serialized);
    } catch (error) {
      console.error("SessionStorage setItem failed:", error);
    }
  }

  public getItem<T>(key: string, defaultValue: T | null = null): T | null {
    try {
      const serialized = sessionStorage.getItem(key);
      if (!serialized) return defaultValue;
      return JSON.parse(serialized) as T;
    } catch (error) {
      console.error("SessionStorage getItem failed:", error);
      return defaultValue;
    }
  }

  public removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }

  public clear(): void {
    sessionStorage.clear();
  }
}

export const sessionStorageService = SessionStorageService.getInstance();
