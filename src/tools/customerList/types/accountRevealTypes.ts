/**
 * Account Reveal Types
 * Type definitions for account reveal operations
 */

/**
 * API Response Types
 */
export interface AccountRevealResponse {
  status?: {
    message: string;
    code: number;
  };
  data?: AccountRevealResponseData[];
  error?: string;
}

/**
 * Account Reveal Response Data Item
 */
export interface AccountRevealResponseData {
  compGuid: string;
  accountInfo?: AccountInformation;
  contacts?: ContactSummary[];
}

/**
 * Account Information
 */
export interface AccountInformation {
  companyName?: string;
  website?: string;
  industry?: string;
  revenue?: string;
  revenueRange?: string;
  employeeSize?: string;
  employeeRange?: string;
  headquarters?: LocationInfo;
  foundedYear?: number;
  description?: string;
  linkedInUrl?: string;
  phone?: string;
  technologies?: string[];
}

/**
 * Contact Summary
 */
export interface ContactSummary {
  conGuid?: string;
  fullName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
}

/**
 * Location Information
 */
export interface LocationInfo {
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipcode?: string;
  region?: string;
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
export interface AccountRevealOptions {
  timeout?: number;
  retries?: number;
  validateResponse?: boolean;
}
