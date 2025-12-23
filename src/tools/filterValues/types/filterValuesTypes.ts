/**
 * Filter Values Types
 * Type definitions for filter values operations
 */

/**
 * Filter type enum values
 */
export type FilterType =
  | "INDUSTRY"
  | "TECHNOGRAPHICS_PRODUCT"
  | "TECHNOGRAPHICS_CATEGORY"
  | "TECHNOGRAPHICS_VENDOR";

/**
 * Filter value result item
 */
export interface FilterValueItem {
  code: string;
  description: string;
}

/**
 * Filter values response structure
 */
export interface FilterValuesResponse {
  data?: FilterValueItem[];
  message?: string;
  status?: string;
  [key: string]: unknown;
}

/**
 * Validation result for filter values requests
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Filter values search options
 */
export interface FilterValuesOptions {
  type: FilterType;
  searchValue: string;
  topK?: number;
}
