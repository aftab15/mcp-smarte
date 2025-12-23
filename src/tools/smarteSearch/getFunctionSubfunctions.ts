import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import {
  CONTACT_FUNCTIONS,
  ContactFunction,
  FUNCTION_NAMES,
} from "./constants/contactFunctions";

/**
 * Request schema for getting subfunctions
 */
const GetSubfunctionsRequestSchema = z.object({
  functionName: z
    .enum(FUNCTION_NAMES)
    .optional()
    .describe(
      "Optional function name to get subfunctions for. If not provided, returns all functions with their subfunctions."
    ),
});

type GetSubfunctionsRequest = z.infer<typeof GetSubfunctionsRequestSchema>;

/**
 * Register get function subfunctions tool with MCP server
 * @param server - MCP server instance
 */
export function registerGetFunctionSubfunctionsTool(server: McpServer) {
  server.tool(
    "get_function_subfunctions",
    "Get available subfunctions for contact functions/departments. Use this tool before filtering by subfunctions to know which subfunctions are available for each function. Returns all functions with their subfunctions if no function name is provided, or subfunctions for a specific function.",
    GetSubfunctionsRequestSchema.shape,
    async (params: GetSubfunctionsRequest) => {
      try {
        // If function name provided, return subfunctions for that function
        if (params.functionName) {
          const func = CONTACT_FUNCTIONS.find(
            (f) =>
              f.name.toLowerCase() === params.functionName?.toLowerCase() ||
              f.name === params.functionName
          );

          if (!func) {
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    {
                      error: `Function "${params.functionName}" not found`,
                      availableFunctions: CONTACT_FUNCTIONS.map((f) => f.name),
                    },
                    null,
                    2
                  ),
                },
              ],
            };
          }

          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    function: func.name,
                    subfunctions: func.subFunction.map((sf) => ({
                      id: sf.id,
                      name: sf.name,
                    })),
                    totalSubfunctions: func.subFunction.length,
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }

        // Return all functions with their subfunctions
        const allFunctions = CONTACT_FUNCTIONS.map((func) => ({
          id: func.id,
          name: func.name,
          subfunctions: func.subFunction.map((sf) => ({
            id: sf.id,
            name: sf.name,
          })),
          totalSubfunctions: func.subFunction.length,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  functions: allFunctions,
                  totalFunctions: allFunctions.length,
                  totalSubfunctions: allFunctions.reduce(
                    (sum, f) => sum + f.totalSubfunctions,
                    0
                  ),
                },
                null,
                2
              ),
            },
          ],
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error("Get Function Subfunctions Error:", errorMessage);

        return {
          content: [
            {
              type: "text",
              text: `Error getting function subfunctions: ${errorMessage}`,
            },
          ],
        };
      }
    }
  );
}
