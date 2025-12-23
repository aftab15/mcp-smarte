/**
 * Lists Filter API Constants
 */

/**
 * API Endpoints
 */
export const LISTS_FILTER_ENDPOINTS = {
  LEAD: "/customer-list/v1/lead-list/lead-lists",
  ACCOUNT: "/customer-list/v1/account-list/account-lists",
} as const;

/**
 * Error Messages
 */
export const LISTS_FILTER_ERRORS = {
  MISSING_AUTH: "Missing Authorization header",
  FAILED_RETRIEVE: "Failed to retrieve lists filter data",
  VALIDATION_FAILED: "Request validation failed",
  INVALID_TYPE: "Invalid type. Must be LEAD or ACCOUNT",
  INVALID_PAGINATION: "Invalid pagination parameters",
} as const;

/**
 * Validation Constraints
 */
export const LISTS_FILTER_CONSTRAINTS = {
  MAX_PAGE_SIZE: 200,
  MIN_PAGE_INDEX: 1,
  MIN_PAGE_NO: 1,
  MIN_PAGE_SIZE: 1,
} as const;
