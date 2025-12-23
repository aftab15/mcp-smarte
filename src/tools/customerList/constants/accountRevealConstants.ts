/**
 * Account Reveal API Constants
 */

/**
 * API Endpoints
 */
export const ACCOUNT_REVEAL_ENDPOINTS = {
  REVEAL: "/customer-list/v2/account-list/account-reveal",
} as const;

/**
 * Error Messages
 */
export const ACCOUNT_REVEAL_ERRORS = {
  MISSING_AUTH: "Missing Authorization header",
  FAILED_RETRIEVE: "Failed to retrieve account reveal data",
  VALIDATION_FAILED: "Request validation failed",
  EMPTY_COMP_GUIDS: "At least one company GUID is required",
  INVALID_TYPE: "Invalid reveal type. Must be EXISTING or NEW",
  MISSING_REVEAL_SOURCE: "Missing reveal source",
} as const;

/**
 * Success Messages
 */
export const ACCOUNT_REVEAL_SUCCESS = {
  REVEAL_COMPLETE: "Account reveal completed successfully",
} as const;

/**
 * Validation Constraints
 */
export const ACCOUNT_REVEAL_CONSTRAINTS = {
  MIN_COMP_GUIDS: 1,
  MAX_COMP_GUIDS: 100, // Maximum number of company GUIDs per request
} as const;

/**
 * Default Values
 */
export const ACCOUNT_REVEAL_DEFAULTS = {
  REVEAL_SOURCE: "Employee List",
  TYPE: "EXISTING",
} as const;
