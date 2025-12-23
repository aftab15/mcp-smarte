# CRM Export Tool

## Overview
The CRM Export tool enables exporting contacts and accounts from SMARTe to external CRM systems like Salesforce and Outreach.

## Features
- Export to **Salesforce** (LEAD, ACCOUNT, CONTACT)
- Export to **Outreach** (PROSPECT, ACCOUNT)
- Automatic validation of export parameters
- Support for both contact and company exports

## Tool Name
`export_to_crm`

## Input Parameters

### Required Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `data` | Object | Contains the GUIDs for export |
| `data.conGUID` | string (optional) | Contact GUID - Required for LEAD/CONTACT/PROSPECT exports |
| `data.compGUID` | string (optional) | Company GUID - Required for ACCOUNT exports |
| `exportCRM` | enum | Target CRM system: `SALESFORCE` or `OUTREACH` |
| `assetType` | enum | Asset type to export (see below) |

### Asset Types by CRM

#### Salesforce
- `LEAD` - Export as a Salesforce Lead (requires `conGUID`)
- `ACCOUNT` - Export as a Salesforce Account (requires `compGUID`)
- `CONTACT` - Export as a Salesforce Contact (requires `conGUID`)

#### Outreach
- `PROSPECT` - Export as an Outreach Prospect (requires `conGUID`)
- `ACCOUNT` - Export as an Outreach Account (requires `compGUID`)

## Usage Examples

### Export Contact as Salesforce Lead
```json
{
  "data": {
    "conGUID": "ABC123XYZ789"
  },
  "exportCRM": "SALESFORCE",
  "assetType": "LEAD"
}
```

### Export Company as Salesforce Account
```json
{
  "data": {
    "compGUID": "COMP456DEF012"
  },
  "exportCRM": "SALESFORCE",
  "assetType": "ACCOUNT"
}
```

### Export Contact as Outreach Prospect
```json
{
  "data": {
    "conGUID": "ABC123XYZ789"
  },
  "exportCRM": "OUTREACH",
  "assetType": "PROSPECT"
}
```

### Export Company as Outreach Account
```json
{
  "data": {
    "compGUID": "COMP456DEF012"
  },
  "exportCRM": "OUTREACH",
  "assetType": "ACCOUNT"
}
```

## Response Format

### Success Response
```json
{
  "data": {
    "success": true,
    "message": "Successfully exported to Salesforce",
    "exportedId": "00Q5g00000XYZ123",
    "crmType": "SALESFORCE",
    "assetType": "LEAD"
  },
  "status": "success"
}
```

### Error Response
```json
{
  "content": [
    {
      "type": "text",
      "text": "Validation errors: conGUID is required for LEAD asset type"
    }
  ]
}
```

## Validation Rules

1. **CRM Type Validation**: Must be either `SALESFORCE` or `OUTREACH`
2. **Asset Type Validation**: Must match the selected CRM type
   - Salesforce: LEAD, ACCOUNT, or CONTACT
   - Outreach: PROSPECT or ACCOUNT
3. **GUID Requirements**:
   - Contact exports (LEAD/CONTACT/PROSPECT): Require `conGUID`
   - Account exports (ACCOUNT): Require `compGUID`
4. **GUID Length**: Must be between 10-100 characters

## Error Messages

| Error | Description |
|-------|-------------|
| `MISSING_AUTH` | Authorization header is required |
| `MISSING_GUID` | Required GUID is missing |
| `INVALID_CRM_TYPE` | Invalid CRM type specified |
| `INVALID_ASSET_TYPE` | Asset type doesn't match CRM type |
| `CONTACT_GUID_REQUIRED` | conGUID required for contact exports |
| `COMPANY_GUID_REQUIRED` | compGUID required for account exports |
| `FAILED_EXPORT` | Export operation failed |

## Architecture

### Folder Structure
```
crmExport/
├── constants/
│   └── crmExportConstants.ts    # Error messages, endpoints, constraints
├── request/
│   └── crmExportRequestSchema.ts # Zod validation schemas
├── services/
│   └── CRMExportService.ts      # Business logic and API calls
├── types/
│   └── crmExportTypes.ts        # TypeScript type definitions
├── crmExport.ts                 # Tool registration
├── index.ts                     # Module exports
└── README.md                    # This file
```

### Key Components

#### CRMExportService
- `executeCRMExport()`: Executes the CRM export API call
- `validateRequest()`: Validates export request parameters

#### Request Schema
- Zod-based validation with refinement rules
- Ensures asset type matches CRM type
- Validates required GUIDs based on asset type

## Integration

To register this tool in your MCP server:

```typescript
import { registerCRMExportTool } from './tools/crmExport';

// In your server setup
registerCRMExportTool(server);
```

## Dependencies
- `@modelcontextprotocol/sdk` - MCP server SDK
- `zod` - Schema validation
- `../../services/http` - HTTP request utilities
- `../../context/requestContext` - Request context management
- `../../config/config` - Configuration management
