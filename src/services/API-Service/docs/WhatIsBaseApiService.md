# BaseApiService

The `BaseApiService` is a singleton service that provides a centralized HTTP client for the application. It wraps `axios` with standard configurations, interceptors, and environment-specific behaviors.

## Overview

Unlike using `axios` directly, `BaseApiService` ensures:

- **Consistent Configuration**: Base URL, timeouts, and headers are set automatically based on the environment.
- **Global Error Handling**: Common HTTP errors (401, 403, 404, 500) are handled centrally.
- **CSRF Protection**: Automatically handles CSRF token fetching and inclusion for modifying requests.
- **Type Safety**: Generic methods allow you to specify response types.

## Recommended Usage Pattern

The recommended way to use `BaseApiService` is to **wrap it within feature-specific Service classes**. Do not call `BaseApiService` directly from your Vue components. Instead, create a dedicated service class (e.g., `UserService`, `RegionService`) that encapsulates the API logic and response validation.

### Best Practices

1.  **Create a Singleton Service Class**: Use the singleton pattern for your feature service.
2.  **Use Zod for Validation**: Always validate the API response using Zod schemas to ensure runtime type safety.
3.  **Encapsulate Error Handling**: Catch errors in the service method and throw normalized errors or specific error types.

### Example Implementation

Here is an example of how to correctly implement a service using `BaseApiService`:

```typescript
import BaseService from "@/API-Service/baseApiService";
import { z } from "zod";

// 1. Define Zod Schema
const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
});

type User = z.infer<typeof UserSchema>;

class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  /**
   * Fetch a user by ID
   */
  async getUser(userId: number): Promise<User> {
    try {
      // 2. Call BaseService
      const json = await BaseService.get<User>(`users/${userId}`);

      // 3. Validate Response
      return UserSchema.parse(json);
    } catch (error) {
      console.error("Error fetching user:", error);
      // Re-throw or normalize error
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * Create a new user
   */
  async createUser(data: Omit<User, "id">): Promise<User> {
    try {
      // BaseService automatically handles CSRF token for POST requests
      const json = await BaseService.post<User>("users", data);
      return UserSchema.parse(json);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }
}

export default UserService.getInstance();
```

## API Reference

The `BaseApiService` exposes the following methods for use within your service classes:

### `get<T>(url: string, params?: any): Promise<T>`

Performs a GET request.

- `url`: The endpoint path (relative to `VITE_API_BASE_URL`).
- `params`: Optional query parameters.

### `post<T>(url: string, data?: any): Promise<T>`

Performs a POST request. Automatically handles CSRF token injection.

### `put<T>(url: string, data?: any): Promise<T>`

Performs a PUT request. Automatically handles CSRF token injection.

### `patch<T>(url: string, data?: any): Promise<T>`

Performs a PATCH request. Automatically handles CSRF token injection.

### `delete<T>(url: string): Promise<T>`

Performs a DELETE request. Automatically handles CSRF token injection.

## Environment Configuration

The service automatically configures itself based on environment variables:

- `VITE_API_BASE_URL`: Base URL for API requests.
- `VITE_API_TIMEOUT`: Request timeout (default: 30s).
- `VITE_ENABLE_API_LOGGING`: Enables console logging in non-production environments.
