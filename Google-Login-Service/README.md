# Google Login Service

This service provides a wrapper around Google Identity Services (GIS) for implementing "Sign In With Google".

## Features

- **Automatic Script Loading**: Handles lazy loading of the Google JS SDK.
- **Environment Configuration**: API keys managed via `EnvironmentConfigService`.
- **Easy Button Rendering**: Simple method to render the standard Google button into any container.
- **Type Safety**: TypeScript interfaces for configuration and button options.

## Configuration

Ensure `VITE_GOOGLE_CLIENT_ID` is set in your `.env` file or via `window.__CONFIG__`.

```env
VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

## Usage

```typescript
import { googleLoginService } from "./Google-Login-Service/googleLoginService";

// 1. Initialize logic
const handleCredentialResponse = (response: any) => {
  console.log("Encoded JWT ID token: " + response.credential);
  // Send this token to your backend for verification
};

await googleLoginService.init({
  callback: handleCredentialResponse,
  autoSelect: false,
});

// 2. Render Button
googleLoginService.renderButton("google-btn-container", {
  theme: "outline",
  size: "large",
  width: "100%",
});
```

## HTML

```html
<div id="google-btn-container"></div>
```
