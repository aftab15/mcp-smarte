import { config } from "../../../config/config";
import { makePOSTRequest } from "../../../services/http";
import { ContactRevealRequest } from "../request/contactRevealRequestSchema";
import {
  CONTACT_REVEAL_ENDPOINTS,
  CONTACT_REVEAL_ERRORS,
} from "../constants/contactRevealConstants";
import { ValidationResult } from "../types/contactRevealTypes";

/**
 * Contact Reveal Service
 * Handles contact reveal operations and API interactions
 */
export class ContactRevealService {
  /**
   * Execute contact reveal API call
   * @param requestBody - Request payload containing contact and company GUIDs
   * @param headers - Request headers including authorization
   * @returns API response data with revealed contact information
   */
  public static async executeContactReveal(
    requestBody: ContactRevealRequest,
    headers: Record<string, string>
  ): Promise<unknown> {
    const url = config.appGatewayUrl + CONTACT_REVEAL_ENDPOINTS.REVEAL;

    console.log(
      "Contact Reveal Request:",
      JSON.stringify(
        {
          url,
          itemCount: requestBody.data.length,
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );

    const requestPayload = {
      data: requestBody.data,
      revealSource: "Employee List",
      type: "NEW",
    };
    const data = await makePOSTRequest<unknown>(url, requestPayload, headers);
    return data;
  }

  /**
   * Validate contact reveal request data
   * @param requestBody - Request payload to validate
   * @returns Validation result with isValid flag and error messages
   */
  public static validateRequest(
    requestBody: ContactRevealRequest
  ): ValidationResult {
    const errors: string[] = [];

    // Check if data array exists and has items
    if (!requestBody.data || requestBody.data.length === 0) {
      errors.push(CONTACT_REVEAL_ERRORS.EMPTY_DATA);
    }

    // Validate each item in the data array
    requestBody.data?.forEach((item, index) => {
      if (!item.conGuid || item.conGuid.trim() === "") {
        errors.push(
          `${CONTACT_REVEAL_ERRORS.MISSING_CON_GUID} at index ${index}`
        );
      }
      if (!item.compGuid || item.compGuid.trim() === "") {
        errors.push(
          `${CONTACT_REVEAL_ERRORS.MISSING_COMP_GUID} at index ${index}`
        );
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
