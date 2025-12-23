/**
 * CRM Export Types
 * Type definitions for CRM export operations
 */

/**
 * CRM type enum values
 */
export type CRMType = "SALESFORCE" | "OUTREACH";

/**
 * Salesforce asset type values
 */
export type SalesforceAssetType = "LEAD" | "ACCOUNT" | "CONTACT";

/**
 * Outreach asset type values
 */
export type OutreachAssetType = "PROSPECT" | "ACCOUNT";

/**
 * Combined asset type
 */
export type AssetType = SalesforceAssetType | OutreachAssetType;

/**
 * CRM export result item
 */
export interface CRMExportResult {
  success: boolean;
  message: string;
  exportedId?: string;
  crmType: CRMType;
  assetType: AssetType;
}

/**
 * CRM export response structure
 */
export interface CRMExportResponse {
  data?: CRMExportResult;
  message?: string;
  status?: string;
  [key: string]: unknown;
}

/**
 * Validation result for CRM export requests
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * CRM export options
 */
export interface CRMExportOptions {
  crmType: CRMType;
  assetType: AssetType;
  conGUID?: string;
  compGUID?: string;
}
