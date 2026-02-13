# Logger Service

The `LoggerService` provides a centralized logging mechanism for the application, supporting different log levels and environment-based configuration.

## Features

- **Log Levels**: Support for `DEBUG`, `INFO`, `WARN`, `ERROR`, and `NONE`.
- **Environment Configuration**: Log level is configurable via `EnvironmentConfigService` (e.g., `VITE_LOG_LEVEL` or runtime config).
- **Singleton Instance**: Ensures consistent logging configuration throughout the app.
- **Console Output**: Formats logs with timestamps and levels.

## Usage

Import the `loggerService` instance:

```typescript
import { loggerService } from "./path/to/loggerService";

loggerService.debug("This is a debug message", { details: "..." });
loggerService.info("Application started");
loggerService.warn("Something might be wrong");
loggerService.error("Critical failure", errorObject);
```

## Configuration

The log level is determined by `EnvironmentConfigService`.

- **Development**: Defaults to `DEBUG`.
- **Production**: Defaults to `INFO`.

To override, set `VITE_LOG_LEVEL` in your `.env` file:

```env
VITE_LOG_LEVEL=warn
```

Or update runtime configuration:

```typescript
window.__CONFIG__ = {
  logLevel: "debug",
};
```
