import { number, z } from "zod";
import { RangeFilterSchema, ValueFilterSchema } from "../CommonRequest";
import {
  FUNCTION_NAMES,
  getSubFunctionNames,
} from "../../constants/contactFunctions";

/**
 * Contact level filter schema
 * Filters contacts by their organizational level
 */
export const ContactLevelValueFilterSchema = z.object({
  name: z.enum([
    "Founder/CXO",
    "VP",
    "MD",
    "Director",
    "Head",
    "Manager",
    "Board Members/Trustee",
    "Staff/Principal",
    "Below Manager",
  ]),
  type: z.enum(["INCLUDE", "EXCLUDE"]),
});

/**
 * Sub-function filter schema
 * Filters contacts by their sub-function within a department
 */
export const SubFunctionFilterSchema = z.object({
  name: z.string(),
  type: z.enum(["INCLUDE", "EXCLUDE"]),
});

/**
 * Contact function filter schema
 * Filters contacts by their primary function/department
 * Validates that subfunctions belong to the parent function
 */
export const ContactFunctionFilterSchema = z
  .object({
    name: z
      .enum(FUNCTION_NAMES)
      .describe(
        "Function/Department name. Use the 'get_function_subfunctions' tool to retrieve available subfunctions for any function before filtering by subfunctions."
      ),
    type: z.enum(["INCLUDE", "EXCLUDE"]),
    subFunction: z
      .array(SubFunctionFilterSchema)
      .optional()
      .describe(
        "List of contact sub-functions to filter by. Each subfunction must be valid for the selected function. Call 'get_function_subfunctions' tool first to see available subfunctions."
      ),
  })
  .superRefine((data, ctx) => {
    // Validate that subfunctions belong to the parent function
    if (data.subFunction && data.subFunction.length > 0) {
      const validSubFunctions = getSubFunctionNames(data.name);

      data.subFunction.forEach((subFunc, index) => {
        if (!validSubFunctions.includes(subFunc.name)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Invalid subfunction "${subFunc.name}" for function "${
              data.name
            }". Valid subfunctions are: ${validSubFunctions.join(
              ", "
            )}. Use 'get_function_subfunctions' tool to see all available subfunctions.`,
            path: ["subFunction", index, "name"],
          });
        }
      });
    }
  });

export const RadiusFilterSchema = z.object({
  radius: z.enum([
    "WITHIN_25_MILES",
    "WITHIN_50_MILES",
    "WITHIN_100_MILES",
    "WITHIN_200_MILES",
    "WITHIN_300_MILES",
  ]),
});

export const LocationFilterSchema = z.object({
  regions: z
    .array(ValueFilterSchema)
    .optional()
    .describe(
      "List of contact regions to filter by. Use the 'location_filter' tool to retrieve available regions."
    ),
  countries: z
    .array(ValueFilterSchema)
    .optional()
    .describe(
      "List of contact countries to filter by. Use the 'location_filter' tool to retrieve available countries."
    ),
  states: z
    .array(ValueFilterSchema)
    .optional()
    .describe(
      "List of contact states to filter by. Use the 'location_filter' tool to retrieve available states."
    ),
  cities: z
    .array(ValueFilterSchema)
    .optional()
    .describe(
      "List of contact cities to filter by. Use the 'location_filter' tool to retrieve available cities."
    ),
  zipcodes: z
    .array(ValueFilterSchema)
    .optional()
    .describe("List of contact zipcodes to filter by. "),
  radius: RadiusFilterSchema.optional().describe(
    "Radius filter to filter contacts based on their location. when use this filter, zipcodes are required."
  ),
});

export const ContactKeywordsFilterSchema = z.object({
  values: z
    .array(ValueFilterSchema)
    .optional()
    .describe("List of contact keywords to filter by"),
  type: z.enum([
    "CURRENT_JOB_TITLE",
    "CURRENT_JOB_DESCRIPTION_OR_JOB_TITLE",
    "ALL_JOBS_OR_BIO",
  ]),
});

export const jobChangeFilterSchema = z.object({
  value: z.enum(["IN_PAST_4_MONTHS", "IN_PAST_6_MONTHS", "IN_12_MONTHS"]),
});

export const designationChangeFilterSchema = z.object({
  value: z.enum([
    "IN_PAST_1_MONTHS",
    "IN_PAST_3_MONTHS",
    "IN_PAST_6_MONTHS",
    "IN_PAST_12_MONTHS",
  ]),
});

export const searchTextSchema = z.object({
  value: z.string().optional().describe("Search text to filter contacts by"),
});

/**
 * Comprehensive contact filter schema
 * Aggregates all contact-related filters for advanced search
 */
export const ContactFilterSchema = z.object({
  search_text: searchTextSchema
    .optional()
    .describe("Search text to filter contacts by"),
  level: z
    .array(ContactLevelValueFilterSchema)
    .optional()
    .describe("List of contact levels to filter by"),
  department: z
    .array(ContactFunctionFilterSchema)
    .optional()
    .describe("List of contact functions or departments to filter by"),
  location: z
    .array(LocationFilterSchema)
    .optional()
    .describe(
      "List of contact locations to filter by. Use the 'location_filter' tool to retrieve available locations."
    ),
  contactKeywords: ContactKeywordsFilterSchema.optional().describe(
    "List of contact keywords to filter by. It can be filtered by current job title, current job description or job title, or all jobs or bio."
  ),
  totalYearsOfExperience: RangeFilterSchema.optional().describe(
    "Contact total years of experience to filter by"
  ),
  yearsInCurrentCompany: RangeFilterSchema.optional().describe(
    "Contact years in current company to filter by"
  ),
  yearsInCurrentRole: RangeFilterSchema.optional().describe(
    "Contact years in current role to filter by"
  ),
  timeZone: z
    .array(ValueFilterSchema)
    .optional()
    .describe("List of contact time zones to filter by"),
  accountList: z
    .array(z.number())
    .optional()
    .describe("List of SMARTe created account-list IDs to filter by"),
  leadList: z
    .array(z.number())
    .optional()
    .describe("List of SMARTe created lead-list IDs to filter by"),
});

/**
 * Contact filter type
 */
export type ContactFilter = z.infer<typeof ContactFilterSchema>;
