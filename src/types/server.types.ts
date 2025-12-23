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
  enrichLeadUrl: string;
  enrichAccountUrl: string;
  userAgent?: string;
}
