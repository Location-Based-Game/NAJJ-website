import { z } from "zod";

export function validateSearchParams<T>(url: string, schema: z.ZodObject<any>) {
  const { searchParams } = new URL(url);

  const params: { [key: string]: string | null } = {};
  const keys = Object.keys(schema.shape);

  for (let key of keys) {
    params[key] = searchParams.get(key);
  }

  const validatedData = schema.safeParse(params);

  if (!validatedData.success) {
    console.error(validatedData.error);
    throw new Error("Invalid Data!");
  }

  return validatedData.data as T
}
