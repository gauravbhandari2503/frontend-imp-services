# Monitoring Service

The `MonitoringService` provides centralized error tracking and performance monitoring for the application.

## Features

- **Global Error Tracking**: Automatically captures `window.onerror` and `unhandledrejection` events.
- **Performance Monitoring**: Tracks Web Vitals (LCP, FID, CLS) using `PerformanceObserver`.
- **Configurable**: Can be enabled/disabled via `EnvironmentConfigService`.
- **Integration**: Logs all events via `LoggerService`.

## Configuration

Enable monitoring via environment variables or runtime config:

```env
VITE_ENABLE_MONITORING=true
```

## Usage

Initialize the service at the start of your application (e.g., in `main.ts`):

```typescript
import { monitoringService } from "./Monitoring-Service/monitoringService";

monitoringService.init();
```

### Manual Error Tracking

You can manually track caught errors:

```typescript
try {
  // ... risky code
} catch (error) {
  monitoringService.trackError(error, { component: "UserProfile" });
}
```

### Custom Metrics

Log custom performance metrics:

```typescript
monitoringService.logMetric("custom_latency", 150);
```
