# HTTP Error Handling Architecture

## Overview

This document describes the centralized HTTP error handling architecture implemented across the MCP server tools.

## Architecture Components

### 1. Core HTTP Service (`src/services/http.ts`)

The HTTP service provides a standardized approach to handling API errors across all tools.

#### Key Interfaces

```typescript
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
```

#### Core Functions

##### `makePOSTRequest<T>(url, body, extraHeaders): Promise<HttpResponse<T>>`

Executes HTTP POST requests with automatic error handling:
- Detects HTTP error status codes (401, 403, 404, 500, etc.)
- Parses API error responses automatically
- Converts API errors to standardized `HttpErrorResponse` format
- Returns `null` for network/parsing failures

##### `isHttpError(response): response is HttpErrorResponse`

Type guard to check if a response is an error:
```typescript
if (isHttpError(responseData)) {
  // Handle error
}
```

##### `formatHttpError(errorResponse): string`

Formats error responses as user-friendly messages:
```typescript
// Returns: "Error 401: UnAuthorized access to application (Request ID: 63638d05-...)"
const message = formatHttpError(errorResponse);
```

##### `parseApiError(res, statusCode): Promise<HttpErrorResponse>`

Internal function that:
1. Attempts to parse the API's error response body
2. Extracts error message and requestId from API format
3. Falls back to default messages if parsing fails
4. Returns standardized `HttpErrorResponse`

##### `getDefaultErrorMessage(statusCode): string`

Provides default error messages for common HTTP status codes:
- 401: "Unauthorized: Invalid or missing authentication credentials"
- 403: "Forbidden: Access denied"
- 404: "Not Found: Resource does not exist"
- 500: "Internal Server Error"
- 502: "Bad Gateway"
- 503: "Service Unavailable"

## Error Flow

```
1. Tool calls makePOSTRequest()
   ↓
2. makePOSTRequest() detects non-OK status
   ↓
3. parseApiError() extracts error details from API response
   ↓
4. Returns HttpErrorResponse with standardized format
   ↓
5. Tool checks with isHttpError()
   ↓
6. Tool formats error with formatHttpError()
   ↓
7. User receives formatted error message
```

## API Error Format

The backend API returns errors in this format:

```json
{
  "status": {
    "statusCode": 4011,
    "message": "UnAuthorized access to application",
    "requestId": "63638d05-0273-4e4f-8db8-56d0ebc9b3d1"
  }
}
```

This is automatically converted to our internal format:

```typescript
{
  error: {
    status: 401,
    message: "UnAuthorized access to application",
    requestId: "63638d05-0273-4e4f-8db8-56d0ebc9b3d1"
  }
}
```

## Usage in Tools

### Standard Pattern

```typescript
import { isHttpError, formatHttpError } from "../../services/http";

// Execute API call
const responseData = await SomeService.executeApiCall(params, headers);

// Check for HTTP error response
if (isHttpError(responseData)) {
  return {
    content: [
      {
        type: "text",
        text: formatHttpError(responseData),
      },
    ],
  };
}

// Check for null response (network failure)
if (!responseData) {
  return {
    content: [
      { type: "text", text: "Failed to retrieve data" },
    ],
  };
}

// Process successful response
return {
  content: [
    { type: "text", text: JSON.stringify(responseData, null, 2) },
  ],
};
```

## Implemented Tools

The following tools have been updated with the standardized error handling:

1. **MMI Filter** (`src/tools/mmiFilters/mmiFilter.ts`)
   - `search_mmi_records`

2. **Advanced Search** (`src/tools/smarteSearch/advancedSearch.ts`)
   - `advanced_search`
   - `advanced_search_count`
   - `data_insights`

3. **Technographics** (`src/tools/smarteSearch/technographics.ts`)
   - `technographics_search`
   - `technographics_count`

## Benefits

### 1. Centralized Logic
- All HTTP error handling in one place
- Easy to update error messages or add new status codes
- Consistent behavior across all tools

### 2. Type Safety
- TypeScript type guards ensure proper error checking
- Compile-time verification of error handling
- IntelliSense support for error properties

### 3. Maintainability
- Single source of truth for error handling
- Easy to extend with new error types
- Clear separation of concerns

### 4. User Experience
- Consistent error messages across all tools
- Includes request IDs for debugging
- Clear, actionable error information

### 5. Debugging
- Request IDs included in error messages
- Detailed console logging
- Easy to trace errors back to API calls

## Extending the Pattern

### Adding New HTTP Status Codes

Update `getDefaultErrorMessage()` in `http.ts`:

```typescript
function getDefaultErrorMessage(statusCode: number): string {
  const errorMessages: Record<number, string> = {
    401: "Unauthorized: Invalid or missing authentication credentials",
    403: "Forbidden: Access denied",
    404: "Not Found: Resource does not exist",
    429: "Too Many Requests: Rate limit exceeded", // New
    500: "Internal Server Error",
  };
  
  return errorMessages[statusCode] || `HTTP Error ${statusCode}`;
}
```

### Applying to New Tools

1. Import the utilities:
```typescript
import { isHttpError, formatHttpError } from "../../services/http";
```

2. Add error check after API call:
```typescript
const data = await makeAPICall();

if (isHttpError(data)) {
  return {
    content: [{ type: "text", text: formatHttpError(data) }],
  };
}
```

### Customizing Error Messages

For tool-specific error messages, you can still access the error details:

```typescript
if (isHttpError(responseData)) {
  const { status, message, requestId } = responseData.error;
  
  // Custom formatting
  const customMessage = `[${toolName}] ${message}`;
  
  return {
    content: [{ type: "text", text: customMessage }],
  };
}
```

## Testing

### Test Cases

1. **401 Unauthorized**: Invalid/missing auth credentials
2. **403 Forbidden**: Valid auth but insufficient permissions
3. **404 Not Found**: Resource doesn't exist
4. **500 Server Error**: Backend failure
5. **Network Failure**: Returns `null`
6. **Malformed Error Response**: Falls back to default message

### Example Test

```typescript
// Simulate 401 error
const mockResponse = {
  status: 401,
  json: async () => ({
    status: {
      statusCode: 4011,
      message: "UnAuthorized access to application",
      requestId: "test-123"
    }
  })
};

const result = await makePOSTRequest(url, body, headers);
// Result should be HttpErrorResponse with parsed message
```

## Future Enhancements

1. **Retry Logic**: Automatic retries for transient errors (502, 503)
2. **Circuit Breaker**: Prevent cascading failures
3. **Metrics**: Track error rates by status code
4. **Custom Error Classes**: Typed error classes for different scenarios
5. **Error Recovery**: Automatic fallback strategies

## Related Documentation

- [API Documentation](./API.md)
- [Architecture Overview](./ARCHITECTURE_DIAGRAM.md)
- [Contributing Guidelines](./CONTRIBUTING.md)
