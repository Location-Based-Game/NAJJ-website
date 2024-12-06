import { onRequest, type Request } from "firebase-functions/v2/https";
import { deleteSession } from "./sessionUtils";
import type { Response } from "express";

export function onAuthorizedRequest(
  handler: (
    request: Request,
    response: Response,
  ) => Promise<void>,
) {
  return onRequest({ cors: true }, async (request, response) => {
    response.set("Access-Control-Allow-Credentials", "true");

    try {
      await handler(request, response);
    } catch (error) {
      deleteSession(response);
      response.send({ error: `${error}` });
    }
  });
}
