/**
 * CRM Export Tool Registration
 *
 * @module crmExport
 * @description Registers the CRM export tool with the MCP server
 * Implements clean architecture with proper error handling and validation
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getForwardedHeaders } from "../../context/requestContext";
import { CRMExportService } from "./services/CRMExportService";
import { CRM_EXPORT_ERRORS } from "./constants/crmExportConstants";
import type { CRMExportResponse } from "./types/crmExportTypes";
import {
  CRMExportDataSchema,
  CRMExportRequest,
  CRMExportRequestSchema,
} from "./request/crmExportRequestSchema";

/**
 * Creates an error response
 * @param message - Error message
 * @returns Formatted tool response
 */
function createErrorResponse(message: string) {
  return {
    content: [
      {
        type: "text" as const,
        text: message,
      },
    ],
  };
}

/**
 * Creates a success response
 * @param data - Response data
 * @returns Formatted tool response
 */
function createSuccessResponse(data: unknown) {
  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(data, null, 2),
      },
    ],
  };
}

/**
 * Validates response data
 * @param responseData - The response to validate
 * @returns True if response is valid
 */
function isValidResponse(
  responseData: unknown
): responseData is CRMExportResponse {
  return responseData !== null && responseData !== undefined;
}

/**
 * Register CRM export tool with MCP server
 * @param server - MCP server instance
 * @description Registers the export_to_crm tool with comprehensive validation
 * and error handling following enterprise patterns
 */
export function registerCRMExportTool(server: McpServer): void {
  server.tool(
    "export_to_crm",
    "Export contacts or accounts to CRM systems (Salesforce or Outreach). For Salesforce, you can export as LEAD, ACCOUNT, or CONTACT. For Outreach, you can export as PROSPECT or ACCOUNT. Provide conGUID for contact/lead/prospect exports or compGUID for account exports.",
    CRMExportRequestSchema._def.schema.shape,
    async (params: CRMExportRequest) => {
      try {
        // Step 1: Validate request parameters
        const validation = CRMExportService.validateRequest(params);
        if (!validation.isValid) {
          const errorMessage = `Validation failed: ${validation.errors.join(
            "; "
          )}`;
          console.warn(`[CRM Export Tool] ${errorMessage}`);
          return createErrorResponse(errorMessage);
        }

        // Step 2: Retrieve and validate authorization headers
        const headers = getForwardedHeaders();
        if (!headers || !headers["Authorization"]) {
          console.error("[CRM Export Tool] Missing authorization headers");
          return createErrorResponse(CRM_EXPORT_ERRORS.MISSING_AUTH);
        }

        // Step 3: Execute CRM export through service layer
        const responseData = await CRMExportService.executeCRMExport(
          params,
          headers
        );

        // Step 4: Validate response
        if (!isValidResponse(responseData)) {
          console.error(
            "[CRM Export Tool] Invalid or empty response from service"
          );
          return createErrorResponse(CRM_EXPORT_ERRORS.FAILED_EXPORT);
        }

        // Step 5: Return successful response
        return createSuccessResponse(responseData);
      } catch (error) {
        // Comprehensive error handling
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;

        console.error("[CRM Export Tool] Unhandled error:", {
          message: errorMessage,
          stack: errorStack,
          params: params,
        });

        return createErrorResponse(`CRM export failed: ${errorMessage}`);
      }
    }
  );
}
