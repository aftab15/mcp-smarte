/**
 * MMI Filter Types
 * Type definitions for MMI filter operations
 */

/**
 * API Response Types
 */
export interface MMIFilterResponse {
  status?: {
    message: string;
    code: number;
  };
  data?: MMIFilterResultItem[];
  pagination?: PaginationInfo;
  error?: string;
}

/**
 * MMI Filter Result Item
 * Used for populating filter dropdowns in advanced search
 */
export interface MMIFilterResultItem {
  recordId: string; // Unique record identifier for the CRM entity
  name: string; // Display name of the record
}

/**
 * Pagination Information
 */
export interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Validation Result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Service Options
 */
export interface MMIFilterOptions {
  timeout?: number;
  retries?: number;
  validateResponse?: boolean;
}

/**
 * CRM Entity Types
 */
export type CRMEntityType = "LEAD" | "CONTACT" | "ACCOUNT";

/**
 * Search Context
 */
export interface SearchContext {
  searchValue: string;
  crmType: string;
  entityType: CRMEntityType;
  pageSize: number;
  pageNumber: number;
}
