# Filter Values Tool

## Overview

The Filter Values tool provides vector-based search functionality to find similar filter values for advanced search operations. It helps users discover valid filter codes and descriptions for industries, technographics products, categories, and vendors.

## Purpose

This tool is designed to:
- Search for filter values using vector similarity search
- Return code-description pairs that can be used in advanced search filters
- Support multiple filter types: Industry, Technographics Product, Category, and Vendor
- Provide fuzzy matching to find similar values based on user input

## API Endpoint

**Endpoint**: `/queryservice/v1/vectorstore/filter-search`  
**Method**: POST

## Request Schema

### Input Parameters

```typescript
{
  data: {
    value: string;  // Search text (e.g., "IT", "Software", "Microsoft")
  },
  type: FilterType;  // One of: INDUSTRY, TECHNOGRAPHICS_PRODUCT, TECHNOGRAPHICS_CATEGORY, TECHNOGRAPHICS_VENDOR
  top_k?: number;    // Number of results to return (default: 5, max: 100)
}
```

### Filter Types

- **INDUSTRY**: Search company industries (e.g., "Information Technology", "Healthcare")
- **TECHNOGRAPHICS_PRODUCT**: Search product names (e.g., "Salesforce", "Microsoft Office")
- **TECHNOGRAPHICS_CATEGORY**: Search product categories (e.g., "CRM", "Marketing Automation")
- **TECHNOGRAPHICS_VENDOR**: Search product vendors (e.g., "Microsoft", "Oracle")

## Response Format

The API returns a list of matching filter values with code-description pairs:

```json
{
  "data": [
    {
      "code": "IT_001",
      "description": "Information Technology"
    },
    {
      "code": "IT_002",
      "description": "IT Services"
    }
  ]
}
```

## Usage Examples

### Example 1: Search for Industries

```json
{
  "data": {
    "value": "IT"
  },
  "type": "INDUSTRY",
  "top_k": 5
}
```

### Example 2: Search for Products

```json
{
  "data": {
    "value": "Salesforce"
  },
  "type": "TECHNOGRAPHICS_PRODUCT",
  "top_k": 10
}
```

### Example 3: Search for Categories

```json
{
  "data": {
    "value": "CRM"
  },
  "type": "TECHNOGRAPHICS_CATEGORY",
  "top_k": 5
}
```

### Example 4: Search for Vendors

```json
{
  "data": {
    "value": "Microsoft"
  },
  "type": "TECHNOGRAPHICS_VENDOR",
  "top_k": 5
}
```

## Use Cases

1. **Industry Filtering**: Find valid industry codes for advanced search filters
2. **Technographics Search**: Discover products, categories, or vendors for technology stack filtering
3. **Fuzzy Matching**: Get similar values when exact match is not available
4. **Auto-complete**: Provide suggestions for filter values in UI

## Validation Rules

- **Search Value**: Required, non-empty, max 500 characters
- **Filter Type**: Must be one of the valid enum values
- **top_k**: Optional, between 1 and 100 (default: 5)
- **Authorization**: Required in request headers

## Error Handling

The tool validates:
- Empty or missing search values
- Invalid filter types
- Out-of-range top_k values
- Missing authorization headers

## Integration

The tool is registered with the MCP server and can be called using:

```typescript
server.tool("search_filter_values", ...)
```

## Module Structure

```
filterValues/
├── constants/
│   └── filterValuesConstants.ts    # Error messages, endpoints, constraints
├── request/
│   └── filterValuesRequestSchema.ts # Zod validation schemas
├── services/
│   └── FilterValuesService.ts      # Business logic and API calls
├── types/
│   └── filterValuesTypes.ts        # TypeScript type definitions
├── filterValues.ts                 # Tool registration
├── index.ts                        # Module exports
└── README.md                       # This file
```

## Dependencies

- `@modelcontextprotocol/sdk`: MCP server integration
- `zod`: Request validation
- `../services/http`: HTTP request utilities
- `../config/config`: Application configuration
- `../context/requestContext`: Authorization header forwarding
