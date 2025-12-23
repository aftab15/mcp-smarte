import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { makePOSTRequest } from "../../services/http";
import { getForwardedHeaders } from "../../context/requestContext";
import { ENRICH_LEAD_RESPONSE_FIELDS } from "../../constants/responseFields";
import { config } from "../../config/config";

export function registerEnrichLeadTool(server: McpServer) {
  server.tool(
    "enrich_lead",
    `Enrich lead information by providing company and contact details. 
    
Returns comprehensive data including:
- Company Info: GUID, name, phone, address, city, state, country, zipcode, global region, website, revenue range, employee count/range, industry, SIC/NAICS codes, subsidiary status, legal status, founding year, LinkedIn URL
- Contact Info: GUID, full name, first/last name, email, job title, level, department, sub-department, job dates, work location, phone numbers, mobile, direct dials, LinkedIn URL
- Metadata: record status, data grade/accuracy, SMARTe transaction ID, record ID`,
    {
      companyName: z.string().optional().describe("Name of the company"),
      companyWebAddress: z.string().optional().describe("Company website URL"),
      recordId: z.string().optional().describe("Record ID for the lead"),
      contactGuid: z.string().optional().describe("Contact GUID"),
      contactEmail: z.string().optional().describe("Contact email address"),
      contactUrl: z.string().optional().describe("Contact LinkedIn or profile URL"),
      contactFullName: z.string().optional().describe("Contact full name"),
      contactFirstName: z.string().optional().describe("Contact first name"),
      contactLastName: z.string().optional().describe("Contact last name"),
    },
    async ({
      companyName,
      companyWebAddress,
      recordId,
      contactGuid,
      contactEmail,
      contactUrl,
      contactFullName,
      contactFirstName,
      contactLastName,
    }) => {
      const url = config.enrichLeadUrl;

      const requestBody = {
        companyName,
        companyWebAddress,
        recordId,
        contactGuid,
        contactEmail,
        contactUrl,
        contactFullName,
        contactFirstName,
        contactLastName,
      };

      const headers = getForwardedHeaders();

      if (!headers || !headers["apikey"]) {
        return { content: [{ type: "text", text: "Missing API Key header" }] };
      }

      const data = await makePOSTRequest<unknown>(url, requestBody, headers);
      if (!data) {
        return { content: [{ type: "text", text: "Failed to enrich lead data" }] };
      }

      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );
}
