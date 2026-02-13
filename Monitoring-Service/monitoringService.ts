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
}

export class MonitoringService {
  private static instance: MonitoringService;
  private isInitialized = false;

  private constructor() {}

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

  public trackError(error: SystemError | Error, context?: any): void {
    const errorObj =
      error instanceof Error
        ? {
            message: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString(),
            type: "manual" as const,
          }
        : error;

    // Log locally
    loggerService.error("MonitoringService caught error:", errorObj, context);

    // TODO: Send to external monitoring service (e.g., Sentry, Datadog)
    // this.sendToBackend(errorObj);
  }

  public logMetric(
    name: string,
    value: number,
    tags?: Record<string, string>,
  ): void {
    loggerService.info(`[Metric] ${name}: ${value}`, tags);
    // TODO: Send to analytics backend
  }
}

export const monitoringService = MonitoringService.getInstance();
