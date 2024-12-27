import { db } from "../lib/firebaseAdmin";
import { onAuthorizedRequest } from "../lib/onAuthorizedRequest";
import { getSessionData } from "../lib/sessionUtils";
import { submittedWordSchema } from "../schemas/wordDataSchema";

export const submitWord = onAuthorizedRequest(async (request, response) => {
  const validatedData = submittedWordSchema.safeParse(JSON.parse(request.body));
  if (!validatedData.success) {
    response.send({ error: "Invalid Data!" });
    return;
  }
  const { wordsData } = validatedData.data;

  const { gameId, playerId } = await getSessionData(request);
  const submittedWordRef = db.ref(`activeGames/${gameId}/submittedWord`);
  await submittedWordRef.set({
    playerId,
    wordsData,
  });

  response.send({ data: "Success" });
});
