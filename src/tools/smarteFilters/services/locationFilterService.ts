import { config } from "../../../config/config";
import { makePOSTRequest } from "../../../services/http";
import { locationFilterRequest } from "../request/locationFilterRequestSchema";
import { ValidationResult } from "../types/locationFilterTypes";

export class LocationFilterService {
  public static validateRequest(
    requestBody: locationFilterRequest
  ): ValidationResult {
    const errors: string[] = [];

    if (!requestBody.data) {
      errors.push(`Missing data`);
      return { isValid: false, errors };
    }

    if (!requestBody.data.value || requestBody.data.value.trim() === "") {
      errors.push(`Missing search value`);
    }

    if (requestBody.data.value && requestBody.data.value.length > 200) {
      errors.push(`Search value too long. Maximum 200 characters allowed`);
    }

    if (requestBody.pagination) {
      if (
        requestBody.pagination.page_size !== undefined &&
        (requestBody.pagination.page_size < 1 ||
          requestBody.pagination.page_size > 100)
      ) {
        errors.push(`Page size must be between 1 and 100`);
      }

      if (
        requestBody.pagination.page_no !== undefined &&
        requestBody.pagination.page_no < 1
      ) {
        errors.push(`Page number must be greater than 0`);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  public static async executeLocationFilterSearch(
    requestBody: locationFilterRequest,
    headers: Record<string, string>
  ): Promise<unknown> {
    const url = config.appGatewayUrl + "/search/v4/generic/location";

    const apiPayload = {
      data: requestBody.data,
      type: "BY_REGION",
      pagination: {
        page_size: requestBody.pagination?.page_size || 50,
        page_no: requestBody.pagination?.page_no || 1,
      },
    };

    console.log(
      "Location Filter Search Request:",
      JSON.stringify(
        {
          url,
          searchValue: requestBody.data.value,
          pageSize: requestBody.pagination?.page_size || 50,
          pageNo: requestBody.pagination?.page_no || 1,
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );

    const data = await makePOSTRequest<unknown>(url, apiPayload, headers);
    return data;
  }
}
