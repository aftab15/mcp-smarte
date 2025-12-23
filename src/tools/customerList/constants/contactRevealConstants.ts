/**
 * Contact Reveal API Constants
 */

/**
 * API Endpoints
 */
export const CONTACT_REVEAL_ENDPOINTS = {
  REVEAL: "/customer-list/v2/reveal/contact-reveal",
} as const;

/**
 * Error Messages
 */
export const CONTACT_REVEAL_ERRORS = {
  MISSING_AUTH: "Missing Authorization header",
  FAILED_RETRIEVE: "Failed to retrieve contact reveal data",
  VALIDATION_FAILED: "Request validation failed",
  EMPTY_DATA: "At least one contact-company GUID pair is required",
  MISSING_CON_GUID: "Missing contact GUID (conGuid)",
  MISSING_COMP_GUID: "Missing company GUID (compGuid)",
} as const;

/**
 * Success Messages
 */
export const CONTACT_REVEAL_SUCCESS = {
  REVEAL_COMPLETE: "Contact reveal completed successfully",
} as const;

/**
 * Validation Constraints
 */
export const CONTACT_REVEAL_CONSTRAINTS = {
  MIN_ITEMS: 1,
  MAX_ITEMS: 100, // Maximum number of items per request
} as const;
