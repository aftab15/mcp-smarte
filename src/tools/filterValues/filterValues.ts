import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getForwardedHeaders } from "../../context/requestContext";
import {
  FilterValuesRequest,
  FilterValuesRequestSchema,
} from "./request/filterValuesRequestSchema";
import { FilterValuesService } from "./services/FilterValuesService";
import { FILTER_VALUES_ERRORS } from "./constants/filterValuesConstants";

/**
 * Register filter values tool with MCP server
 * @param server - MCP server instance
 */
export function registerFilterValuesTool(server: McpServer) {
  server.tool(
    "search_filter_values",
    "Search for filter values (industry, technographics product/category/vendor) to get code-description pairs for advanced search. Returns similar matching values based on search text that can be used in advanced search filters. Use this to find valid filter codes for industries, products, categories, or vendors.",
    FilterValuesRequestSchema.shape,
    async (params: FilterValuesRequest) => {
      try {
        // Validate request
        const validation = FilterValuesService.validateRequest(params);
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
              { type: "text", text: FILTER_VALUES_ERRORS.MISSING_AUTH },
            ],
          };
        }

        // Execute API call through service
        const responseData = await FilterValuesService.executeFilterValuesSearch(
          params,
          headers
        );

        if (!responseData) {
          return {
            content: [
              { type: "text", text: FILTER_VALUES_ERRORS.FAILED_RETRIEVE },
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
        console.error("Filter Values Error:", errorMessage);

        return {
          content: [
            {
              type: "text",
              text: `Error in filter values search: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );
}
