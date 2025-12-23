import { z } from "zod";

/**
 * MMI Filter Type Enum (CRM Systems)
 */
export const MMIFilterTypeEnum = [
  "SALESFORCE",
  "HUBSPOT",
  "DYNAMICS",
  "MARKETO",
] as const;

/**
 * Entity Type Enum (CRM Entities)
 */
export const EntityTypeEnum = ["LEAD", "CONTACT", "ACCOUNT"] as const;

/**
 * MMI Filter Data Schema
 * Schema for MMI filter search data
 */
export const MMIFilterDataSchema = z.object({
  value: z
    .string()
    .min(1)
    .describe("Search text value to filter by (e.g., name, keyword)"),
  entityType: z
    .enum(EntityTypeEnum)
    .optional()
    .default("LEAD")
    .describe(
      "Type of CRM entity to search - LEAD, CONTACT, or ACCOUNT (default: LEAD)"
    ),
});

/**
 * Pagination Schema
 */
export const MMIPaginationSchema = z.object({
  page_size: z
    .number()
    .int()
    .positive()
    .optional()
    .default(50)
    .describe("Number of results per page (default: 50)"),
  page_no: z
    .number()
    .int()
    .positive()
    .optional()
    .default(1)
    .describe("Page number (default: 1)"),
});

/**
 * MMI Filter Request Schema
 * Schema for MMI filter API request
 */
export const MMIFilterRequestSchema = z.object({
  data: MMIFilterDataSchema.describe(
    "Search data containing the filter value"
  ),
  type: z
    .enum(MMIFilterTypeEnum)
    .describe(
      "Type of CRM system to search - SALESFORCE, HUBSPOT, DYNAMICS, or MARKETO"
    ),
  pagination: MMIPaginationSchema.optional().describe(
    "Pagination parameters for result set"
  ),
});

/**
 * Type exports
 */
export type MMIFilterType = (typeof MMIFilterTypeEnum)[number];
export type EntityType = (typeof EntityTypeEnum)[number];
export type MMIFilterData = z.infer<typeof MMIFilterDataSchema>;
export type MMIPagination = z.infer<typeof MMIPaginationSchema>;
export type MMIFilterRequest = z.infer<typeof MMIFilterRequestSchema>;
