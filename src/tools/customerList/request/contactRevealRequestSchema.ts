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
      "Reveals contact phone numbers or work emails using contact–company GUID pairs. Requires an array of GUID pairs (at least one). Supports single or multiple reveal requests."
    ),
});

/**
 * Type exports
 */
export type ContactRevealDataItem = z.infer<typeof ContactRevealDataItemSchema>;
export type ContactRevealRequest = z.infer<typeof ContactRevealRequestSchema>;
