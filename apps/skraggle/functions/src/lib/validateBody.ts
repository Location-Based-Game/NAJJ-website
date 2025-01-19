import { type Request } from "express";
import { z } from "zod";

export default function validateBody<TBody extends (Request["body"] | string), TSchema extends z.AnyZodObject>(
  body: TBody,
  schema: TSchema,
) {
  const validatedData = schema.safeParse(
    typeof body === "string" ? JSON.parse(body) : body,
  );

  if (!validatedData.success) {
    throw new Error("Invalid Data!");
  }

  return validatedData.data as z.infer<TSchema>;
}
