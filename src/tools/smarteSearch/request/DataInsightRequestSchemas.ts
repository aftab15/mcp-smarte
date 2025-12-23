import { z } from "zod";
import { FilterDataSchema } from "./advanvedSearchRequestSchema";

/**
 * Level One Enum - Primary aggregation level
 */
const LevelOneEnum = z.enum([
  "EMPLOYEE_SIZE",
  "COMPANY_REGION",
  "COMPANY_COUNTRY",
  "WORK_LOCATION_REGION",
  "WORK_LOCATION_COUNTRY",
  "REVENUE",
  "INDUSTRY",
  "TECHNOGRAPHICS",
  "LEVEL",
  "FUNCTION",
  "COMPANY_NAME",
]);

/**
 * Level Two Enum - Secondary aggregation level (optional)
 */
const LevelTwoEnum = z.enum([
  "COMPANY_REGION",
  "COMPANY_COUNTRY",
  "WORK_LOCATION_REGION",
  "WORK_LOCATION_COUNTRY",
  "EMPLOYEE_SIZE",
  "REVENUE",
  "LEVEL",
  "FUNCTION",
]);

/**
 * Aggregation levels schema for data insights breakdown
 */
const AggregationLevelsSchema = z.object({
  levelOneEnum: LevelOneEnum.describe("Primary aggregation level"),
  levelTwoEnum: LevelTwoEnum.optional().describe(
    "Secondary aggregation level (optional)"
  ),
});

// Create filter schema for data insights
const DataInsightsFilterDataSchema = FilterDataSchema.extend({
  aggregation_levels: AggregationLevelsSchema.describe(
    "Required aggregation levels for data breakdown - specify levelOneEnum and optionally levelTwoEnum"
  ),
});

// Create data insights input schema with nested data structure
export const DataInsightRequestToolSchema = z.object({
  data: DataInsightsFilterDataSchema.describe(
    "All filter schemas with aggregation levels"
  ),
  type: z
    .enum(["ADVANCED_SEARCH_ACCOUNT", "ADVANCED_SEARCH_LEAD"])
    .describe(
      "Type of records requested by the user, e.g., 'ADVANCED_SEARCH_ACCOUNT' or 'ADVANCED_SEARCH_LEAD'"
    ),
  size: z
    .number()
    .optional()
    .describe(
      "Number of records to return. Include this field only if the user explicitly requests a specific number of records."
    ),
});

export type DataInsightRequestToolInput = z.infer<
  typeof DataInsightRequestToolSchema
>;
