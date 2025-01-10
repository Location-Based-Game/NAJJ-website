import { onRequest, type Request } from "firebase-functions/v2/https";
import { deleteSession } from "./sessionUtils";
import type { Response } from "express";
import * as logger from "firebase-functions/logger"

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
      logger.error(`${error}`);
      response.send({ error: `${error}` });
    }
  });
}
