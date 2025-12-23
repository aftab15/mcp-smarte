/**
 * Application configuration loaded from environment variables
 */

import type { ServerConfig } from "../types";

export const config: ServerConfig = {
  port: parseInt(process.env.PORT || "3000"),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  appGatewayUrl:
    process.env.APP_GATEWAY_URL || "https://testigapp.smarteinc.com",
  enrichLeadUrl:
    process.env.ENRICH_LEAD_URL || "https://api.smarte.pro/v7/enrich",
  enrichAccountUrl:
    process.env.ENRICH_ACCOUNT_URL || "https://api.smarte.pro/v7/enrich",
  userAgent: process.env.USER_AGENT,
};

export const PROJECT_VERSION = "1.0.0";

/**
 * Validate required configuration
 */
export function validateConfig(): void {
  const required = ["port"];

  for (const key of required) {
    if (!config[key as keyof ServerConfig]) {
      throw new Error(`Missing required configuration: ${key}`);
    }
  }
}
