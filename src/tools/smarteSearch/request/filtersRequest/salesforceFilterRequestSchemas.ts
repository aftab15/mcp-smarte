import { z } from "zod";
import { crmValueFilterSchema, ValueFilterSchema } from "../CommonRequest";

const accountSchema = z.object({
  sfAccountExisting: z
    .enum(["Yes", "No"])
    .optional()
    .describe("Salesforce Account Existing"),
  sfAccountOwner: z
    .array(ValueFilterSchema)
    .optional()
    .describe("Salesforce Account Owner"),
  sfAccountName: z
    .array(crmValueFilterSchema)
    .optional()
    .describe(
      "Filter by Salesforce Account Name. Requires recordId and name pairs. IMPORTANT: Use the 'search_mmi_records' tool with entityType='ACCOUNT' to search and retrieve matching account recordIds and names based on search text."
    ),
  sfAccountType: z
    .array(ValueFilterSchema)
    .optional()
    .describe("Salesforce Account Type"),
  sfAccountSource: z
    .array(ValueFilterSchema)
    .optional()
    .describe("Salesforce Account Source"),
  sfAccountRating: z
    .array(ValueFilterSchema)
    .optional()
    .describe("Salesforce Account Rating"),
});

const leadSchema = z.object({
  sfLeadExisting: z
    .enum(["Yes", "No"])
    .optional()
    .describe("Salesforce Lead Existing"),
  sfLeadOwner: z
    .array(ValueFilterSchema)
    .optional()
    .describe("Salesforce Lead Owner"),
  sfLeadName: z
    .array(crmValueFilterSchema)
    .optional()
    .describe(
      "Filter by Salesforce Lead Name. Requires recordId and name pairs. IMPORTANT: Use the 'search_mmi_records' tool with entityType='LEAD' to search and retrieve matching lead recordIds and names based on search text."
    ),
  sfLeadStatus: z
    .array(ValueFilterSchema)
    .optional()
    .describe("Salesforce Lead Status"),
});

const contactSchema = z.object({
  sfContactExisting: z
    .enum(["Yes", "No"])
    .optional()
    .describe("Salesforce Contact Existing"),
  sfContactOwner: z
    .array(ValueFilterSchema)
    .optional()
    .describe("Salesforce Contact Owner"),
  sfContactName: z
    .array(crmValueFilterSchema)
    .optional()
    .describe(
      "Filter by Salesforce Contact Name. Requires recordId and name pairs. IMPORTANT: Use the 'search_mmi_records' tool with entityType='CONTACT' to search and retrieve matching contact recordIds and names based on search text."
    ),
});

export const salesforceFilterSchema = z.object({
  account: accountSchema.optional().describe("Salesforce Account Schema"),
  lead: leadSchema.optional().describe("Salesforce Lead Schema"),
  contact: contactSchema.optional().describe("Salesforce Contact Schema"),
});

export type SalesforceFilter = z.infer<typeof salesforceFilterSchema>;
