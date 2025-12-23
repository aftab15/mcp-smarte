/**
 * API request and response type definitions
 */

export interface EnrichLeadRequest {
  companyName?: string;
  companyWebAddress?: string;
  recordId?: string;
  contactGuid?: string;
  contactEmail?: string;
  contactUrl?: string;
  contactFullName?: string;
  contactFirstName?: string;
  contactLastName?: string;
}

export interface EnrichAccountRequest {
  companyName?: string;
  companyWebAddress?: string;
  companyLnUrl?: string;
  companyGuid?: string;
  recordId?: string;
}

export interface ApiResponse<T = unknown> {
  status?: {
    message: string;
    requestId: string;
    statusCode: number;
  };
  data?: T;
}
