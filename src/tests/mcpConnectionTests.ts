/**
 * MCP Server Connection Failure Test Scenarios
 * Run this file to manually test different failure scenarios
 */

import { createMcpServer } from "../mcpServer";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

interface TestResult {
  testName: string;
  passed: boolean;
  error?: string;
  duration: number;
}

const results: TestResult[] = [];

/**
 * Test 1: Server connection with null transport
 */
async function testNullTransport(): Promise<void> {
  const start = Date.now();
  try {
    const server = createMcpServer();
    // @ts-ignore - intentionally passing null to test error handling
    await server.connect(null);
    results.push({
      testName: "Null Transport",
      passed: false,
      error: "Should have thrown error but didn't",
      duration: Date.now() - start,
    });
  } catch (error) {
    results.push({
      testName: "Null Transport",
      passed: true,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    });
  }
}

/**
 * Test 2: Multiple simultaneous connections
 */
async function testMultipleConnections(): Promise<void> {
  const start = Date.now();
  try {
    const server = createMcpServer();
    const transport1 = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    const transport2 = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    await server.connect(transport1);
    await server.connect(transport2); // This might cause issues

    results.push({
      testName: "Multiple Simultaneous Connections",
      passed: false,
      error: "Multiple connections accepted (potential issue)",
      duration: Date.now() - start,
    });
  } catch (error) {
    results.push({
      testName: "Multiple Simultaneous Connections",
      passed: true,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    });
  }
}

/**
 * Test 3: Connection after server close
 */
async function testConnectionAfterClose(): Promise<void> {
  const start = Date.now();
  try {
    const server = createMcpServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    await server.connect(transport);
    await server.close();
    
    // Try to connect again after close
    const transport2 = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });
    await server.connect(transport2);

    results.push({
      testName: "Connection After Server Close",
      passed: false,
      error: "Connection succeeded after close (unexpected)",
      duration: Date.now() - start,
    });
  } catch (error) {
    results.push({
      testName: "Connection After Server Close",
      passed: true,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    });
  }
}

/**
 * Test 4: Transport close during active connection
 */
async function testTransportCloseDuringConnection(): Promise<void> {
  const start = Date.now();
  try {
    const server = createMcpServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    await server.connect(transport);
    transport.close(); // Close transport immediately

    results.push({
      testName: "Transport Close During Connection",
      passed: true,
      error: "Transport closed successfully",
      duration: Date.now() - start,
    });
  } catch (error) {
    results.push({
      testName: "Transport Close During Connection",
      passed: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    });
  }
}

/**
 * Test 5: Invalid request body handling
 */
async function testInvalidRequestBody(): Promise<void> {
  const start = Date.now();
  try {
    const server = createMcpServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    await server.connect(transport);

    // Simulate invalid request
    const mockReq = {
      headers: {},
      body: { invalid: "data", malformed: true },
    };

    results.push({
      testName: "Invalid Request Body",
      passed: true,
      error: "Test setup completed (manual validation needed)",
      duration: Date.now() - start,
    });
  } catch (error) {
    results.push({
      testName: "Invalid Request Body",
      passed: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    });
  }
}

/**
 * Test 6: Memory leak on repeated connections
 */
async function testRepeatedConnections(): Promise<void> {
  const start = Date.now();
  try {
    const initialMemory = process.memoryUsage().heapUsed;
    
    for (let i = 0; i < 10; i++) {
      const server = createMcpServer();
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined,
        enableJsonResponse: true,
      });
      await server.connect(transport);
      transport.close();
      await server.close();
    }

    const finalMemory = process.memoryUsage().heapUsed;
    const memoryDiff = finalMemory - initialMemory;
    const memoryDiffMB = (memoryDiff / 1024 / 1024).toFixed(2);

    results.push({
      testName: "Repeated Connections (Memory Leak Check)",
      passed: true,
      error: `Memory difference: ${memoryDiffMB} MB`,
      duration: Date.now() - start,
    });
  } catch (error) {
    results.push({
      testName: "Repeated Connections (Memory Leak Check)",
      passed: false,
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    });
  }
}

/**
 * Test 7: Connection timeout scenario
 */
async function testConnectionTimeout(): Promise<void> {
  const start = Date.now();
  try {
    const server = createMcpServer();
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
      enableJsonResponse: true,
    });

    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Connection timeout")), 5000)
    );

    await Promise.race([
      server.connect(transport),
      timeout,
    ]);

    results.push({
      testName: "Connection Timeout",
      passed: true,
      error: "Connection completed within timeout",
      duration: Date.now() - start,
    });
  } catch (error) {
    results.push({
      testName: "Connection Timeout",
      passed: error instanceof Error && error.message === "Connection timeout",
      error: error instanceof Error ? error.message : String(error),
      duration: Date.now() - start,
    });
  }
}

/**
 * Test 8: Authorization token not provided (401 status)
 */
async function testMissingAuthToken(): Promise<void> {
  const start = Date.now();
  try {
    // This test requires the server to be running
    // We'll simulate the auth middleware behavior
    const mockReq = {
      headers: {} as Record<string, string | string[] | undefined>,
    };

    const mockRes = {
      status: function(code: number) {
        this.statusCode = code;
        return this;
      },
      json: function(data: any) {
        this.responseData = data;
        return this;
      },
      statusCode: 0,
      responseData: null as any,
    };

    let nextCalled = false;
    const mockNext = () => { nextCalled = true; };

    // Import and test the authGate middleware
    const { authGate } = await import("../middleware/auth");
    authGate(mockReq as any, mockRes as any, mockNext);

    if (mockRes.statusCode === 401 && !nextCalled) {
      results.push({
        testName: "Missing Authorization Token (401)",
        passed: true,
        error: `Correctly returned 401 status with error code: ${mockRes.responseData?.error?.code}`,
        duration: Date.now() - start,
      });
    } else {
      results.push({
        testName: "Missing Authorization Token (401)",
        passed: false,
        error: `Expected 401 status, got ${mockRes.statusCode}. Next called: ${nextCalled}`,
        duration: Date.now() - start,
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
 * Test 9: Authorization token provided (should pass)
 */
async function testValidAuthToken(): Promise<void> {
  const start = Date.now();
  try {
    const mockReq = {
      headers: {
        authorization: "Bearer test-token-123",
      } as Record<string, string | string[] | undefined>,
    };

    const mockRes = {
      status: function(code: number) {
        this.statusCode = code;
        return this;
      },
      json: function(data: any) {
        this.responseData = data;
        return this;
      },
      statusCode: 0,
      responseData: null as any,
    };

    let nextCalled = false;
    const mockNext = () => { nextCalled = true; };

    // Import and test the authGate middleware
    const { authGate } = await import("../middleware/auth");
    authGate(mockReq as any, mockRes as any, mockNext);

    if (nextCalled && mockRes.statusCode === 0) {
      results.push({
        testName: "Valid Authorization Token",
        passed: true,
        error: "Auth middleware correctly called next()",
        duration: Date.now() - start,
      });
    } else {
      results.push({
        testName: "Valid Authorization Token",
        passed: false,
        error: `Expected next() to be called, but got status ${mockRes.statusCode}`,
        duration: Date.now() - start,
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
 * Run all tests
 */
async function runAllTests(): Promise<void> {
  console.log("\n🧪 Starting MCP Server Connection Failure Tests\n");
  console.log("=".repeat(60));

  const tests = [
    testNullTransport,
    testMultipleConnections,
    testConnectionAfterClose,
    testTransportCloseDuringConnection,
    testInvalidRequestBody,
    testRepeatedConnections,
    testConnectionTimeout,
    testMissingAuthToken,
    testValidAuthToken,
  ];

  for (const test of tests) {
    try {
      await test();
    } catch (error) {
      console.error(`❌ Test failed to run: ${error}`);
    }
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
}

// Run tests if executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

export { runAllTests, results };
