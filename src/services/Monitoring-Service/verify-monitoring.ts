import { monitoringService } from "./monitoringService";
import { envConfigService } from "../Environment-Config-Service/environmentConfigService";

// Mock dependencies
// @ts-ignore
global.window = {
  // @ts-ignore
  onerror: null,
  // @ts-ignore
  onunhandledrejection: null,
};
// @ts-ignore
global.PerformanceObserver = class {
  observe() {}
};

console.log("--- Starting Monitoring Service Verification ---");

// 1. Enable Monitoring
// Used a direct cast or mock if possible, but for verification script we need to ensure config is enabled.
// Since we can't easily change the singleton instance of envConfigService loaded from file,
// we rely on the default logic or previous modifications.
// However, if VITE_ENABLE_MONITORING is not set, it defaults to false.
// Let's manually set the "internal" config if possible or just proceed and check logs.
// For this script, we'll assume we can force init or mock the check.

// Force override for test purposes (using any cast to access private if needed, or better,
// just knowing that in this test environment env vars might be undefined = false).
// Let's try to simulate checking enabled state.

// Force override for test purposes
// @ts-ignore
envConfigService.config = {
  ...envConfigService.getAll(),
  enableMonitoring: true,
};

console.log("Is Monitoring Enabled?", envConfigService.get("enableMonitoring"));

// Initialize
monitoringService.init();

// 2. Track Manual Error
console.log("--- Tracking Manual Error ---");
monitoringService.trackError(new Error("Test manual error"), {
  context: "test",
});

// 3. Simulate Global Error
console.log("--- Simulating Global Error ---");
if (typeof window.onerror === "function") {
  window.onerror(
    "Test global error",
    "test.js",
    10,
    20,
    new Error("Global Error Object"),
  );
} else {
  console.log("window.onerror not set!");
}

// 4. Simulate Unhandled Rejection
console.log("--- Simulating Unhandled Rejection ---");
if (typeof window.onunhandledrejection === "function") {
  // @ts-ignore - Mocking event
  window.onunhandledrejection({
    reason: new Error("Unhandled Promise Rejection"),
  });
} else {
  console.log("window.onunhandledrejection not set!");
}

console.log("--- Verification Complete ---");
