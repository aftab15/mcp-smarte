import { z } from "zod";

/**
 * Contact accuracy/score grade filter schema
 * Filters contacts by their data accuracy score (A+, A, A-, B+)
 */
export const AccuracyFilterSchema = z.object({
  values: z.array(z.enum(["A+", "A", "A-", "B+"])),
  type: z.enum(["INCLUDE", "EXCLUDE"]),
});

export const exclusionsSchema = z.object({
  id: z.bigint().optional().describe("Exclusion ID"),
  type: z.enum(["EXCLUDE"]).describe("Exclusion type"),
  value: z
    .enum([
      "MY_REVEALED_EXPORTED_LEADS",
      "MY_EXPORTED_ACCOUNTS",
      "ORG_REVEALED_EXPORTED_LEADS",
      "ORG_EXPORTED_ACCOUNTS",
    ])
    .describe(
      "Exclusion value MY_REVEALED_EXPORTED_LEADS, MY_EXPORTED_ACCOUNTS, ORG_REVEALED_EXPORTED_LEADS, ORG_EXPORTED_ACCOUNTS"
    ),
});

export const miscellaneousFilterSchema = z.object({
  dataGrade: AccuracyFilterSchema.optional().describe(
    "Contact accuracy/score grade filter schema"
  ),
  exclusions: z
    .array(exclusionsSchema)
    .optional()
    .describe("List of exclusions to filter by. Only EXCLUDE is allowed"),
});

export type MiscellaneousFilter = z.infer<typeof miscellaneousFilterSchema>;
