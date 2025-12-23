import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getForwardedHeaders } from "../../context/requestContext";
import {
  MMIFilterRequest,
  MMIFilterRequestSchema,
} from "./request/mmiFilterRequestSchema";
import { MMIFilterService } from "./services/MMIFilterService";
import { MMI_FILTER_ERRORS } from "./constants/mmiFilterConstants";

/**
 * Register MMI filter tool with MCP server
 * @param server - MCP server instance
 */
export function registerMMIFilterTool(server: McpServer) {
  server.tool(
    "search_mmi_records",
    "Search CRM records by name to get recordId and name pairs for advanced search filters. Used to populate Salesforce lead names, contact names, and account names in advanced search. Returns matching records with recordId and name based on search text.",
    MMIFilterRequestSchema.shape,
    async (params: MMIFilterRequest) => {
      try {
        // Validate request
        const validation = MMIFilterService.validateRequest(params);
        if (!validation.isValid) {
          return {
            content: [
              {
                type: "text",
                text: `Validation errors: ${validation.errors.join(", ")}`,
              },
            ],
          };
        }

        // Get authorization headers
        const headers = getForwardedHeaders();
        if (!headers || !headers["Authorization"]) {
          return {
            content: [
              { type: "text", text: MMI_FILTER_ERRORS.MISSING_AUTH },
            ],
          };
        }

        // Execute API call through service
        const responseData = await MMIFilterService.executeMMIFilterSearch(
          params,
          headers
        );

        if (!responseData) {
          return {
            content: [
              { type: "text", text: MMI_FILTER_ERRORS.FAILED_RETRIEVE },
            ],
          };
        }

        return {
          content: [
            { type: "text", text: JSON.stringify(responseData, null, 2) },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("MMI Filter Error:", errorMessage);

        return {
          content: [
            {
              type: "text",
              text: `Error in MMI filter search: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );
}
