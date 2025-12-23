import { z } from "zod";
import { ValueFilterSchema } from "../CommonRequest";
import { ContactFilterSchema } from "./contactFilterRequestSchemas";

export const personaSchema = z.object({
  personaId: z.bigint().describe("Unique persona ID"),
  personaName: z.string().describe("Unique persona name"),
  personaJson: ContactFilterSchema.describe("person info"),
  type: z.enum(["INCLUDE", "EXCLUDE"]).describe("Type of filter"),
});

export const workFlowFilterSchema = z.object({
  persona: z
    .array(personaSchema)
    .optional()
    .describe(
      "List of personas to filter by. to get the required persona info calling respected tool"
    ),
  leadList: z
    .array(ValueFilterSchema)
    .optional()
    .describe(
      "List of SMARTe created lead-list IDs to filter by. to get the required created all lead lists calling respected tool"
    ),
  accountList: z
    .array(ValueFilterSchema)
    .optional()
    .describe(
      "List of SMARTe created account-list IDs to filter by. to get the required created all account lists calling respected tool"
    ),
});

export type WorkFlowFilter = z.infer<typeof workFlowFilterSchema>;
