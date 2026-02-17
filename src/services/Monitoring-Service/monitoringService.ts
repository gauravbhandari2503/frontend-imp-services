import { envConfigService } from "../Environment-Config-Service/environmentConfigService";
import { loggerService } from "../Logger-Service/loggerService";

export interface SystemError {
  message: string;
  stack?: string;
  source?: string;
  lineno?: number;
  colno?: number;
  timestamp: string;
  type: "uncaught" | "unhandledRejection" | "manual";
  context?: any;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  tags?: Record<string, string>;
  timestamp: string;
}

type MonitoringEvent =
  | { kind: "error"; payload: SystemError }
  | { kind: "metric"; payload: PerformanceMetric };

export class MonitoringService {
  private static instance: MonitoringService;
  private isInitialized = false;
  private queue: MonitoringEvent[] = [];
  private flushIntervalId: any;
  private readonly FLUSH_DELAY = 5000; // 5 seconds
  private endpoint: string;

  private constructor() {
    this.endpoint = envConfigService.get("apiUrl") + "/monitoring"; // Example endpoint
  }

  public static getInstance(): MonitoringService {
    if (!MonitoringService.instance) {
      MonitoringService.instance = new MonitoringService();
    }
    return MonitoringService.instance;
  }

  public init(): void {
    if (this.isInitialized) return;
    const enabled = envConfigService.get("enableMonitoring");
    if (!enabled) {
      loggerService.info("MonitoringService is disabled via config.");
      return;
    }

    this.setupErrorListeners();
    this.setupPerformanceMonitoring();
    this.startFlushLoop();
    this.setupLifecycleListeners();

    this.isInitialized = true;
    loggerService.info("MonitoringService initialized.");
  }

  private setupErrorListeners(): void {
    window.onerror = (message, source, lineno, colno, error) => {
      this.trackError({
        message: String(message),
        source,
        lineno,
        colno,
        stack: error?.stack,
        timestamp: new Date().toISOString(),
        type: "uncaught",
      });
    };

    window.onunhandledrejection = (event) => {
      this.trackError({
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack,
        timestamp: new Date().toISOString(),
        type: "unhandledRejection",
      });
    };
  }

  private setupLifecycleListeners(): void {
    // Flush on page visibility change (hidden/unload)
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.flush();
      }
    });
  }

  private setupPerformanceMonitoring(): void {
    if ("PerformanceObserver" in window) {
      // Track LCP
      try {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.logMetric("LCP", lastEntry.startTime);
        });
        lcpObserver.observe({
          type: "largest-contentful-paint",
          buffered: true,
        });
      } catch (e) {
        // Observer not supported
      }

      // Track FID
      try {
        const fidObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            this.logMetric("FID", entry.processingStart - entry.startTime);
          }
        });
        fidObserver.observe({ type: "first-input", buffered: true });
      } catch (e) {
        // Observer not supported
      }

      // Track CLS
      try {
        const clsObserver = new PerformanceObserver((entryList) => {
          for (const entry of entryList.getEntries()) {
            // @ts-ignore - layout-shift specific property
            if (!entry.hadRecentInput) {
              // @ts-ignore
              this.logMetric("CLS", entry.value);
            }
          }
        });
        clsObserver.observe({ type: "layout-shift", buffered: true });
      } catch (e) {
        // Observer not supported
      }
    }
  }

  public trackError(
    error: SystemError | Error | Partial<SystemError>,
    context?: any,
  ): void {
    let errorObj: SystemError;

    if (error instanceof Error) {
      errorObj = {
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        type: "manual",
        context,
      };
    } else {
      // Merge with defaults
      errorObj = {
        message: "Unknown Error",
        type: "manual",
        timestamp: new Date().toISOString(),
        ...error,
        context: context || error.context,
      } as SystemError;
    }

    // Log locally
    loggerService.error("MonitoringService caught error:", errorObj);

    this.queue.push({ kind: "error", payload: errorObj });
  }

  public logMetric(
    name: string,
    value: number,
    tags?: Record<string, string>,
  ): void {
    const metric: PerformanceMetric = {
      name,
      value,
      tags,
      timestamp: new Date().toISOString(),
    };

    // Log locally
    loggerService.debug(`[Metric] ${name}: ${value}`, tags);

    this.queue.push({ kind: "metric", payload: metric });
  }

  private startFlushLoop(): void {
    this.flushIntervalId = setInterval(() => {
      this.flush();
    }, this.FLUSH_DELAY);
  }

  private flush(): void {
    if (this.queue.length === 0) return;

    const eventsToSend = [...this.queue];
    this.queue = [];

    const payload = JSON.stringify(eventsToSend);

    // Use sendBeacon if available for reliability during unload
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      const success = navigator.sendBeacon(this.endpoint, blob);
      // If sendBeacon fails (e.g. payload too large), fall back to fetch
      if (!success) {
        this.sendViaFetch(payload);
      }
    } else {
      this.sendViaFetch(payload);
    }
  }

  private sendViaFetch(body: string): void {
    fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch((err) => {
      loggerService.warn("Failed to send monitoring events", err);
    });
  }
}

export const monitoringService = MonitoringService.getInstance();
