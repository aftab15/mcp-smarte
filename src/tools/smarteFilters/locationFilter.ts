import { McpServer } from "@modelcontextprotocol/sdk/server/mcp";
import {
  locationFilterRequest,
  locationFilterRequestSchema,
} from "./request/locationFilterRequestSchema";
import { LocationFilterService } from "./services/locationFilterService";
import { getForwardedHeaders } from "../../context";
import { formatHttpError, isHttpError } from "../../services/http";

export function registerLocationFilterTool(server: McpServer) {
  server.tool(
    "search_location_filter",
    "Search for location filter values (region, country, state, or city) to get name-source pairs for advanced search. Returns similar matching values based on search text that can be used in advanced search filters. Use this to find valid filter name for regions, countries, states, or cities.",
    locationFilterRequestSchema.shape,
    async (params: locationFilterRequest) => {
      try {
        const validation = LocationFilterService.validateRequest(params);
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
            content: [{ type: "text", text: "Missing Authorization header" }],
          };
        }

        const responseData =
          await LocationFilterService.executeLocationFilterSearch(
            params,
            headers
          );

        if (isHttpError(responseData)) {
          return {
            content: [
              {
                type: "text",
                text: formatHttpError(responseData),
              },
            ],
          };
        }

        if (!responseData) {
          return {
            content: [
              { type: "text", text: "Failed to retrieve location filter data" },
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
        console.error("Location Filter Error:", errorMessage);

        return {
          content: [
            {
              type: "text",
              text: `Error in location filter search: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );
}
