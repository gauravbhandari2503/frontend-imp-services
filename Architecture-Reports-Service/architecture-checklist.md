# Architecture Checklist

Use this checklist to audit the architectural health of the application.

## 1. Modularity & Separation of Concerns

- [ ] **Service Layer Isolation**: Business logic should reside in services, not UI components.
- [ ] **Component Purity**: UI components should primarily focus on presentation and user interaction.
- [ ] **Dependency Injection**: Services should be injectable or use a singleton pattern for testability (e.g., `EnvironmentConfigService`).
- [ ] **Feature Modules**: Code related to a specific feature should be grouped together (components, routes, stores).
- [ ] **Shared Kernel**: Common utilities, types, and UI libraries should be in a shared `core` or `shared` directory.

## 2. Scalability & State Management

- [ ] **Global State Usage**: Is the global store (e.g., Redux, Pinia, Context) used effectively? Avoid stuffing local UI state into global stores.
- [ ] **Data Fetching**: Are API calls deduplicated and cached? (Check usage of `CacheService` or `TanStack Query`).
- [ ] **Lazy Loading**: Are routes and heavy components lazy-loaded to reduce initial bundle size?
- [ ] **Event Driven**: Are events used for loose coupling where appropriate (e.g., `window` events for cross-tab or strict decoupling)?

## 3. Performance

- [ ] **Bundle Size**: Is the vendor bundle optimized? Are tree-shakable libraries used?
- [ ] **Render Performance**: Are expensive calculations memoized (`useMemo`)? Is re-rendering minimized?
- [ ] **Asset Optimization**: Are images/fonts optimized and served with correct cache headers?
- [ ] **Web Vitals**: Is `MonitoringService` integrated to track LCP, CLS, FID?

## 4. Maintainability

- [ ] **Code Style**: Is Prettier/ESLint configured and enforcing consistent style?
- [ ] **Type Safety**: Is `strict: true` enabled in `tsconfig.json`? Are `any` types minimized?
- [ ] **Documentation**: Do complex functions and services have JSDoc comments? Are architectural decisions recorded (ADRs)?
- [ ] **Naming Conventions**: Do file and variable names follow a consistent pattern (e.g., `service.ts`, `component.tsx`, `camelCase`)?

## 5. Testing Strategy

- [ ] **Unit Tests**: Coverage for all utility functions and core service logic.
- [ ] **Integration Tests**: Tests for critical user flows (e.g., Login, Checkout).
- [ ] **E2E Tests**: High-level browser tests for happy paths.
- [ ] **Mocking**: Are external dependencies (API, Storage) properly mocked in tests?

## 6. Error Handling & Reliability

- [ ] **Global Boundary**: Is there a global error boundary for UI crashes?
- [ ] **Service Recovery**: Do services handle network failures gracefully (retries, fallbacks)?
- [ ] **Logging**: Are errors logged to a centralized service (`LoggerService`)?
