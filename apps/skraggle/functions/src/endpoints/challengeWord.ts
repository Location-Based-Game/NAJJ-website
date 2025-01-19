import { db } from "../lib/firebaseAdmin";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import { getSessionData } from "../lib/sessionUtils";
import validateBody from "../lib/validateBody";
import { challengeWordSchema } from "../../../schemas/challengeWordSchema";

export const challengeWord = onAuthorizedRequest(async (request, response) => {
  const validatedData = validateBody<typeof challengeWordSchema>(
    request.body,
    challengeWordSchema,
  );
  const { wordId, wageredLetters } = validatedData;

  if (Object.keys(wageredLetters).length === 0) {
    throw new Error("No letters wagered!");
  }

  const { gameId, playerId } = await getSessionData(request);

  const wordIdRef = db.ref(
    `activeGames/${gameId}/challengeWords/words/${wordId}`,
  );
  const wordIdSnapshot = await wordIdRef.get();
  if (!wordIdSnapshot.exists()) {
    response.status(400).send({ error: "Error: Invalid wordId!" });
    return;
  }

  const challengersRef = wordIdRef.child("challengers")
  await challengersRef.update({ [playerId]: wageredLetters });

  response.send({ data: "Success" });
});
