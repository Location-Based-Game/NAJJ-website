import { onRequest } from "firebase-functions/https";
import { z } from "zod";
import { setSessionCookie } from "../lib/sessionUtils";

const logInSchema = z.object({
  gameId: z.string().length(4).nullable(),
});

export const logIn = onRequest({ cors: true }, async (request, response) => {
  response.set("Access-Control-Allow-Credentials", "true");

  try {
    const validatedData = logInSchema.safeParse(JSON.parse(request.body));

    if (!validatedData.success) {
      response.send({ error: "Invalid Data!" });
      return;
    }

    let { gameId } = validatedData.data;

    if (!gameId) {
      gameId = makeid(4);
    }

    await setSessionCookie(response, {
      gameId,
      playerId: "",
      playerName: "",
    });

    response.send({ data: gameId });
  } catch (error) {
    response.send({ error: `${error}` });
  }
});

function makeid(length: number): string {
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
