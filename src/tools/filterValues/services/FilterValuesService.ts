import { config } from "../../../config/config";
import { makePOSTRequest } from "../../../services/http";
import { FilterValuesRequest } from "../request/filterValuesRequestSchema";
import {
  FILTER_VALUES_ERRORS,
  FILTER_VALUES_CONSTRAINTS,
  FILTER_VALUES_ENDPOINTS,
} from "../constants/filterValuesConstants";
import { ValidationResult } from "../types/filterValuesTypes";

/**
 * Filter Values Service
 * Handles filter values search operations and API interactions
 */
export class FilterValuesService {
  /**
   * Execute filter values search API call
   * @param requestBody - Request payload containing search criteria
   * @param headers - Request headers including authorization
   * @returns API response data with filter values
   */
  public static async executeFilterValuesSearch(
    requestBody: FilterValuesRequest,
    headers: Record<string, string>
  ): Promise<unknown> {
    const url = config.appGatewayUrl + FILTER_VALUES_ENDPOINTS.VECTOR_SEARCH;
    // const url = "http://localhost:3001" + FILTER_VALUES_ENDPOINTS.VECTOR_SEARCH;

    const apiPayload = {
      data: {
        value: requestBody.data.value,
      },
      type: requestBody.type,
      top_k: requestBody.top_k || FILTER_VALUES_CONSTRAINTS.DEFAULT_TOP_K,
    };

    console.log(
      "Filter Values Search Request:",
      JSON.stringify(
        {
          url,
          searchValue: requestBody.data.value,
          filterType: requestBody.type,
          topK: apiPayload.top_k,
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );

    headers["token-payload"] = JSON.stringify({
      user: {
        id: 2542,
        account: {
          id: 182,
          name: "Qa new org 2022",
          status: "active",
          accountDetails: {
            piId: "ED5ABE80D6B311ECA46C85D077967E5A",
            indexPrefix: "cci_qa_new_org_2022_182",
            ssoEnabled: false,
          },
          client: { id: 179, name: "Qa new org 2022", status: "active" },
          cmsSubscription: {
            status: "active",
            subscriptionsId: "cf13f1e4-17da-488d-ba57-f8e497ee615b",
          },
          unifyIntDetails: {
            customerName: "Qa new org 2022",
            authToken: "3afb654c2e",
            idPID: "67e53aec01c61c197066de89",
          },
          accountConfiguration: {
            erActive: false,
            ddlActive: false,
            accessDownloads: true,
            accessTargetList: true,
            accessSuppressionList: true,
            accessPreviouslyExportedEmails: true,
            integrations: false,
            emailToleranceLevel: "high",
            filterExclusions: "6",
          },
        },
        email: "chetan.patel@smarteinc.com",
        userName: "chetan.patelprod@smarteinc.com",
        firstName: "chetan",
        lastName: "patel",
        designation: "SE",
        status: "active",
        role: { name: "Admin" },
        licenseType: {
          allowBulkDownloads: true,
          hourlyRevealLimit: 0,
          licenseName: "Enterprise",
          monthlyRevealLimit: 0,
        },
        bulkDownload: true,
        ssoEnabled: false,
        defaultOrg: true,
        avatar: {
          largeUrl: "ig-images/Group-342-big.png",
          smallUrl: "ig-images/Group-342.png",
        },
        existingUser: false,
        internal: true,
        userAccess: {
          discover: true,
          datagpt: true,
          enrich: true,
          playbook: false,
        },
      },
      sub: "chetan.patelprod@smarteinc.com",
      iat: 1759917194,
      exp: 1760003594,
    });

    const data = await makePOSTRequest<unknown>(url, apiPayload, headers);
    return data;
  }

  /**
   * Validate filter values request data
   * @param requestBody - Request payload to validate
   * @returns Validation result with isValid flag and error messages
   */
  public static validateRequest(
    requestBody: FilterValuesRequest
  ): ValidationResult {
    const errors: string[] = [];

    // Check if data object exists
    if (!requestBody.data) {
      errors.push(FILTER_VALUES_ERRORS.VALIDATION_FAILED);
      return { isValid: false, errors };
    }

    // Validate search value
    if (!requestBody.data.value || requestBody.data.value.trim() === "") {
      errors.push(FILTER_VALUES_ERRORS.EMPTY_VALUE);
    }

    // Validate value length
    if (
      requestBody.data.value &&
      requestBody.data.value.length > FILTER_VALUES_CONSTRAINTS.MAX_VALUE_LENGTH
    ) {
      errors.push(
        `Search value too long. Maximum ${FILTER_VALUES_CONSTRAINTS.MAX_VALUE_LENGTH} characters allowed`
      );
    }

    // Validate filter type
    if (
      !requestBody.type ||
      ![
        "INDUSTRY",
        "TECHNOGRAPHICS_PRODUCT",
        "TECHNOGRAPHICS_CATEGORY",
        "TECHNOGRAPHICS_VENDOR",
      ].includes(requestBody.type)
    ) {
      errors.push(FILTER_VALUES_ERRORS.INVALID_TYPE);
    }

    // Validate top_k if provided
    if (requestBody.top_k !== undefined) {
      if (
        requestBody.top_k < FILTER_VALUES_CONSTRAINTS.MIN_TOP_K ||
        requestBody.top_k > FILTER_VALUES_CONSTRAINTS.MAX_TOP_K
      ) {
        errors.push(
          `top_k must be between ${FILTER_VALUES_CONSTRAINTS.MIN_TOP_K} and ${FILTER_VALUES_CONSTRAINTS.MAX_TOP_K}`
        );
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
