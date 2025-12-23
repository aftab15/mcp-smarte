/**
 * Contact Reveal Types
 * Type definitions for contact reveal operations
 */

/**
 * API Response Types
 */
export interface ContactRevealResponse {
  status?: {
    message: string;
    code: number;
  };
  data?: ContactRevealData[];
  error?: string;
}

/**
 * Contact Reveal Data Item in Response
 */
export interface ContactRevealData {
  conGuid: string;
  compGuid: string;
  contactInfo?: ContactInformation;
  companyInfo?: CompanyInformation;
}

/**
 * Contact Information
 */
export interface ContactInformation {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  mobile?: string;
  directDial?: string;
  jobTitle?: string;
  level?: string;
  department?: string;
  linkedInUrl?: string;
  workLocation?: LocationInfo;
}

/**
 * Company Information
 */
export interface CompanyInformation {
  companyName?: string;
  website?: string;
  industry?: string;
  revenue?: string;
  employeeSize?: string;
  headquarters?: LocationInfo;
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
export interface ContactRevealOptions {
  timeout?: number;
  retries?: number;
  validateResponse?: boolean;
}
