# MCP Server Tests

This directory contains test scenarios for validating MCP server functionality and failure handling.

## Test Types

### Integration Tests (Recommended)
Tests that run against the **actual running server** with real HTTP requests.

```bash
# Run all integration tests (default)
npm test

# Or explicitly
npm run test:integration
```

### Unit Tests
Tests that use **mocked components** to test individual parts in isolation.

```bash
# Run unit tests
npm run test:unit
```

## Integration Test Scenarios

### 1. **Health Check Endpoint**
- **Purpose**: Validates the `/health` endpoint returns server status
- **Expected**: 200 OK with uptime, memory usage, and version info

### 2. **Missing Authorization Token (401)**
- **Purpose**: Tests authentication when no auth token is provided
- **Expected**: 401 Unauthorized with JSON-RPC error code -32001

### 3. **Valid Authorization Token**
- **Purpose**: Tests that valid auth tokens allow requests to proceed
- **Expected**: Request is accepted (not 401)

### 4. **Invalid Request Body (400)**
- **Purpose**: Validates handling of malformed JSON in request body
- **Expected**: 400 Bad Request

### 5. **Empty Request Body (400)**
- **Purpose**: Tests handling of null/empty request bodies
- **Expected**: 400 Bad Request with error code -32600

### 6. **CORS Headers (OPTIONS)**
- **Purpose**: Validates CORS preflight requests are handled correctly
- **Expected**: 204 No Content with proper CORS headers

### 7. **Client Disconnect During Request**
- **Purpose**: Tests cleanup when client aborts request mid-flight
- **Expected**: Server handles abort gracefully and cleans up resources

### 8. **Concurrent Requests (10)**
- **Purpose**: Validates server can handle multiple simultaneous requests
- **Expected**: All requests complete without 500 errors

## Unit Test Scenarios

### 1. **Null Transport Test**
- **Purpose**: Validates error handling when null transport is provided
- **Expected**: Should throw an error and be caught gracefully

### 2. **Multiple Simultaneous Connections**
- **Purpose**: Tests behavior when multiple transports try to connect simultaneously
- **Expected**: Should handle gracefully or reject duplicate connections

### 3. **Connection After Server Close**
- **Purpose**: Validates that connections are rejected after server shutdown
- **Expected**: Should throw error when attempting to connect to closed server

### 4. **Transport Close During Connection**
- **Purpose**: Tests cleanup when transport is closed mid-connection
- **Expected**: Should clean up resources without memory leaks

### 5. **Invalid Request Body**
- **Purpose**: Validates handling of malformed or invalid request bodies
- **Expected**: Should return 400 Bad Request with appropriate error code (-32600)

### 6. **Memory Leak Check**
- **Purpose**: Tests for memory leaks during repeated connection/disconnection cycles
- **Expected**: Memory growth should be minimal (<50MB for 10 connections)

### 7. **Connection Timeout**
- **Purpose**: Validates timeout handling for long-running connections
- **Expected**: Should timeout after 30 seconds and clean up resources

### 8. **Missing Authorization Token (401)**
- **Purpose**: Tests authentication middleware when no auth token is provided
- **Expected**: Should return 401 Unauthorized with JSON-RPC error code -32001

### 9. **Valid Authorization Token**
- **Purpose**: Tests authentication middleware with valid authorization header
- **Expected**: Should call next() and allow request to proceed

## Enhanced Error Handling Features

The main MCP endpoint now includes:

- ✅ **Request ID Tracking** - Each request gets a unique ID for debugging
- ✅ **Request Body Validation** - Validates JSON structure before processing
- ✅ **Transport Creation Timeout** - 5-second timeout for transport creation
- ✅ **Connection Timeout** - 30-second timeout for MCP connections
- ✅ **Client Disconnect Handling** - Properly cleans up when client disconnects
- ✅ **Transport Cleanup** - Ensures transport is closed on errors
- ✅ **Detailed Logging** - Logs with request ID for traceability
- ✅ **Proper Error Codes** - Returns appropriate JSON-RPC error codes:
  - `-32600`: Invalid Request
  - `-32700`: Parse error
  - `-32601`: Method not found
  - `-32603`: Internal error
  - `-32000`: Server error (timeout)

## Error Response Format

```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32603,
    "message": "Internal server error",
    "data": "Detailed error message (development only)"
  },
  "id": null
}
```

## Manual Testing

You can also test manually using curl:

```bash
# Test missing authorization (should return 401)
curl -X POST http://localhost:3000/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'

# Test invalid body
curl -X POST http://localhost:3000/mcp \
  -H "Authorization: Bearer test" \
  -H "Content-Type: application/json" \
  -d "invalid json"

# Test missing body
curl -X POST http://localhost:3000/mcp \
  -H "Authorization: Bearer test" \
  -H "Content-Type: application/json"

# Test valid request (requires proper MCP JSON-RPC format)
curl -X POST http://localhost:3000/mcp \
  -H "Authorization: Bearer test" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"tools/list","id":1}'
```

### Expected Responses:

**401 Unauthorized (no auth token):**
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32001,
    "message": "Unauthorized"
  },
  "id": null
}
```

**400 Bad Request (invalid body):**
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32600,
    "message": "Invalid Request: Body must be a valid JSON object"
  },
  "id": null
}
```
