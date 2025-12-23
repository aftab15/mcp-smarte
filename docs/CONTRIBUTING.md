# Contributing Guide

## Development Setup

1. **Clone the repository**
2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```bash
   cp .env.example .env
   ```

4. **Run in development mode**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── config/          # Configuration and environment variables
├── constants/       # Application constants (response fields, etc.)
├── context/         # Request context management
├── middleware/      # Express middleware (auth, etc.)
├── services/        # External service integrations (HTTP client, etc.)
├── tools/           # MCP tool implementations
├── types/           # TypeScript type definitions
├── utils/           # Utility functions (logger, helpers, etc.)
├── tests/           # Test files
├── index1.ts        # Main application entry point
└── mcpServer.ts     # MCP server configuration
```

## Coding Standards

### TypeScript

- Use TypeScript for all new code
- Define interfaces for data structures in `src/types/`
- Export types from `src/types/index.ts`
- Use `const` assertions for constant objects

### Naming Conventions

- **Files**: camelCase (e.g., `enrichAccount.ts`)
- **Classes**: PascalCase (e.g., `Logger`)
- **Functions**: camelCase (e.g., `registerEnrichLeadTool`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `ENRICH_LEAD_RESPONSE_FIELDS`)
- **Interfaces**: PascalCase with descriptive names (e.g., `EnrichLeadRequest`)

### Code Organization

1. **Imports** - Group by type:
   - External libraries
   - Internal modules
   - Types

2. **Constants** - Define at the top of file or in `src/constants/`

3. **Functions** - One function per responsibility

4. **Exports** - Export at the bottom

### Comments

- Use JSDoc for functions and classes
- Include parameter descriptions
- Document return types
- Add examples for complex logic

Example:
```typescript
/**
 * Enrich lead information
 * @param request - Lead enrichment parameters
 * @returns Enriched lead data
 */
export async function enrichLead(request: EnrichLeadRequest): Promise<ApiResponse> {
  // Implementation
}
```

## Adding a New Tool

1. **Create tool file** in `src/tools/`
   ```typescript
   // src/tools/myNewTool.ts
   import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
   import { z } from "zod";
   
   export function registerMyNewTool(server: McpServer) {
     server.tool(
       "my_new_tool",
       "Description of what this tool does",
       {
         param1: z.string().describe("Description"),
         // ... more parameters
       },
       async ({ param1 }) => {
         // Implementation
       }
     );
   }
   ```

2. **Register in mcpServer.ts**
   ```typescript
   import { registerMyNewTool } from "./tools/myNewTool";
   
   // In createMcpServer function:
   registerMyNewTool(server);
   ```

3. **Add types** in `src/types/index.ts` if needed

4. **Add tests** in `src/tests/`

5. **Update documentation**
   - README.md
   - docs/API.md

## Testing

### Running Tests

```bash
npm test                  # All tests
npm run test:unit         # Unit tests
npm run test:integration  # Integration tests
```

### Writing Tests

- Test files go in `src/tests/`
- Name test files descriptively
- Use meaningful test descriptions
- Test both success and error cases

Example:
```typescript
describe("enrichLead", () => {
  it("should enrich lead with valid data", async () => {
    // Test implementation
  });
  
  it("should handle missing parameters", async () => {
    // Test implementation
  });
});
```

## Git Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring

### Commit Messages

Follow conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance

Example:
```
feat: add enrich account tool
fix: handle missing auth header
docs: update API documentation
```

## Pull Request Process

1. Create a feature branch
2. Make your changes
3. Add/update tests
4. Update documentation
5. Run tests locally
6. Submit PR with description

## Environment Variables

Keep sensitive data in `.env` (not committed):
- API keys
- Tokens
- URLs

Use `.env.example` as template.

## Error Handling

- Always validate input
- Use try-catch for async operations
- Return meaningful error messages
- Log errors with context

Example:
```typescript
try {
  const data = await fetchData();
  return { success: true, data };
} catch (error) {
  logger.error("Failed to fetch data", { error });
  return { success: false, error: "Failed to fetch data" };
}
```

## Security

- Never log sensitive data
- Validate all input
- Use environment variables for secrets
- Keep dependencies updated

## Questions?

If you have questions, please:
1. Check existing documentation
2. Review similar code
3. Ask the team

Thank you for contributing! 🎉
