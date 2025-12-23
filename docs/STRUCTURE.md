# Project Structure

## Overview

This document describes the folder structure and organization of the SMARTe MCP Server project.

## Directory Layout

```
smarte-mcp-server/
│
├── src/                          # Source code
│   ├── config/                   # Configuration files
│   │   └── index.ts              # Environment config & validation
│   │
│   ├── constants/                # Application constants
│   │   └── responseFields.ts     # API response field definitions
│   │
│   ├── context/                  # Request context management
│   │   └── requestContext.ts     # AsyncLocalStorage for headers
│   │
│   ├── middleware/               # Express middleware
│   │   └── auth.ts               # Authentication middleware
│   │
│   ├── services/                 # External service integrations
│   │   └── http.ts               # HTTP client for API requests
│   │
│   ├── tools/                    # MCP tool implementations
│   │   ├── smarteSearch/         # SMARTe search tools
│   │   │   ├── advancedSearch.ts # Advanced lead search tool
│   │   │   └── technographics.ts # Technographics search & count tools
│   │   ├── enrich/               # Enrichment tools
│   │   │   ├── enrichLead.ts     # Lead enrichment tool
│   │   │   └── enrichAccount.ts  # Account enrichment tool
│   │   └── weather.ts            # Weather tools (demo)
│   │
│   ├── types/                    # TypeScript type definitions
│   │   ├── api.types.ts          # API request/response types
│   │   ├── server.types.ts       # Server configuration types
│   │   └── index.ts              # Central export point (barrel file)
│   │
│   ├── utils/                    # Utility functions
│   │   └── logger.ts             # Logging utility
│   │
│   ├── tests/                    # Test files
│   │   ├── README.md             # Testing documentation
│   │   ├── integrationTests.ts   # Integration tests
│   │   └── mcpConnectionTests.ts # Connection tests
│   │
│   ├── index.ts                  # Main application entry point
│   └── mcpServer.ts              # MCP server configuration
│
├── docs/                         # Documentation
│   ├── API.md                    # API documentation
│   ├── CONTRIBUTING.md           # Contributing guidelines
│   └── STRUCTURE.md              # This file
│
├── node_modules/                 # Dependencies (gitignored)
│
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── CHANGELOG.md                  # Version history
├── package.json                  # Project metadata & dependencies
├── package-lock.json             # Dependency lock file
├── README.md                     # Main documentation
└── tsconfig.json                 # TypeScript configuration
```

## Folder Purposes

### `/src` - Source Code

Main application code organized by responsibility.

#### `/src/config`
- **Purpose**: Application configuration
- **Contents**: Environment variables, server config, validation
- **Key Files**:
  - `index.ts` - Exports configuration object and validation

#### `/src/constants`
- **Purpose**: Application-wide constants
- **Contents**: Response field definitions, error codes, defaults
- **Key Files**:
  - `responseFields.ts` - API response field documentation

#### `/src/context`
- **Purpose**: Request context management
- **Contents**: AsyncLocalStorage for passing data through call chain
- **Key Files**:
  - `requestContext.ts` - Header forwarding context

#### `/src/middleware`
- **Purpose**: Express middleware functions
- **Contents**: Authentication, validation, error handling
- **Key Files**:
  - `auth.ts` - Authentication gate for MCP requests

#### `/src/services`
- **Purpose**: External service integrations
- **Contents**: HTTP clients, API wrappers
- **Key Files**:
  - `http.ts` - Fetch-based HTTP client

#### `/src/tools`
- **Purpose**: MCP tool implementations
- **Contents**: Tool modules organized by category
- **Subdirectories**:
  - `smarteSearch/` - SMARTe search tools
    - `advancedSearch.ts` - Advanced lead search
    - `technographics.ts` - Technographics search & count tools
  - `enrich/` - Data enrichment tools
    - `enrichLead.ts` - Lead/contact enrichment
    - `enrichAccount.ts` - Company/account enrichment
  - `weather.ts` - Weather tools (demo functionality)

#### `/src/types`
- **Purpose**: TypeScript type definitions
- **Contents**: Interfaces, types, enums organized by domain
- **Key Files**:
  - `api.types.ts` - API request/response interfaces
  - `server.types.ts` - Server configuration and context types
  - `index.ts` - Barrel file that re-exports all types

#### `/src/utils`
- **Purpose**: Utility functions
- **Contents**: Helpers, formatters, validators
- **Key Files**:
  - `logger.ts` - Logging utility

#### `/src/tests`
- **Purpose**: Test files
- **Contents**: Unit tests, integration tests
- **Key Files**:
  - `integrationTests.ts` - Integration test suite
  - `mcpConnectionTests.ts` - Connection test suite

### `/docs` - Documentation

Project documentation and guides.

- `API.md` - Complete API reference
- `CONTRIBUTING.md` - Development guidelines
- `STRUCTURE.md` - This file

## File Naming Conventions

- **TypeScript files**: camelCase (e.g., `enrichAccount.ts`)
- **Test files**: descriptive names (e.g., `integrationTests.ts`)
- **Config files**: lowercase with extensions (e.g., `.env.example`)
- **Documentation**: UPPERCASE.md (e.g., `README.md`, `API.md`)

## Import Paths

Use relative imports within the same module:
```typescript
import { config } from "../config";
import type { ServerConfig } from "../types";
```

## Adding New Modules

When adding new functionality:

1. **New tool**: Add to `/src/tools/`
2. **New type**: 
   - API types → Add to `/src/types/api.types.ts`
   - Server types → Add to `/src/types/server.types.ts`
   - New domain → Create new `.types.ts` file and export from `index.ts`
3. **New constant**: Add to `/src/constants/`
4. **New utility**: Add to `/src/utils/`
5. **New test**: Add to `/src/tests/`

Always update relevant documentation!

## Build Output

When building with `npm run build`:
- Output goes to `/dist/` (gitignored)
- Preserves folder structure
- Generates .js and .d.ts files

## Environment Files

- `.env` - Local environment variables (gitignored)
- `.env.example` - Template for environment variables (committed)
- Never commit `.env` file!

## Version Control

Tracked files:
- All `/src` code
- `/docs` documentation
- Configuration files (tsconfig.json, package.json)
- `.env.example` template

Ignored files:
- `/node_modules`
- `/dist`
- `.env`
- Log files
- IDE-specific files

## Best Practices

1. **Keep modules small and focused**
2. **One responsibility per file**
3. **Export types separately from implementation**
4. **Document public APIs**
5. **Test all tools**
6. **Update documentation when changing structure**

## Questions?

Refer to `CONTRIBUTING.md` for development guidelines.
