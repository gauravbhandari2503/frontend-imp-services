import { loggerService, LogLevel } from "./loggerService";
import { envConfigService } from "../Environment-Config-Service/environmentConfigService";

// Mock console methods to verify output
const originalConsole = {
  debug: console.debug,
  info: console.info,
  warn: console.warn,
  error: console.error,
};

const mockConsole = {
  debug: 0,
  info: 0,
  warn: 0,
  error: 0,
};

console.debug = (...args) => {
  mockConsole.debug++;
  originalConsole.debug("[MOCKED]", ...args);
};
console.info = (...args) => {
  mockConsole.info++;
  originalConsole.info("[MOCKED]", ...args);
};
console.warn = (...args) => {
  mockConsole.warn++;
  originalConsole.warn("[MOCKED]", ...args);
};
console.error = (...args) => {
  mockConsole.error++;
  originalConsole.error("[MOCKED]", ...args);
};

console.log("--- Starting Verification ---");

// Test 1: Default level (based on environment)
console.log("Current Level:", envConfigService.get("logLevel"));

loggerService.debug("Debug message");
loggerService.info("Info message");
loggerService.warn("Warn message");
loggerService.error("Error message");

// Test 2: Change level to WARN
console.log("--- Changing level to WARN ---");
loggerService.setLogLevel(LogLevel.WARN);

loggerService.debug("Debug message (should not see)");
loggerService.info("Info message (should not see)");
loggerService.warn("Warn message (should see)");
loggerService.error("Error message (should see)");

console.log("--- Verification Complete ---");
console.log("Mock Console Counts:", mockConsole);

// Restore console
console.debug = originalConsole.debug;
console.info = originalConsole.info;
console.warn = originalConsole.warn;
console.error = originalConsole.error;
