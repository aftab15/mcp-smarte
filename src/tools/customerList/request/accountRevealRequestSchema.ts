import { z } from "zod";

/**
 * Account Reveal Type Enum
 */
export const AccountRevealTypeEnum = ["EXISTING", "NEW"] as const;

/**
 * Account Reveal Data Schema
 * Schema for account reveal request data (metadata)
 */
export const AccountRevealDataSchema = z.object({
  type: z
    .enum(AccountRevealTypeEnum)
    .describe("Type of reveal operation - EXISTING or NEW")
    .optional()
    .default("EXISTING"),
  revealSource: z
    .string()
    .describe("Source of the reveal request (e.g., 'Employee List')")
    .optional()
    .default("Employee List"),
  compGuids: z
    .array(z.string())
    .min(1)
    .describe("Array of company GUIDs to reveal. At least one is required."),
});

/**
 * Account Reveal Request Schema
 * Schema for account reveal API request
 */
export const AccountRevealRequestSchema = z.object({
  data: AccountRevealDataSchema.describe(
    "Account reveal data containing type and source"
  ),
});

/**
 * Type exports
 */
export type AccountRevealType = (typeof AccountRevealTypeEnum)[number];
export type AccountRevealData = z.infer<typeof AccountRevealDataSchema>;
export type AccountRevealRequest = z.infer<typeof AccountRevealRequestSchema>;
