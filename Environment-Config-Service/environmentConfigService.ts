export interface RegionConfig {
  region: string;
  currency: string;
  locale: string;
}

export interface AppConfig {
  apiUrl: string;
  enableAnalytics: boolean;
  region: RegionConfig;
  features: Record<string, boolean>;
  logLevel: "debug" | "info" | "warn" | "error" | "none";
}

declare global {
  interface Window {
    __CONFIG__?: Partial<AppConfig>;
  }
}

export class EnvironmentConfigService {
  private static instance: EnvironmentConfigService;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): EnvironmentConfigService {
    if (!EnvironmentConfigService.instance) {
      EnvironmentConfigService.instance = new EnvironmentConfigService();
    }
    return EnvironmentConfigService.instance;
  }

  /**
   * Load and merge configurations from multiple sources.
   * Priority: Window Config (Runtime) > Environment Variables (Build) > Defaults
   */
  private loadConfig(): AppConfig {
    const env = import.meta.env || {};

    const defaults: AppConfig = {
      apiUrl: "http://localhost:3000/api",
      enableAnalytics: false,
      region: {
        region: "us",
        currency: "USD",
        locale: "en-US",
      },
      features: {},
      logLevel: "info",
    };

    const envConfig: Partial<AppConfig> = {
      apiUrl: env.VITE_API_BASE_URL,
      enableAnalytics: env.VITE_ENABLE_ANALYTICS === "true",
      logLevel: (env.VITE_LOG_LEVEL as any) || (env.DEV ? "debug" : "info"),
    };

    const runtimeConfig =
      (typeof window !== "undefined" && window.__CONFIG__) || {};

    // Deep merge could be implemented here if needed for nested objects like features/region
    return {
      ...defaults,
      ...envConfig,
      ...runtimeConfig,
      // Merge nested objects manually for now if they exist in partials
      region: {
        ...defaults.region,
        ...(envConfig.region as any), // Type assertion if Env vars mapped to object
        ...(runtimeConfig.region as any),
      },
      features: {
        ...defaults.features,
        ...(runtimeConfig.features as any),
      },
    };
  }

  public get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    return this.config[key];
  }

  public getAll(): AppConfig {
    return { ...this.config };
  }

  /**
   * Determine current region based on URL subdomain or config.
   * e.g., us.example.com -> 'us'
   */
  public detectRegion(): string {
    const host = window.location.hostname;
    const subdomain = host.split(".")[0];

    // Validate if subdomain matches known regions
    if (["us", "eu", "asia"].includes(subdomain)) {
      return subdomain;
    }

    return this.config.region.region;
  }
}

export const envConfigService = EnvironmentConfigService.getInstance();
