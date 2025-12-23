import { config } from "../../../config/config";
import {
  formatHttpError,
  isHttpError,
  makePOSTRequest,
} from "../../../services/http";
import {
  ContactRevealDataItem,
  ContactRevealRequest,
} from "../request/contactRevealRequestSchema";
import {
  CONTACT_REVEAL_ENDPOINTS,
  CONTACT_REVEAL_ERRORS,
} from "../constants/contactRevealConstants";
import {
  ContactRevealedGuidsResponse,
  ValidationResult,
} from "../types/contactRevealTypes";

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

    const existingGuids = await this.verifyExistingContactReveal(
      requestBody.data.map((item) => item.conGuid),
      headers
    );

    const newGuidsRequestData: ContactRevealDataItem[] = [];
    const existingGuidsRequestData: ContactRevealDataItem[] = [];
    requestBody.data.forEach((item) => {
      if (existingGuids[item.conGuid]) {
        existingGuidsRequestData.push(item);
      } else {
        newGuidsRequestData.push(item);
      }
    });

    let responseData: Record<string, unknown> = {};

    if (existingGuidsRequestData.length > 0) {
      const existingGuidsRequestPayload = {
        data: existingGuidsRequestData,
        revealSource: "Employee List",
        type: "EXISTING",
      };
      const existingGuidsResponse = await makePOSTRequest<any>(
        url,
        existingGuidsRequestPayload,
        headers
      );
      if (
        existingGuidsResponse?.status?.statusCode === 200 &&
        existingGuidsResponse?.data
      ) {
        responseData = { ...responseData, ...existingGuidsResponse.data };
      }
    }

    if (newGuidsRequestData.length > 0) {
      const newGuidsRequestPayload = {
        data: newGuidsRequestData,
        revealSource: "Employee List",
        type: "NEW",
      };
      const newGuidsResponse = await makePOSTRequest<any>(
        url,
        newGuidsRequestPayload,
        headers
      );
      if (
        newGuidsResponse?.status?.statusCode === 200 &&
        newGuidsResponse?.data
      ) {
        responseData = { ...responseData, ...newGuidsResponse.data };
      }
    }

    return { data: responseData };
  }

  public static async verifyExistingContactReveal(
    guids: string[],
    headers: Record<string, string>
  ): Promise<Record<string, boolean>> {
    const url =
      config.appGatewayUrl + CONTACT_REVEAL_ENDPOINTS.EXISTING_REVEAL_LIST;

    const response = await makePOSTRequest<ContactRevealedGuidsResponse>(
      url,
      {},
      headers
    );

    if (!response) {
      throw new Error(CONTACT_REVEAL_ERRORS.FAILED_RETRIEVE);
    }

    if (isHttpError(response)) {
      throw new Error(formatHttpError(response));
    }

    const revealedList = response.data?.revealedList;
    return guids.reduce((acc, guid) => {
      acc[guid] = revealedList?.includes(guid) || false;
      return acc;
    }, {} as Record<string, boolean>);
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
