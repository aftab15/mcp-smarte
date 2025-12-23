/**
 * Filter Values Request Schema
 * Zod schemas for validating filter values search requests
 */

import { z } from "zod";

/**
 * Filter type enum schema
 */
export const FilterTypeEnum = z.enum([
  "INDUSTRY",
  "TECHNOGRAPHICS_PRODUCT",
  "TECHNOGRAPHICS_CATEGORY",
  "TECHNOGRAPHICS_VENDOR",
]);

/**
 * Data object schema for filter values request
 */
export const FilterValuesDataSchema = z.object({
  value: z.string().min(1, "Search value cannot be empty"),
});

/**
 * Main filter values request schema
 */
export const FilterValuesRequestSchema = z.object({
  data: FilterValuesDataSchema,
  type: FilterTypeEnum,
  top_k: z.number().int().positive().optional().default(5),
});

/**
 * Type exports
 */
export type FilterType = z.infer<typeof FilterTypeEnum>;
export type FilterValuesData = z.infer<typeof FilterValuesDataSchema>;
export type FilterValuesRequest = z.infer<typeof FilterValuesRequestSchema>;
