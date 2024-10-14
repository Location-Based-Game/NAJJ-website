"use server";

import { encryptJWT } from "@/lib/encryptJWT";
import { cookies } from "next/headers";
import { z } from "zod";

const logInSchema = z.object({
  gameId: z.string().length(4).optional(),
});

type LogInType = z.infer<typeof logInSchema>;

export async function logIn(data: LogInType) {
  const validatedData = logInSchema.safeParse(data);

  if (!validatedData.success) {
    console.error(validatedData.error);
    throw new Error("Invalid Data!");
  }

  let { gameId } = validatedData.data

  if (!gameId) {
    gameId = makeid(4)
  }

  const expires = new Date(Date.now() + 100 * 1000)
  const session = await encryptJWT({gameId, playerId: "", expires})

  cookies().set('session', session, {expires, httpOnly: true})

  return gameId
}

function makeid(length: number): string {
    if (
      process.env.NODE_ENV === "development" &&
      process.env.NEXT_PUBLIC_USE_PLACEHOLDER_CODE === "true"
    ) {
      return process.env.NEXT_PUBLIC_PLACEHOLDER_CODE;
    }
  
    let result = "";
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }
