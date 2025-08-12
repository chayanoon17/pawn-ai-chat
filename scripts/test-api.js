#!/usr/bin/env node
/**
 * Comprehensive API Testing Script
 * Usage: node scripts/test-api.js [--auth] [--verbose]
 */

const https = require("https");
const querystring = require("querystring");

const API_BASE_URL = "https://pawn-api.azurewebsites.net";

// Test credentials
const TEST_CREDENTIALS = {
  email: "superadmin@pawnshop.com",
  password: "superadmin123456",
};

let ACCESS_TOKEN = null;

// Parse command line arguments
const args = process.argv.slice(2);
const includeAuth = args.includes("--auth");
const verbose = args.includes("--verbose");

async function makeRequest(endpoint, options = {}) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE_URL}${endpoint}`;

    const defaultOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "User-Agent": "API-Tester/1.0",
      },
    };

    // Merge options
    const requestOptions = { ...defaultOptions, ...options };

    // Add authorization if token exists
    if (ACCESS_TOKEN && !requestOptions.headers["Authorization"]) {
      requestOptions.headers["Authorization"] = `Bearer ${ACCESS_TOKEN}`;
    }

    if (verbose) {
      console.log(`� ${requestOptions.method} ${url}`);
      if (requestOptions.headers["Authorization"]) {
        console.log(
          `🔐 Authorization: Bearer ***${ACCESS_TOKEN.substring(
            ACCESS_TOKEN.length - 8
          )}`
        );
      }
    }

    const startTime = Date.now();

    const req = https.request(url, requestOptions, (res) => {
      const duration = Date.now() - startTime;

      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            statusMessage: res.statusMessage,
            data: jsonData,
            duration,
            headers: res.headers,
          });
        } catch (err) {
          resolve({
            success: res.statusCode >= 200 && res.statusCode < 300,
            status: res.statusCode,
            statusMessage: res.statusMessage,
            data: data,
            duration,
            headers: res.headers,
          });
        }
      });
    });

    req.on("error", (err) => {
      reject({
        success: false,
        error: err.message,
      });
    });

    // Send request body if provided
    if (requestOptions.body) {
      req.write(requestOptions.body);
    }

    req.end();
  });
}

async function testEndpoint(endpoint, description, options = {}) {
  console.log(`\n🔍 Testing: ${description}`);
  console.log(`📍 ${options.method || "GET"} ${API_BASE_URL}${endpoint}`);

  try {
    const result = await makeRequest(endpoint, options);

    console.log(`📊 Status: ${result.status} ${result.statusMessage}`);
    console.log(`⏱️  Response time: ${result.duration}ms`);

    if (result.headers["content-type"]) {
      console.log(`📦 Content-Type: ${result.headers["content-type"]}`);
    }

    if (result.success) {
      if (typeof result.data === "object") {
        console.log(`✅ Response:`, JSON.stringify(result.data, null, 2));
      } else {
        console.log(`✅ Response:`, result.data.substring(0, 200));
      }
    } else {
      console.log(`❌ Error Response:`, JSON.stringify(result.data, null, 2));
    }

    return { ...result, description };
  } catch (error) {
    console.log(`❌ Request Error: ${error.error}`);
    return { success: false, error: error.error, description };
  }
}

async function testLogin() {
  console.log(
    `\n🔐 Testing Authentication with email: ${TEST_CREDENTIALS.email}`
  );

  const loginResult = await testEndpoint("/api/auth/login", "User Login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(TEST_CREDENTIALS),
  });

  // Extract access token if login successful
  if (
    loginResult.success &&
    loginResult.data &&
    loginResult.data.data &&
    loginResult.data.data.accessToken
  ) {
    ACCESS_TOKEN = loginResult.data.data.accessToken;
    console.log(
      `🎫 Access Token received: ***${ACCESS_TOKEN.substring(
        ACCESS_TOKEN.length - 8
      )}`
    );
  } else {
    console.log(`⚠️  No access token received from login`);
  }

  return loginResult;
}

async function testAuthEndpoints() {
  const authResults = [];

  // Test login
  const loginResult = await testLogin();
  authResults.push(loginResult);

  if (ACCESS_TOKEN) {
    // Test /api/auth/me
    const meResult = await testEndpoint(
      "/api/auth/me",
      "Get Current User Info"
    );
    authResults.push(meResult);

    // Test logout
    const logoutResult = await testEndpoint("/api/auth/logout", "User Logout", {
      method: "POST",
    });
    authResults.push(logoutResult);
  }

  return authResults;
}

async function runBasicTests() {
  const tests = [
    { endpoint: "/api/health", description: "Health Check" },
    { endpoint: "/api/status", description: "Status Check (if available)" },
  ];

  const results = [];

  for (const test of tests) {
    try {
      const result = await testEndpoint(test.endpoint, test.description);
      results.push(result);
    } catch (error) {
      results.push({
        success: false,
        error: error.message,
        description: test.description,
      });
    }
  }

  return results;
}

async function runAllTests() {
  console.log("🚀 Starting Comprehensive API Tests...");
  console.log("=".repeat(60));

  let allResults = [];

  // Basic connectivity tests
  console.log("\n📡 Basic Connectivity Tests");
  console.log("-".repeat(30));
  const basicResults = await runBasicTests();
  allResults = [...allResults, ...basicResults];

  // Authentication tests
  if (includeAuth) {
    console.log("\n🔐 Authentication Tests");
    console.log("-".repeat(30));
    const authResults = await testAuthEndpoints();
    allResults = [...allResults, ...authResults];
  }

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📋 Test Summary:");
  console.log("=".repeat(60));

  allResults.forEach((result, index) => {
    const status = result.success ? "✅" : "❌";
    const duration = result.duration ? `(${result.duration}ms)` : "";
    const statusCode = result.status ? `[${result.status}]` : "";
    console.log(
      `${index + 1}. ${status} ${result.description} ${statusCode} ${duration}`
    );
  });

  const successCount = allResults.filter((r) => r.success).length;
  const successRate = ((successCount / allResults.length) * 100).toFixed(1);

  console.log("\n📊 Results:");
  console.log(
    `   Success: ${successCount}/${allResults.length} (${successRate}%)`
  );
  console.log(
    `   Failed:  ${allResults.length - successCount}/${allResults.length}`
  );

  if (includeAuth) {
    console.log("\n💡 Note: Authentication tests were included");
  } else {
    console.log("\n💡 Tip: Use --auth flag to include authentication tests");
    console.log("   Example: node scripts/test-api.js --auth");
  }
}

// Usage information
if (args.includes("--help") || args.includes("-h")) {
  console.log(`
🧪 API Testing Script

Usage: node scripts/test-api.js [options]

Options:
  --auth     Include authentication endpoint tests
  --verbose  Show detailed request information
  --help     Show this help message

Examples:
  node scripts/test-api.js                    # Basic tests only
  node scripts/test-api.js --auth             # Include auth tests
  node scripts/test-api.js --auth --verbose   # Verbose output with auth tests

Test Credentials:
  Email: ${TEST_CREDENTIALS.email}
  Password: ${TEST_CREDENTIALS.password}
`);
  process.exit(0);
}

// Run the tests
runAllTests().catch(console.error);
