export interface ServiceDefinition {
  name: string;
  description: string;
  files: string[];
  dependencies: string[];
  devDependencies: string[];
}

export const REGISTRY: Record<string, ServiceDefinition> = {
  api: {
    name: "API Service",
    description: "Axios wrapper with interceptors and error handling",
    files: [
      "services/API-Service/baseApiService.ts",
      "services/API-Service/csrfAPIService.ts",
    ],
    dependencies: ["axios"],
    devDependencies: [],
  },
  authorization: {
    name: "Authorization Service",
    description: "RBAC with dynamic roles and route guards",
    files: [
      "services/Authorization-Service/permissions.ts",
      "services/Authorization-Service/rbacService.ts",
      "services/Authorization-Service/rolePermissions.ts",
    ],
    dependencies: [],
    devDependencies: [],
  },
  cache: {
    name: "Cache Service",
    description: "Two-layer cache (Memory + IndexedDB) with LRU",
    files: [
      "services/Cache-Service/cacheService.ts",
      "services/Cache-Service/simple-explanation.md",
    ],
    dependencies: ["idb"],
    devDependencies: [],
  },
  date: {
    name: "Date Service",
    description: "Date manipulation wrapper around date-fns",
    files: ["services/Date-Service/dateService.ts"],
    dependencies: ["date-fns", "date-fns-tz"],
    devDependencies: [],
  },
  env: {
    name: "Environment Config",
    description: "Centralized configuration management",
    files: [
      "services/Environment-Config-Service/environmentConfigService.ts",
      "services/Environment-Config-Service/simple-explanation.md",
    ],
    dependencies: [],
    devDependencies: [],
  },
  "feature-flag": {
    name: "Feature Flag Service",
    description: "Remote feature toggles with retry logic",
    files: ["services/Feature-Flag-Service/featureFlagService.ts"],
    dependencies: [],
    devDependencies: [],
  },
  file: {
    name: "File Service",
    description: "File upload (standard/chunked), preview, compression",
    files: [
      "services/File-Service/fileService.ts",
      "services/File-Service/simple-explanation.md",
    ],
    dependencies: [],
    devDependencies: [],
  },
  "google-login": {
    name: "Google Login Service",
    description: "Google Identity Services SDK wrapper",
    files: ["services/Google-Login-Service/googleLoginService.ts"],
    dependencies: [],
    devDependencies: ["@types/google.accounts"],
  },
  logger: {
    name: "Logger Service",
    description: "Structured logging with multiple transports",
    files: [
      "services/Logger-Service/loggerService.ts",
      "services/Logger-Service/simple-explanation.md",
    ],
    dependencies: [],
    devDependencies: [],
  },
  monitoring: {
    name: "Monitoring Service",
    description: "Error tracking and Web Vitals monitoring",
    files: [
      "services/Monitoring-Service/monitoringService.ts",
      "services/Monitoring-Service/simple-explanation.md",
    ],
    dependencies: [],
    devDependencies: [],
  },
  validation: {
    name: "Validation Service",
    description: "Pure TypeScript form validation",
    files: [
      "services/Validation-Service/form.ts",
      "services/Validation-Service/rules.ts",
    ],
    dependencies: [],
    devDependencies: [],
  },
  worker: {
    name: "Worker Service",
    description: "Safe Web Worker execution wrapper",
    files: ["services/Worker-Service/workerService.ts"],
    dependencies: [],
    devDependencies: [],
  },
  storage: {
    name: "Storage Service",
    description: "Wrappers for LocalStorage, SessionStorage, IndexedDB",
    files: [
      "services/Storage-Service/indexedDBService.ts",
      "services/Storage-Service/localStorageService.ts",
      "services/Storage-Service/sessionStorageService.ts",
    ],
    dependencies: ["idb"],
    devDependencies: [],
  },
  graphql: {
    name: "GraphQL Service",
    description: "Client for handling GraphQL queries and mutations",
    files: ["services/GraphQl-Service/graphqlService.ts"],
    dependencies: ["graphql", "graphql-request"],
    devDependencies: [],
  },
  i18n: {
    name: "i18n Service",
    description: "Internationalization service for managing translations",
    files: [
      "services/i18n-Service/i18nService.ts",
      "services/i18n-Service/locales/en.json",
    ],
    dependencies: [],
    devDependencies: [],
  },
  "architecture-reports": {
    name: "Architecture Reports",
    description: "Checklists and guidelines for architectural health",
    files: [
      "services/Architecture-Reports-Service/architecture-checklist.md",
      "services/Architecture-Reports-Service/report-generation-prompt.md",
    ],
    dependencies: [],
    devDependencies: [],
  },
  "security-reports": {
    name: "Security Reports",
    description: "Security best practices and audit guides",
    files: [
      "services/Security-Reports-Service/security-checklist.md",
      "services/Security-Reports-Service/report-generation-prompt.md",
    ],
    dependencies: [],
    devDependencies: [],
  },
};
