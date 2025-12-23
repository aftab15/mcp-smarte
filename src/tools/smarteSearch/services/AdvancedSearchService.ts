import { config } from "../../../config/config";
import { makePOSTRequest } from "../../../services/http";
import { AdvancedSearchToolInput } from "../request/advanvedSearchRequestSchema";
import { DataInsightRequestToolInput } from "../request/DataInsightRequestSchemas";

/**
 * Advanced Search Service
 * Handles all advanced search, search count, and data insights operations
 */
export class AdvancedSearchService {
  /**
   * Execute advanced search API call
   * @param requestBody - Request payload
   * @param headers - Request headers including authorization
   * @returns API response data
   */
  public static async executeAdvancedSearch(
    requestBody: AdvancedSearchToolInput,
    headers: Record<string, string>
  ): Promise<unknown> {
    const url = config.appGatewayUrl + "/search/v4/advanced-search";

    console.log(
      "Advanced Search Request Body:",
      JSON.stringify(requestBody, null, 2)
    );

    const data = await makePOSTRequest<unknown>(url, requestBody, headers);
    return data;
  }

  /**
   * Execute advanced search count API call
   * @param requestBody - Request payload
   * @param headers - Request headers including authorization
   * @returns API response data
   */
  public static async executeAdvancedSearchCount(
    requestBody: AdvancedSearchToolInput,
    headers: Record<string, string>
  ): Promise<unknown> {
    const url = config.appGatewayUrl + "/search/v4/advanced-search-count";

    console.log(
      "Advanced Search Count Request Body:",
      JSON.stringify(requestBody, null, 2)
    );

    const data = await makePOSTRequest<unknown>(url, requestBody, headers);
    return data;
  }

  /**
   * Execute data insights API call
   * @param requestBody - Request payload
   * @param headers - Request headers including authorization
   * @returns API response data
   */
  public static async executeDataInsights(
    requestBody: DataInsightRequestToolInput,
    headers: Record<string, string>
  ): Promise<unknown> {
    const url = config.appGatewayUrl + "/search/v4/data-insights";

    console.log(
      "Data Insights Request Body:",
      JSON.stringify(requestBody, null, 2)
    );

    const data = await makePOSTRequest<unknown>(url, requestBody, headers);
    return data;
  }
}
