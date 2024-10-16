import { z } from "zod";

export function validateSearchParams<T>(url: string, schema: z.ZodObject<any>) {
  const { searchParams } = new URL(url);

  //loops through schema keys and checks if there's a matching search param
  const params: { [key: string]: string | null } = {};
  const schemaKeys = Object.keys(schema.shape);
  for (let key of schemaKeys) {
    params[key] = searchParams.get(key);
  }

  const validatedData = schema.safeParse(params);

  if (!validatedData.success) {
    console.error(validatedData.error);
    throw new Error("Invalid Data!");
  }

  return validatedData.data as T
}
