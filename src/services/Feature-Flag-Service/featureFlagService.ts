import BaseService from "../API-Service/baseApiService";

export class FeatureFlagService {
  private static instance: FeatureFlagService;
  private flags: Record<string, boolean> = {};
  private isInitialized = false;
  private fetchPromise: Promise<void> | null = null;

  private constructor() {
    // Optionally load default flags from local storage or env
  }

  public static getInstance(): FeatureFlagService {
    if (!FeatureFlagService.instance) {
      FeatureFlagService.instance = new FeatureFlagService();
    }
    return FeatureFlagService.instance;
  }

  /**
   * Initialize the service by fetching flags from the backend.
   * Call this in your main entry point (main.ts/App.tsx).
   */
  public async init(): Promise<void> {
    if (this.isInitialized) return;

    // Prevent multiple simultaneous fetches
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    this.fetchPromise = this.fetchFlags();
    await this.fetchPromise;
    this.isInitialized = true;
    this.fetchPromise = null;
  }

  /**
   * Force refresh flags from the server.
   * Useful if the user changes settings or switches accounts.
   */
  public async refresh(): Promise<void> {
    this.isInitialized = false;
    await this.init();
  }

  /**
   * Check if a feature is enabled.
   * @param key The feature flag key (e.g., 'new-dashboard')
   * @param defaultValue Default value if flag is missing (default: false)
   */
  public isEnabled(key: string, defaultValue = false): boolean {
    if (!this.isInitialized) {
      console.warn(
        `FeatureFlagService: Checking flag '${key}' before initialization.`,
      );
    }
    return this.flags[key] ?? defaultValue;
  }

  /**
   * Get all currently loaded flags.
   */
  public getFlags(): Record<string, boolean> {
    return { ...this.flags };
  }

  private async fetchFlags(retries = 3, delay = 1000): Promise<void> {
    try {
      // Assuming GET /feature-flags returns { "flag-name": true, ... }
      this.flags =
        await BaseService.get<Record<string, boolean>>("feature-flags");
    } catch (error) {
      if (retries > 0) {
        console.warn(
          `Failed to fetch feature flags. Retrying in ${delay}ms... (${retries} attempts left)`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.fetchFlags(retries - 1, delay * 2);
      } else {
        console.error(
          "Failed to fetch feature flags after multiple attempts:",
          error,
        );
        // Fallback strategies could go here (e.g. use cached values or defaults)
      }
    }
  }
}

export const featureFlagService = FeatureFlagService.getInstance();
