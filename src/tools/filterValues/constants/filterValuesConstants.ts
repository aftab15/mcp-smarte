/**
 * Filter Values Constants
 * Contains error messages, success messages, and constraints for filter values operations
 */

/**
 * API Endpoints for filter values
 */
export const FILTER_VALUES_ENDPOINTS = {
  VECTOR_SEARCH: "/queryservice/v1/vectorstore/filter-search",
} as const;

/**
 * Error messages for filter values operations
 */
export const FILTER_VALUES_ERRORS = {
  MISSING_AUTH: "Authorization header is required",
  EMPTY_VALUE: "Search value cannot be empty",
  INVALID_TYPE: "Invalid filter type. Must be one of: INDUSTRY, TECHNOGRAPHICS_PRODUCT, TECHNOGRAPHICS_CATEGORY, TECHNOGRAPHICS_VENDOR",
  VALIDATION_FAILED: "Request validation failed",
  FAILED_RETRIEVE: "Failed to retrieve filter values",
  INVALID_TOP_K: "top_k must be a positive integer",
} as const;

/**
 * Success messages for filter values operations
 */
export const FILTER_VALUES_SUCCESS = {
  SEARCH_COMPLETED: "Filter values search completed successfully",
} as const;

/**
 * Constraints for filter values operations
 */
export const FILTER_VALUES_CONSTRAINTS = {
  MAX_VALUE_LENGTH: 500,
  MIN_TOP_K: 1,
  MAX_TOP_K: 100,
  DEFAULT_TOP_K: 5,
} as const;
