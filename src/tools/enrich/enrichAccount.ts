import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { makePOSTRequest } from "../../services/http";
import { getForwardedHeaders } from "../../context/requestContext";
import { config } from "../../config/config";

export function registerEnrichAccountTool(server: McpServer) {
  server.tool(
    "enrich_account",
    `Enrich company/account information by providing company details.
    
Returns comprehensive company data including:
- Company Identifiers: GUID, name, also known as names
- Contact Info: phone, address, city, state, country, zipcode, global region, website
- Company Hierarchy: parent company details, worldwide parent, global HQ parent GUID
- Firmographics: revenue range, employee count/range, industry
- Classification: SIC codes/descriptions, NAICS codes/descriptions
- Company Details: subsidiary status, legal status/type, founding year, LinkedIn URL
- Metadata: record status, SMARTe transaction ID, record ID`,
    {
      companyName: z.string().optional().describe("Name of the company"),
      companyWebAddress: z.string().optional().describe("Company website URL"),
      companyLnUrl: z.string().optional().describe("Company LinkedIn URL"),
      companyGuid: z.string().optional().describe("Company GUID"),
      recordId: z.string().optional().describe("Record ID for the account"),
    },
    async ({
      companyName,
      companyWebAddress,
      companyLnUrl,
      companyGuid,
      recordId,
    }) => {
      const url = config.enrichUrl;
      const apiKey = config.enrichApiKey;

      const requestBody = {
        companyName,
        companyWebAddress,
        companyLnUrl,
        companyGuid,
        recordId,
      };

      const headers = getForwardedHeaders();

      if (!apiKey) {
        return {
          content: [{ type: "text", text: "Missing API Key" }],
        };
      }

      headers["apikey"] = apiKey;

      const data = await makePOSTRequest<unknown>(url, requestBody, headers);
      if (!data) {
        return {
          content: [{ type: "text", text: "Failed to enrich account data" }],
        };
      }

      return {
        content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
      };
    }
  );
}
