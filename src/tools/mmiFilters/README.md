# MMI Filters

This module contains tools for MMI (Multi-Model Integration) filter operations across various CRM systems in the SMARTe MCP Server.

## Overview

MMI Filters enable searching CRM records by name to retrieve **recordId** and **name** pairs used for populating advanced search filters. This tool is specifically designed to support the advanced search feature by providing dropdown/autocomplete options for Salesforce lead names, contact names, and account names.

**Primary Use Case**: When performing an advanced search with Salesforce filters, this tool helps users find and select specific leads, contacts, or accounts by searching for their names and returning the corresponding recordId required for the filter criteria.

## Structure

```
mmiFilters/
├── constants/              # Constants and configuration
│   └── mmiFilterConstants.ts
├── request/               # Request schemas and types
│   └── mmiFilterRequestSchema.ts
├── services/              # Service layer for business logic
│   └── MMIFilterService.ts
├── types/                 # TypeScript interfaces
│   └── mmiFilterTypes.ts
├── mmiFilter.ts           # Tool registration
├── index.ts              # Module exports
└── README.md             # This file
```

## Available Tools

### MMI Filter Search

Search CRM records by name to retrieve recordId and name pairs for use in advanced search filters.

**Tool Name:** `mmi_filter`

**Purpose**: Returns recordId and name combinations that can be used to populate filter values in advanced search queries, particularly for Salesforce lead/contact/account name filters.

**Note**: The `entityType` field is used to determine the API endpoint but is **not sent** in the API payload. It's only used for routing purposes.

**Supported CRM Types:**
- `SALESFORCE` - Salesforce CRM
- `HUBSPOT` - HubSpot CRM
- `DYNAMICS` - Microsoft Dynamics 365
- `MARKETO` - Marketo

**Input Schema:**
```typescript
{
  data: {
    value: string;                        // Search text (min 1 char, max 200 chars)
    entityType?: "LEAD" | "CONTACT" | "ACCOUNT";  // Entity type (default: "LEAD")
  },
  type: "SALESFORCE" | "HUBSPOT" | "DYNAMICS" | "MARKETO",
  pagination?: {
    page_size?: number;                   // Results per page (default: 50, max: 100)
    page_no?: number;                     // Page number (default: 1)
  }
}
```

**Example Usage:**

1. **Salesforce Lead Name Search:**
```json
{
  "data": {
    "value": "ti",
    "entityType": "LEAD"
  },
  "type": "SALESFORCE",
  "pagination": {
    "page_size": 50,
    "page_no": 1
  }
}
```

2. **Salesforce Contact Name Search:**
```json
{
  "data": {
    "value": "john",
    "entityType": "CONTACT"
  },
  "type": "SALESFORCE"
}
```

3. **Salesforce Account Name Search:**
```json
{
  "data": {
    "value": "acme",
    "entityType": "ACCOUNT"
  },
  "type": "SALESFORCE"
}
```

**Use Case**: User is creating an advanced search with Salesforce filters. They can search for leads, contacts, or accounts by specifying the appropriate `entityType`. The tool returns matching recordId and name pairs for the selected entity type.

4. **HubSpot Contact Search:**
```json
{
  "data": {
    "value": "john",
    "entityType": "CONTACT"
  },
  "type": "HUBSPOT"
}
```

5. **Simple Search (with defaults - defaults to LEAD):**
```json
{
  "data": {
    "value": "smith"
  },
  "type": "SALESFORCE"
}
```

**Response Format:**
```json
{
  "status": {
    "message": "Success",
    "code": 200
  },
  "data": [
    {
      "recordId": "00Q5g00000ABC123",
      "name": "Timothy Johnson"
    },
    {
      "recordId": "00Q5g00000XYZ789",
      "name": "Tina Martinez"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "pageSize": 50,
    "totalPages": 5,
    "totalRecords": 234,
    "hasNext": true,
    "hasPrevious": false
  }
}
```

## Architecture

### Layered Architecture

1. **Tool Layer** (`mmiFilter.ts`)
   - Registers tool with MCP server
   - Handles tool-specific logic
   - Delegates to service layer

2. **Service Layer** (`services/`)
   - Contains business logic
   - Handles API communication
   - Validates requests
   - Manages error handling
   - Maps CRM types to endpoints

3. **Schema Layer** (`request/`)
   - Defines request/response schemas
   - Type definitions
   - Zod validation schemas
   - Pagination schema

4. **Constants Layer** (`constants/`)
   - API endpoints for each CRM
   - Error messages
   - Configuration values
   - Validation constraints
   - CRM type mappings

5. **Types Layer** (`types/`)
   - Response interfaces
   - Result item types
   - Pagination info
   - Validation results

## Features

✅ **Filter Value Lookup**: Returns recordId and name for advanced search filters
✅ **Multi-CRM Support**: Search across Salesforce, HubSpot, Dynamics, Marketo
✅ **Type Safety**: Full TypeScript + Zod validation
✅ **Pagination**: Built-in pagination support
✅ **Validation**: Comprehensive request validation
✅ **Error Handling**: Consistent error messages
✅ **Flexible Search**: Text-based search with minimum 1 character
✅ **Default Values**: Sensible defaults for pagination

## Integration with Advanced Search

This tool is designed to work seamlessly with the advanced search feature:

1. **User searches for a name** in advanced search filter (e.g., typing "john" in Salesforce lead name field)
2. **MMI Filter tool is called** with the search text
3. **Tool returns recordId and name pairs** matching the search
4. **User selects a record** from the results
5. **Selected recordId and name are used** in the advanced search filter criteria

**Example Flow:**
```typescript
// Step 1: Search for leads with name containing "ti"
const leadResults = await mmi_filter({
  data: { 
    value: "ti",
    entityType: "LEAD"
  },
  type: "SALESFORCE"
});

// Step 2: User selects "Timothy Johnson" with recordId "00Q5g00000ABC123"
// Step 3: Use in advanced search filter
const advancedSearch = {
  data: {
    salesforce: {
      lead: {
        sfLeadName: [
          {
            recordId: "00Q5g00000ABC123",
            name: "Timothy Johnson",
            type: "INCLUDE"
          }
        ]
      }
    }
  },
  type: "ADVANCED_SEARCH_LEAD"
};

// Or search for accounts
const accountResults = await mmi_filter({
  data: { 
    value: "acme",
    entityType: "ACCOUNT"
  },
  type: "SALESFORCE"
});

// Use in advanced search account filter
const accountSearch = {
  data: {
    salesforce: {
      account: {
        sfAccountName: [
          {
            recordId: "001XX00000ABCDE",
            name: "Acme Corporation",
            type: "INCLUDE"
          }
        ]
      }
    }
  },
  type: "ADVANCED_SEARCH_ACCOUNT"
};
```

## API Endpoints

The service automatically routes to the correct endpoint based on CRM type and entity type:

**Base Endpoint Pattern**: `/search/v4/mmi/name/{entityType}`

Where `{entityType}` can be:
- `lead` - For searching leads
- `contact` - For searching contacts  
- `account` - For searching accounts

**Examples:**
- **Salesforce Lead**: `/search/v4/mmi/name/lead`
- **Salesforce Contact**: `/search/v4/mmi/name/contact`
- **Salesforce Account**: `/search/v4/mmi/name/account`
- **HubSpot Contact**: `/search/v4/mmi/name/contact`
- **Dynamics Lead**: `/search/v4/mmi/name/lead`

**Important**: The endpoint is dynamically constructed based on the `entityType` field in your request, but the `entityType` field itself is **not included** in the API payload sent to the backend. It's only used for routing to the correct endpoint.

**What Gets Sent to API:**

The actual API payload includes everything **except** `entityType`:

```json
{
  "data": {
    "value": "ti"
    // entityType removed - used only for routing
  },
  "type": "SALESFORCE",
  "pagination": {           // ← Pagination IS included in API payload
    "page_size": 50,
    "page_no": 1
  }
}
```

**Fields in API Payload:**
- ✅ `data.value` - Search text (sent to API)
- ❌ `data.entityType` - Routing only (NOT sent to API)
- ✅ `type` - CRM type (sent to API)
- ✅ `pagination` - Page settings (sent to API)

## Validation Rules

- ✅ Search value required (min 1 char, max 200 chars)
- ✅ CRM type must be one of: SALESFORCE, HUBSPOT, DYNAMICS, MARKETO
- ✅ Page size: 1-100 (default: 50)
- ✅ Page number: >= 1 (default: 1)
- ✅ Authorization header required

## Usage Examples

### Basic Search
```typescript
const result = await mmi_filter({
  data: { value: "john" },
  type: "SALESFORCE"
});
```

### Advanced Search with Pagination
```typescript
const result = await mmi_filter({
  data: { value: "marketing director" },
  type: "HUBSPOT",
  pagination: {
    page_size: 25,
    page_no: 2
  }
});
```

### Search Across Different CRMs
```typescript
// Salesforce
const sfResults = await mmi_filter({
  data: { value: "smith" },
  type: "SALESFORCE"
});

// HubSpot
const hsResults = await mmi_filter({
  data: { value: "smith" },
  type: "HUBSPOT"
});

// Dynamics
const dynResults = await mmi_filter({
  data: { value: "smith" },
  type: "DYNAMICS"
});
```

## Best Practices

1. **Use Specific Search Terms**: More specific searches return better results
2. **Pagination**: Use reasonable page sizes (25-50) for optimal performance
3. **Error Handling**: Always check for validation errors in response
4. **CRM Type**: Ensure correct CRM type for your data source
5. **Authentication**: Valid authorization headers required

## Testing

```bash
# Run tests for MMI filters
npm run test

# Test specific CRM type
npm run test -- --grep "MMI.*Salesforce"
```

## Adding New CRM Support

To add support for a new CRM system:

1. Add CRM type to `MMIFilterTypeEnum` in schema
2. Add endpoint to `MMI_FILTER_ENDPOINTS` in constants
3. Add mapping to `CRM_TYPE_ENDPOINTS`
4. Update validation in service
5. Update documentation

## API Documentation

See the main [README.md](../../README.md) for complete API documentation.
