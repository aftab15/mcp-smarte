/**
 * Application configuration loaded from environment variables
 */

import type { ServerConfig } from "../types";

export const config: ServerConfig = {
  port: parseInt(process.env.PORT || "3000"),
  nodeEnv: process.env.NODE_ENV || "development",
  corsOrigin: process.env.CORS_ORIGIN || "*",
  appGatewayUrl: process.env.APP_GATEWAY_URL || "",
  enrichUrl: process.env.ENRICH_URL || "",
  enrichApiKey: process.env.ENRICH_API_KEY || "",
  userAgent: process.env.USER_AGENT,
  mcpServerUrl: process.env.MCP_SERVER_URL || "",
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
