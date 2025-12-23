import { config } from "../../../config/config";
import { makePOSTRequest, HttpResponse } from "../../../services/http";
import {
  ListsFilterRequest,
  ListsFilterResponseSchema,
  ListsFilterType,
} from "../request/listsFilterRequestSchema";
import {
  LISTS_FILTER_ENDPOINTS,
  LISTS_FILTER_ERRORS,
  LISTS_FILTER_CONSTRAINTS,
} from "../constants/listsFilterConstants";

interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Lists Filter Service
 * Handles lists filter operations and API interactions
 */
export class ListsFilterService {
  /**
   * Execute lists filter API call
   * @param requestBody - Request payload containing search and pagination
   * @param headers - Request headers including authorization
   * @returns API response data with filtered lists
   */
  public static async executeListsFilter(
    requestBody: ListsFilterRequest,
    headers: Record<string, string>
  ): Promise<HttpResponse<ListsFilterResponseSchema>> {
    const url = config.appGatewayUrl + LISTS_FILTER_ENDPOINTS[requestBody.type];

    console.log(
      "Lists Filter Request:",
      JSON.stringify(
        {
          url,
          type: requestBody.type,
          searchText: requestBody.data?.searchText ?? "",
          pagination: requestBody.pagination,
          timestamp: new Date().toISOString(),
        },
        null,
        2
      )
    );

    const requestPayload = {
      data: {
        searchText: requestBody.data?.searchText ?? "",
        contentType: "ALL",
      },
      pagination: requestBody.pagination,
      type: "DASHBOARD",
    };

    const data = await makePOSTRequest<ListsFilterResponseSchema>(
      url,
      requestPayload,
      headers
    );

    if (typeof data === "object" && data != null && "error" in data) {
      throw new Error(data.error.message);
    }

    return this.prepareResponse(data, requestBody.type);
  }

  public static prepareResponse(
    response: HttpResponse<ListsFilterResponseSchema>,
    type: ListsFilterType
  ): HttpResponse<ListsFilterResponseSchema> {
    if (!response) {
      return {
        error: {
          status: 500,
          message: LISTS_FILTER_ERRORS.FAILED_RETRIEVE,
        },
      };
    }

    const listsFilterResponse = response as ListsFilterResponseSchema;

    if (listsFilterResponse["status"]["statusCode"] == 200) {
      const data = listsFilterResponse["data"];

      if (type === "LEAD") {
        const leadLists = data["leadLists"];

        // Handle optional leadLists with proper null checking
        if (leadLists && Array.isArray(leadLists)) {
          const responseLists = leadLists
            .filter((listItem) => listItem.listStatus === "active")
            .map((listItem) => {
              return {
                id: listItem.id,
                listName: listItem.listName,
                status: listItem.listStatus,
              };
            });
          listsFilterResponse["data"]["leadLists"] = responseLists;
        }
      }

      if (type === "ACCOUNT") {
        const accountLists = data["accountLists"];

        // Handle optional accountLists with proper null checking
        if (accountLists && Array.isArray(accountLists)) {
          const responseLists = accountLists
            .filter((listItem) => listItem.status === "active")
            .map((listItem) => {
              return {
                id: listItem.id,
                listName: listItem.listName,
                status: listItem.status,
              };
            });
          listsFilterResponse["data"]["accountLists"] = responseLists;
        }
      }
    }

    return response;
  }
  /**
   * Validate lists filter request data
   * @param requestBody - Request payload to validate
   * @returns Validation result with isValid flag and error messages
   */
  public static validateRequest(
    requestBody: ListsFilterRequest
  ): ValidationResult {
    const errors: string[] = [];

    if (!requestBody) {
      return {
        isValid: false,
        errors: [LISTS_FILTER_ERRORS.VALIDATION_FAILED],
      };
    }

    if (!requestBody.type || !["LEAD", "ACCOUNT"].includes(requestBody.type)) {
      errors.push(LISTS_FILTER_ERRORS.INVALID_TYPE);
    }

    const p = requestBody.pagination as any;
    if (!p) {
      errors.push(LISTS_FILTER_ERRORS.INVALID_PAGINATION);
    } else {
      const pageIndex = Number(p.pageIndex ?? p.page_no);
      const page_no = Number(p.page_no ?? p.pageIndex);
      const pageSize = Number(p.pageSize);

      if (
        !Number.isInteger(pageIndex) ||
        pageIndex < LISTS_FILTER_CONSTRAINTS.MIN_PAGE_INDEX
      ) {
        errors.push("Invalid pageIndex");
      }
      if (
        !Number.isInteger(page_no) ||
        page_no < LISTS_FILTER_CONSTRAINTS.MIN_PAGE_NO
      ) {
        errors.push("Invalid page_no");
      }
      if (
        !Number.isInteger(pageSize) ||
        pageSize < LISTS_FILTER_CONSTRAINTS.MIN_PAGE_SIZE ||
        pageSize > LISTS_FILTER_CONSTRAINTS.MAX_PAGE_SIZE
      ) {
        errors.push("Invalid pageSize");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
