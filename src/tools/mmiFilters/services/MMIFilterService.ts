import { config } from "../../../config/config";
import { makePOSTRequest } from "../../../services/http";
import { MMIFilterRequest } from "../request/mmiFilterRequestSchema";
import {
  MMI_FILTER_ERRORS,
  MMI_FILTER_CONSTRAINTS,
} from "../constants/mmiFilterConstants";
import { ValidationResult } from "../types/mmiFilterTypes";

/**
 * MMI Filter Service
 * Handles MMI filter operations and API interactions
 */
export class MMIFilterService {
  /**
   * Execute MMI filter search API call
   * @param requestBody - Request payload containing search criteria
   * @param headers - Request headers including authorization
   * @returns API response data with filtered results
   */
  public static async executeMMIFilterSearch(
    requestBody: MMIFilterRequest,
    headers: Record<string, string>
  ): Promise<unknown> {
    // Get endpoint based on CRM type and entity type
    const entityType = requestBody.data.entityType || "LEAD";
    const endpoint = this.getEndpointForEntity(requestBody.type, entityType);
    const url = config.appGatewayUrl + endpoint;

    // Remove entityType from data object, but keep pagination and other fields
    const { entityType: _, ...dataWithoutEntityType } = requestBody.data;
    const apiPayload = {
      data: dataWithoutEntityType,
      type: requestBody.type,
      ...(requestBody.pagination && { pagination: requestBody.pagination }),
    };

    console.log(
      "MMI Filter Search Request:",
      JSON.stringify(
        {
          url,
          searchValue: requestBody.data.value,
          crmType: requestBody.type,
          entityType: entityType,
          pageSize:
            requestBody.pagination?.page_size ||
            MMI_FILTER_CONSTRAINTS.DEFAULT_PAGE_SIZE,
          pageNo:
            requestBody.pagination?.page_no ||
            MMI_FILTER_CONSTRAINTS.DEFAULT_PAGE_NO,
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );

    const data = await makePOSTRequest<unknown>(url, apiPayload, headers);
    return data;
  }

  /**
   * Get endpoint based on CRM type and entity type
   * @param crmType - Type of CRM system
   * @param entityType - Type of entity (LEAD, CONTACT, ACCOUNT)
   * @returns API endpoint path
   */
  private static getEndpointForEntity(
    crmType: "SALESFORCE" | "HUBSPOT" | "DYNAMICS" | "MARKETO",
    entityType: "LEAD" | "CONTACT" | "ACCOUNT"
  ): string {
    const baseEndpoint = "/search/v4/mmi/name";
    const entityPath = entityType.toLowerCase();
    return `${baseEndpoint}/${entityPath}`;
  }

  /**
   * Validate MMI filter request data
   * @param requestBody - Request payload to validate
   * @returns Validation result with isValid flag and error messages
   */
  public static validateRequest(
    requestBody: MMIFilterRequest
  ): ValidationResult {
    const errors: string[] = [];

    // Check if data object exists
    if (!requestBody.data) {
      errors.push(MMI_FILTER_ERRORS.VALIDATION_FAILED);
      return { isValid: false, errors };
    }

    // Validate search value
    if (!requestBody.data.value || requestBody.data.value.trim() === "") {
      errors.push(MMI_FILTER_ERRORS.EMPTY_VALUE);
    }

    // Validate value length
    if (
      requestBody.data.value &&
      requestBody.data.value.length > MMI_FILTER_CONSTRAINTS.MAX_VALUE_LENGTH
    ) {
      errors.push(
        `Search value too long. Maximum ${MMI_FILTER_CONSTRAINTS.MAX_VALUE_LENGTH} characters allowed`
      );
    }

    // Validate CRM type
    if (
      !requestBody.type ||
      !["SALESFORCE", "HUBSPOT", "DYNAMICS", "MARKETO"].includes(
        requestBody.type
      )
    ) {
      errors.push(MMI_FILTER_ERRORS.INVALID_TYPE);
    }

    // Validate pagination if provided
    if (requestBody.pagination) {
      if (
        requestBody.pagination.page_size !== undefined &&
        (requestBody.pagination.page_size < MMI_FILTER_CONSTRAINTS.MIN_PAGE_SIZE ||
          requestBody.pagination.page_size > MMI_FILTER_CONSTRAINTS.MAX_PAGE_SIZE)
      ) {
        errors.push(
          `Page size must be between ${MMI_FILTER_CONSTRAINTS.MIN_PAGE_SIZE} and ${MMI_FILTER_CONSTRAINTS.MAX_PAGE_SIZE}`
        );
      }

      if (
        requestBody.pagination.page_no !== undefined &&
        requestBody.pagination.page_no < 1
      ) {
        errors.push(MMI_FILTER_ERRORS.INVALID_PAGE_NO);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Get endpoint for specific CRM type and entity type
   * @param crmType - Type of CRM system
   * @param entityType - Type of entity (LEAD, CONTACT, ACCOUNT)
   * @returns API endpoint path
   */
  public static getEndpointForType(
    crmType: "SALESFORCE" | "HUBSPOT" | "DYNAMICS" | "MARKETO",
    entityType: "LEAD" | "CONTACT" | "ACCOUNT" = "LEAD"
  ): string {
    return this.getEndpointForEntity(crmType, entityType);
  }
}
