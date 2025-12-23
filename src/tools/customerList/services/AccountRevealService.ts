import { config } from "../../../config/config";
import { makePOSTRequest } from "../../../services/http";
import { AccountRevealRequest } from "../request/accountRevealRequestSchema";
import {
  ACCOUNT_REVEAL_ENDPOINTS,
  ACCOUNT_REVEAL_ERRORS,
  ACCOUNT_REVEAL_CONSTRAINTS,
} from "../constants/accountRevealConstants";
import { ValidationResult } from "../types/accountRevealTypes";

/**
 * Account Reveal Service
 * Handles account reveal operations and API interactions
 */
export class AccountRevealService {
  /**
   * Execute account reveal API call
   * @param requestBody - Request payload containing company GUIDs and reveal metadata
   * @param headers - Request headers including authorization
   * @returns API response data with revealed account information
   */
  public static async executeAccountReveal(
    requestBody: AccountRevealRequest,
    headers: Record<string, string>
  ): Promise<unknown> {
    const url = config.appGatewayUrl + ACCOUNT_REVEAL_ENDPOINTS.REVEAL;

    console.log(
      "Account Reveal Request:",
      JSON.stringify(
        {
          url,
          compGuidCount: requestBody.data.compGuids.length,
          compGuids: requestBody.data.compGuids,
          type: requestBody.data.type,
          revealSource: requestBody.data.revealSource,
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );

    const data = await makePOSTRequest<unknown>(url, requestBody, headers);
    return data;
  }

  /**
   * Validate account reveal request data
   * @param requestBody - Request payload to validate
   * @returns Validation result with isValid flag and error messages
   */
  public static validateRequest(
    requestBody: AccountRevealRequest
  ): ValidationResult {
    const errors: string[] = [];

    // Check if data object exists
    if (!requestBody.data) {
      errors.push(ACCOUNT_REVEAL_ERRORS.VALIDATION_FAILED);
      return { isValid: false, errors };
    }

    // Validate type
    if (
      !requestBody.data.type ||
      !["EXISTING", "NEW"].includes(requestBody.data.type)
    ) {
      errors.push(ACCOUNT_REVEAL_ERRORS.INVALID_TYPE);
    }

    // Validate reveal source
    if (
      !requestBody.data.revealSource ||
      requestBody.data.revealSource.trim() === ""
    ) {
      errors.push(ACCOUNT_REVEAL_ERRORS.MISSING_REVEAL_SOURCE);
    }

    // Check if compGuids array exists and has items
    if (
      !requestBody.data.compGuids ||
      requestBody.data.compGuids.length === 0
    ) {
      errors.push(ACCOUNT_REVEAL_ERRORS.EMPTY_COMP_GUIDS);
    }

    // Validate each company GUID
    if (requestBody.data.compGuids) {
      requestBody.data.compGuids.forEach((compGuid: string, index: number) => {
        if (!compGuid || compGuid.trim() === "") {
          errors.push(`Missing or empty company GUID at index ${index}`);
        }
      });

      // Check max limit
      if (
        requestBody.data.compGuids.length >
        ACCOUNT_REVEAL_CONSTRAINTS.MAX_COMP_GUIDS
      ) {
        errors.push(
          `Too many company GUIDs. Maximum allowed is ${ACCOUNT_REVEAL_CONSTRAINTS.MAX_COMP_GUIDS}`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
