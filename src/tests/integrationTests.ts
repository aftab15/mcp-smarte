/**
 * MCP Server Integration Tests
 * These tests run against the actual server
 */

import { spawn, ChildProcess } from "child_process";
import path from "path";

interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  duration: number;
  statusCode?: number;
  responseBody?: any;
}

const results: TestResult[] = [];
const SERVER_PORT = 3001; // Use different port to avoid conflicts
const BASE_URL = `http://localhost:${SERVER_PORT}`;
let serverProcess: ChildProcess | null = null;

/**
 * Start the MCP server
 */
async function startServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    console.log("🚀 Starting MCP server...");
    
    // Use relative path from project root
    const isWindows = process.platform === "win32";
    const command = isWindows ? "npx.cmd" : "npx";
    
    serverProcess = spawn(command, ["tsx", "src/index1.ts"], {
      cwd: path.resolve(__dirname, "..", ".."),
      env: { ...process.env, PORT: SERVER_PORT.toString(), NODE_ENV: "test" },
      stdio: ["ignore", "pipe", "pipe"],
      shell: isWindows,
    });

    let output = "";

    serverProcess.stdout?.on("data", (data) => {
      output += data.toString();
      if (output.includes("MCP Server running")) {
        console.log(`✅ Server started on port ${SERVER_PORT}`);
        // Give it a moment to fully initialize
        setTimeout(() => resolve(), 500);
      }
    });

    serverProcess.stderr?.on("data", (data) => {
      console.error("Server stderr:", data.toString());
    });

    serverProcess.on("error", (error) => {
      reject(new Error(`Failed to start server: ${error.message}`));
    });

    // Timeout if server doesn't start
    setTimeout(() => {
      if (!output.includes("MCP Server running")) {
        reject(new Error("Server startup timeout"));
      }
    }, 10000);
  });
}

/**
 * Stop the MCP server
 */
async function stopServer(): Promise<void> {
  if (serverProcess) {
    console.log("🛑 Stopping MCP server...");
    serverProcess.kill("SIGTERM");
    
    return new Promise((resolve) => {
      serverProcess?.on("exit", () => {
        console.log("✅ Server stopped");
        resolve();
      });
      
      // Force kill if not stopped within 5 seconds
      setTimeout(() => {
        if (serverProcess) {
          serverProcess.kill("SIGKILL");
          resolve();
        }
      }, 5000);
    });
  }
}

/**
 * Test 1: Missing Authorization Token (401)
 */
async function testMissingAuthToken(): Promise<void> {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ jsonrpc: "2.0", method: "tools/list", id: 1 }),
    });

    const responseBody = await response.json() as any;

    if (response.status === 401 && responseBody.error?.code === -32001) {
      results.push({
        testName: "Missing Authorization Token (401)",
        passed: true,
        error: `Correctly returned 401 with error code ${responseBody.error.code}`,
        duration: Date.now() - start,
        statusCode: response.status,
        responseBody,
      });
    } else {
      results.push({
        testName: "Missing Authorization Token (401)",
        passed: false,
        error: `Expected 401 with code -32001, got ${response.status} with code ${responseBody.error?.code}`,
        duration: Date.now() - start,
        statusCode: response.status,
        responseBody,
      });
    }
  } catch (error) {
    results.push({
      testName: "Missing Authorization Token (401)",
      passed: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    });
  }
}

/**
 * Test 2: Valid Authorization Token
 */
async function testValidAuthToken(): Promise<void> {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token-123",
      },
      body: JSON.stringify({ jsonrpc: "2.0", method: "tools/list", id: 1 }),
    });

    const responseBody = await response.json() as any;

    // Should not get 401 with valid token
    if (response.status !== 401) {
      results.push({
        testName: "Valid Authorization Token",
        passed: true,
        error: `Request accepted with status ${response.status}`,
        duration: Date.now() - start,
        statusCode: response.status,
        responseBody,
      });
    } else {
      results.push({
        testName: "Valid Authorization Token",
        passed: false,
        error: `Got 401 even with valid token`,
        duration: Date.now() - start,
        statusCode: response.status,
        responseBody,
      });
    }
  } catch (error) {
    results.push({
      testName: "Valid Authorization Token",
      passed: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    });
  }
}

/**
 * Test 3: Invalid Request Body
 */
async function testInvalidRequestBody(): Promise<void> {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
      body: "invalid json {{{",
    });

    const responseBody = await response.text();

    if (response.status === 400) {
      results.push({
        testName: "Invalid Request Body (400)",
        passed: true,
        error: `Correctly returned 400 for invalid JSON`,
        duration: Date.now() - start,
        statusCode: response.status,
      });
    } else {
      results.push({
        testName: "Invalid Request Body (400)",
        passed: false,
        error: `Expected 400, got ${response.status}`,
        duration: Date.now() - start,
        statusCode: response.status,
        responseBody,
      });
    }
  } catch (error) {
    results.push({
      testName: "Invalid Request Body (400)",
      passed: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    });
  }
}

/**
 * Test 4: Empty Request Body
 */
async function testEmptyRequestBody(): Promise<void> {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
      body: JSON.stringify(null),
    });

    const responseBody = await response.json() as any;

    if (response.status === 400 && responseBody.error?.code === -32600) {
      results.push({
        testName: "Empty Request Body (400)",
        passed: true,
        error: `Correctly returned 400 with code -32600`,
        duration: Date.now() - start,
        statusCode: response.status,
        responseBody,
      });
    } else {
      results.push({
        testName: "Empty Request Body (400)",
        passed: false,
        error: `Expected 400 with code -32600, got ${response.status}`,
        duration: Date.now() - start,
        statusCode: response.status,
        responseBody,
      });
    }
  } catch (error) {
    results.push({
      testName: "Empty Request Body (400)",
      passed: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    });
  }
}

/**
 * Test 5: Health Check Endpoint
 */
async function testHealthCheck(): Promise<void> {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const responseBody = await response.json() as any;

    if (response.status === 200 && responseBody.status === "ok") {
      results.push({
        testName: "Health Check Endpoint",
        passed: true,
        error: `Server is healthy, uptime: ${responseBody.uptime}s`,
        duration: Date.now() - start,
        statusCode: response.status,
        responseBody,
      });
    } else {
      results.push({
        testName: "Health Check Endpoint",
        passed: false,
        error: `Expected 200 with status ok, got ${response.status}`,
        duration: Date.now() - start,
        statusCode: response.status,
        responseBody,
      });
    }
  } catch (error) {
    results.push({
      testName: "Health Check Endpoint",
      passed: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    });
  }
}

/**
 * Test 6: CORS Headers
 */
async function testCORSHeaders(): Promise<void> {
  const start = Date.now();
  try {
    const response = await fetch(`${BASE_URL}/mcp`, {
      method: "OPTIONS",
      headers: {
        Origin: "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
      },
    });

    const corsHeader = response.headers.get("Access-Control-Allow-Origin");

    if (response.status === 204 && corsHeader) {
      results.push({
        testName: "CORS Headers (OPTIONS)",
        passed: true,
        error: `CORS headers present: ${corsHeader}`,
        duration: Date.now() - start,
        statusCode: response.status,
      });
    } else {
      results.push({
        testName: "CORS Headers (OPTIONS)",
        passed: false,
        error: `Expected 204 with CORS headers, got ${response.status}`,
        duration: Date.now() - start,
        statusCode: response.status,
      });
    }
  } catch (error) {
    results.push({
      testName: "CORS Headers (OPTIONS)",
      passed: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    });
  }
}

/**
 * Test 7: Client Disconnect During Request
 */
async function testClientDisconnect(): Promise<void> {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const signal = controller.signal;

    // Start request and abort immediately
    const fetchPromise = fetch(`${BASE_URL}/mcp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
      body: JSON.stringify({ jsonrpc: "2.0", method: "tools/list", id: 1 }),
      signal,
    });

    // Abort after 50ms
    setTimeout(() => controller.abort(), 50);

    try {
      await fetchPromise;
    } catch (abortError: any) {
      if (abortError.name === "AbortError") {
        results.push({
          testName: "Client Disconnect During Request",
          passed: true,
          error: "Request aborted successfully, server should cleanup",
          duration: Date.now() - start,
        });
        return;
      }
    }

    results.push({
      testName: "Client Disconnect During Request",
      passed: false,
      error: "Request was not aborted",
      duration: Date.now() - start,
    });
  } catch (error) {
    results.push({
      testName: "Client Disconnect During Request",
      passed: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    });
  }
}

/**
 * Test 8: Concurrent Requests
 */
async function testConcurrentRequests(): Promise<void> {
  const start = Date.now();
  try {
    const requests = Array.from({ length: 10 }, (_, i) =>
      fetch(`${BASE_URL}/mcp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer test-token-${i}`,
        },
        body: JSON.stringify({ jsonrpc: "2.0", method: "tools/list", id: i }),
      })
    );

    const responses = await Promise.all(requests);
    const allSuccessful = responses.every((r) => r.status !== 500);

    if (allSuccessful) {
      results.push({
        testName: "Concurrent Requests (10)",
        passed: true,
        error: `All 10 concurrent requests handled successfully`,
        duration: Date.now() - start,
      });
    } else {
      results.push({
        testName: "Concurrent Requests (10)",
        passed: false,
        error: `Some requests failed with 500`,
        duration: Date.now() - start,
      });
    }
  } catch (error) {
    results.push({
      testName: "Concurrent Requests (10)",
      passed: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    });
  }
}

/**
 * Run all integration tests
 */
async function runAllTests(): Promise<void> {
  console.log("\n🧪 Starting MCP Server Integration Tests\n");
  console.log("=".repeat(60));

  try {
    // Start the server
    await startServer();

    // Run tests
    const tests = [
      testHealthCheck,
      testMissingAuthToken,
      testValidAuthToken,
      testInvalidRequestBody,
      testEmptyRequestBody,
      testCORSHeaders,
      testClientDisconnect,
      testConcurrentRequests,
    ];

    for (const test of tests) {
      try {
        await test();
      } catch (error) {
        console.error(`❌ Test failed to run: ${error}`);
      }
    }
  } finally {
    // Always stop the server
    await stopServer();
  }

  // Print results
  console.log("\n📊 Test Results:");
  console.log("=".repeat(60));

  let passed = 0;
  let failed = 0;

  results.forEach((result) => {
    const icon = result.passed ? "✅" : "❌";
    console.log(`${icon} ${result.testName}`);
    console.log(`   Duration: ${result.duration}ms`);
    if (result.statusCode) {
      console.log(`   Status Code: ${result.statusCode}`);
    }
    if (result.error) {
      console.log(`   Details: ${result.error}`);
    }
    console.log();

    if (result.passed) passed++;
    else failed++;
  });

  console.log("=".repeat(60));
  console.log(`Total: ${results.length} | Passed: ${passed} | Failed: ${failed}`);
  console.log("=".repeat(60));

  // Exit with appropriate code
  process.exit(failed > 0 ? 1 : 0);
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests().catch((error) => {
    console.error("Fatal error:", error);
    stopServer().finally(() => process.exit(1));
  });
}

export { runAllTests, results };
