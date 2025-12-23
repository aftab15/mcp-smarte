import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getForwardedHeaders } from "../../context/requestContext";
import {
  ListsFilterRequest,
  ListsFilterRequestSchema,
} from "./request/listsFilterRequestSchema";
import { ListsFilterService } from "./services/ListsFilterService";
import { LISTS_FILTER_ERRORS } from "./constants/listsFilterConstants";

/**
 * Register lists filter tool with MCP server
 * @param server - MCP server instance
 */
export function registerListsFilterTool(server: McpServer) {
  server.tool(
    "lists_filter_value",
    "Search and filter customer lists by type (LEAD or ACCOUNT) with optional search text and pagination. Returns filtered lists with active lists matching the search criteria. Use pagination to navigate through results (pageIndex starts at 1, pageSize max 200).",
    ListsFilterRequestSchema.shape,
    async (params: ListsFilterRequest) => {
      try {
        // Validate request
        const validation = ListsFilterService.validateRequest(params);
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
            content: [{ type: "text", text: LISTS_FILTER_ERRORS.MISSING_AUTH }],
          };
        }

        // Execute API call through service
        const responseData = await ListsFilterService.executeListsFilter(
          params,
          headers
        );

        if (!responseData) {
          return {
            content: [
              { type: "text", text: LISTS_FILTER_ERRORS.FAILED_RETRIEVE },
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
        console.error("Lists Filter Error:", errorMessage);

        return {
          content: [
            {
              type: "text",
              text: `Error in lists filter: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );
}
