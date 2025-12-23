import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  makePOSTRequest,
  isHttpError,
  formatHttpError,
} from "../../services/http";
import { getForwardedHeaders } from "../../context/requestContext";
import { config } from "../../config/config";

export function registerTechnographicsSearchTool(server: McpServer) {
  server.tool(
    "technographics_search",
    `Search for technographic or companies product's data of a company using its GUID.
    
Returns technology stack information with the following details for each product:
- Product: code (P-xxxx) and name
- Vendor: code (V-xxxx) and name
- Category: code (C-xxxx) and name`,
    {
      guid: z
        .string()
        .describe("Company GUID to search technographic data for"),
      searchText: z
        .string()
        .optional()
        .describe("Optional search text filter (default: empty string)"),
      pageSize: z
        .number()
        .optional()
        .describe("Number of results per page (default: 25)"),
      pageNo: z.number().optional().describe("Page number (default: 1)"),
    },
    async ({ guid, searchText, pageSize, pageNo }) => {
      const url = config.appGatewayUrl + "/search/v4/profiles/technographics";

      const requestBody = {
        data: {
          guid: guid,
          search_text: {
            value: searchText || "",
          },
        },
        pagination: {
          page_size: pageSize || 25,
          page_no: pageNo || 1,
        },
      };

      const headers = getForwardedHeaders();

      if (!headers || !headers["Authorization"]) {
        return {
          content: [{ type: "text", text: "Missing Authorization header" }],
        };
      }

      const data = await makePOSTRequest<unknown>(url, requestBody, headers);

      // Check for HTTP error response (e.g., 401 Unauthorized)
      if (isHttpError(data)) {
        return {
          content: [
            {
              type: "text",
              text: formatHttpError(data),
            },
          ],
        };
      }

      if (!data) {
        return {
          content: [
            { type: "text", text: "Failed to retrieve technographics data" },
          ],
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}

export function registerTechnographicsCountTool(server: McpServer) {
  server.tool(
    "technographics_count",
    `Get the count of technographic data for a company using its GUID.
    
Returns the total count of technology entries and related statistics in JSON format.`,
    {
      guid: z.string().describe("Company GUID to get technographic count for"),
      searchText: z
        .string()
        .optional()
        .describe("Optional search text filter (default: empty string)"),
    },
    async ({ guid, searchText }) => {
      const url =
        config.appGatewayUrl + "/search/v4/profiles/technographics-count-all";

      const requestBody = {
        data: {
          guid: guid,
          search_text: {
            value: searchText || "",
          },
        },
      };

      const headers = getForwardedHeaders();

      if (!headers || !headers["Authorization"]) {
        return {
          content: [{ type: "text", text: "Missing Authorization header" }],
        };
      }

      const data = await makePOSTRequest<unknown>(url, requestBody, headers);

      // Check for HTTP error response (e.g., 401 Unauthorized)
      if (isHttpError(data)) {
        return {
          content: [
            {
              type: "text",
              text: formatHttpError(data),
            },
          ],
        };
      }

      if (!data) {
        return {
          content: [
            { type: "text", text: "Failed to retrieve technographics count" },
          ],
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
