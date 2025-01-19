import { type Request } from "express";
import { z, ZodTypeAny } from "zod";

export default function validateBody<TSchema extends ZodTypeAny>(
  body: Request["body"] | string,
  schema: z.AnyZodObject,
) {
  const validatedData = schema.safeParse(
    typeof body === "string" ? JSON.parse(body) : body,
  );

  if (!validatedData.success) {
    throw new Error("Invalid Data!");
  }

  return validatedData.data as z.infer<TSchema>;
}
