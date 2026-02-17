# FeatureFlagService

The `FeatureFlagService` provides a simple, framework-agnostic way to manage feature toggles in your application. It allows you to enable or disable features remotely without redeploying code.

## Overview

Feature flags are boolean values (true/false) associated with a key (e.g., `new-dashboard`). The service fetches these flags from the backend at startup and makes them available throughout the app.

### Key Features

- **Backend Driven**: Flags are fetched from an API endpoint (`GET /feature-flags`).
- **Framework Agnostic**: Can be used in Vue, React, or plain TypeScript files.
- **Singleton**: Ensures flags are fetched only once per session.

## How to Use

### 1. Initialization

You must initialize the service before using it, typically in your application's entry point.

**Vue (`main.ts`):**

```typescript
import { createApp } from "vue";
import App from "./App.vue";
import { featureFlagService } from "@/Feature-Flag-Service/featureFlagService";

async function init() {
  await featureFlagService.init(); // Fetch flags
  createApp(App).mount("#app");
}

init();
```

**React (`main.tsx`):**

```typescript
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { featureFlagService } from "@/Feature-Flag-Service/featureFlagService";

featureFlagService.init().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
});
```

### 2. Checking Flags

Use `isEnabled(key)` to check if a feature is active.

```typescript
import { featureFlagService } from "@/Feature-Flag-Service/featureFlagService";

if (featureFlagService.isEnabled("new-dashboard")) {
  // Show new dashboard
} else {
  // Show legacy dashboard
}
```

### 3. Framework specific integration

You can easily create wrapper components or directives.

**Vue Directive (`v-feature`)**:

```typescript
// directives/feature.ts
import { featureFlagService } from "@/Feature-Flag-Service/featureFlagService";

export const vFeature = {
  mounted(el, binding) {
    if (!featureFlagService.isEnabled(binding.value)) {
      el.parentNode?.removeChild(el);
    }
  },
};
```

**React Component (`<Feature>`)**:

```tsx
import { featureFlagService } from "@/Feature-Flag-Service/featureFlagService";

const Feature = ({ name, children }) => {
  return featureFlagService.isEnabled(name) ? children : null;
};
```

## Configuration

The service attempts to fetch flags from `GET /feature-flags`. Ensure your `BaseApiService` is correctly configured and that your backend provides this endpoint.
