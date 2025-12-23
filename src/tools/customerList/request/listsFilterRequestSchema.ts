import { z } from "zod";

/**
 * Lists Filter Type Enum
 */
export const ListsFilterTypeEnum = ["LEAD", "ACCOUNT"] as const;

/**
 * Pagination Schema
 */
export const ListsFilterPaginationSchema = z.object({
  pageIndex: z
    .number()
    .int()
    .min(1)
    .describe("Page index starting from 1")
    .optional()
    .default(1),
  pageSize: z
    .number()
    .int()
    .min(1)
    .max(200)
    .describe("Number of records per page, max 200")
    .optional()
    .default(50),
  page_no: z
    .number()
    .int()
    .min(1)
    .describe("Alias for page index (for backend compatibility)")
    .optional()
    .default(1),
});

/**
 * Lists Filter Data Schema
 */
export const ListsFilterDataSchema = z.object({
  searchText: z
    .string()
    .describe("Search text to filter lists")
    .optional()
    .default(""),
});

/**
 * Lists Filter Request Schema
 */
export const ListsFilterRequestSchema = z.object({
  data: ListsFilterDataSchema.describe(
    "Lists filter data containing search text"
  ),
  pagination: ListsFilterPaginationSchema.describe(
    "Pagination info: pageIndex, pageSize, page_no"
  ),
  type: z
    .enum(ListsFilterTypeEnum)
    .describe("Type of list to filter - LEAD or ACCOUNT"),
});

interface ListDetails {
  id?: number;
  listName?: string;
  listStatus?: string;
  status?: string;
  public?: boolean;
  leadShares?: unknown;
}

interface ListFilterDataResponseScheam {
  currentPage?: number;
  leadLists?: ListDetails[];
  accountLists?: ListDetails[];
  total?: number;
  totalPages?: number;
}

interface StatusSchema {
  statusCode?: number;
  requestId?: string;
  message?: string;
}

export interface ListsFilterResponseSchema {
  status: StatusSchema;
  data: ListFilterDataResponseScheam;
}

/**
 * Type exports
 */
export type ListsFilterType = (typeof ListsFilterTypeEnum)[number];
export type ListsFilterPagination = z.infer<typeof ListsFilterPaginationSchema>;
export type ListsFilterData = z.infer<typeof ListsFilterDataSchema>;
export type ListsFilterRequest = z.infer<typeof ListsFilterRequestSchema>;
