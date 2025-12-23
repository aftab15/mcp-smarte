import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getForwardedHeaders } from "../../context/requestContext";
import {
  AccountRevealRequest,
  AccountRevealRequestSchema,
} from "./request/accountRevealRequestSchema";
import { AccountRevealService } from "./services/AccountRevealService";
import { ACCOUNT_REVEAL_ERRORS } from "./constants/accountRevealConstants";

/**
 * Register account reveal tool with MCP server
 * @param server - MCP server instance
 */
export function registerAccountRevealTool(server: McpServer) {
  // @ts-ignore
  server.tool(
    "account_reveal",
    "Reveal comprehensive account information using company GUIDs. Returns detailed company data including contacts, firmographics, and other account information.",
    AccountRevealRequestSchema.shape,
   // @ts-ignore
    async (params: any) => {
      try {
        // Validate request
        const validation = AccountRevealService.validateRequest(params);
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
              { type: "text", text: ACCOUNT_REVEAL_ERRORS.MISSING_AUTH },
            ],
          };
        }

        // Execute API call through service
        const responseData = await AccountRevealService.executeAccountReveal(
          params,
          headers
        );

        if (!responseData) {
          return {
            content: [
              { type: "text", text: ACCOUNT_REVEAL_ERRORS.FAILED_RETRIEVE },
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
        console.error("Account Reveal Error:", errorMessage);

        return {
          content: [
            {
              type: "text",
              text: `Error in account reveal: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );
}
