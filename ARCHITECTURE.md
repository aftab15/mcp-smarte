# SMARTe MCP Server - Architecture Documentation

## Overview

This document describes the architectural patterns and best practices used in the SMARTe MCP Server project.

## Architecture Principles

1. **Layered Architecture**: Clear separation of concerns across layers
2. **Type Safety**: Strong typing with TypeScript and Zod validation
3. **Modularity**: Self-contained, reusable modules
4. **Consistency**: Standardized patterns across all tools
5. **Maintainability**: Easy to understand, modify, and extend

## Project Structure

```
src/
├── config/              # Application configuration
├── context/            # Request context management
├── middleware/         # Express middleware
├── services/           # Shared services (HTTP, etc.)
├── tools/              # MCP tools modules
│   ├── customerList/   # Customer list tools
│   ├── smarteSearch/   # Search tools
│   └── enrich/         # Enrichment tools
├── types/              # Global type definitions
├── utils/              # Utility functions
├── index.ts            # Application entry point
└── mcpServer.ts        # MCP server setup
```

## Tool Module Architecture

Each tool module follows a consistent structure:

```
toolModule/
├── constants/          # Constants and configuration
│   └── toolConstants.ts
├── request/            # Request schemas and validation
│   └── toolRequestSchema.ts
├── services/           # Business logic layer
│   └── ToolService.ts
├── types/              # TypeScript interfaces
│   └── toolTypes.ts
├── tool.ts             # Tool registration
├── index.ts            # Module exports
└── README.md           # Module documentation
```

### Example: Contact Reveal Tool

```
customerList/
├── constants/
│   └── contactRevealConstants.ts    # API endpoints, error messages
├── request/
│   └── contactRevealRequestSchema.ts # Zod schemas, types
├── services/
│   └── ContactRevealService.ts       # API calls, validation
├── types/
│   └── contactRevealTypes.ts         # Response types, interfaces
├── contactReveal.ts                  # Tool registration
├── index.ts                          # Exports
└── README.md                         # Documentation
```

## Layer Responsibilities

### 1. Tool Layer (`tool.ts`)

**Responsibility**: Register tools with MCP server

```typescript
export function registerContactRevealTool(server: McpServer) {
  server.tool(
    "contact_reveal",
    "Description",
    Schema.shape,
    async (params) => {
      // 1. Validate input
      // 2. Get headers
      // 3. Call service layer
      // 4. Handle response
      // 5. Error handling
    }
  );
}
```

**Best Practices**:
- Keep logic minimal
- Delegate to service layer
- Use constants for messages
- Consistent error handling
- Clear documentation

### 2. Service Layer (`services/`)

**Responsibility**: Business logic and API communication

```typescript
export class ToolService {
  /**
   * Execute API call
   */
  public static async executeOperation(
    requestBody: Request,
    headers: Headers
  ): Promise<Response> {
    const url = config.baseUrl + ENDPOINTS.OPERATION;
    return await makePOSTRequest(url, requestBody, headers);
  }

  /**
   * Validate request
   */
  public static validateRequest(data: Request): ValidationResult {
    // Validation logic
    return { isValid: true, errors: [] };
  }
}
```

**Best Practices**:
- Static methods for stateless operations
- Clear method names
- Comprehensive JSDoc comments
- Proper error handling
- Use constants for URLs and messages

### 3. Schema Layer (`request/`)

**Responsibility**: Request/response validation and types

```typescript
import { z } from "zod";

export const RequestSchema = z.object({
  field: z.string().describe("Field description"),
  // ... more fields
});

export type Request = z.infer<typeof RequestSchema>;
```

**Best Practices**:
- Use Zod for runtime validation
- Export both schema and type
- Descriptive field descriptions
- Proper validation rules
- Reusable sub-schemas

### 4. Constants Layer (`constants/`)

**Responsibility**: Centralize all constants

```typescript
export const TOOL_ENDPOINTS = {
  OPERATION: "/api/v1/operation",
} as const;

export const TOOL_ERRORS = {
  MISSING_AUTH: "Missing Authorization header",
  FAILED_RETRIEVE: "Failed to retrieve data",
} as const;

export const TOOL_CONSTRAINTS = {
  MIN_ITEMS: 1,
  MAX_ITEMS: 100,
} as const;
```

**Best Practices**:
- Use `as const` for immutability
- Group related constants
- Clear naming conventions
- No magic strings in code

### 5. Types Layer (`types/`)

**Responsibility**: TypeScript type definitions

```typescript
export interface ApiResponse {
  status?: {
    message: string;
    code: number;
  };
  data?: DataType[];
  error?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
```

**Best Practices**:
- Interface for objects
- Type for unions/primitives
- Descriptive names
- Optional fields marked clearly
- Reusable across module

## Code Style Guide

### Naming Conventions

- **Files**: camelCase for tools, PascalCase for services
- **Classes**: PascalCase
- **Functions**: camelCase
- **Constants**: UPPER_SNAKE_CASE
- **Types/Interfaces**: PascalCase
- **Variables**: camelCase

### Documentation

```typescript
/**
 * Brief description of function/class
 * 
 * Longer description if needed
 * 
 * @param paramName - Description
 * @returns Description of return value
 * @throws Error description if applicable
 * 
 * @example
 * ```typescript
 * const result = functionName(params);
 * ```
 */
```

### Error Handling

```typescript
try {
  // Operation
  const result = await service.execute(params);
  return { content: [{ type: "text", text: JSON.stringify(result) }] };
} catch (error) {
  const errorMessage = error instanceof Error 
    ? error.message 
    : String(error);
  console.error("Operation Error:", errorMessage);
  
  return {
    content: [{ 
      type: "text", 
      text: `Error: ${errorMessage}` 
    }]
  };
}
```

## Adding a New Tool

### Step-by-Step Guide

1. **Create Module Structure**
```bash
mkdir -p src/tools/newTool/{constants,request,services,types}
```

2. **Define Constants**
```typescript
// constants/newToolConstants.ts
export const NEW_TOOL_ENDPOINTS = {
  OPERATION: "/api/v1/operation",
} as const;
```

3. **Create Request Schema**
```typescript
// request/newToolRequestSchema.ts
import { z } from "zod";

export const NewToolRequestSchema = z.object({
  // Define schema
});

export type NewToolRequest = z.infer<typeof NewToolRequestSchema>;
```

4. **Implement Service**
```typescript
// services/NewToolService.ts
export class NewToolService {
  public static async executeOperation(/* params */) {
    // Implementation
  }
  
  public static validateRequest(/* params */) {
    // Validation
  }
}
```

5. **Register Tool**
```typescript
// newTool.ts
export function registerNewTool(server: McpServer) {
  server.tool(
    "tool_name",
    "Description",
    Schema.shape,
    async (params) => {
      // Implementation using service
    }
  );
}
```

6. **Create Index**
```typescript
// index.ts
export { registerNewTool } from "./newTool";
export { NewToolService } from "./services/NewToolService";
// ... export other items
```

7. **Register in MCP Server**
```typescript
// mcpServer.ts
import { registerNewTool } from "./tools/newTool";

export function createMcpServer() {
  // ...
  registerNewTool(server);
  // ...
}
```

8. **Update Documentation**
- Update README.md
- Update ARCHITECTURE.md
- Create module README.md

## Testing Strategy

```typescript
// tests/newTool.test.ts
describe("NewTool", () => {
  describe("Service Layer", () => {
    it("should validate request correctly", () => {
      // Test validation
    });
    
    it("should execute API call", async () => {
      // Test API call
    });
  });
  
  describe("Tool Registration", () => {
    it("should register tool with correct schema", () => {
      // Test registration
    });
  });
});
```

## Best Practices Summary

### DO ✅

- Use layered architecture
- Separate concerns clearly
- Type everything with TypeScript
- Validate with Zod schemas
- Centralize constants
- Write JSDoc comments
- Handle errors consistently
- Export through index files
- Follow naming conventions
- Write README for each module

### DON'T ❌

- Mix business logic in tool registration
- Hardcode strings or URLs
- Skip type definitions
- Ignore error handling
- Create circular dependencies
- Duplicate code
- Skip documentation
- Use any type
- Leave TODO comments in production
- Break established patterns

## Performance Considerations

1. **Lazy Loading**: Import modules only when needed
2. **Caching**: Cache frequently used data
3. **Connection Pooling**: Reuse HTTP connections
4. **Validation**: Fail fast with early validation
5. **Logging**: Use appropriate log levels

## Security Best Practices

1. **Input Validation**: Always validate user input
2. **Authentication**: Check headers consistently
3. **Error Messages**: Don't expose sensitive info
4. **Dependencies**: Keep packages updated
5. **Environment Variables**: Never commit secrets

## Maintainability

1. **Code Reviews**: Follow review checklist
2. **Refactoring**: Improve continuously
3. **Testing**: Write tests for new features
4. **Documentation**: Keep docs up-to-date
5. **Versioning**: Use semantic versioning

## Resources

- [MCP SDK Documentation](https://modelcontextprotocol.io)
- [Zod Documentation](https://zod.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express Documentation](https://expressjs.com)
