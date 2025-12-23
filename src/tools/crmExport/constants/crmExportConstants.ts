/**
 * CRM Export Constants
 * Contains error messages, success messages, and constraints for CRM export operations
 */

/**
 * API Endpoints for CRM export
 */
export const CRM_EXPORT_ENDPOINTS = {
  CRM_EXPORT_ENDPOINTS: "/Integrations/getAddRecordPrime",
  CRM_EXPORT_CONNECTOR_ID: "/Integrations/getStandardUserConnectors",
  CRM_EXPORT_INTEGRATION_STATUS: "/Integrations/integration-status",
  CRM_EXPORT_VERIFICATION: "/Integrations/dedupePrime",
} as const;

/**
 * Error messages for CRM export operations
 */
export const CRM_EXPORT_ERRORS = {
  MISSING_AUTH: "Authorization header is required",
  MISSING_GUID: "Contact GUID (conGUID) is required",
  INVALID_CRM_TYPE: "Invalid CRM type. Must be SALESFORCE",
  INVALID_ASSET_TYPE: "Invalid asset type. Must be LEAD or CONTACT",
  VALIDATION_FAILED: "Request validation failed",
  FAILED_EXPORT: "Failed to export to Salesforce",
  SALESFORCE_ASSET_MISMATCH:
    "For SALESFORCE, assetType must be LEAD or CONTACT",
  CONTACT_GUID_REQUIRED: "conGUID is required for LEAD and CONTACT asset types",
  PERMISSION_DENIED: "You do not have permission to export this asset type",
  PERMISSION_CHECK_FAILED: "Failed to verify export permissions",
  EXPORT_NOT_ALLOWED: "Export not allowed - data already exists in CRM",
  EXPORT_VERIFICATION_FAILED: "Failed to verify export eligibility",
} as const;

/**
 * Success messages for CRM export operations
 */
export const CRM_EXPORT_SUCCESS = {
  EXPORT_COMPLETED: "Salesforce export completed successfully",
  SALESFORCE_EXPORT_SUCCESS: "Successfully exported to Salesforce",
} as const;

/**
 * Constraints for CRM export operations
 */
export const CRM_EXPORT_CONSTRAINTS = {
  MAX_GUID_LENGTH: 100,
  MIN_GUID_LENGTH: 10,
} as const;

/**
 * CRM type mapping
 * Currently only SALESFORCE is supported
 */
export const CRM_TYPES = {
  SALESFORCE: "SALESFORCE",
} as const;

/**
 * Asset type mapping for Salesforce
 * Currently only LEAD and CONTACT are supported
 */
export const ASSET_TYPES = {
  LEAD: "LEAD",
  CONTACT: "CONTACT",
} as const;
