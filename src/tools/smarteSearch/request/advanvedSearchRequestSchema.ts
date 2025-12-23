import z from "zod";
import { CompanyFilterSchema } from "./filtersRequest/companyFilterRequestSchemas";
import { ContactFilterSchema } from "./filtersRequest/contactFilterRequestSchemas";
import { fundingFilterSchema } from "./filtersRequest/fundingFilterRequestSchemas";
import { workFlowFilterSchema } from "./filtersRequest/workFlowFilterRequestSchema";
import { miscellaneousFilterSchema } from "./filtersRequest/miscellaneousFilterSchemas";
import { salesforceFilterSchema } from "./filtersRequest/salesforceFilterRequestSchemas";

// Create filter schema for data field
export const FilterDataSchema = z.object({
  company_info: CompanyFilterSchema.optional().describe(
    "Company filter schema"
  ),
  person_info: ContactFilterSchema.optional().describe("Person filter schema"),
  funding: fundingFilterSchema.optional().describe("Funding filter schema"),
  work_flow: workFlowFilterSchema
    .optional()
    .describe("Work flow filter schema"),
  miscellaneous: miscellaneousFilterSchema
    .optional()
    .describe("Miscellaneous filter schema"),
  salesforce: salesforceFilterSchema
    .optional()
    .describe("Salesforce filter schema"),
});

// Create input schema with nested data structure
export const AdvancedSearchToolSchema = z.object({
  data: FilterDataSchema.describe("All filter schemas"),
  type: z
    .enum(["ADVANCED_SEARCH_ACCOUNT", "ADVANCED_SEARCH_LEAD"])
    .describe(
      "Type of records requested by the user, e.g., 'ADVANCED_SEARCH_ACCOUNT' or 'ADVANCED_SEARCH_LEAD'"
    ),
  pagination: z.object({
    page_size: z.number().optional().describe("Page size"),
    page_no: z.number().optional().describe("Page number"),
  }),
});

export type AdvancedSearchToolInput = z.infer<typeof AdvancedSearchToolSchema>;
