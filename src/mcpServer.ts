import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerAdvancedSearchTool } from "./tools/smarteSearch/advancedSearch";
import {
  registerTechnographicsSearchTool,
  registerTechnographicsCountTool,
} from "./tools/smarteSearch/technographics";
import { registerEnrichLeadTool } from "./tools/enrich/enrichLead";
import { registerEnrichAccountTool } from "./tools/enrich/enrichAccount";
import {
  registerContactRevealTool,
  registerAccountRevealTool,
} from "./tools/customerList";
import { registerMMIFilterTool } from "./tools/mmiFilters";
import { registerFilterValuesTool } from "./tools/filterValues";
import { PROJECT_VERSION } from "./config/config";

/**
 * Creates and configures the MCP Server with all registered tools
 */
export function createMcpServer(): McpServer {
  const server = new McpServer({
    name: "SMARTe MCP Server",
    version: PROJECT_VERSION,
    capabilities: {
      resources: {},
      tools: {},
    },
  });

  // Register external tool modules
  registerAdvancedSearchTool(server);
  registerTechnographicsSearchTool(server);
  registerTechnographicsCountTool(server);
  registerEnrichLeadTool(server);
  registerEnrichAccountTool(server);
  registerContactRevealTool(server);
  registerAccountRevealTool(server);
  registerMMIFilterTool(server);
  registerFilterValuesTool(server);

  return server;
}
