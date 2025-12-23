// Lightweight HTTP helpers used by tools
// Uses global fetch available in Node 18+

import { config } from "../config/config";

/**
 * API error response structure from the backend
 * Example: { status: { statusCode: 4011, message: "...", requestId: "..." } }
 */
interface ApiErrorResponse {
  status: {
    statusCode: number;
    message: string;
    requestId?: string;
  };
}

/**
 * Standardized HTTP error response structure for internal use
 */
export interface HttpErrorResponse {
  error: {
    status: number;
    message: string;
    requestId?: string;
  };
}

/**
 * HTTP response type that can be either success data or an error
 */
export type HttpResponse<T> = T | HttpErrorResponse | null;

/**
 * Type guard to check if response is an HTTP error
 * @param response - Response to check
 * @returns True if response is an HttpErrorResponse
 */
export function isHttpError(response: unknown): response is HttpErrorResponse {
  return (
    typeof response === "object" &&
    response !== null &&
    "error" in response &&
    typeof (response as any).error === "object" &&
    "status" in (response as any).error &&
    "message" in (response as any).error
  );
}

/**
 * Format HTTP error response as user-friendly message
 * @param errorResponse - HTTP error response object
 * @returns Formatted error message string
 */
export function formatHttpError(errorResponse: HttpErrorResponse): string {
  const { status, message, requestId } = errorResponse.error;

  if (requestId) {
    return `Error ${status}: ${message} (Request ID: ${requestId})`;
  }

  return `Error ${status}: ${message}`;
}

/**
 * Parse API error response and convert to standardized format
 * @param res - Fetch response object
 * @param statusCode - HTTP status code
 * @returns Standardized HttpErrorResponse
 */
async function parseApiError(
  res: Response,
  statusCode: number
): Promise<HttpErrorResponse> {
  const defaultMessage = getDefaultErrorMessage(statusCode);

  try {
    const apiError: ApiErrorResponse = await res.json();

    return {
      error: {
        status: statusCode,
        message: defaultMessage,
        requestId: apiError?.status?.requestId,
      },
    };
  } catch (parseErr) {
    console.error(`Failed to parse ${statusCode} error response:`, parseErr);
    return {
      error: {
        status: statusCode,
        message: defaultMessage,
      },
    };
  }
}

/**
 * Get default error message for HTTP status codes
 * @param statusCode - HTTP status code
 * @returns Default error message
 */
function getDefaultErrorMessage(statusCode: number): string {
  const errorMessages: Record<number, string> = {
    401: "Unauthorized: Invalid or missing authentication credentials. To get the new token from SMARTe platform, Go to https://qc1-primeapp.smarte.pro/oauth2/signin -> sign in with you credentials -> click on Access token copy button -> paste the token in the Authorization header at the time of SMARTe MCP connect.",
    403: "Forbidden: Access denied",
    404: "Not Found: Resource does not exist",
    500: "Internal Server Error",
    502: "Bad Gateway",
    503: "Service Unavailable",
  };

  return errorMessages[statusCode] || `HTTP Error ${statusCode}`;
}

export async function makeGETRequest<T>(
  url: string,
  extraHeaders?: Record<string, string>
): Promise<T | null> {
  const headers: Record<string, string> = {
    ...(extraHeaders || {}),
  };

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) {
      throw new Error(`GET ${url} failed: ${res.status} ${res.statusText}`);
    }
    return (await res.json()) as T;
  } catch (err) {
    console.error("makeGETRequest error:", err);
    return null;
  }
}

/**
 * Execute HTTP POST request with error handling
 * @param url - Target URL
 * @param body - Request payload
 * @param extraHeaders - Additional headers to include
 * @returns Response data, error response, or null on failure
 */
export async function makePOSTRequest<T>(
  url: string,
  body: unknown,
  extraHeaders?: Record<string, string>
): Promise<HttpResponse<T>> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(extraHeaders || {}),
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body ?? {}),
    });

    // Handle other non-OK responses
    if (!res.ok) {
      const errorResponse = await parseApiError(res, res.status);
      console.error(`makePOSTRequest ${res.status} error:`, errorResponse);
      return errorResponse;
    }

    // Parse and return successful response
    return (await res.json()) as T;
  } catch (err) {
    console.error("makePOSTRequest error:", err);
    return null;
  }
}
