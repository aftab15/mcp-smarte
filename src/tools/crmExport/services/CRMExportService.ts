/**
 * CRM Export Service
 *
 * @module crmExport/services
 * @description Enterprise-grade service for CRM export operations
 * Implements separation of concerns, dependency injection ready,
 * and comprehensive error handling
 */

import { config } from "../../../config/config";
import { makeGETRequest, makePOSTRequest } from "../../../services/http";
import { CRMExportRequest, CRMType } from "../request/crmExportRequestSchema";
import {
  CRM_EXPORT_ERRORS,
  CRM_EXPORT_CONSTRAINTS,
  CRM_EXPORT_ENDPOINTS,
  CRM_TYPES,
} from "../constants/crmExportConstants";
import { ValidationResult, CRMExportResponse } from "../types/crmExportTypes";
import { ContactRevealService } from "../../customerList/services/ContactRevealService";

/**
 * Interface for contact reveal API response
 */
interface ContactRevealResponse {
  data: {
    [conGUID: string]: object;
  };
}

/**
 * Interface for export verification API response
 */
interface ExportVerificationResponse {
  statusCode: number;
  errorMessage?: string;
  data?: unknown;
  smarteData?: unknown;
  recordId?: string;
}

/**
 * Interface for connector permissions API response
 */
interface ConnectorPermissionsResponse {
  isBaseConnectorConfiguredByIH: boolean;
  lead_status: boolean; // bulk export
  integrationId: string;
  contact_status: boolean;
  account_status: boolean;
  connector_name: string;
  lead: boolean; // single export for LEAD
  base_crm_lead: boolean;
  connection_name: string;
  accounts_and_contacts: boolean; // single export for CONTACT
  base_crm_contact: boolean;
  data_sync_status: boolean;
  base_crm_account: boolean;
  account: boolean; // account export
}

/**
 * Interface for connector API response
 */
interface ConnectorResponse {
  tenantId: number;
  tenantUserId: number;
  responseLists: Array<{
    connectorId: string;
    connectorName: string;
    integrationUrl: string;
    status: boolean;
    authenticationType: number;
    superStatus: boolean;
  }>;
  errorCode: number;
}

/**
 * Interface for export request payload
 */
interface ExportRequestPayload {
  connectorName: CRMType;
  connectorId: string;
  data: {};
  dataPrime: object;
  assetType: string;
}

/**
 * Interface for logging metadata
 */
interface ExportLogMetadata {
  url: string;
  crmType: CRMType;
  assetType: string;
  conGUID: string;
  timestamp: string;
  requestId?: string;
}

/**
 * CRM Export Service
 * @description Handles CRM export operations with enterprise patterns:
 * - Single Responsibility: Each method has one clear purpose
 * - Open/Closed: Extensible for new CRM types without modification
 * - Dependency Inversion: Depends on abstractions (config, http service)
 */
export class CRMExportService {
  /**
   * Builds the API request payload
   * @param requestBody - The validated request body
   * @returns Structured payload for API call
   * @private
   */
  private static async buildExportPayload(
    requestBody: CRMExportRequest,
    headers: Record<string, string>
  ): Promise<ExportRequestPayload> {
    const connectorId = await this.getConnectorId(
      requestBody.exportCRM,
      headers
    );

    // Verify export permissions for the asset type
    await this.verifyExportPermission(
      connectorId,
      requestBody.assetType,
      headers
    );

    // Fetch contact reveal data for dataPrime
    const dataPrime = await this.getContactRevealData(
      requestBody.data.conGUID,
      headers
    );

    const exportRequestPayload = {
      data: {},
      dataPrime,
      connectorId,
      connectorName: requestBody.exportCRM,
      assetType: requestBody.assetType,
    };

    // Verify if export is allowed (check for duplicates)
    await this.verifyExportEligibility(exportRequestPayload, headers);

    return exportRequestPayload;
  }

  /**
   * Verifies if the export is allowed (checks for duplicate data)
   * @param payload - The export request payload
   * @param headers - Request headers including authorization
   * @throws Error if export verification fails or data already exists
   * @private
   */
  private static async verifyExportEligibility(
    payload: ExportRequestPayload,
    headers: Record<string, string>
  ): Promise<void> {
    try {
      const url = `${config.appGatewayUrl}${CRM_EXPORT_ENDPOINTS.CRM_EXPORT_VERIFICATION}`;

      console.log(
        `[CRM Export] Verifying export eligibility for ${payload.assetType}`
      );

      const response = await makePOSTRequest<ExportVerificationResponse>(
        url,
        payload,
        headers
      );

      // Check if response is an HTTP error
      if (!response) {
        throw new Error(CRM_EXPORT_ERRORS.EXPORT_VERIFICATION_FAILED);
      }

      // Check if it's an error response object
      if (typeof response === "object" && "isError" in response) {
        throw new Error(CRM_EXPORT_ERRORS.EXPORT_VERIFICATION_FAILED);
      }

      const verificationResponse = response as ExportVerificationResponse;

      // Check if status is 201 (allowed to export)
      if (verificationResponse.statusCode === 201) {
        console.log(`[CRM Export] Export allowed - status 201 (new export)`);
        return;
      }

      // If status is not 201, data already exists
      const errorMsg = `${CRM_EXPORT_ERRORS.EXPORT_NOT_ALLOWED}. Status: ${
        verificationResponse.statusCode
      }${
        verificationResponse.errorMessage
          ? `, Message: ${verificationResponse.errorMessage}`
          : ""
      }`;
      console.warn(`[CRM Export] ${errorMsg}`);
      throw new Error(errorMsg);
    } catch (error) {
      // Re-throw the error to be handled by the caller
      throw error;
    }
  }

  /**
   * Verifies if the user has permission to export the requested asset type
   * @param connectorId - The connector ID for the CRM
   * @param assetType - The asset type to verify (LEAD or CONTACT)
   * @param headers - Request headers including authorization
   * @throws Error if permission check fails or user doesn't have permission
   * @private
   */
  private static async verifyExportPermission(
    connectorId: string,
    assetType: string,
    headers: Record<string, string>
  ): Promise<void> {
    try {
      const url = `${config.appGatewayUrl}${CRM_EXPORT_ENDPOINTS.CRM_EXPORT_INTEGRATION_STATUS}`;

      console.log(
        `[CRM Export] Verifying export permission for asset type: ${assetType}`
      );

      const response = await makeGETRequest<ConnectorPermissionsResponse>(
        url,
        headers
      );

      if (!response) {
        throw new Error(CRM_EXPORT_ERRORS.PERMISSION_CHECK_FAILED);
      }

      // Check permission based on asset type
      let hasPermission = false;
      if (assetType === "LEAD") {
        hasPermission = response.lead === true;
      } else if (assetType === "CONTACT") {
        hasPermission = response.accounts_and_contacts === true;
      }

      if (!hasPermission) {
        const errorMsg = `${
          CRM_EXPORT_ERRORS.PERMISSION_DENIED
        }. Asset type: ${assetType}, Permission: ${
          assetType === "LEAD" ? "lead" : "accounts_and_contacts"
        } = ${
          assetType === "LEAD" ? response.lead : response.accounts_and_contacts
        }`;
        console.error(`[CRM Export] ${errorMsg}`);
        throw new Error(errorMsg);
      }

      console.log(
        `[CRM Export] Permission verified successfully for ${assetType}`
      );
    } catch (error) {
      // Re-throw the error to be handled by the caller
      throw error;
    }
  }

  /**
   * Fetches contact reveal data and extracts the object for the given conGUID
   * @param conGUID - Contact GUID to reveal
   * @param headers - Request headers including authorization
   * @returns The contact reveal object for dataPrime
   * @throws Error if contact reveal fails
   * @private
   */
  private static async getContactRevealData(
    conGUID: string,
    headers: Record<string, string>
  ): Promise<object> {
    try {
      // Build request payload for contact reveal
      const revealRequest = {
        data: [
          {
            conGuid: conGUID,
            compGuid: "", // You may need to pass this if required
          },
        ],
      };

      console.log(
        `[CRM Export] Fetching contact reveal data for conGUID: ${conGUID}`
      );

      // Call contact reveal service
      const response = await ContactRevealService.executeContactReveal(
        revealRequest,
        headers
      );

      // Extract the object from response structure: {"data":{"<conGUID>":{object}}}
      if (
        response &&
        typeof response === "object" &&
        "data" in response &&
        response.data
      ) {
        const responseData = response as ContactRevealResponse;
        const contactData = responseData.data[conGUID];

        if (contactData) {
          console.log(
            `[CRM Export] Successfully retrieved contact reveal data for ${conGUID}`
          );
          return contactData;
        }
      }

      console.warn(
        `[CRM Export] No contact data found for conGUID: ${conGUID}`
      );
      return {};
    } catch (error) {
      console.error(`[CRM Export] Error fetching contact reveal data:`, error);
      // Return empty object instead of throwing to allow export to continue
      return {};
    }
  }

  /**
   * Fetches connector ID from API based on CRM type
   * @param connectorName - The CRM type (e.g., SALESFORCE)
   * @param headers - Request headers including authorization
   * @returns The connector ID for the specified CRM
   * @throws Error if connector not found or API fails
   * @private
   */
  private static async getConnectorId(
    connectorName: CRMType,
    headers: Record<string, string>
  ): Promise<string> {
    const url = `${config.appGatewayUrl}${CRM_EXPORT_ENDPOINTS.CRM_EXPORT_CONNECTOR_ID}`;
    const response = await makeGETRequest<ConnectorResponse>(url, headers);

    if (!response || !response.responseLists) {
      throw new Error(
        `Failed to fetch connector information for ${connectorName}`
      );
    }

    // Find the connector matching the requested CRM type
    const connector = response.responseLists.find(
      (item) =>
        item.connectorName === connectorName &&
        (item.status || item.superStatus)
    );

    if (!connector) {
      throw new Error(
        `Connector not found for ${connectorName}. Require to reconfigure the connector. Available configured connectors: ${response.responseLists
          .filter((item) => item.status || item.superStatus)
          .map((c) => c.connectorName)
          .join(
            ", "
          )}. To configure the connector, folloe the steps - 1. login to SMARTe platform using Admin account -> go to Admin Console -> go to Integrations -> click on Connect button with respected CRM type. `
      );
    }

    console.log(
      `[CRM Export] Found connector ID for ${connectorName}: ${connector.connectorId}`
    );

    return connector.connectorId;
  }

  /**
   * Creates structured logging metadata
   * @param url - The API endpoint URL
   * @param requestBody - The request body
   * @returns Logging metadata object
   * @private
   */
  private static createLogMetadata(
    url: string,
    requestBody: CRMExportRequest
  ): ExportLogMetadata {
    return {
      url,
      crmType: requestBody.exportCRM,
      assetType: requestBody.assetType,
      conGUID: requestBody.data.conGUID,
      timestamp: new Date().toISOString(),
      requestId: Math.random().toString(36).substring(2, 11),
    };
  }

  /**
   * Logs export request with structured data
   * @param metadata - The logging metadata
   * @private
   */
  private static logExportRequest(metadata: ExportLogMetadata): void {
    console.log(
      `[CRM Export] [${metadata.requestId}] Initiating Salesforce export:`,
      JSON.stringify(
        {
          crmType: metadata.crmType,
          assetType: metadata.assetType,
          conGUID: metadata.conGUID,
          timestamp: metadata.timestamp,
        },
        null,
        2
      )
    );
  }

  /**
   * Execute CRM export API call
   * @param requestBody - Request payload containing export criteria
   * @param headers - Request headers including authorization
   * @returns API response data with export result or HTTP error
   */
  public static async executeCRMExport(
    requestBody: CRMExportRequest,
    headers: Record<string, string>
  ): Promise<unknown> {
    // Build endpoint URL
    const url = `${config.appGatewayUrl}${CRM_EXPORT_ENDPOINTS.CRM_EXPORT_ENDPOINTS}`;

    // Build API payload
    const apiPayload = await this.buildExportPayload(requestBody, headers);

    // Create and log metadata
    const logMetadata = this.createLogMetadata(url, requestBody);
    this.logExportRequest(logMetadata);

    // Execute API call
    const response = await makePOSTRequest<unknown>(url, apiPayload, headers);

    if (response) {
      console.log(
        `[CRM Export] [${logMetadata.requestId}] Export completed successfully`
      );
    }

    return response;
  }

  /**
   * Validates GUID format and length
   * @param guid - The GUID to validate
   * @param guidType - Type of GUID (for error messages)
   * @returns Array of validation errors (empty if valid)
   * @private
   */
  private static validateGUIDFormat(
    guid: string | undefined,
    guidType: "conGUID" | "compGUID"
  ): string[] {
    const errors: string[] = [];

    if (!guid) {
      return errors;
    }

    if (guid.trim().length === 0) {
      errors.push(`${guidType} cannot be empty or whitespace only`);
      return errors;
    }

    if (guid.length < CRM_EXPORT_CONSTRAINTS.MIN_GUID_LENGTH) {
      errors.push(
        `${guidType} must be at least ${CRM_EXPORT_CONSTRAINTS.MIN_GUID_LENGTH} characters (current: ${guid.length})`
      );
    }

    if (guid.length > CRM_EXPORT_CONSTRAINTS.MAX_GUID_LENGTH) {
      errors.push(
        `${guidType} must not exceed ${CRM_EXPORT_CONSTRAINTS.MAX_GUID_LENGTH} characters (current: ${guid.length})`
      );
    }

    return errors;
  }

  /**
   * Validates CRM type
   * @param crmType - The CRM type to validate
   * @returns Array of validation errors (empty if valid)
   * @private
   */
  private static validateCRMType(crmType: string): string[] {
    const validTypes = Object.values(CRM_TYPES);
    if (!validTypes.includes(crmType as any)) {
      return [
        `${CRM_EXPORT_ERRORS.INVALID_CRM_TYPE}. Valid types: ${validTypes.join(
          ", "
        )}`,
      ];
    }
    return [];
  }

  /**
   * Validates asset type compatibility with CRM type
   * @param crmType - The CRM type (SALESFORCE)
   * @param assetType - The asset type
   * @returns Array of validation errors (empty if valid)
   * @private
   */
  private static validateAssetTypeCompatibility(
    crmType: CRMType,
    assetType: string
  ): string[] {
    if (!["LEAD", "CONTACT"].includes(assetType)) {
      return [CRM_EXPORT_ERRORS.SALESFORCE_ASSET_MISMATCH];
    }
    return [];
  }

  /**
   * Validates required GUID presence
   * @param conGUID - Contact GUID
   * @returns Array of validation errors (empty if valid)
   * @private
   */
  private static validateRequiredGUID(conGUID: string): string[] {
    if (!conGUID || conGUID.trim() === "") {
      return [CRM_EXPORT_ERRORS.CONTACT_GUID_REQUIRED];
    }
    return [];
  }

  /**
   * Validate CRM export request data with comprehensive business rules
   * @param requestBody - Request payload to validate
   * @returns Validation result with isValid flag and detailed error messages
   * @description Performs multi-layer validation:
   * 1. Structural validation (data object exists)
   * 2. CRM type validation (SALESFORCE)
   * 3. Asset type compatibility validation (LEAD or CONTACT)
   * 4. Required GUID presence validation
   * 5. GUID format and length validation
   */
  public static validateRequest(
    requestBody: CRMExportRequest
  ): ValidationResult {
    const errors: string[] = [];

    // Structural validation
    if (!requestBody.data) {
      return {
        isValid: false,
        errors: [CRM_EXPORT_ERRORS.VALIDATION_FAILED],
      };
    }

    // CRM type validation
    errors.push(...this.validateCRMType(requestBody.exportCRM));

    // Asset type compatibility validation
    errors.push(
      ...this.validateAssetTypeCompatibility(
        requestBody.exportCRM,
        requestBody.assetType
      )
    );

    // Required GUID validation
    errors.push(...this.validateRequiredGUID(requestBody.data.conGUID));

    // GUID format validation
    errors.push(
      ...this.validateGUIDFormat(requestBody.data.conGUID, "conGUID")
    );

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
