import { z } from "zod";

/**
 * Basic value filter schema used across multiple filter types
 */
export const ValueFilterSchema = z.object({
  id: z.number().optional().describe("Unique identifier ID"),
  name: z.string().optional().describe("Unique name"),
  code: z.string().optional().describe("Unique code"),
  source: z.string().optional().describe("Unique source"),
  latlong: z
    .record(z.string(), z.string())
    .optional()
    .describe("Unique latlong"),
  type: z.enum(["INCLUDE", "EXCLUDE"]),
});

export const crmValueFilterSchema = z.object({
  recordId: z.string().describe("Unique identifier ID"),
  name: z.string().optional().describe("Unique name"),
  type: z.enum(["INCLUDE", "EXCLUDE"]),
});
/**
 * Range filter schema for numeric ranges
 */
export const RangeFilterSchema = z.object({
  min: z.number().optional().describe("Minimum value for the range filter"),
  max: z.number().optional().describe("Maximum value for the range filter"),
});

/**
 * Date range filter schema
 */
export const DateRangeFilterSchema = z.object({
  start_date: z
    .string()
    .optional()
    .describe("Start datetime in 'YYYY-MM-DD HH:MM:SS.sss' format"),
  end_date: z
    .string()
    .optional()
    .describe("End datetime in 'YYYY-MM-DD HH:MM:SS.sss' format"),
});

export const DataItemAccountSchema = z.object({
  id: z.number().optional().describe("Unique company SMARTe identifier ID"),
  name: z.string().optional().describe("Unique company name"),
  pc_comp_guid: z
    .string()
    .describe(
      "Unique SMARTe company GUID (pc_comp_guid). IMPORTANT: Always use the 'enrich Account' tool to retrieve available pc_comp_guid."
    ),
  type: z.enum(["INCLUDE", "EXCLUDE"]).optional().describe("Type of filter"),
});
