# EnvironmentConfigService

The `EnvironmentConfigService` acts as the single source of truth for your application's configuration, merging build-time variables, runtime configurations, and defaults.

## Overview

Configuration management in modern frontends can be complex. We often need:

1.  **Build-time variables**: Baked into the bundle (e.g., `VITE_API_URL`).
2.  **Runtime variables**: Injected via `window.__CONFIG__` or `config.json` (allows changing values without rebuilding docker images).
3.  **Defaults**: Fallback values.

This service prioritizes these sources: **Runtime > Build-time > Defaults**.

### Key Features

- **Runtime Injection**: Change API URLs or feature flags without rebuilding the app.
- **Strict Typing**: Returns a typed `AppConfig` object.
- **Region Detection**: Helper to detect region from subdomains (e.g., `eu.myapp.com`).

## How to Use

### 1. Accessing Config

```typescript
import { envConfigService } from "@/Environment-Config-Service/environmentConfigService";

// Get specific value
const apiUrl = envConfigService.get("apiUrl");

// Get entire config object
const allConfig = envConfigService.getAll();
console.log(allConfig.features);
```

### 2. Runtime Injection (DevOps)

To change configuration at runtime (e.g., in a Kubernetes pod), you can inject a `window.__CONFIG__` object into your `index.html` before the app loads.

**Example `index.html`:**

```html
<script>
  window.__CONFIG__ = {
    apiUrl: "https://api.production.com",
    enableAnalytics: true,
    region: {
      region: "eu",
      currency: "EUR",
    },
  };
</script>
```

### 3. Region Detection

The service includes a helper to detect the current region, useful for multi-region deployments.

```typescript
const currentRegion = envConfigService.detectRegion();
// Returns 'eu' if hostname is 'eu.example.com', or falls back to config default.
```

## Adding New Config Keys

1.  Update the `AppConfig` interface in `environmentConfigService.ts`.
2.  Add a default value in `loadConfig()`.
3.  Map any new environment variables in `loadConfig()`.
