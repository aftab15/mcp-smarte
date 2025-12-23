import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getForwardedHeaders } from "../../context/requestContext";
import {
  ContactRevealRequest,
  ContactRevealRequestSchema,
} from "./request/contactRevealRequestSchema";
import { ContactRevealService } from "./services/ContactRevealService";
import { CONTACT_REVEAL_ERRORS } from "./constants/contactRevealConstants";

/**
 * Register contact reveal tool with MCP server
 * @param server - MCP server instance
 */
export function registerContactRevealTool(server: McpServer) {
  server.tool(
    "contact_reveal",
    "Reveal contact information using contact GUID and company GUID pairs. Returns comprehensive contact details including email, phone, and other information.",
    ContactRevealRequestSchema.shape,
    async (params: ContactRevealRequest) => {
      try {
        // Validate request
        const validation = ContactRevealService.validateRequest(params);
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
            content: [{ type: "text", text: CONTACT_REVEAL_ERRORS.MISSING_AUTH }],
          };
        }

        // Execute API call through service
        const responseData = await ContactRevealService.executeContactReveal(
          params,
          headers
        );

        if (!responseData) {
          return {
            content: [
              { type: "text", text: CONTACT_REVEAL_ERRORS.FAILED_RETRIEVE },
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
        console.error("Contact Reveal Error:", errorMessage);

        return {
          content: [
            {
              type: "text",
              text: `Error in contact reveal: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );
}
