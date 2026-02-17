import { envConfigService } from "../Environment-Config-Service/environmentConfigService";

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

export interface LogEntry {
  timestamp: string;
  level: string; // "DEBUG" | "INFO" ...
  message: string;
  data?: any[];
}

export interface LogTransport {
  log(entry: LogEntry): void;
}

export class ConsoleTransport implements LogTransport {
  log(entry: LogEntry): void {
    const { timestamp, level, message, data } = entry;
    const args = data && data.length ? data : [];

    const formattedMsg = `[${timestamp}] [${level}] ${message}`;

    switch (level) {
      case "DEBUG":
        console.debug(formattedMsg, ...args);
        break;
      case "INFO":
        console.info(formattedMsg, ...args);
        break;
      case "WARN":
        console.warn(formattedMsg, ...args);
        break;
      case "ERROR":
        console.error(formattedMsg, ...args);
        break;
    }
  }
}

export class LoggerService {
  private static instance: LoggerService;
  private level: LogLevel = LogLevel.INFO;
  private transports: LogTransport[] = [];

  private constructor() {
    this.configureLevel();
    this.transports.push(new ConsoleTransport());
  }

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  private configureLevel() {
    const levelStr = envConfigService.get("logLevel") || "info";
    switch (levelStr.toLowerCase()) {
      case "debug":
        this.level = LogLevel.DEBUG;
        break;
      case "info":
        this.level = LogLevel.INFO;
        break;
      case "warn":
        this.level = LogLevel.WARN;
        break;
      case "error":
        this.level = LogLevel.ERROR;
        break;
      case "none":
        this.level = LogLevel.NONE;
        break;
      default:
        this.level = LogLevel.INFO;
    }
  }

  public addTransport(transport: LogTransport): void {
    this.transports.push(transport);
  }

  public debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, "DEBUG", message, args);
  }

  public info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, "INFO", message, args);
  }

  public warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, "WARN", message, args);
  }

  public error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, "ERROR", message, args);
  }

  private log(
    level: LogLevel,
    levelName: string,
    message: string,
    args: any[],
  ): void {
    if (level < this.level) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: levelName,
      message,
      data: args,
    };

    this.transports.forEach((t) => t.log(entry));
  }
}

export const loggerService = LoggerService.getInstance();
