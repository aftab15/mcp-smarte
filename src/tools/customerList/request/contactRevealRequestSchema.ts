import { z } from "zod";

/**
 * Contact Reveal Data Item Schema
 * Schema for individual contact reveal request item
 */
export const ContactRevealDataItemSchema = z.object({
  conGuid: z
    .string()
    .describe("Contact GUID - Unique identifier for the contact"),
  compGuid: z
    .string()
    .describe("Company GUID - Unique identifier for the company"),
});

/**
 * Contact Reveal Request Schema
 * Schema for contact reveal API request
 */
export const ContactRevealRequestSchema = z.object({
  data: z
    .array(ContactRevealDataItemSchema)
    .min(1)
    .describe(
      "Array of contact and company GUID pairs to reveal. At least one pair is required."
    ),
});

/**
 * Type exports
 */
export type ContactRevealDataItem = z.infer<typeof ContactRevealDataItemSchema>;
export type ContactRevealRequest = z.infer<typeof ContactRevealRequestSchema>;
