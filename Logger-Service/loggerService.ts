import { envConfigService } from "../Environment-Config-Service/environmentConfigService";

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

export class LoggerService {
  private static instance: LoggerService;
  private currentLevel: LogLevel;

  private constructor() {
    const configLevel = envConfigService.get("logLevel");
    this.currentLevel = this.parseLogLevel(configLevel as string);
  }

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  private parseLogLevel(level: string): LogLevel {
    switch (level?.toLowerCase()) {
      case "debug":
        return LogLevel.DEBUG;
      case "info":
        return LogLevel.INFO;
      case "warn":
        return LogLevel.WARN;
      case "error":
        return LogLevel.ERROR;
      case "none":
        return LogLevel.NONE;
      default:
        return LogLevel.INFO;
    }
  }

  private formatMessage(level: string, message: string): string {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
  }

  private log(level: LogLevel, ...args: any[]): void {
    if (level >= this.currentLevel) {
      const levelName = LogLevel[level];
      const message = args[0];
      const rest = args.slice(1);

      const formattedMessage =
        typeof message === "string"
          ? this.formatMessage(levelName, message)
          : message;

      switch (level) {
        case LogLevel.DEBUG:
          console.debug(formattedMessage, ...rest);
          break;
        case LogLevel.INFO:
          console.info(formattedMessage, ...rest);
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage, ...rest);
          break;
        case LogLevel.ERROR:
          console.error(formattedMessage, ...rest);
          break;
      }
    }
  }

  public debug(message: string, ...args: any[]): void {
    this.log(LogLevel.DEBUG, message, ...args);
  }

  public info(message: string, ...args: any[]): void {
    this.log(LogLevel.INFO, message, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    this.log(LogLevel.WARN, message, ...args);
  }

  public error(message: string, ...args: any[]): void {
    this.log(LogLevel.ERROR, message, ...args);
  }

  public setLogLevel(level: LogLevel): void {
    this.currentLevel = level;
  }
}

export const loggerService = LoggerService.getInstance();
