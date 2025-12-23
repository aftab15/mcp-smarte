import { PROJECT_VERSION } from "../config/config";

const toolsInfo = [
  {
    name: "advanced_search",
    description:
      "Search for contacts or companies with advanced filters (industry, location, revenue, employee size, technographics, etc.)",
    category: "Search",
  },
  {
    name: "advanced_search_count",
    description:
      "Get count of contacts or companies matching advanced search filters",
    category: "Search",
  },
  {
    name: "data_insights",
    description:
      "Get data insights and breakdown statistics with aggregation levels",
    category: "Analytics",
  },
  {
    name: "contact_reveal",
    description:
      "Reveal contact information using contact GUID and company GUID pairs",
    category: "Data Enrichment",
  },
  {
    name: "account_reveal",
    description: "Reveal comprehensive account information using company GUIDs",
    category: "Data Enrichment",
  },
  {
    name: "enrich_lead",
    description: "Enrich lead information with company and contact details",
    category: "Data Enrichment",
  },
  {
    name: "enrich_account",
    description:
      "Enrich company/account information by providing company details",
    category: "Data Enrichment",
  },
  {
    name: "lists_filter_value",
    description: "Search and filter customer lists by type (LEAD or ACCOUNT)",
    category: "List Management",
  },
  {
    name: "search_filter_values",
    description:
      "Search for filter values (industry, technographics) to get code-description pairs",
    category: "Utilities",
  },
  {
    name: "search_mmi_records",
    description:
      "Search CRM records by name to get recordId and name pairs for Salesforce/HubSpot/Dynamics/Marketo",
    category: "CRM Integration",
  },
  {
    name: "export_to_crm",
    description:
      "Export contacts or accounts to CRM systems (Salesforce, Outreach)",
    category: "CRM Integration",
  },
  {
    name: "technographics_search",
    description:
      "Search for technographic/product data of a company using its GUID",
    category: "Technographics",
  },
  {
    name: "technographics_count",
    description:
      "Get the count of technographic data for a company using its GUID",
    category: "Technographics",
  },
  {
    name: "get_function_subfunctions",
    description:
      "Get available subfunctions for contact functions/departments. Returns all functions with subfunctions or specific function's subfunctions",
    category: "Utilities",
  },
];

const usageInfo = {
  mcpClient: {
    description:
      "Configure your MCP client (Claude Desktop, Cline, etc.) to connect to this server",
    configuration: {
      mcpServers: {
        "smarte-mcp": {
          command: "mcp-remote",
          args: [
            "https://qc-mcp.smarte.pro/mcp",
            "--allow-http",
            "--header",
            "Authorization: ${authorization}",
            "--header",
            "apikey: ${apikey}",
          ],
          env: {
            authorization: "Bearer YOUR_SMARTE_API_TOKEN",
            apikey: "YOUR_SMARTE_ENRICH_API_KEY",
          },
        },
      },
    },
  },
  directAPI: {
    description: "Make direct HTTP POST requests to the MCP endpoint",
    example: {
      url: `https://qc-mcp.smarte.pro/mcp`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer YOUR_SMARTE_API_TOKEN",
        apikey: "YOUR_SMARTE_ENRICH_API_KEY",
      },
      body: {
        jsonrpc: "2.0",
        method: "tools/call",
        params: {
          name: "advanced_search",
          arguments: {
            type: "ADVANCED_SEARCH_LEAD",
            data: {
              company_info: {
                industry: [
                  {
                    code: "software",
                    type: "INCLUDE",
                  },
                ],
              },
            },
            pagination: {
              page_no: 1,
              page_size: 10,
            },
          },
        },
        id: 1,
      },
    },
  },
};

export const serverInfo = {
  name: "SMARTe MCP Server",
  version: PROJECT_VERSION,
  description:
    "Model Context Protocol server for SMARTe B2B contact and company data platform",
  protocol: "MCP (Model Context Protocol)",
  status: "running",

  connection: {
    endpoint: "/mcp",
    method: "POST",
    contentType: "application/json",
    authentication: {
      type: "Bearer Token + API Key",
      headers: {
        Authorization: "Bearer <your-smarte-api-token>",
        apikey: "<your-smarte-api-key>",
      },
      note: "Both Authorization token and apikey are required. Contact SMARTe support to obtain your credentials.",
    },
  },

  capabilities: {
    tools: toolsInfo,
    totalTools: toolsInfo.length,
  },

  usage: usageInfo,

  documentation: {
    mcp_protocol: "https://modelcontextprotocol.io/",
    smarte_mcp_docs: "https://docs.api.smarte.pro/",
    smarte_platform: "https://www.smarte.pro/",
    support: "Contact SMARTe support for API access and documentation",
  },

  endpoints: {
    root: "/",
    health: "/health",
    mcp: "/mcp",
  },

  server: {
    uptime: (() => {
      const totalSeconds = Math.floor(process.uptime());
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      return `${hours}h ${minutes}m`;
    })(),
    timestamp: new Date().toISOString(),
  },
};
