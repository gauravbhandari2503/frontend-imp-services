# Frontend Services Collection

A comprehensive collection of framework-agnostic frontend services designed for scalability, maintainability, and performance.

## 🚀 Quick Usage (CLI)

This package provides a CLI to easily discover and install services directly into your project.

### 1️⃣ List Available Services

To see all the services you can install, run:

```bash
npx --package @gaurav_bhandari/common-frontend-services frontend-services list
```

### 2️⃣ Install a Service

To add a specific service (e.g., `logger`, `api`) to your project, run:

```bash
npx --package @gaurav_bhandari/common-frontend-services frontend-services add <service-name>
```

**Example:**

```bash
npx --package @gaurav_bhandari/common-frontend-services frontend-services add logger
```

## 📦 Services Overview

This repository contains the following services. Each service directory includes its own `docs` folder with detailed usage instructions and examples.

### Core Foundation

- **[API Service](./API-Service)**: Base API handling wrapper around Axios with interceptors, error handling, and CSRF protection.
- **[Environment Config Service](./Environment-Config-Service)**: Centralized configuration management for environment variables and runtime settings.
- **[Logger Service](./Logger-Service)**: structured logging service with support for multiple transports (Console, External).
- **[Monitoring Service](./Monitoring-Service)**: Error tracking and performance monitoring (Web Vitals) with backend reporting capabilities.

### Application Logic

- **[Authorization Service](./Authorization-Service)**: Role-Based Access Control (RBAC) service for managing user permissions and route guards.
- **[Cache Service](./Cache-Service)**: Two-layer caching mechanism (Memory + IndexedDB) with LRU eviction policies for performance optimization.
- **[Feature Flag Service](./Feature-Flag-Service)**: Remote feature toggling service with retry logic and caching.
- **[Google Login Service](./Google-Login-Service)**: Integration wrapper for Google Identity Services SDK for easy authentication.
- **[GraphQL Service](./GraphQl-Service)**: Client for handling GraphQL queries and mutations.
- **[i18n Service](./i18n-Service)**: Internationalization service for managing translations and locale settings.
- **[Validation Service](./Validation-Service)**: Pure TypeScript, framework-agnostic form validation logic.
- **[Worker Service](./Worker-Service)**: Utility for safely executing heavy computations in Web Workers with timeout support.

### Data & Storage

- **[Date Service](./Date-Service)**: Date manipulation and formatting utilities (wrapper around `date-fns`) with time zone support.
- **[File Service](./File-Service)**: Robust file handling service including support for chunked uploads and progress tracking.
- **[Storage Service](./Storage-Service)**: Type-safe wrappers for LocalStorage, SessionStorage, and IndexedDB.

### Documentation & Standards

- **[Architecture Reports](./Architecture-Reports-Service)**: Checklists and guidelines for maintaining architectural health and standards.
- **[Security Reports](./Security-Reports-Service)**: Security best practices, checklists (including OWASP Top 10), and audit guides.

## 📚 Documentation

For detailed implementation details, API references, and usage examples, please refer to the `docs` folder located within each service's directory.
