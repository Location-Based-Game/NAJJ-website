import { setSessionCookie } from "@/lib/setSessionCookie";
import { validateSearchParams } from "@/lib/validateSearchParams";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const logInSchema = z.object({
  gameId: z.string().length(4).nullable(),
});

//LOG IN
export async function GET(request: NextRequest) {
  let { gameId } = validateSearchParams<z.infer<typeof logInSchema>>(
    request.url,
    logInSchema,
  );

  if (!gameId) {
    gameId = makeid(4);
  }

  await setSessionCookie("", "", gameId);

  return NextResponse.json(gameId);
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
