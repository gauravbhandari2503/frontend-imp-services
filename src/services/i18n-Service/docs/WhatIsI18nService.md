# I18nService

The `I18nService` provides a lightweight, framework-agnostic solution for managing translations and multiple languages in your application.

## Overview

This service handles loading translation files (JSON), managing the active locale, and interpolating dynamic values into translated strings.

### Key Features

- **Lazy Loading**: Translation files are only loaded when needed.
- **Nested Keys**: Support for dot notation (e.g., `dashboard.title`).
- **Interpolation**: Simple value replacement (e.g., `Hello {name}`).
- **Framework Agnostice**: Can be used with any UI library.

## How to Use

### 1. Structure

Place your translation files in the `locales/` directory.

```
/i18n-Service/locales/
  ├── en.json
  ├── es.json
  └── fr.json
```

**Example `en.json`**:

```json
{
  "welcome": "Welcome, {name}!",
  "buttons": {
    "save": "Save Changes"
  }
}
```

### 2. Initialization

Initialize the service at your application entry point.

```typescript
import { i18nService } from "@/i18n-Service/i18nService";

async function initApp() {
  await i18nService.init("en"); // Sets default language
  // mount app...
}
```

### 3. Usage

Use the `t()` method to translate keys.

```typescript
import { i18nService } from "@/i18n-Service/i18nService";

// Simple key
const buttonLabel = i18nService.t("buttons.save"); // "Save Changes"

// With parameters
const welcomeMsg = i18nService.t("welcome", { name: "Alice" }); // "Welcome, Alice!"
```

### 4. Changing Language

```typescript
async function switchLanguage(lang: string) {
  await i18nService.setLocale(lang);
  // You might need to trigger a re-render in your framework
}
```

## Framework Integration

### Vue Plugin (Example)

```typescript
// plugins/i18n.ts
import { i18nService } from "@/i18n-Service/i18nService";

export default {
  install: (app) => {
    app.config.globalProperties.$t = (key, params) =>
      i18nService.t(key, params);
  },
};
```

### React Hook (Example)

```tsx
// hooks/useI18n.ts
import { useState, useEffect } from "react";
import { i18nService } from "@/i18n-Service/i18nService";

export function useI18n() {
  const [locale, setLocale] = useState(i18nService.getLocale());

  const t = (key, params) => i18nService.t(key, params);

  // Logic to listen for locale changes would go here

  return { t, locale };
}
```
