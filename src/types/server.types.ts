/**
 * Server configuration and context type definitions
 */

export interface HeaderStore {
  headers: Record<string, string | string[] | undefined>;
}

export interface ServerConfig {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  appGatewayUrl: string;
  enrichUrl: string;
  enrichApiKey: string;
  userAgent?: string;
  mcpServerUrl: string;
}
