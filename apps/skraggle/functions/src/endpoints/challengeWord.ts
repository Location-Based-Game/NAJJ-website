import { z } from "zod";
import { db } from "../lib/firebaseAdmin";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import { getSessionData } from "../lib/sessionUtils";
import { Item } from "../schemas/itemSchema";

const challengeWordSchema = z.object({
  wordId: z.string(),
  wageredItems: z.record(z.custom<Item<any>>())
});

export type ChallengeWordSchemaType = z.infer<typeof challengeWordSchema>

export const challengeWord = onAuthorizedRequest(async (request, response) => {
  const validatedData = challengeWordSchema.safeParse(JSON.parse(request.body));
  if (!validatedData.success) {
    response.send({ error: "Invalid Data!" });
    return;
  }
  const { wordId, wageredItems } = validatedData.data;

  const { gameId, playerId } = await getSessionData(request);
  const challengersRef = db.ref(
    `activeGames/${gameId}/challengeWords/words/${wordId}/challengers`,
  );
  await challengersRef.update({ [playerId]: wageredItems });
  
  response.send({ data: "Success" });
});
