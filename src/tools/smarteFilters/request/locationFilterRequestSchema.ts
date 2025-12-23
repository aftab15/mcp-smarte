import { z } from "zod";

export const locationFilterDataSchema = z.object({
  value: z
    .string()
    .min(1)
    .describe(
      "Search text value to filter by (e.g., region, country, state, or city). In the context of SMARTe's available locations, this value is used to filter by region, country, state, or city."
    ),
});

/**
 * Pagination Schema
 */
export const locationPaginationSchema = z.object({
  page_size: z
    .number()
    .int()
    .positive()
    .default(50)
    .describe("Number of results per page (default: 50)"),
  page_no: z
    .number()
    .int()
    .positive()
    .default(1)
    .describe("Page number (default: 1)"),
});

export const locationFilterRequestSchema = z.object({
  data: locationFilterDataSchema.describe(
    "Search data containing the location filter value"
  ),
  pagination: locationPaginationSchema
    .optional()
    .describe("Pagination parameters for result set"),
});

export type locationFilterRequest = z.infer<typeof locationFilterRequestSchema>;
export type locationFilterData = z.infer<typeof locationFilterDataSchema>;
export type locationPagination = z.infer<typeof locationPaginationSchema>;
