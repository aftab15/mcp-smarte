# API Documentation

## Overview

The SMARTe MCP Server provides a Model Context Protocol interface for enriching lead and account data.

## Base URL

```
http://localhost:3000
```

## Authentication

All MCP requests require authentication:

```http
POST /mcp
Authorization: Bearer <your-token>
apikey: <your-api-key>
Content-Type: application/json
```

## Endpoints

### Health Check

Check server status and health.

**Request:**
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "mode": "http-fixed",
  "version": "1.0.0",
  "uptime": 12345,
  "memory": {
    "used": 45,
    "total": 128,
    "unit": "MB"
  },
  "timestamp": "2025-10-24T10:00:00.000Z"
}
```

### MCP Endpoint

Main endpoint for MCP tool calls.

**Request:**
```http
POST /mcp
Authorization: Bearer <token>
apikey: <api-key>
Content-Type: application/json
```

## MCP Tools

### 1. advanced_search

Search for leads with advanced filtering.

**Tool Name:** `advanced_search`

**Parameters:**
- `body` (optional, object): Search criteria

**Example Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "advanced_search",
    "arguments": {
      "body": {
        "data": {
          "filterType": "Applied Search",
          "company_info": {
            "globalHeadCount": {
              "size_type": "FIXED_RANGE",
              "fixed_range": [{ "id": 3, "name": "11 to 50", "type": "INCLUDE" }]
            }
          }
        },
        "type": "ADVANCED_SEARCH_LEAD",
        "pagination": { "page_no": 1, "page_size": 10 }
      }
    }
  }
}
```

**Response Fields:**
- `pc_con_guid` - Contact GUID
- `ln_con_full_name` - Full name
- `rc_work_loc_country` - Work location country
- `ln_con_job_title_en` - Job title
- `leads_details` - Contact details (email, LinkedIn, etc.)
- `accounts_filter` - Company information

---

### 2. enrich_lead

Enrich lead/contact information.

**Tool Name:** `enrich_lead`

**Parameters:**
- `companyName` (optional, string): Company name
- `companyWebAddress` (optional, string): Company website
- `recordId` (optional, string): Record ID
- `contactGuid` (optional, string): Contact GUID
- `contactEmail` (optional, string): Email address
- `contactUrl` (optional, string): LinkedIn URL
- `contactFullName` (optional, string): Full name
- `contactFirstName` (optional, string): First name
- `contactLastName` (optional, string): Last name

**Example Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "enrich_lead",
    "arguments": {
      "contactFullName": "John Doe",
      "companyName": "Acme Corp"
    }
  }
}
```

**Response Fields:** (45 fields)
- **Metadata:** recordStatus, accuracy, smarteTransactionId, recordId
- **Company Info:** compGUID, compName, compAddr, compCity, compState, etc.
- **Contact Info:** conGUID, conFullName, conEmail, conJobTitleEn, etc.

---

### 3. enrich_account

Enrich company/account information.

**Tool Name:** `enrich_account`

**Parameters:**
- `companyName` (optional, string): Company name
- `companyWebAddress` (optional, string): Company website
- `companyLnUrl` (optional, string): Company LinkedIn URL
- `companyGuid` (optional, string): Company GUID
- `recordId` (optional, string): Record ID

**Example Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "enrich_account",
    "arguments": {
      "companyName": "Acme Corp"
    }
  }
}
```

**Response Fields:** (30 fields)
- **Metadata:** recordStatus, smarteTransactionId, recordId
- **Company Identifiers:** compGUID, compName, compNameAka
- **Contact Info:** compPhoneNo, compAddr, compCity, compState, etc.
- **Hierarchy:** compParentName, compGlobalHqParentGuid, etc.
- **Firmographics:** compRevRange, compEmpCount, compIndustry, etc.

---

### 4. get_alerts

Get weather alerts for a US state (demo functionality).

**Tool Name:** `get_alerts`

**Parameters:**
- `state` (required, string): Two-letter US state code

---

### 5. get_forecast

Get weather forecast for coordinates (demo functionality).

**Tool Name:** `get_forecast`

**Parameters:**
- `latitude` (required, number): Latitude (-90 to 90)
- `longitude` (required, number): Longitude (-180 to 180)

## Error Responses

### 401 Unauthorized
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32000,
    "message": "Unauthorized: Missing or invalid authorization"
  },
  "id": null
}
```

### 400 Bad Request
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

### 500 Internal Server Error
```json
{
  "jsonrpc": "2.0",
  "error": {
    "code": -32603,
    "message": "Internal server error"
  },
  "id": null
}
```

## Rate Limits

No explicit rate limits are enforced by the MCP server. However, downstream SMARTe APIs may have their own rate limiting policies.

## Support

For issues or questions, please contact the development team.
