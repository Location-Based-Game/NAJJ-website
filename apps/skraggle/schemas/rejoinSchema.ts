import { z } from "zod";
import { sessionSchema } from "./sessionSchema";

export const rejoinSchema = sessionSchema.extend({
  isHost: z.boolean(),
});

export type RejoinSchemaType = z.infer<typeof rejoinSchema>