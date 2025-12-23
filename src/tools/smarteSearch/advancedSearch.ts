import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getForwardedHeaders } from "../../context/requestContext";
import {
  AdvancedSearchToolInput,
  AdvancedSearchToolSchema,
} from "./request/advanvedSearchRequestSchema";
import {
  DataInsightRequestToolInput,
  DataInsightRequestToolSchema,
} from "./request/DataInsightRequestSchemas";
import { AdvancedSearchService } from "./services/AdvancedSearchService";

export function registerAdvancedSearchTool(server: McpServer) {
  server.tool(
    "advanced_search",
    "Call the advanced lead search POST API with structured parameters to search for contacts or companies based on various filters",
    AdvancedSearchToolSchema.shape,
    async (params: AdvancedSearchToolInput) => {
      try {
        // Get authorization headers
        const headers = getForwardedHeaders();
        if (!headers || !headers["Authorization"]) {
          return {
            content: [{ type: "text", text: "Missing Authorization header" }],
          };
        }

        // Execute API call
        const responseData = await AdvancedSearchService.executeAdvancedSearch(
          params,
          headers
        );

        if (!responseData) {
          return {
            content: [
              { type: "text", text: "Failed to retrieve advanced search data" },
            ],
          };
        }

        return {
          content: [
            { type: "text", text: JSON.stringify(responseData, null, 2) },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error in advanced search: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );

  server.tool(
    "advanced_search_count",
    "Call the advanced search count POST API with structured parameters to search for contacts or companies based on various filters",
    AdvancedSearchToolSchema.shape,
    async (params: AdvancedSearchToolInput) => {
      try {
        // Get authorization headers
        const headers = getForwardedHeaders();
        if (!headers || !headers["Authorization"]) {
          return {
            content: [{ type: "text", text: "Missing Authorization header" }],
          };
        }

        // Execute API call
        const countData =
          await AdvancedSearchService.executeAdvancedSearchCount(
            params,
            headers
          );

        if (!countData) {
          return {
            content: [
              {
                type: "text",
                text: "Failed to retrieve advanced search count data",
              },
            ],
          };
        }

        return {
          content: [{ type: "text", text: JSON.stringify(countData, null, 2) }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error in advanced search count: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );

  // Data Insights Tool
  server.tool(
    "data_insights",
    "Get data insights and breakdown statistics with aggregation levels for contacts or companies based on various filters",
    DataInsightRequestToolSchema.shape,
    async (params: DataInsightRequestToolInput) => {
      try {
        // Get authorization headers
        const headers = getForwardedHeaders();
        if (!headers || !headers["Authorization"]) {
          return {
            content: [{ type: "text", text: "Missing Authorization header" }],
          };
        }

        // Execute API call
        const insightsData = await AdvancedSearchService.executeDataInsights(
          params,
          headers
        );

        if (!insightsData) {
          return {
            content: [
              { type: "text", text: "Failed to retrieve data insights" },
            ],
          };
        }

        return {
          content: [
            { type: "text", text: JSON.stringify(insightsData, null, 2) },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `Error in data insights: ${
                error instanceof Error ? error.message : String(error)
              }`,
            },
          ],
        };
      }
    }
  );
}
