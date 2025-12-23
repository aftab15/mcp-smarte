# Customer List Tools

This module contains tools for customer list operations in the SMARTe MCP Server.

## Structure

```
customerList/
├── constants/              # Constants and enums
│   └── contactRevealConstants.ts
├── request/               # Request schemas and types
│   └── contactRevealRequestSchema.ts
├── services/              # Service layer for business logic
│   └── ContactRevealService.ts
├── contactReveal.ts       # Tool registration
├── index.ts              # Module exports
└── README.md             # This file
```

## Available Tools

### 1. Contact Reveal

Reveals comprehensive contact information using contact and company GUIDs.

**Tool Name:** `contact_reveal`

**Input Schema:**
```typescript
{
  data: Array<{
    conGuid: string;  // Contact GUID
    compGuid: string; // Company GUID
  }>
}
```

**Example Usage:**
```json
{
  "data": [
    {
      "conGuid": "C3C560F780D9B59DB4D99C96B87B0C31",
      "compGuid": "8E5C4565312A0306"
    }
  ]
}
```

### 2. Account Reveal

Reveals comprehensive account information using company GUIDs.

**Tool Name:** `account_reveal`

**Input Schema:**
```typescript
{
  data: {
    type: "EXISTING" | "NEW";     // Reveal type
    revealSource: string;          // Source of reveal
    compGuids: string[];           // Array of company GUIDs
  }
}
```

**Example Usage:**
```json
{
  "data": {
    "type": "EXISTING",
    "revealSource": "Employee List",
    "compGuids": ["8E5C4565312A0306"]
  }
}
```

### 3. Lists Filter

Filter customer lists by type with optional search text and pagination.

**Tool Name:** `lists_filter`

**Description:** Filter lists of type `LEAD` or `ACCOUNT` using `searchText`. Supports both `pageIndex`/`page_no` (alias) and `pageSize` with validation.

**Input Schema:**
```typescript
{
  data: {
    searchText?: string; // optional, defaults to ""
  };
  pagination: {
    pageIndex?: number; // int, min 1, defaults to 1
    page_no?: number;   // alias for page index, min 1, defaults to 1
    pageSize?: number;  // int, min 1, max 200, defaults to 50
  };
  type: "LEAD" | "ACCOUNT";
}
```

**Validation Rules:**
- **Type:** must be `LEAD` or `ACCOUNT`
- **Pagination:**
  - `pageIndex` ≥ 1
  - `page_no` ≥ 1
  - `pageSize` ∈ [1, 200]

**Endpoint:**
- **LEAD:** `/customer-list/v1/lead-list/lead-lists`
- **ACCOUNT:** `/customer-list/v1/account-list/account-lists`

**Example Usage:**
```json
{
  "type": "LEAD",
  "data": {
    "searchText": "marketing"
  },
  "pagination": {
    "pageIndex": 1,
    "pageSize": 25
  }
}
```

## Architecture

### Layered Architecture

1. **Tool Layer** (`contactReveal.ts`)
   - Registers tools with MCP server
   - Handles tool-specific logic
   - Delegates to service layer

2. **Service Layer** (`services/`)
   - Contains business logic
   - Handles API communication
   - Validates requests
   - Manages error handling

3. **Schema Layer** (`request/`)
   - Defines request/response schemas
   - Type definitions
   - Zod validation schemas

4. **Constants Layer** (`constants/`)
   - API endpoints
   - Error messages
   - Configuration values
   - Validation constraints

## Best Practices

1. **Separation of Concerns:** Each layer has a single responsibility
2. **Type Safety:** Use TypeScript types and Zod schemas
3. **Constants:** Centralize all constants and magic strings
4. **Error Handling:** Consistent error messages and validation
5. **Documentation:** JSDoc comments for all public methods

## Adding New Tools

To add a new tool to this module:

1. Create request schema in `request/`
2. Create service class in `services/`
3. Define constants in `constants/`
4. Create tool registration file
5. Export from `index.ts`
6. Update this README

## Testing

```bash
# Run tests for customer list tools
npm run test
```

## API Documentation

See the main [README.md](../../README.md) for complete API documentation.
