/**
 * Simple logging utility
 */

import { config } from "../config/config";

type LogLevel = "info" | "warn" | "error" | "debug";

export class Logger {
  private requestId?: string;

  constructor(requestId?: string) {
    this.requestId = requestId;
  }

  private format(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const prefix = this.requestId ? `[${this.requestId}]` : "";
    const dataStr = data ? ` ${JSON.stringify(data)}` : "";
    return `${timestamp} ${level.toUpperCase()} ${prefix} ${message}${dataStr}`;
  }

  info(message: string, data?: any): void {
    console.log(this.format("info", message, data));
  }

  warn(message: string, data?: any): void {
    console.warn(this.format("warn", message, data));
  }

  error(message: string, data?: any): void {
    console.error(this.format("error", message, data));
  }

  debug(message: string, data?: any): void {
    if (config.nodeEnv === "development") {
      console.debug(this.format("debug", message, data));
    }
  }
}

// Default logger instance
export const logger = new Logger();
