import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { runWithRequestContext } from "./context";
import { authGate } from "./middleware/auth";
import { createMcpServer } from "./mcpServer";
import { config, PROJECT_VERSION } from "./config/config";

const server = createMcpServer();

async function main() {
  const app = express();
  app.use(express.json());

  // Security headers
  app.use((req, res, next) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    res.setHeader(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains"
    );
    next();
  });

  // CORS configuration
  app.use((req, res, next) => {
    const allowedOrigin = config.corsOrigin;
    res.setHeader("Access-Control-Allow-Origin", allowedOrigin);
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Accept"
    );
    res.setHeader("Access-Control-Max-Age", "86400");

    if (req.method === "OPTIONS") {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Health check endpoint
  app.get("/health", (req, res) => {
    res.json({
      status: "ok",
      mode: "http-fixed",
      version: PROJECT_VERSION,
      uptime: Math.floor(process.uptime()),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        unit: "MB",
      },
      timestamp: new Date().toISOString(),
    });
  });

  app.post(
    "/mcp",
    authGate,
    async (req: express.Request, res: express.Response): Promise<void> => {
      let transport: StreamableHTTPServerTransport | null = null;
      const requestId = Math.random().toString(36).substring(7);

      try {
        // Validate request body
        if (!req.body || typeof req.body !== "object") {
          console.error(`[${requestId}] Invalid request body`);
          res.status(400).json({
            jsonrpc: "2.0",
            error: {
              code: -32600,
              message: "Invalid Request: Body must be a valid JSON object",
            },
            id: null,
          });
          return;
        }

        // Create transport with timeout protection
        const transportCreationTimeout = setTimeout(() => {
          console.error(`[${requestId}] Transport creation timeout`);
        }, 5000);

        transport = new StreamableHTTPServerTransport({
          sessionIdGenerator: undefined,
          enableJsonResponse: true,
        });

        clearTimeout(transportCreationTimeout);

        // Handle client disconnect
        let isConnected = true;
        res.on("close", () => {
          isConnected = false;
          if (transport) {
            console.log(
              `[${requestId}] Client disconnected, closing transport`
            );
            transport.close();
          }
        });

        // Connection timeout
        const connectionTimeout = setTimeout(() => {
          if (isConnected && transport) {
            console.error(`[${requestId}] MCP connection timeout`);
            transport.close();
          }
        }, 30000); // 30 second timeout

        // Attempt server connection
        await server.connect(transport);

        // Process request with context
        await runWithRequestContext(req.headers, async () => {
          if (!transport) {
            throw new Error("Transport is null");
          }
          await transport.handleRequest(req, res, req.body);
        });

        clearTimeout(connectionTimeout);
        console.log(`[${requestId}] Request processed successfully`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        const errorStack = error instanceof Error ? error.stack : undefined;

        console.error(`[${requestId}] Error handling MCP request:`, {
          message: errorMessage,
          stack: errorStack,
          body: req.body,
        });

        // Cleanup transport on error
        if (transport) {
          try {
            transport.close();
          } catch (closeError) {
            console.error(
              `[${requestId}] Error closing transport:`,
              closeError
            );
          }
        }

        // Send error response if headers not sent
        if (!res.headersSent) {
          // Determine appropriate error code
          let errorCode = -32603; // Internal error
          let statusCode = 500;

          if (errorMessage.includes("timeout")) {
            errorCode = -32000; // Server error - timeout
            statusCode = 504;
          } else if (
            errorMessage.includes("Invalid") ||
            errorMessage.includes("Parse")
          ) {
            errorCode = -32700; // Parse error
            statusCode = 400;
          } else if (
            errorMessage.includes("not found") ||
            errorMessage.includes("Method")
          ) {
            errorCode = -32601; // Method not found
            statusCode = 404;
          }

          res.status(statusCode).json({
            jsonrpc: "2.0",
            error: {
              code: errorCode,
              message: "Internal server error",
              data: config.nodeEnv === "development" ? errorMessage : undefined,
            },
            id: null,
          });
        }
      }
    }
  );

  const port = config.port;
  app
    .listen(port, () => {
      console.log(`MCP Server running on http://localhost:${port}/mcp`);
    })
    .on("error", (error) => {
      console.error("Server error:", error);
      process.exit(1);
    });
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
