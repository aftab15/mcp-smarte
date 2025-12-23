import { z } from "zod";
import {
  ValueFilterSchema,
  DataItemAccountSchema,
  RangeFilterSchema,
} from "../CommonRequest";
import { LocationFilterSchema } from "./contactFilterRequestSchemas";
import { FUNCTION_NAMES } from "../../constants/contactFunctions";

/**
 * Company revenue filter schema
 * Filters companies by their revenue range
 */
export const CompanyRevenueValueFilterSchema = z.object({
  name: z.enum([
    "$0 - $500K",
    "$500K - $1M",
    "$1M - $5M",
    "$5M - $10M",
    "$10M - $25M",
    "$25M - $50M",
    "$50M - $100M",
    "$100M - $250M",
    "$250M - $500M",
    "$500M - $1B",
    "$1B - $5B",
    "$5B - $10B",
    "$10B+",
  ]),
  type: z.enum(["INCLUDE", "EXCLUDE"]),
});

/**
 * Company employee size filter schema
 * Filters companies by their employee count range
 */
export const CompanyEmployeeSizeValueFilterSchema = z.object({
  size_type: z
    .enum(["FIXED_RANGE", "CUSTOM_RANGE"])
    .describe("Type of employee headcount range to filter by"),

  fixed_range: z
    .array(
      z.object({
        name: z.enum([
          "1 to 10",
          "11 to 50",
          "51 to 200",
          "201 to 500",
          "501 to 1000",
          "1001 to 5000",
          "5001 to 10,000",
          "10,001+",
        ]),
        type: z.enum(["INCLUDE", "EXCLUDE"]),
      })
    )
    .optional()
    .describe("Fixed employee headcount range to filter by"),
  custom_range: RangeFilterSchema.optional().describe(
    "Custom employee headcount range to filter by"
  ),
});

export const AccountSignalSchema = z.object({
  values: z
    .array(ValueFilterSchema)
    .optional()
    .describe("List of account signals to filter by"),
  type: z.enum([
    "IN_PAST_1_MONTHS",
    "IN_PAST_3_MONTHS",
    "IN_PAST_6_MONTHS",
    "IN_PAST_9_MONTHS",
  ]),
});

export const FortuneSchema = z.object({
  type: z.enum(["INCLUDE", "EXCLUDE"]),
  values: z
    .array(
      z.enum([
        "FORTUNE_50",
        "FORTUNE_51_100",
        "FORTUNE_101_250",
        "FORTUNE_251_500",
      ])
    )
    .optional()
    .describe(
      "List of Fortune 50, 51-100, 101-250, and 251-500 companies to filter by"
    ),
});

export const departmentHeadCountSchema = z.object({
  department: z.object({
    name: z.enum(FUNCTION_NAMES),
    type: z.enum(["INCLUDE", "EXCLUDE"]),
  }),
  headCount: RangeFilterSchema.describe("Department headcount to filter by"),
});

export const industrySchema = z.object({
  type: z.enum(["INCLUDE", "EXCLUDE"]),
  code: z
    .string()
    .describe(
      "Industry code to filter by. to get the list of industry codes, use the search_filter_values tool and consider name or id as code"
    ),
  name: z
    .string()
    .optional()
    .describe(
      "Industry name to filter by. to get the list of industry names, use the search_filter_values tool and consider description as name"
    ),
});

/**
 * Technographics type enum
 * Categories for technology stack filtering
 */
export const TechnoGraphicsTypeEnum = [
  "TECHNOLOGY",
  "VENDOR",
  "CATEGORY",
] as const;

/**
 * Technographics schema
 * Map of technographic type to list of data items
 * Key: TechnoGraphicsTypeEnum (TECHNOLOGY, VENDOR, CATEGORY)
 * Value: List of ValueFilterSchema
 */
export const technographicsSchema = z
  .record(z.enum(TechnoGraphicsTypeEnum), z.array(ValueFilterSchema))
  .describe(
    "Technographics to filter by. Map of technographic type (TECHNOLOGY, VENDOR, CATEGORY) to list of filter values."
  );

/**
 * Comprehensive company filter schema
 * Aggregates all company-related filters for advanced search
 */
export const CompanyFilterSchema = z.object({
  comp_guid: z
    .string()
    .optional()
    .describe("List of Unique company SMARTe identifier IDs to search for"),
  company: z
    .array(DataItemAccountSchema)
    .optional()
    .describe(
      "List of Unique company names to search for if comp_guid provided."
    ),
  accountSignal: AccountSignalSchema.optional().describe(
    "Account signals to filter by"
  ),
  foundedYear: RangeFilterSchema.optional().describe(
    "Founded year to filter by"
  ),
  fortune: FortuneSchema.optional().describe(
    "Fortune 50, 51-100, 101-250, and 251-500 companies to filter by"
  ),
  departmentHeadCount: departmentHeadCountSchema
    .optional()
    .describe("Department headcount to filter by"),

  location: LocationFilterSchema.optional().describe(
    "Company  Global HQ locations to filter by. IMPORTANT: Always use the 'location_filter' tool to retrieve available locations."
  ),
  globalHeadCount: CompanyEmployeeSizeValueFilterSchema.optional().describe(
    "Company Global headcount to filter by"
  ),
  globalRevenue: z
    .array(CompanyRevenueValueFilterSchema)
    .optional()
    .describe("Company Global revenue to filter by"),
  industry: z
    .array(industrySchema)
    .optional()
    .describe(
      "List of industries to filter by. IMPORTANT: Always use the search_filter_values tool with type='INDUSTRY' before adding industry codes. Use the 'name' or 'id' field from the tool response as the code value. Always prefer exact match or parent industry category over broader/child matches."
    ),

  technographics: technographicsSchema
    .optional()
    .describe(
      "Technographics to filter by. IMPORTANT: Always use the search_filter_values tool with type='TECHNOGRAPHIC' before adding technographic codes. Use the 'name' or 'id' field from the tool response as the code value. Always prefer exact match or parent technographic category over broader/child matches."
    ),
  companyKeywords: z
    .array(ValueFilterSchema)
    .optional()
    .describe("List of company keywords to filter by"),
  isMultiNationalCompany: z
    .string()
    .optional()
    .describe(
      "Indicates if the company is a multinational company. Filter by in Yes or No"
    ),
  isSubsidiary: z
    .string()
    .optional()
    .describe(
      "Indicates if the company is owned or controlled by another company. Filter by in Yes or No"
    ),
});

/**
 * Company filter type
 */
export type CompanyFilter = z.infer<typeof CompanyFilterSchema>;
