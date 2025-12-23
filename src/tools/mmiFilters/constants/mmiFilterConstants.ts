/**
 * MMI Filter API Constants
 *
 * MMI Filters are used to search CRM records by name and retrieve
 * recordId and name pairs for populating advanced search filter dropdowns.
 */

/**
 * API Endpoints
 */
export const MMI_FILTER_ENDPOINTS = {
  SALESFORCE_LEAD: "/search/v4/mmi/name/lead",
  SALESFORCE_CONTACT: "/search/v4/mmi/name/contact",
  SALESFORCE_ACCOUNT: "/search/v4/mmi/name/account",
  HUBSPOT_CONTACT: "/search/v4/mmi/name/contact",
  DYNAMICS_LEAD: "/search/v4/mmi/name/lead",
  MARKETO_LEAD: "/search/v4/mmi/name/lead",
} as const;

/**
 * Error Messages
 */
export const MMI_FILTER_ERRORS = {
  MISSING_AUTH: "Missing Authorization header",
  FAILED_RETRIEVE: "Failed to retrieve MMI filter data",
  VALIDATION_FAILED: "Request validation failed",
  EMPTY_VALUE: "Search value cannot be empty",
  INVALID_TYPE:
    "Invalid CRM type. Must be SALESFORCE, HUBSPOT, DYNAMICS, or MARKETO",
  INVALID_PAGE_SIZE: "Page size must be a positive integer",
  INVALID_PAGE_NO: "Page number must be a positive integer",
} as const;

/**
 * Success Messages
 */
export const MMI_FILTER_SUCCESS = {
  SEARCH_COMPLETE: "MMI filter search completed successfully",
} as const;

/**
 * Validation Constraints
 */
export const MMI_FILTER_CONSTRAINTS = {
  MIN_VALUE_LENGTH: 1,
  MAX_VALUE_LENGTH: 200,
  MIN_PAGE_SIZE: 1,
  MAX_PAGE_SIZE: 100,
  DEFAULT_PAGE_SIZE: 50,
  DEFAULT_PAGE_NO: 1,
} as const;

/**
 * CRM Type Mappings
 */
export const CRM_TYPE_ENDPOINTS = {
  SALESFORCE: MMI_FILTER_ENDPOINTS.SALESFORCE_LEAD,
  HUBSPOT: MMI_FILTER_ENDPOINTS.HUBSPOT_CONTACT,
  DYNAMICS: MMI_FILTER_ENDPOINTS.DYNAMICS_LEAD,
  MARKETO: MMI_FILTER_ENDPOINTS.MARKETO_LEAD,
} as const;
