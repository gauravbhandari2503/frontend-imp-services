# CsrfApiService

The `CsrfApiService` is a specialized service responsible for managing Cross-Site Request Forgery (CSRF) protection tokens. It works in conjunction with `BaseApiService` to ensure that all state-modifying requests are secure.

## What is CSRF?

Cross-Site Request Forgery (CSRF) is an attack that forces an end user to execute unwanted actions on a web application in which they are currently authenticated. To prevent this, our backend (e.g., Laravel Sanctum) requires a valid CSRF token to be present in the headers of any request that changes state (POST, PUT, PATCH, DELETE).

## How It Works

1.  **Token Fetching**: The service fetches a CSRF cookie from the backend endpoint (typically `/sanctum/csrf-cookie`).
2.  **Cookie Storage**: The backend sets an `XSRF-TOKEN` cookie in the browser.
3.  **Token Validation**: The service verifies that the cookie has been set correctly.
4.  **Request Injection**: `BaseApiService` reads this cookie and adds it to the `X-XSRF-TOKEN` header of outgoing requests.

## Key Features

### 1. Singleton Pattern

Like `BaseApiService`, `CsrfApiService` is a singleton. This prevents multiple simultaneous requests for a CSRF token, which could cause race conditions or unnecessary network traffic.

### 2. Request Deduplication

If multiple API requests are initiated simultaneously and no token exists, `CsrfApiService` will only send **one** request to fetch the token. All pending requests will wait for this single fetch to complete before proceeding.

### 3. Automatic integration

You typically do not need to use `CsrfApiService` directly in your components. It is automatically used by `BaseApiService`. when you make a `post`, `put`, `patch`, or `delete` request.

## How to Use

### Direct Usage (Rare)

In most cases, you won't need to call this service directly. However, if you are manually configuring a separate axios instance or need to force a token refresh, you can use it as follows:

```typescript
import csrfApiService from "@/API-Service/csrfAPIService";

async function manualTokenRefresh() {
  await csrfApiService.ensureToken();
  console.log("CSRF token is ready");
}
```

### Methods

- **`ensureToken(): Promise<void>`**:
  - Checks if a valid token already exists.
  - If not, it fetches a new one.
  - Returns a promise that resolves when the token is available.
  - Safe to call multiple times; it handles deduplication.

- **`resetToken(): void`**:
  - Resets the internal state, forcing the next call to `ensureToken()` to fetch a new token from the server.

## Troubleshooting

If you see CSRF errors (419 status code):

1.  **Check Cookies**: Ensure your browser is accepting cookies and that the `XSRF-TOKEN` cookie is being set by the backend.
2.  **CORS Configuration**: Ensure your backend CORS configuration allows credentials (`Access-Control-Allow-Credentials: true`) and lists your frontend domain in allowed origins.
3.  **Endpoint**: verify that the `csrfUrl` in `csrfAPIService.ts` matches your backend's CSRF cookie endpoint.

```typescript
// In csrfAPIService.ts
const csrfUrl = `${import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "")}/sanctum/csrf-cookie`;
```
