import { z } from "zod";
import { RangeFilterSchema } from "../CommonRequest";

export const lastFundingDateSchema = z.object({
  value: z.enum(["IN_PAST_6_MONTHS", "IN_PAST_12_MONTHS", "IN_PAST_18_MONTHS"]),
  type: z.enum(["INCLUDE", "EXCLUDE"]),
});

export const lastFundingRoundSchema = z.object({
  value: z.enum(["SEED", "ANGEL", "SERIES_A", "SERIES_B", "SERIES_C", "OTHER"]),
  type: z.enum(["INCLUDE", "EXCLUDE"]),
});

export const fundingFilterSchema = z.object({
  lastFundingDate: lastFundingDateSchema
    .optional()
    .describe("Last funding date to filter by"),
  totalFundingAmount: RangeFilterSchema.optional().describe(
    "Total funding amount to filter by"
  ),
  lastFundingRound: z
    .array(lastFundingRoundSchema)
    .optional()
    .describe("Last funding round to filter by"),
  totalFundingRounds: RangeFilterSchema.optional().describe(
    "Total funding rounds to filter by"
  ),
});

export type FundingFilter = z.infer<typeof fundingFilterSchema>;
